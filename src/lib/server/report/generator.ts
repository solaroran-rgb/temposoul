import { handleAiAnalyze } from '../../ai/proxy';

const TEN_DIM_SCHEMA_PROMPT = `You are an expert Eastern wisdom interpreter.
Generate a structured JSON report with exactly these 10 dimensions:
["talent","character","career","wealth","emotion","family","health","life_stage","risk","action"]
Each dimension must have: {"title":string,"summary":string,"evidence":string[],"advice":string}
Output ONLY valid JSON. No markdown formatting. No preamble. No explanations outside JSON.`;

export interface TenDimReport {
  fullText: string;
  structured: Record<string, unknown>;
  generatedAt: string;
}

/**
 * Robust JSON extractor to handle LLM markdown wrapping or slight formatting errors.
 */
function extractJsonFromLlmResponse(text: string): Record<string, unknown> {
  // Strip markdown code blocks
  let cleaned = text
    .replace(/```json/gi, '')
    .replace(/```/g, '')
    .trim();

  // Find the first '{' and last '}'
  const firstBrace = cleaned.indexOf('{');
  const lastBrace = cleaned.lastIndexOf('}');

  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    cleaned = cleaned.substring(firstBrace, lastBrace + 1);
  }

  try {
    return JSON.parse(cleaned);
  } catch (_e) {
    console.error('[Generator] JSON parse failed. Raw text:', text);
    throw new Error('invalid_json_response', { cause: _e });
  }
}

/**
 * Consume handleAiAnalyze SSE stream and concatenate full text.
 * handleAiAnalyze returns `data: {"content":"..."}` lines (see src/lib/ai/proxy.ts).
 */
async function readSseContent(response: Response): Promise<string> {
  if (!response.body) return '';
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let full = '';

  const consume = (chunk: string): void => {
    buffer += chunk;
    const lines = buffer.split('\n');
    buffer = lines.pop() ?? '';
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed.startsWith('data:')) continue;
      const data = trimmed.slice(5).trim();
      if (data === '[DONE]') continue;
      try {
        const parsed = JSON.parse(data);
        const content = parsed?.content;
        if (typeof content === 'string') full += content;
      } catch {
        // ignore unparseable lines
      }
    }
  };

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    consume(decoder.decode(value, { stream: true }));
  }
  consume(decoder.decode());

  return full;
}

export async function generateTenDimReport(
  env: Env,
  chartId: string,
  productId: string,
): Promise<TenDimReport> {
  const userPrompt =
    `${TEN_DIM_SCHEMA_PROMPT}\n\n` +
    `请为命盘 chartId=${chartId}（产品档位：${productId}）生成完整的十维深度洞察报告。直接输出 JSON，不要输出任何解释、前言或 Markdown 标记。`;

  const request = new Request('http://internal/ai/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messages: [{ role: 'user', content: userPrompt }],
      lang: 'zh-CN',
    }),
  });

  const response = await handleAiAnalyze(request, env);
  if (!response.ok) {
    throw new Error(`AI generation failed with status: ${response.status}`);
  }

  const rawContent = await readSseContent(response);
  if (!rawContent || !rawContent.trim()) {
    throw new Error('empty_ai_response');
  }

  const structured = extractJsonFromLlmResponse(rawContent);

  // Basic validation
  const requiredDims = [
    'talent',
    'character',
    'career',
    'wealth',
    'emotion',
    'family',
    'health',
    'life_stage',
    'risk',
    'action',
  ];
  for (const dim of requiredDims) {
    if (!structured[dim]) {
      throw new Error(`missing_dimension: ${dim}`);
    }
  }

  return {
    fullText: rawContent,
    structured,
    generatedAt: new Date().toISOString(),
  };
}
