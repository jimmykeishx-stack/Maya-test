interface ArticleContentProps {
  htmlContent: string;
}

export function ArticleContent({ htmlContent }: ArticleContentProps) {
  return (
    <div
      className="article-content prose prose-lg max-w-none prose-headings:font-display prose-headings:text-[#12100f] prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-4 prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3 prose-p:text-[#1e1a16]/85 prose-p:leading-[1.9] prose-p:mb-6 prose-ul:my-6 prose-ul:space-y-2 prose-li:text-[#1e1a16]/80 prose-li:leading-relaxed prose-a:text-[var(--gold-strong)] prose-a:underline-offset-4 hover:prose-a:text-[var(--gold)] prose-strong:text-[#12100f] prose-strong:font-semibold prose-blockquote:border-l-[var(--gold)] prose-blockquote:bg-[var(--gold)]/5 prose-blockquote:py-2 prose-blockquote:px-6 prose-blockquote:not-italic prose-blockquote:text-[#1e1a16]/80"
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
}
