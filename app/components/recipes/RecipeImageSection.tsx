import Image from 'next/image';
import { Recipe } from '../../types';

interface RecipeImageSectionProps {
  recipe: Recipe;
}

export default function RecipeImageSection({
  recipe,
}: RecipeImageSectionProps) {
  return (
    <div className="flex flex-col justify-center items-center py-6 gap-1.5 w-full max-w-[1344px] mx-auto">
      <div className="w-full aspect-4/3 relative">
        {recipe.image ? (
          <Image
            src={recipe.image}
            alt={recipe.title}
            fill
            className="object-cover rounded-lg"
            priority
            sizes="(max-width: 768px) 100vw, 1344px"
          />
        ) : (
          <div className="w-full h-full bg-linear-to-br from-gray-300 to-gray-400 flex items-center justify-center rounded-lg">
            <svg
              className="w-12 h-12 text-gray-500"
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
        )}
      </div>

      <p className="w-full font-['Fira_Sans'] font-normal text-[13px] leading-4 text-[rgba(230,216,214,0.62)]">
        {recipe.title}
      </p>
    </div>
  );
}
