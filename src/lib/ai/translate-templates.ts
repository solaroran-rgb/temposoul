/**
 * T3·M3 模板件：受限翻译档（决策 A）的 L1/L3/L5 × 7 语言结构化指令模板。
 *
 * 口径：docs/audit/2026-09-13-上线前加固/thread-03-多语言翻译实现与准确性/output/02_准确性口径定义.md
 * 模板规格：04_翻译管线方案.md §一（temperature=0 + 术语注入 + <translated> 标记 + 数值/方向禁改）。
 * 模板为「键控槽位 + 语言指令」，非自由文本；改模板 = 改输出契约，须同步 tests/ai-analyze-lang.test.ts。
 */

export type TranslateLayer = 'L1' | 'L3' | 'L5';

export const TRANSLATE_LAYERS: readonly TranslateLayer[] = ['L1', 'L3', 'L5'];

export const LOCALE_LABELS: Record<string, string> = {
  'zh-CN': '中文',
  en: 'English',
  'es-ES': 'Español',
  ja: '日本語',
  'ko-KN': '한국어',
  'th-TH': 'ไทย',
  'vi-VN': 'Tiếng Việt',
};

/** 层级专属约束（翻译对象语义，各语言共用的中文指令——指令语言≠输出语言） */
const LAYER_DIRECTIVE: Record<TranslateLayer, string> = {
  L1: '译文对象为古籍/典籍原文层（L1）：保留典故与古籍锚点原貌，锚点编号/引文出处原样保留，语气从文，不得白话化或加入现代阐发。',
  L3: '译文对象为通用白话解读层（L3）：保持口语化表述与吉凶方向，逐句对齐信息，不增删任何断语与条件从句。',
  L5: '译文对象为场景化文案层（L5）：保持场景模板字段完整与行动指引语气，不得新增医疗、法律、财务的断言。',
};

/** 跨层共同约束：数值/干支/方向禁改 + 术语表优先 + 输出标记 */
const BASE_DIRECTIVE =
  '你是中华命理内容的专业译者。逐句翻译用户提供的资料，遵守：' +
  '1) 数值、干支、星曜名、宫位名、卦名与吉凶方向一律不得改变；' +
  '2) 术语译法必须采用「术语对照表」给出的译法（含其 archetype_key），表中未登记的术语保持原文并保持原样，不得自行发明；' +
  '3) 只输出译文正文，不附加解释。';

export function isTranslateLayer(value: unknown): value is TranslateLayer {
  return typeof value === 'string' && (TRANSLATE_LAYERS as readonly string[]).includes(value);
}

/**
 * 组装受限翻译档的 system prompt。
 * @param termInjection buildTermInjection 的产物（可为空串）
 */
export function buildTranslateSystemPrompt(
  layer: TranslateLayer,
  locale: string,
  termInjection: string,
): string {
  const label = LOCALE_LABELS[locale] ?? locale;
  return (
    `${BASE_DIRECTIVE}${LAYER_DIRECTIVE[layer]}` +
    `目标语言：${label}（${locale}）。` +
    `输出格式：将译文整体包裹在 <translated lang="${locale}"> 与 </translated> 标记内，标记之外不得输出任何内容。` +
    termInjection
  );
}

/**
 * 剥离 <translated ...>/</translated> 标记的流式过滤器（标记可能跨 SSE delta 分裂）。
 * 非本管线标记（如 HTML）原样透传；流结束时 flush() 输出残留。
 */
export function createTranslatedTagFilter() {
  let buffer = '';
  const OPEN_TAG = '<translated';
  const CLOSE_TAG = '</translated';

  const drain = (out: string[]): void => {
    while (buffer.length > 0) {
      const lt = buffer.indexOf('<');
      if (lt === -1) {
        out.push(buffer);
        buffer = '';
        return;
      }
      if (lt > 0) {
        out.push(buffer.slice(0, lt));
        buffer = buffer.slice(lt);
      }
      // buffer 以 '<' 开头
      const gt = buffer.indexOf('>');
      const lower = buffer.toLowerCase();
      const isOpenTag = /^<translated[\s>]/.test(lower);
      if (gt === -1) {
        // 不完整标签：凡可能是本管线标记前缀的都等待；确认无关或异常超长则按字面放行
        const maybeOurs = OPEN_TAG.startsWith(lower) || CLOSE_TAG.startsWith(lower);
        if (!maybeOurs || buffer.length > 64) {
          out.push(buffer[0]);
          buffer = buffer.slice(1);
          continue;
        }
        return; // 等待更多数据
      }
      const tag = buffer.slice(0, gt + 1);
      buffer = buffer.slice(gt + 1);
      if (isOpenTag || /^<\/translated/i.test(tag)) continue; // 丢弃本管线标记
      out.push(tag);
    }
  };

  return {
    push(chunk: string): string {
      buffer += chunk;
      const out: string[] = [];
      drain(out);
      return out.join('');
    },
    flush(): string {
      const rest = buffer;
      buffer = '';
      return rest;
    },
  };
}

// ---- A8 白话映射库查表（T-17 子项 B）------------------------------------
// 仅追加导出，不改上方既有模板/过滤契约。
// getMappingVernacular(mappingKey, locale) 查 57 条白话三语；
// getTermVernacular(lexiconKey, locale) 查引用某 lexicon 术语的全部映射白话；
// 多义体系由调用方按 a8-polysemy.ts 的 senseId 选定 lexicon key 后再传入。
// 查不到一律返回 null（= 缺词条信号），禁止运行时 LLM 直译关键术语。
export {
  getMappingVernacular,
  getTermVernacular,
  A8_WAVE1_MAPPINGS,
  A8_ORPHAN_REFS,
} from '../../data/mappings/a8-wave1';
export type {
  A8MappingEntry,
  A8Vernacular,
  A8VernacularLocale,
} from '../../data/mappings/a8-wave1';
