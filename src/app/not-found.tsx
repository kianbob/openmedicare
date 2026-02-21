import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-medicare-light to-white px-4">
      <div className="max-w-lg text-center">
        <div className="mb-6">
          <span className="text-8xl font-bold text-medicare-primary font-playfair">404</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">This page took early retirement</h1>
        <p className="text-gray-600 mb-8">
          We couldn&apos;t find what you&apos;re looking for. It may have been moved, removed, or never existed — unlike some of the billing we&apos;ve investigated.
        </p>

        <div className="bg-white rounded-xl shadow-md border border-medicare-primary/20 p-6 mb-8">
          <div className="w-12 h-12 bg-medicare-light rounded-full flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-medicare-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <p className="text-gray-800 mb-3 font-semibold">Looking for a provider?</p>
          <p className="text-gray-500 text-sm mb-4">Search 1.72 million Medicare providers by name or NPI number.</p>
          <Link
            href="/lookup"
            className="inline-block bg-medicare-primary text-white px-8 py-3 rounded-lg hover:bg-medicare-dark transition-colors font-medium shadow-sm"
          >
            Search Providers
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-3 text-left">
          <Link href="/" className="flex items-center gap-2 bg-white rounded-lg border border-gray-200 p-3 hover:border-medicare-primary/40 hover:shadow-sm transition-all group">
            <span className="text-lg">🏠</span>
            <span className="text-sm font-medium text-gray-700 group-hover:text-medicare-primary">Homepage</span>
          </Link>
          <Link href="/providers" className="flex items-center gap-2 bg-white rounded-lg border border-gray-200 p-3 hover:border-medicare-primary/40 hover:shadow-sm transition-all group">
            <span className="text-lg">👨‍⚕️</span>
            <span className="text-sm font-medium text-gray-700 group-hover:text-medicare-primary">Top Providers</span>
          </Link>
          <Link href="/fraud" className="flex items-center gap-2 bg-white rounded-lg border border-gray-200 p-3 hover:border-medicare-primary/40 hover:shadow-sm transition-all group">
            <span className="text-lg">🔍</span>
            <span className="text-sm font-medium text-gray-700 group-hover:text-medicare-primary">Fraud Analysis</span>
          </Link>
          <Link href="/investigations" className="flex items-center gap-2 bg-white rounded-lg border border-gray-200 p-3 hover:border-medicare-primary/40 hover:shadow-sm transition-all group">
            <span className="text-lg">📰</span>
            <span className="text-sm font-medium text-gray-700 group-hover:text-medicare-primary">Investigations</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
