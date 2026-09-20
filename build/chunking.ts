export function getManualChunk(id: string) {
  // Isolate Vite's virtual preload helper into its own tiny chunk
  // so it doesn't drag engine code into the entry's static import graph.
  if (id.includes('preload-helper') || id.includes('modulepreload-polyfill')) {
    return 'vite-helpers';
  }
  if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/')) {
    return 'react-vendor';
  }

  if (id.includes('node_modules/react-router') || id.includes('node_modules/react-router-dom')) {
    return 'router-vendor';
  }

  if (id.includes('node_modules/iztro')) {
    return 'iztro-vendor';
  }

  if (id.includes('node_modules/tyme4ts')) {
    return 'tyme-vendor';
  }

  if (id.includes('node_modules/celestine')) {
    return 'celestine-vendor';
  }

  // three.js — 3D 城市/天空渲染（src/lib/sky, src/lib/city），体积大、仅场景页用
  if (id.includes('node_modules/three/')) {
    return 'three-vendor';
  }

  if (id.includes('packages/core/src/ziwei/iztro/pattern-detection.ts')) {
    return 'ziwei-patterns';
  }

  // Calendar utilities — needed by InputPage (form validation), keep as small separate chunk
  if (id.includes('packages/core/dist/calendar') || id.includes('packages/core/src/calendar')) {
    return 'calendar-engine';
  }

  // Bazi engine — only needed by ResultPage (lazy)
  if (id.includes('packages/core/dist/bazi') || id.includes('packages/core/src/bazi')) {
    return 'bazi-engine';
  }

  // Ziwei/iztro engine — only needed by ResultPage (lazy)
  if (id.includes('packages/core/dist/ziwei') || id.includes('packages/core/src/ziwei/iztro')) {
    return 'ziwei-engine';
  }

  // Shared core utilities (random, result types) — small, shared across chunks
  if (id.includes('packages/core/dist/shared') || id.includes('packages/core/src/shared')) {
    return 'core-shared';
  }

  // Combined chart engine — ResultPage only
  if (
    id.includes('src/lib/full-chart-engine.ts') ||
    id.includes('src/lib/full-chart-engine/')
  ) {
    return 'chart-combined';
  }

  // Ziwei prompt builders — used by ResultPage
  if (id.includes('src/lib/ziwei-')) {
    return 'ziwei-prompts';
  }

  // Astrolabe topic/shortcut data — tiny arrays needed by query-state
  // (InputPage URL sync). Isolate so the landing page doesn't pull the full
  // prompt-engine barrel (which carries bazi/divination prompt text only used
  // by ResultPage).
  if (
    id.includes('packages/core/dist/prompt/astrolabe.js') ||
    id.includes('packages/core/dist/prompt/presets.js') ||
    id.includes('packages/core/src/prompt/astrolabe') ||
    id.includes('packages/core/src/prompt/presets')
  ) {
    return 'astrolabe-data';
  }

  if (id.includes('src/lib/prompt-engine.ts') || id.includes('src/utils/ai')) {
    return 'prompt-engine';
  }

  if (id.includes('src/components/BaziFortuneTools/')) {
    return 'bazi-fortune-ui';
  }

  return undefined;
}
