import Link from 'next/link'

export default function NewsletterCTA() {
  return (
    <div className="rounded-xl overflow-hidden shadow-lg" style={{ background: 'linear-gradient(135deg, #1a73e8 0%, #0d47a1 100%)' }}>
      <div className="px-6 py-10 sm:px-12 sm:py-14 text-center">
        <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white mb-3">
          Stay Updated on Medicare Fraud
        </h3>
        <p className="text-blue-100 mb-6 max-w-lg mx-auto">
          New investigations published regularly. 64 articles and counting.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/investigations"
            className="inline-flex items-center justify-center px-6 py-3 bg-white text-blue-800 font-medium rounded-md hover:bg-blue-50 transition-colors"
          >
            Read Investigations
          </Link>
          <a
            href="https://github.com/kianbob/openmedicare"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-6 py-3 border border-white text-white font-medium rounded-md hover:bg-white/10 transition-colors"
          >
            Follow on GitHub
          </a>
        </div>
      </div>
    </div>
  )
}
