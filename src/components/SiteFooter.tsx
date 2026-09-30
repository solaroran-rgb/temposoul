import { useI18n } from '@/i18n';

/**
 * 全局页脚免责声明 —— 挂载于 App 布局层，所有非沉浸式页面底部固定展示。
 * 满足合规要求：每页必现「娱乐与自我参照，非专业建议」声明。
 */
export function SiteFooter() {
  const { t } = useI18n();
  return (
    <footer
      className="global-disclaimer"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        padding: '6px 12px',
        fontSize: 11,
        lineHeight: 1.4,
        textAlign: 'center',
        color: '#d8cfe0',
        background: 'rgba(19, 16, 25, 0.92)',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
      }}
    >
      {t('disclaimer')}
    </footer>
  );
}

export default SiteFooter;
