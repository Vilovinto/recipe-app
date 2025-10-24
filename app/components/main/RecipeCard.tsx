import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { Recipe } from '../../types';

interface RecipeCardProps {
  recipe: Recipe;
  onEdit?: (recipe: Recipe) => void;
  onDelete?: (recipe: Recipe) => void;
  isOwner?: boolean;
  className?: string;
}

// Функція для форматування часу приготування
const formatPrepTime = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes} m`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  if (remainingMinutes === 0) {
    return `${hours} h`;
  }
  return `${hours} h ${remainingMinutes} m`;
};

export default function RecipeCard({
  recipe,
  onEdit,
  onDelete,
  isOwner = false,
  className = '',
}: RecipeCardProps) {
  const router = useRouter();
  const [showMenu, setShowMenu] = useState(false);
  const [showActionMenu, setShowActionMenu] = useState(false);
  const actionMenuRef = useRef<HTMLDivElement>(null);

  const handleMenuToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onEdit?.(recipe);
    setShowMenu(false);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onDelete?.(recipe);
    setShowMenu(false);
  };

  const handleActionMenuToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowActionMenu(!showActionMenu);
  };

  const handleCardClick = () => {
    // Зберігаємо дані рецепту в sessionStorage для передачі на сторінку деталей
    sessionStorage.setItem('currentRecipe', JSON.stringify(recipe));
    router.push(`/recipes/${recipe.id}`);
  };

  // Закриваємо action menu при кліку поза ним
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        actionMenuRef.current &&
        !actionMenuRef.current.contains(event.target as Node)
      ) {
        setShowActionMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div
      className={`relative w-[330.67px] h-[328px] bg-[rgba(255,255,255,0.16)] border-[1.5px] border-[rgba(230,216,214,0.2)] rounded-lg overflow-visible group cursor-pointer ${className}`}
    >
      <div onClick={handleCardClick} className="block h-full">
        {/* Recipe Image */}
        <div className="w-full h-[164px] relative">
          {recipe.image ? (
            <img
              src={recipe.image}
              alt={recipe.title}
              className="w-full h-full object-cover"
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

        {/* Recipe Content */}
        <div className="p-4 h-[164px] flex flex-col justify-between">
          {/* Title and Rating */}
          <div className="flex items-start justify-between gap-1.5">
            <div className="flex-1 space-y-2">
              <h3 className="text-[#E6D8D6] font-semibold text-base leading-6 font-['Fira_Sans'] line-clamp-1">
                {recipe.title}
              </h3>
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

          {/* Prep Time and Action Menu */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="px-4 py-1.5 bg-[#FFE478] text-[#0D0402] rounded-lg font-semibold text-[15px] leading-5 font-['Fira_Sans']">
                {formatPrepTime(recipe.prepTime)}
              </div>
            </div>

            {/* Three Dots Button */}
            <div className="relative z-10" ref={actionMenuRef}>
              <button
                onClick={handleActionMenuToggle}
                className="w-8 h-8 border-[1.5px] border-[#FFE478] rounded-lg flex items-center justify-center hover:bg-[#FFE478]/10 transition-colors"
              >
                <div className="w-5 h-5 relative">
                  <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3">
                    <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-1 bg-[#FFE478] rounded-full"></div>
                    <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-[#FFE478] rounded-full"></div>
                    <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-1 h-1 bg-[#FFE478] rounded-full"></div>
                  </div>
                </div>
              </button>

              {/* Action Menu */}
              {showActionMenu && (
                <div className="absolute right-0 top-full mt-1 w-[102px] h-[64px] bg-[#FFE478] rounded-lg shadow-lg z-99999 flex flex-col items-start p-1 gap-2">
                  <button
                    onClick={handleEdit}
                    className="flex flex-row justify-center items-center px-1 py-0.5 gap-2.5 w-[94px] h-6 bg-linear-to-b from-white/30 to-white/30 rounded hover:bg-white/40 transition-colors"
                  >
                    <span className="w-[86px] h-5 font-['Fira_Sans'] font-normal text-base leading-5 text-[#2D2726]">
                      Edit
                    </span>
                  </button>
                  <button
                    onClick={handleDelete}
                    className="flex flex-row justify-center items-center px-1 py-0.5 gap-2.5 w-[94px] h-6 rounded hover:bg-white/20 transition-colors"
                  >
                    <span className="w-[86px] h-5 font-['Fira_Sans'] font-normal text-base leading-5 text-[#2D2726]">
                      Delete
                    </span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
