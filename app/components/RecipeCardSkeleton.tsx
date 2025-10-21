export default function RecipeCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden animate-pulse">
      {/* Image skeleton */}
      <div className="h-48 bg-gray-200"></div>

      {/* Content skeleton */}
      <div className="p-4">
        {/* Title skeleton */}
        <div className="h-6 bg-gray-200 rounded mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>

        {/* Cuisine skeleton */}
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>

        {/* Rating and time skeleton */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="h-4 w-16 bg-gray-200 rounded"></div>
            <div className="h-4 w-8 bg-gray-200 rounded"></div>
          </div>
          <div className="h-4 w-12 bg-gray-200 rounded"></div>
        </div>

        {/* Category skeleton */}
        <div className="mt-2">
          <div className="h-6 w-20 bg-gray-200 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}
