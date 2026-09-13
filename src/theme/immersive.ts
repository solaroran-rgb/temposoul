// HUD 风格 token
export const IMMERSIVE_THEME = {
  colors: {
    bgUniverse: '#030305',
    primaryCyan: '#00E5FF',
    gridLine: 'rgba(0, 229, 255, 0.15)',
    textDim: 'rgba(255, 255, 255, 0.6)',
    textBright: '#FFFFFF',
    panelBg: 'rgba(5, 5, 8, 0.85)',
    overlayBg: 'rgba(0, 0, 0, 0.4)',
  },
  layout: {
    horizonDesktop: 0.78,
    horizonMobile: 0.65,
    panelWidth: '320px',
  },
  easing: { panelSlide: 'cubic-bezier(0.16, 1, 0.3, 1)' },
  duration: {
    panelSlideMs: 300,
    debounceMs: 300,
    sliderDebounceMs: 150,
    loadingDelayMs: 1500,
  },
} as const;
