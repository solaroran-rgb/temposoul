/**
 * AI 解析代理 — 共享逻辑
 *
 * 被 catch-all handler 和独立 Pages Function 共用。
 * 接收提示词或对话消息，调用 OpenAI 兼容的 Chat Completions API 流式解析，返回 SSE Response。
 * 支持任何兼容接口（DeepSeek、千问、豆包、Groq、OpenAI 等）。
 */

import {
  DEFAULT_MAX_REQUEST_BODY_BYTES,
  readLimitedRequestText,
  RequestBodyTooLargeError,
} from '../http/request-body';
import { readIdentity } from '../server/auth';
import type { EntitlementKv } from '../entitlement/store';
import type { FreeSkeleton } from '../entitlement/freeSkeleton';
import { decideDeepInterpretation } from '../entitlement/wiring';
import {
  buildTranslateSystemPrompt,
  createTranslatedTagFilter,
  isTranslateLayer,
  LOCALE_LABELS,
  TRANSLATE_LAYERS,
  type TranslateLayer,
} from './translate-templates';

const DEFAULT_BASE_URL = 'https://api.deepseek.com/v1';
const DEFAULT_MODEL = 'deepseek-chat';
const MAX_PROMPT_LENGTH = 50_000;
const MAX_MESSAGES = 30;
const UPSTREAM_FETCH_TIMEOUT_MS = 25_000;
const UPSTREAM_RETRY_DELAYS_MS = [500, 1500];
const BLOCKED_CUSTOM_AI_HOSTS = new Set(['localhost', 'metadata', 'metadata.google.internal']);

const SSE_HEADERS: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'text/event-stream; charset=utf-8',
  'Cache-Control': 'no-cache',
  Connection: 'keep-alive',
};

export type AiEnv = {
  AI_API_KEY?: string;
  AI_BASE_URL?: string;
  AI_MODEL?: string;
  AI_PROVIDER_NAME?: string;
  AI_BUILTIN_ENABLED?: string;
  AI_DEFAULT_ENABLED?: string;
  /** 内容语言启用集（CSV）；缺省全部启用。未启用语言显式 400，不静默降级（口径 G5） */
  I18N_ENABLED_LOCALES?: string;
  /** 权益 KV 绑定（CF Pages AUTH_KV）；存在时对 report.deep 深度解读启用配额闸口（P1-②）。 */
  AUTH_KV?: EntitlementKv;
  /** 签发 JWT 的密钥；用于从 Authorization 解析用户 sub。 */
  AUTH_SECRET?: string;
};

type ChatMessage = { role: 'user' | 'assistant'; content: string };
type AiProviderConfig = {
  mode?: 'builtin' | 'custom';
  apiKey?: unknown;
  baseUrl?: unknown;
  model?: unknown;
};
type UpstreamFetchResult =
  { ok: true; response: Response; attempts: number } | { ok: false; error: Response };

const SYSTEM_PROMPT_SINGLE = '请根据用户提供的排盘资料和问题直接解读。';

const SYSTEM_PROMPT_CHAT = '用户的第一条消息是本次排盘资料和问题。请继续围绕这份资料解读。';

// T3 多语言（M1）：AI 链路语言控制。口径见 docs/audit/2026-09-13-上线前加固/thread-03-*/output/02
const SUPPORTED_AI_LOCALES = ['zh-CN', 'en', 'es-ES', 'ja', 'ko-KN', 'th-TH', 'vi-VN'] as const;
type SupportedAiLocale = (typeof SUPPORTED_AI_LOCALES)[number];

// 语言标签与受限翻译档模板统一由 ./translate-templates 提供（L1/L3/L5 × 7 语言）。

// I18N 内容语言门控：env.I18N_ENABLED_LOCALES 配置启用集（CSV），缺省全开
function parseEnabledLocales(env?: AiEnv): Set<string> {
  const raw = env?.I18N_ENABLED_LOCALES?.trim();
  if (!raw) return new Set(SUPPORTED_AI_LOCALES as readonly string[]);
  const list = raw
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
  return new Set(list.length > 0 ? list : (SUPPORTED_AI_LOCALES as readonly string[]));
}

// 术语注入（决策 A）：扫描输入中出现的 tier1 术语，注入「zh→目标语言」对照表（动态 import 控包体）
async function buildTermInjection(inputText: string, locale: SupportedAiLocale): Promise<string> {
  if (locale === 'zh-CN') return '';
  const { TERMS_7LANG } = await import('../../data/terms-7lang');
  const matched: Array<{ term: string; key: string; target: string }> = [];
  for (const entry of TERMS_7LANG) {
    if (matched.length >= 40) break;
    const zh = entry.i18n['zh-CN'];
    if (!zh || !inputText.includes(zh)) continue;
    const target = entry.i18n[locale];
    if (target && target !== '—') {
      matched.push({ term: zh, key: entry.key, target });
    }
  }
  if (matched.length === 0) return '';
  return `\n术语对照表（译文必须采用以下译法，key 为 archetype_key）：${JSON.stringify(matched)}`;
}

/**
 * 处理 AI 解析请求，返回 SSE Response。
 * 如果出错则返回 JSON error Response。
 *
 * 请求体支持两种格式：
 * 1. { prompt: string } — 单轮解析（向后兼容）
 * 2. { messages: Array<{role, content}> } — 多轮对话
 */
export async function handleAiAnalyze(request: Request, env?: AiEnv): Promise<Response> {
  let body: {
    prompt?: unknown;
    messages?: unknown;
    aiConfig?: AiProviderConfig;
    lang?: unknown;
    mode?: unknown;
    layer?: unknown;
  };
  try {
    body = parseJsonObject(await readLimitedRequestText(request, DEFAULT_MAX_REQUEST_BODY_BYTES));
  } catch (error) {
    if (error instanceof RequestBodyTooLargeError) {
      return aiJsonError(
        413,
        'REQUEST_BODY_TOO_LARGE',
        `请求体不能超过 ${DEFAULT_MAX_REQUEST_BODY_BYTES} 字节。`,
      );
    }
    return aiJsonError(400, 'BAD_REQUEST', '请求体必须是合法 JSON。');
  }

  // 语言白名单（BP3）：非法 lang 结构化 400，不进入上游
  const rawLang = typeof body.lang === 'string' ? body.lang.trim() : '';
  if (rawLang && !(SUPPORTED_AI_LOCALES as readonly string[]).includes(rawLang)) {
    return aiJsonError(400, 'INVALID_LANG', `不支持的语言代码：${rawLang}。`, {
      supported: SUPPORTED_AI_LOCALES as readonly string[],
    });
  }
  const locale: SupportedAiLocale = rawLang ? (rawLang as SupportedAiLocale) : 'zh-CN';
  // 受限翻译档（决策 A）：mode=translate 时 temperature 固定 0（BP4）
  const translationMode = body.mode === 'translate';
  if (translationMode) {
    if (locale === 'zh-CN') {
      return aiJsonError(400, 'INVALID_LANG', '受限翻译档的目标语言不能是 zh-CN。');
    }
    if (body.layer != null && !isTranslateLayer(body.layer)) {
      return aiJsonError(400, 'INVALID_LAYER', `不支持的翻译层级：${String(body.layer)}。`, {
        supported: TRANSLATE_LAYERS as readonly string[],
      });
    }
  }
  const translateLayer: TranslateLayer = isTranslateLayer(body.layer) ? body.layer : 'L3';

  const enabledLocales = parseEnabledLocales(env);
  if (!enabledLocales.has(locale)) {
    return aiJsonError(400, 'LANG_NOT_ENABLED', `语言 ${locale} 尚未开放内容输出。`, {
      enabled: [...enabledLocales],
    });
  }

  const provider = resolveAiProvider(body.aiConfig, env);
  if ('error' in provider) {
    return provider.error;
  }

  // 解析对话消息：优先使用 messages 数组，否则回退到 prompt 字符串
  let chatMessages: ChatMessage[];
  let isMultiTurn = false;

  if (
    Array.isArray(body.messages) &&
    body.messages.length > 0 &&
    body.messages.every(
      (m) =>
        m &&
        typeof m === 'object' &&
        (m.role === 'user' || m.role === 'assistant') &&
        typeof m.content === 'string',
    )
  ) {
    if (body.messages.length > MAX_MESSAGES) {
      return aiJsonError(
        400,
        'TOO_MANY_MESSAGES',
        `一次最多发送 ${MAX_MESSAGES} 条消息，请拆分为多次请求。`,
      );
    }

    chatMessages = (body.messages as ChatMessage[])
      .map((m) => ({ role: m.role, content: m.content.trim() }))
      .filter((m) => m.content.length > 0);
    isMultiTurn = chatMessages.length > 1;
  } else {
    const prompt = typeof body.prompt === 'string' ? body.prompt.trim() : '';
    if (!prompt) {
      return aiJsonError(400, 'BAD_REQUEST', 'prompt 不能为空。');
    }
    chatMessages = [{ role: 'user' as const, content: prompt }];
  }

  if (chatMessages.length === 0) {
    return aiJsonError(400, 'BAD_REQUEST', '消息内容不能为空。');
  }

  const totalLength = chatMessages.reduce((sum, m) => sum + m.content.length, 0);
  if (totalLength > MAX_PROMPT_LENGTH) {
    return aiJsonError(400, 'PROMPT_TOO_LONG', `提示词不能超过 ${MAX_PROMPT_LENGTH} 字符。`);
  }

  const baseSystemPrompt = isMultiTurn ? SYSTEM_PROMPT_CHAT : SYSTEM_PROMPT_SINGLE;
  const languageDirective =
    locale !== 'zh-CN' && !translationMode ? ` 请全程使用${LOCALE_LABELS[locale]}撰写解读。` : '';
  const termInjection = translationMode
    ? await buildTermInjection(chatMessages.map((message) => message.content).join('\n'), locale)
    : '';
  const systemPrompt = translationMode
    ? buildTranslateSystemPrompt(translateLayer, locale, termInjection)
    : `${baseSystemPrompt}${languageDirective}`;

  // P1-②：report.deep 深度解读闸口。在调用上游 LLM 前「权益校验 + 配额扣减」。
  // 受限翻译档（mode=translate）属另一权益档，不在本闸口范围；KV 未绑定时跳过（向后兼容）。
  // 无权益/用尽/匿名 → 直接返回规则骨架 SSE（0 次 LLM），不得回退上游。
  if (!translationMode && env?.AUTH_KV) {
    const userId = await resolveUserIdFromRequest(request, env.AUTH_SECRET);
    const decision = await decideDeepInterpretation({ kv: env.AUTH_KV, userId });
    // -b 构建模式下 allowed 字面量判别收窄偶发失效，用 in 运算符显式收窄拒绝变体
    if ('skeleton' in decision) {
      return buildSkeletonSseResponse(decision.skeleton);
    }
  }

  const endpoint = `${provider.baseUrl}/chat/completions`;
  const upstreamResult = await fetchUpstreamWithRetry(endpoint, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${provider.apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: provider.model,
      stream: true,
      max_tokens: 4096,
      temperature: translationMode ? 0 : 0.7,
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        ...chatMessages,
      ],
    }),
  });
  if (upstreamResult.ok === false) {
    return upstreamResult.error;
  }

  const { response: upstream, attempts } = upstreamResult;
  if (!upstream.ok) {
    const errText = await upstream.text().catch(() => '');
    return buildUpstreamErrorResponse(upstream.status, errText, attempts);
  }

  if (!upstream.body) {
    return aiJsonError(502, 'AI_UPSTREAM_EMPTY_RESPONSE', 'AI 服务没有返回可读取的内容。', {
      attempts,
      retryable: true,
    });
  }

  // 将 upstream SSE 流转换为前端可读的 SSE 流（受限翻译档剥离 <translated> 标记）
  const tagFilter = translationMode ? createTranslatedTagFilter() : null;
  const { readable, writable } = new TransformStream();
  const writer = writable.getWriter();
  const encoder = new TextEncoder();

  (async () => {
    const reader = upstream.body!.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || !trimmed.startsWith('data:')) continue;

          const data = trimmed.slice(5).trim();
          if (data === '[DONE]') {
            if (tagFilter) {
              const tail = tagFilter.flush();
              if (tail) {
                await writer.write(
                  encoder.encode(`data: ${JSON.stringify({ content: tail })}\n\n`),
                );
              }
            }
            await writer.write(encoder.encode('data: [DONE]\n\n'));
            continue;
          }

          try {
            const parsed = JSON.parse(data);
            const delta = parsed?.choices?.[0]?.delta?.content;
            if (typeof delta === 'string' && delta) {
              const text = tagFilter ? tagFilter.push(delta) : delta;
              if (text) {
                const payload = JSON.stringify({ content: text });
                await writer.write(encoder.encode(`data: ${payload}\n\n`));
              }
            }
          } catch {
            // 忽略无法解析的行
          }
        }
      }

      // 流结束，flush decoder 并处理残留 buffer
      buffer += decoder.decode();
      if (buffer.trim()) {
        const trimmed = buffer.trim();
        if (trimmed.startsWith('data:')) {
          const data = trimmed.slice(5).trim();
          if (data && data !== '[DONE]') {
            try {
              const parsed = JSON.parse(data);
              const delta = parsed?.choices?.[0]?.delta?.content;
              if (typeof delta === 'string' && delta) {
                const text = tagFilter ? tagFilter.push(delta) : delta;
                if (text) {
                  const payload = JSON.stringify({ content: text });
                  await writer.write(encoder.encode(`data: ${payload}\n\n`));
                }
              }
            } catch {
              // 忽略
            }
          } else if (data === '[DONE]' && tagFilter) {
            const tail = tagFilter.flush();
            if (tail) {
              await writer.write(encoder.encode(`data: ${JSON.stringify({ content: tail })}\n\n`));
            }
          }
        }
      }
    } catch (err) {
      const payload = JSON.stringify({
        error: {
          code: 'AI_UPSTREAM_STREAM_ERROR',
          message: 'AI 服务响应中断，请稍后重试，或在设置里改用自己的接口。',
          attempts,
          retryable: true,
          detail: err instanceof Error ? err.message : undefined,
        },
      });
      try {
        await writer.write(encoder.encode(`data: ${payload}\n\n`));
      } catch {
        // writer 已关闭或出错，静默忽略
      }
    } finally {
      try {
        await writer.close();
      } catch {
        // writer 已关闭，静默忽略
      }
    }
  })();

  return new Response(readable, {
    status: 200,
    headers: SSE_HEADERS,
  });
}

export async function handleAiModels(request: Request, env?: AiEnv): Promise<Response> {
  let body: { aiConfig?: AiProviderConfig };
  try {
    body = parseJsonObject(await readLimitedRequestText(request, DEFAULT_MAX_REQUEST_BODY_BYTES));
  } catch (error) {
    if (error instanceof RequestBodyTooLargeError) {
      return aiJsonError(
        413,
        'REQUEST_BODY_TOO_LARGE',
        `请求体不能超过 ${DEFAULT_MAX_REQUEST_BODY_BYTES} 字节。`,
      );
    }
    return aiJsonError(400, 'BAD_REQUEST', '请求体必须是合法 JSON。');
  }

  const provider = resolveAiProvider(body.aiConfig, env, { requireModel: false });
  if ('error' in provider) {
    return provider.error;
  }

  const upstreamResult = await fetchUpstreamWithRetry(`${provider.baseUrl}/models`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${provider.apiKey}`,
      'Content-Type': 'application/json',
    },
  });
  if (upstreamResult.ok === false) {
    return upstreamResult.error;
  }

  const { response: upstream, attempts } = upstreamResult;
  if (!upstream.ok) {
    const errText = await upstream.text().catch(() => '');
    return buildUpstreamErrorResponse(upstream.status, errText, attempts, '获取模型失败：');
  }

  const data = (await upstream.json().catch(() => null)) as { data?: unknown } | null;
  const modelItems = Array.isArray(data?.data) ? data.data : [];
  const models = modelItems
    .map((item: unknown) => {
      if (item && typeof item === 'object' && 'id' in item) {
        return (item as { id?: unknown }).id;
      }
      return null;
    })
    .filter((item: unknown): item is string => typeof item === 'string' && item.length > 0);

  return new Response(JSON.stringify({ ok: true, models }), {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json; charset=utf-8',
    },
  });
}

/** 从 Authorization Bearer 解析用户 sub；未登录/解析失败一律返回 null（走免费骨架）。 */
async function resolveUserIdFromRequest(request: Request, secret?: string): Promise<string | null> {
  if (!secret) return null;
  const authHeader = request.headers.get('Authorization') || '';
  if (!authHeader.startsWith('Bearer ')) return null;
  try {
    const identity = await readIdentity(authHeader.slice(7), secret);
    return identity.sub || null;
  } catch {
    return null;
  }
}

/** 把免费规则骨架以 SSE 帧下发（复用前端既有流解析，0 次 LLM，不回退上游）。 */
function buildSkeletonSseResponse(skeleton: FreeSkeleton): Response {
  const encoder = new TextEncoder();
  const sectionsText = skeleton.sections.map((s) => `【${s.heading}】\n${s.body}`).join('\n\n');
  const payload = JSON.stringify({
    content: `${sectionsText}\n\n${skeleton.upsell}`,
    free_skeleton: true,
    unlockKey: skeleton.unlockKey,
  });
  return new Response(encoder.encode(`data: ${payload}\n\ndata: [DONE]\n\n`), {
    status: 200,
    headers: SSE_HEADERS,
  });
}

function resolveAiProvider(
  config: AiProviderConfig | undefined,
  env?: AiEnv,
  options: { requireModel?: boolean } = {},
):
  | {
      apiKey: string;
      baseUrl: string;
      model: string;
    }
  | { error: Response } {
  const mode = config?.mode === 'custom' ? 'custom' : 'builtin';
  const requireModel = options.requireModel ?? true;

  if (mode === 'custom') {
    const apiKey = typeof config?.apiKey === 'string' ? config.apiKey.trim() : '';
    const rawBaseUrl = typeof config?.baseUrl === 'string' ? config.baseUrl.trim() : '';
    const model = typeof config?.model === 'string' ? config.model.trim() : '';

    if (!apiKey || !rawBaseUrl || (requireModel && !model)) {
      return {
        error: aiJsonError(
          400,
          'AI_CUSTOM_CONFIG_REQUIRED',
          '请先填写自定义 AI 的接口、密钥和模型。',
        ),
      };
    }

    const baseUrlResult = normalizeCustomAiBaseUrl(rawBaseUrl);
    if ('error' in baseUrlResult) {
      return baseUrlResult;
    }

    return { apiKey, baseUrl: baseUrlResult.baseUrl, model };
  }

  if (!isBuiltinAiEnabled(env)) {
    return {
      error: aiJsonError(
        403,
        'AI_SERVER_NOT_ENABLED',
        '服务端 AI 未启用，请在设置里改用自己的 AI 接口。',
      ),
    };
  }

  const apiKey = env?.AI_API_KEY ?? '';
  const baseUrl = (env?.AI_BASE_URL ?? DEFAULT_BASE_URL).replace(/\/+$/, '');
  const model = env?.AI_MODEL ?? DEFAULT_MODEL;

  if (!apiKey) {
    return {
      error: aiJsonError(500, 'AI_API_KEY 未配置', '服务端缺少 AI 密钥，请联系管理员。'),
    };
  }

  return { apiKey, baseUrl, model };
}

function isBuiltinAiEnabled(env?: AiEnv): boolean {
  const enabled = env?.AI_BUILTIN_ENABLED ?? env?.AI_DEFAULT_ENABLED;
  return enabled === 'true';
}

function normalizeCustomAiBaseUrl(value: string): { baseUrl: string } | { error: Response } {
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    return {
      error: aiJsonError(
        400,
        'AI_CUSTOM_BASE_URL_INVALID',
        '自定义 AI 接口地址必须是合法的 HTTPS 公网地址。',
      ),
    };
  }

  if (
    url.protocol !== 'https:' ||
    url.username ||
    url.password ||
    url.search ||
    url.hash ||
    isUnsafeCustomAiHost(url.hostname)
  ) {
    return {
      error: aiJsonError(
        400,
        'AI_CUSTOM_BASE_URL_UNSAFE',
        '自定义 AI 接口地址必须使用 HTTPS 公网地址，不能指向本机、内网或云元数据地址。',
      ),
    };
  }

  return { baseUrl: url.href.replace(/\/+$/, '') };
}

function isUnsafeCustomAiHost(hostname: string): boolean {
  const host = hostname
    .toLowerCase()
    .replace(/^\[(.*)\]$/, '$1')
    .replace(/\.$/, '');
  if (!host) return true;
  if (BLOCKED_CUSTOM_AI_HOSTS.has(host) || host.endsWith('.localhost')) return true;
  if (host.endsWith('.internal')) return true;

  const ipv4 = parseIpv4Address(host);
  if (ipv4) {
    return isUnsafeIpv4Address(ipv4);
  }

  if (host.includes(':')) {
    return isUnsafeIpv6Address(host);
  }

  return !host.includes('.');
}

function parseIpv4Address(host: string): [number, number, number, number] | null {
  const parts = host.split('.');
  if (parts.length !== 4) return null;

  const parsed = parts.map((part) => {
    if (!/^\d+$/.test(part)) return Number.NaN;
    const value = Number(part);
    return Number.isInteger(value) && value >= 0 && value <= 255 ? value : Number.NaN;
  });

  return parsed.every(Number.isFinite) ? (parsed as [number, number, number, number]) : null;
}

function isUnsafeIpv4Address([a, b]: [number, number, number, number]): boolean {
  return (
    a === 0 ||
    a === 10 ||
    a === 127 ||
    (a === 100 && b >= 64 && b <= 127) ||
    (a === 169 && b === 254) ||
    (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && b === 168) ||
    (a === 198 && (b === 18 || b === 19)) ||
    a >= 224
  );
}

function isUnsafeIpv6Address(host: string): boolean {
  const words = parseIpv6Address(host);
  if (!words) return true;

  const firstWord = words[0];
  const isUnspecified = words.every((word) => word === 0);
  const isLoopback = words.slice(0, 7).every((word) => word === 0) && words[7] === 1;
  const isUniqueLocal = (firstWord & 0xfe00) === 0xfc00;
  const isLinkLocal = (firstWord & 0xffc0) === 0xfe80;
  const isMulticast = (firstWord & 0xff00) === 0xff00;
  const isIpv4Compatible = words.slice(0, 6).every((word) => word === 0);
  const isIpv4Mapped = words.slice(0, 5).every((word) => word === 0) && words[5] === 0xffff;

  if (isUnspecified || isLoopback || isUniqueLocal || isLinkLocal || isMulticast) {
    return true;
  }

  if (isIpv4Mapped) {
    return isUnsafeIpv4Address([words[6] >>> 8, words[6] & 0xff, words[7] >>> 8, words[7] & 0xff]);
  }

  // IPv4 兼容地址已经废弃，部分网络栈仍可能把它按 IPv4 解释。
  return isIpv4Compatible;
}

function parseIpv6Address(host: string): number[] | null {
  const sections = host.split('::');
  if (sections.length > 2) return null;

  const parseSection = (section: string): number[] | null => {
    if (!section) return [];
    const parts = section.split(':');
    const words: number[] = [];

    for (const part of parts) {
      if (/^[0-9a-f]{1,4}$/i.test(part)) {
        words.push(Number.parseInt(part, 16));
        continue;
      }

      // URL 通常会规范化 IPv4 嵌入尾段；这里仍保留直接调用时的校验能力。
      const ipv4 = parseIpv4Address(part);
      if (!ipv4 || part !== parts[parts.length - 1]) return null;
      words.push((ipv4[0] << 8) | ipv4[1], (ipv4[2] << 8) | ipv4[3]);
    }

    return words;
  };

  const left = parseSection(sections[0]);
  const right = sections.length === 2 ? parseSection(sections[1]) : [];
  if (!left || !right) return null;

  if (sections.length === 1) {
    return left.length === 8 ? left : null;
  }

  const omittedWords = 8 - left.length - right.length;
  if (omittedWords < 1) return null;
  return [...left, ...Array.from({ length: omittedWords }, () => 0), ...right];
}

async function fetchUpstreamWithRetry(
  url: string,
  init: RequestInit,
): Promise<UpstreamFetchResult> {
  const maxAttempts = UPSTREAM_RETRY_DELAYS_MS.length + 1;

  for (let attemptIndex = 0; attemptIndex < maxAttempts; attemptIndex += 1) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), UPSTREAM_FETCH_TIMEOUT_MS);
    try {
      const response = await fetch(url, { ...init, signal: controller.signal });
      if (isRetryableUpstreamStatus(response.status) && attemptIndex < maxAttempts - 1) {
        await response.text().catch(() => '');
        await sleep(getRetryDelayMs(response, attemptIndex));
        continue;
      }

      return { ok: true, response, attempts: attemptIndex + 1 };
    } catch (error) {
      const timedOut = isAbortError(error);
      if (!timedOut && attemptIndex < maxAttempts - 1) {
        await sleep(UPSTREAM_RETRY_DELAYS_MS[attemptIndex]);
        continue;
      }

      const attempts = attemptIndex + 1;
      return {
        ok: false,
        error: aiJsonError(
          timedOut ? 504 : 502,
          timedOut ? 'AI_UPSTREAM_TIMEOUT' : 'AI_UPSTREAM_NETWORK_ERROR',
          timedOut
            ? `AI 服务连接超时${formatRetrySummary(attempts)}。请稍后再试，或在设置里改用自己的接口。`
            : `无法连接 AI 服务${formatRetrySummary(attempts)}。请稍后再试，或在设置里改用自己的接口。`,
          {
            attempts,
            retryable: true,
            detail: error instanceof Error ? error.message : undefined,
          },
        ),
      };
    } finally {
      clearTimeout(timeoutId);
    }
  }

  return {
    ok: false,
    error: aiJsonError(502, 'AI_UPSTREAM_NETWORK_ERROR', '无法连接 AI 服务。', {
      attempts: maxAttempts,
      retryable: true,
    }),
  };
}

function isAbortError(error: unknown): boolean {
  return (
    (error instanceof Error ||
      (typeof DOMException !== 'undefined' && error instanceof DOMException)) &&
    error.name === 'AbortError'
  );
}

function isRetryableUpstreamStatus(status: number): boolean {
  return status === 408 || status === 429 || status >= 500;
}

function getRetryDelayMs(response: Response, attemptIndex: number): number {
  const retryAfter = parseRetryAfterMs(response.headers.get('Retry-After'));
  return retryAfter ?? UPSTREAM_RETRY_DELAYS_MS[attemptIndex];
}

function parseRetryAfterMs(value: string | null): number | undefined {
  if (!value) return undefined;
  const seconds = Number(value);
  if (Number.isFinite(seconds) && seconds >= 0) {
    return Math.min(seconds * 1000, 3000);
  }

  const retryAt = Date.parse(value);
  if (Number.isFinite(retryAt)) {
    return Math.min(Math.max(retryAt - Date.now(), 0), 3000);
  }

  return undefined;
}

function sleep(delayMs: number): Promise<void> {
  if (delayMs <= 0) return Promise.resolve();
  return new Promise((resolve) => setTimeout(resolve, delayMs));
}

function buildUpstreamErrorResponse(
  status: number,
  rawBody: string,
  attempts: number,
  prefix = '',
): Response {
  const upstreamError = parseUpstreamError(rawBody);
  const retrySummary = formatRetrySummary(attempts);
  const retryable = isRetryableUpstreamStatus(status);
  const detail = upstreamError.message
    ? `上游提示：${upstreamError.message}${upstreamError.code ? `（${upstreamError.code}）` : ''}`
    : undefined;
  const commonDetails = {
    upstreamStatus: status,
    upstreamCode: upstreamError.code,
    attempts,
    retryable,
    detail,
  };

  if (status === 401 || status === 403) {
    return aiJsonError(
      status,
      'AI_UPSTREAM_AUTH_ERROR',
      `${prefix}AI 服务鉴权失败，请检查 API Key 是否有效、额度是否正常。`,
      commonDetails,
    );
  }

  if (status === 400 || status === 404) {
    return aiJsonError(
      status,
      'AI_UPSTREAM_CONFIG_ERROR',
      `${prefix}AI 服务配置可能有误，请检查接口地址和模型名称是否支持当前请求。`,
      commonDetails,
    );
  }

  if (status === 408) {
    return aiJsonError(
      status,
      'AI_UPSTREAM_TIMEOUT',
      `${prefix}AI 服务响应超时${retrySummary}。请稍后再试。`,
      commonDetails,
    );
  }

  if (status === 429) {
    return aiJsonError(
      status,
      'AI_UPSTREAM_RATE_LIMIT',
      `${prefix}AI 服务请求过多或额度受限${retrySummary}。请稍后再试，或改用自己的接口。`,
      commonDetails,
    );
  }

  if (status >= 500) {
    return aiJsonError(
      status,
      'AI_UPSTREAM_UNSTABLE',
      `${prefix}AI 服务暂时不稳定${retrySummary}。请稍后再试，或在设置里改用自己的接口。`,
      commonDetails,
    );
  }

  return aiJsonError(
    status,
    'AI_UPSTREAM_ERROR',
    `${prefix}AI 服务返回异常（上游状态 ${status}）。`,
    commonDetails,
  );
}

function formatRetrySummary(attempts: number): string {
  return attempts > 1 ? `，已自动重试 ${attempts - 1} 次仍未成功` : '';
}

function parseUpstreamError(rawBody: string): { message?: string; code?: string } {
  const trimmed = rawBody.trim();
  if (!trimmed) return {};

  try {
    const parsed = JSON.parse(trimmed);
    const error = parsed?.error;
    const message =
      typeof error?.message === 'string'
        ? error.message
        : typeof parsed?.message === 'string'
          ? parsed.message
          : '';
    const code =
      typeof error?.code === 'string'
        ? error.code
        : typeof parsed?.code === 'string'
          ? parsed.code
          : '';
    return {
      message: sanitizeUpstreamText(message),
      code: sanitizeUpstreamText(code),
    };
  } catch {
    return { message: sanitizeUpstreamText(trimmed) };
  }
}

function parseJsonObject<T extends Record<string, unknown>>(text: string): T {
  const value = JSON.parse(text);
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error('请求体必须是 JSON 对象。');
  }
  return value as T;
}

function sanitizeUpstreamText(value: string): string | undefined {
  const normalized = value.replace(/\s+/g, ' ').trim();
  return normalized ? normalized.slice(0, 180) : undefined;
}

function aiJsonError(
  status: number,
  code: string,
  message: string,
  details: Record<string, unknown> = {},
): Response {
  return new Response(
    JSON.stringify({
      ok: false,
      error: { code, message, ...details },
    }),
    {
      status,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json; charset=utf-8',
      },
    },
  );
}
