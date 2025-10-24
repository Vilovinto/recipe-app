interface RecipeImageProps {
  src?: string;
  alt?: string;
  className?: string;
}

export default function RecipeImage({
  src,
  alt = 'Recipe',
  className = '',
}: RecipeImageProps) {
  if (src) {
    return (
      <div className={`w-full h-full rounded-3xl overflow-hidden ${className}`}>
        <img src={src} alt={alt} className="w-full h-full object-cover" />
      </div>
    );
  }

  // Placeholder when no image is provided
  return (
    <div className={`w-full h-full rounded-3xl overflow-hidden ${className}`}>
      <div className="w-full h-full bg-linear-to-br from-orange-200 to-orange-300 flex items-center justify-center">
        <div className="text-center text-gray-600">
          <div className="w-32 h-32 mx-auto mb-4 bg-orange-400 rounded-full flex items-center justify-center">
            <svg
              className="w-16 h-16 text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <p className="text-lg font-medium">Recipe Image</p>
          <p className="text-sm text-gray-500">Replace with actual image</p>
        </div>
      </div>
    </div>
  );
}
