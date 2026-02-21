export default function StillOutThereLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="animate-pulse mb-6">
          <div className="h-4 w-56 bg-gray-200 rounded" />
        </div>

        {/* Page header */}
        <div className="animate-pulse mb-8">
          <div className="h-9 w-96 bg-gray-200 rounded mb-3" />
          <div className="h-5 w-full max-w-2xl bg-gray-200 rounded mb-2" />
          <div className="h-5 w-3/4 max-w-xl bg-gray-200 rounded" />
        </div>

        {/* Filters bar */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6 animate-pulse">
          <div className="flex flex-wrap gap-3">
            <div className="h-10 w-48 bg-gray-200 rounded-lg" />
            <div className="h-10 w-36 bg-gray-200 rounded-lg" />
            <div className="h-10 w-36 bg-gray-200 rounded-lg" />
          </div>
        </div>

        {/* Table skeleton */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden animate-pulse">
          {/* Table header */}
          <div className="flex gap-4 p-4 border-b border-gray-200 bg-gray-50">
            <div className="h-4 w-48 bg-gray-200 rounded" />
            <div className="h-4 w-32 bg-gray-200 rounded" />
            <div className="h-4 w-24 bg-gray-200 rounded" />
            <div className="h-4 w-28 bg-gray-200 rounded" />
            <div className="h-4 w-20 bg-gray-200 rounded" />
          </div>
          {/* Table rows */}
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex gap-4 p-4 border-b border-gray-100">
              <div className="h-4 w-48 bg-gray-200 rounded" />
              <div className="h-4 w-32 bg-gray-200 rounded" />
              <div className="h-4 w-24 bg-gray-200 rounded" />
              <div className="h-4 w-28 bg-gray-200 rounded" />
              <div className="h-4 w-20 bg-gray-200 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
