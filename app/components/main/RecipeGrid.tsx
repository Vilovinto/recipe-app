import RecipeCard from './RecipeCard';
import { Recipe } from '../../types';

interface RecipeGridProps {
  recipes: Recipe[];
  onEdit?: (recipe: Recipe) => void;
  onDelete?: (recipe: Recipe) => void;
  currentUserId?: string;
  className?: string;
}

export default function RecipeGrid({
  recipes,
  onEdit,
  onDelete,
  currentUserId,
  className = '',
}: RecipeGridProps) {
  if (recipes.length === 0) {
    return (
      <div className={`flex items-center justify-center py-12 ${className}`}>
        <div className="text-center">
          <svg
            className="w-16 h-16 text-gray-400 mx-auto mb-4"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
              clipRule="evenodd"
            />
          </svg>
          <p className="text-[#E6D8D6] text-lg font-['Fira_Sans']">
            No recipes found
          </p>
          <p className="text-[rgba(230,216,214,0.62)] text-sm font-['Fira_Sans'] mt-1">
            Try adjusting your search or filters
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col gap-8 ${className}`}>
      {Array.from({ length: Math.ceil(recipes.length / 3) }).map(
        (_, rowIndex) => (
          <div key={rowIndex} className="flex flex-row items-start gap-8">
            {recipes.slice(rowIndex * 3, (rowIndex + 1) * 3).map(recipe => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                onEdit={onEdit}
                onDelete={onDelete}
                isOwner={currentUserId === recipe.userId}
              />
            ))}
          </div>
        )
      )}
    </div>
  );
}
