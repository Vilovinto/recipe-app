export default function RecipeCardSkeleton() {
  return (
    <div className="w-[330.67px] h-[328px] bg-[rgba(255,255,255,0.16)] border-[1.5px] border-[rgba(230,216,214,0.2)] rounded-lg overflow-hidden animate-pulse">
      {/* Image skeleton */}
      <div className="w-full h-[164px] bg-gray-200"></div>

      {/* Content skeleton */}
      <div className="p-4 h-[164px] flex flex-col justify-between">
        {/* Title and Rating */}
        <div className="flex items-start justify-between gap-1.5">
          <div className="flex-1 space-y-2">
            <div className="h-6 bg-gray-200 rounded"></div>
            <div className="h-5 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-6 bg-gray-200 rounded"></div>
            <div className="w-[18px] h-4 bg-gray-200 rounded"></div>
          </div>
        </div>

        {/* Time Buttons and Action Menu */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-[58px] h-8 bg-gray-200 rounded-lg"></div>
            <div className="w-[76px] h-8 bg-gray-200 rounded-lg"></div>
            <div className="w-[65px] h-8 bg-gray-200 rounded-lg"></div>
          </div>
          <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    </div>
  );
}
