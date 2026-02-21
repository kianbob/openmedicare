import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-lg text-center">
        <h1 className="text-6xl font-bold text-medicare-primary font-playfair mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Page Not Found</h2>
        <p className="text-gray-600 mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <p className="text-gray-700 mb-3 font-medium">Looking for a specific provider?</p>
          <Link
            href="/lookup"
            className="inline-block bg-medicare-primary text-white px-6 py-2 rounded-lg hover:bg-medicare-primary/90 transition-colors"
          >
            Try our Provider Lookup Tool
          </Link>
        </div>

        <div className="space-y-3 text-left">
          <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Popular Pages</p>
          <nav className="flex flex-col gap-2">
            <Link href="/" className="text-medicare-primary hover:underline">← Home</Link>
            <Link href="/providers" className="text-medicare-primary hover:underline">→ Top Providers</Link>
            <Link href="/fraud" className="text-medicare-primary hover:underline">→ Fraud Analysis</Link>
            <Link href="/investigations" className="text-medicare-primary hover:underline">→ Investigations</Link>
          </nav>
        </div>
      </div>
    </div>
  )
}
