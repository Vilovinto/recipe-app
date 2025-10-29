import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Recipe } from '../../types';
import { formatPrepTime } from '../../lib/recipe-utils';
import ActionMenu from './ActionMenu';
import FavoriteButton from './FavoriteButton';

interface RecipeCardProps {
  recipe: Recipe;
  onEdit?: (recipe: Recipe) => void;
  onDelete?: (recipe: Recipe) => void;
  isOwner?: boolean;
  className?: string;
}

export default function RecipeCard({
  recipe,
  onEdit,
  onDelete,
  isOwner = false,
  className = '',
}: RecipeCardProps) {
  const router = useRouter();

  const handleCardClick = () => {
    sessionStorage.setItem('currentRecipe', JSON.stringify(recipe));
    router.push(`/recipes/${recipe.id}`);
  };

  return (
    <div
      className={`relative w-[330.67px] h-[328px] bg-[rgba(255,255,255,0.16)] border-[1.5px] border-[rgba(230,216,214,0.2)] rounded-lg overflow-visible group cursor-pointer ${className}`}
    >
      <div onClick={handleCardClick} className="block h-full">
        <div className="w-full h-[164px] relative">
          {recipe.image ? (
            <Image
              src={recipe.image}
              alt={recipe.title}
              fill
              className="object-cover"
              loading="lazy"
              sizes="(max-width: 768px) 100vw, 330px"
            />
          ) : (
            <div className="w-full h-full bg-linear-to-br from-gray-300 to-gray-400 flex items-center justify-center">
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

        <div className="p-4 h-[164px] flex flex-col justify-between">
          <div className="flex items-start justify-between gap-1.5">
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <h3 className="text-[#E6D8D6] font-semibold text-base leading-6 font-['Fira_Sans'] line-clamp-1">
                  {recipe.title}
                </h3>
                <FavoriteButton recipeId={recipe.id} />
              </div>
              <p className="text-[#E6D8D6] text-sm leading-5 font-['Fira_Sans'] line-clamp-1">
                {recipe.description}
              </p>
              <p className="text-[#E6D8D6] font-semibold text-xs leading-4 font-['Fira_Sans']">
                {recipe.cuisine}
              </p>
            </div>
            <div className="flex items-center gap-1.5">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-[#FFE478]"
              >
                <path
                  d="M12 2L15.09 8.26L22 9L17 14L18.18 21L12 17.77L5.82 21L7 14L2 9L8.91 8.26L12 2Z"
                  fill="currentColor"
                />
              </svg>
              <span className="text-[#FFE478] font-semibold text-[13px] leading-4 font-['Fira_Sans']">
                {recipe.rating}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="px-4 py-1.5 bg-[#FFE478] text-[#0D0402] rounded-lg font-semibold text-[15px] leading-5 font-['Fira_Sans']">
                {formatPrepTime(recipe.prepTime)}
              </div>
            </div>

            {onEdit && onDelete && (
              <ActionMenu recipe={recipe} onEdit={onEdit} onDelete={onDelete} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
