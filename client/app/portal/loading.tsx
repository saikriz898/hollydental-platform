export default function PortalLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Top bar progress hint */}
      <div className="h-1 w-1/3 bg-gold/40 rounded-full" />

      {/* Title skeleton */}
      <div className="h-7 w-56 bg-gray-200/80 rounded-md" />

      {/* Card grid skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="border border-gray-100 bg-white rounded-2xl p-5 shadow-sm space-y-3"
          >
            <div className="h-4 w-1/2 bg-gray-200 rounded" />
            <div className="h-3 w-full bg-gray-100 rounded" />
            <div className="h-3 w-5/6 bg-gray-100 rounded" />
            <div className="h-3 w-2/3 bg-gray-100 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
