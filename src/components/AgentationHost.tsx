import { useState, useEffect } from 'react';

/**
 * AgentationHost —— dev-only 标注工具栏宿主（零侵入）。
 *
 * - 仅当构建期 define `import.meta.env.VITE_ENABLE_AGENTATION === 'true'` 时挂载。
 * - 关闭时 useEffect 直接 return，组件渲染 null；整个 agentation 动态 import、
 *   回调函数、落盘常量全部位于 enabled 分支内，rollup 完全 tree-shake，
 *   产物不含 agentation chunk 与任何引用字符串。
 * - 开启时在 useEffect 内动态 import('agentation')，加载完成后 setState 渲染工具栏。
 * - 回调把 agentation 的 Annotation 对象映射为本地落盘服务约定字段后 POST：
 *     selector  = elementPath
 *     component = element（兼容 reactComponents）
 *     position  = x,y（含 boundingBox 摘要）
 *     feedback  = comment
 *   并补 url=window.location.href。
 * - 不改变页面布局/样式/路由，不监听全局事件。
 */

type RawAnnotation = {
  element?: string;
  elementPath?: string;
  comment?: string;
  x?: number;
  y?: number;
  cssClasses?: string;
  nearbyText?: string;
  reactComponents?: string;
  sourceFile?: string;
  attributes?: Record<string, string>;
  boundingBox?: { x: number; y: number; width: number; height: number };
  createdAt?: string;
  timestamp?: number;
};

type LoadedToolbar = {
  Comp: React.ComponentType<Record<string, unknown>>;
  onSubmit: (output: string, annotations: RawAnnotation[]) => void;
  onAdd: (annotation: RawAnnotation) => void;
};

export default function AgentationHost() {
  const enabled = import.meta.env.VITE_ENABLE_AGENTATION === 'true';
  const [loaded, setLoaded] = useState<LoadedToolbar | null>(null);

  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;

    // ── 以下全部代码仅在 enabled 分支内可达；disabled 构建被 tree-shake ──
    const ANNOTATION_ENDPOINT = 'http://127.0.0.1:8840/annotation';
    const ANNOTATION_TOKEN = 'ts-an-20261009';

    const mapAnnotation = (raw: RawAnnotation): Record<string, unknown> => {
      const pos =
        raw.boundingBox != null
          ? `x=${raw.x ?? raw.boundingBox.x}, y=${raw.y ?? raw.boundingBox.y}, w=${raw.boundingBox.width}, h=${raw.boundingBox.height}`
          : `x=${raw.x ?? ''}, y=${raw.y ?? ''}`;
      const feedbackParts = [raw.comment ?? ''];
      if (raw.nearbyText) feedbackParts.push(`[附近文本] ${raw.nearbyText}`);
      if (raw.reactComponents) feedbackParts.push(`[组件] ${raw.reactComponents}`);
      if (raw.sourceFile) feedbackParts.push(`[源码] ${raw.sourceFile}`);
      if (raw.attributes && Object.keys(raw.attributes).length)
        feedbackParts.push(`[属性] ${JSON.stringify(raw.attributes)}`);

      return {
        url: window.location.href,
        selector: raw.elementPath ?? '',
        component: raw.element ?? raw.reactComponents ?? '',
        position: pos,
        feedback: feedbackParts.filter(Boolean).join('\n'),
        cssClasses: raw.cssClasses ?? '',
        createdAt: raw.createdAt ?? new Date(raw.timestamp ?? Date.now()).toISOString(),
      };
    };

    const postAnnotation = (raw: RawAnnotation) => {
      const body = mapAnnotation(raw);
      fetch(ANNOTATION_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-ts-token': ANNOTATION_TOKEN,
        },
        body: JSON.stringify(body),
      })
        .then(async (r) => {
          if (!r.ok) {
            console.warn('[Agentation] 落盘响应非 2xx', r.status, await r.text().catch(() => ''));
          }
        })
        .catch((err) => {
          console.warn('[Agentation] 落盘服务不可达（本地 8840 未启动？）', err);
        });
    };

    const handleSubmit = (_output: string, annotations: RawAnnotation[]) => {
      (annotations ?? []).forEach(postAnnotation);
    };

    import('agentation').then((mod) => {
      if (cancelled) return;
      const m = mod as unknown as {
        default?: React.ComponentType<Record<string, unknown>>;
        Agentation?: React.ComponentType<Record<string, unknown>>;
      };
      const Comp = (m.Agentation ?? m.default ?? mod) as React.ComponentType<
        Record<string, unknown>
      >;
      setLoaded({ Comp, onSubmit: handleSubmit, onAdd: postAnnotation });
    });

    return () => {
      cancelled = true;
    };
  }, [enabled]);

  if (!enabled || !loaded) return null;
  const { Comp, onSubmit, onAdd } = loaded;
  return <Comp onSubmit={onSubmit} onAnnotationAdd={onAdd} />;
}
