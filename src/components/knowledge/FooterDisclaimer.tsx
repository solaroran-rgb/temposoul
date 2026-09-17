// ============================================================
import type { KnowledgeArticle } from '@/data/knowledge/schema';
import { guardText } from '@/lib/assertions-guard';

interface FooterDisclaimerProps {
  readonly disclaimer: string;
  readonly sources: KnowledgeArticle['sources'];
}

export function FooterDisclaimer({ disclaimer, sources }: FooterDisclaimerProps) {
  return (
    <footer className="footer-disclaimer">
      <p className="footer-disclaimer__text">{guardText(disclaimer)}</p>
      {sources.length > 0 && (
        <p className="footer-disclaimer__source">
          信息来源：{sources.map((s) => s.text).join('；')}
        </p>
      )}
    </footer>
  );
}
