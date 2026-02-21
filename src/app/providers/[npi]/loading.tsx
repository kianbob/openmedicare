export default function ProviderLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="animate-pulse mb-6">
          <div className="h-4 w-64 bg-gray-200 rounded" />
        </div>

        {/* Provider header */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6 animate-pulse">
          <div className="flex items-start gap-6">
            <div className="w-20 h-20 bg-gray-200 rounded-full shrink-0" />
            <div className="flex-1">
              <div className="h-8 w-72 bg-gray-200 rounded mb-2" />
              <div className="h-5 w-48 bg-gray-200 rounded mb-3" />
              <div className="flex gap-3">
                <div className="h-6 w-24 bg-gray-200 rounded-full" />
                <div className="h-6 w-32 bg-gray-200 rounded-full" />
                <div className="h-6 w-20 bg-gray-200 rounded-full" />
              </div>
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 animate-pulse">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="h-4 w-20 bg-gray-200 rounded mb-2" />
              <div className="h-7 w-16 bg-gray-200 rounded" />
            </div>
          ))}
        </div>

        {/* Content sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-pulse">
          <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 p-6">
            <div className="h-6 w-40 bg-gray-200 rounded mb-4" />
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex justify-between">
                  <div className="h-4 w-48 bg-gray-200 rounded" />
                  <div className="h-4 w-24 bg-gray-200 rounded" />
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="h-6 w-32 bg-gray-200 rounded mb-4" />
            <div className="h-48 w-full bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    </div>
  )
}
