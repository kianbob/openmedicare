import Link from 'next/link'

interface RelatedArticle {
  slug: string
  title: string
  description: string
}

interface RelatedArticlesProps {
  articles: RelatedArticle[]
}

export default function RelatedArticles({ articles }: RelatedArticlesProps) {
  if (!articles || articles.length === 0) return null

  return (
    <div className="mt-12 pt-8 border-t border-gray-200 not-prose">
      <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6">
        Continue Reading
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {articles.map((article) => (
          <Link
            key={article.slug}
            href={`/investigations/${article.slug}`}
            className="block rounded-lg border border-gray-200 p-5 hover:border-[#1a73e8] hover:shadow-md transition-all no-underline group"
          >
            <div className="text-sm font-bold text-gray-900 group-hover:text-[#1a73e8] mb-1.5">
              {article.title}
            </div>
            <p className="text-xs text-gray-600 leading-relaxed m-0">
              {article.description}
            </p>
          </Link>
        ))}
      </div>
    </div>
  )
}
