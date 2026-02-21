export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-pulse text-center">
        <div className="text-2xl font-bold text-medicare-primary font-playfair mb-2">OpenMedicare</div>
        <div className="text-sm text-gray-500">Loading data...</div>
      </div>
    </div>
  )
}
