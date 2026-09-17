// src/components/knowledge/ArticleJsonLd.tsx

interface ArticleJsonLdProps {
  slug: string;
  title: string;
  description: string;
  author?: string;
  datePublished?: string;
  dateModified?: string;
}

export function ArticleJsonLd({
  slug,
  title,
  description,
  author = '命律内容团队',
  datePublished = '2026-09-16',
  dateModified = '2026-09-16',
}: ArticleJsonLdProps) {
  const url = `https://temposoul.com/knowledge/${slug}`;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    author: { '@type': 'Organization', name: author },
    datePublished,
    dateModified,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export default ArticleJsonLd;
