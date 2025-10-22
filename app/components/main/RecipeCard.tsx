import Link from 'next/link';
import { useState } from 'react';
import { Recipe } from '../../types';

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
  className = '' 
}: RecipeCardProps) {
  const [showMenu, setShowMenu] = useState(false);

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

  return (
    <div className={`relative bg-white/16 border border-[rgba(230,216,214,0.2)] rounded-lg overflow-hidden group ${className}`}>
      <Link href={`/recipes/${recipe.id}`} className="block">
        {/* Recipe Image */}
        <div className="w-full h-40 relative">
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
        <div className="p-4 space-y-4">
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

          {/* Prep Time Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button className="px-4 py-1.5 bg-[#FFE478] text-[#0D0402] rounded-lg font-semibold text-[15px] leading-5 font-['Fira_Sans']">
                1 hr
              </button>
              <button className="px-4 py-1.5 bg-[#FFE478] text-[#0D0402] rounded-lg font-semibold text-[15px] leading-5 font-['Fira_Sans']">
                1.5 hrs
              </button>
              <button className="px-4 py-1.5 bg-[#FFE478] text-[#0D0402] rounded-lg font-semibold text-[15px] leading-5 font-['Fira_Sans']">
                2 hrs
              </button>
            </div>
            
            {/* Menu Button */}
            {isOwner && (
              <div className="relative">
                <button
                  onClick={handleMenuToggle}
                  className="w-8 h-8 border border-[rgba(182,160,145,0.2)] rounded-lg flex items-center justify-center hover:border-[#FFE478] transition-colors"
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-[#E6D8D6]"
                  >
                    <path
                      d="M12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12C11 12.5523 11.4477 13 12 13Z"
                      fill="currentColor"
                    />
                    <path
                      d="M12 6C12.5523 6 13 5.55228 13 5C13 4.44772 12.5523 4 12 4C11.4477 4 11 4.44772 11 5C11 5.55228 11.4477 6 12 6Z"
                      fill="currentColor"
                    />
                    <path
                      d="M12 20C12.5523 20 13 19.5523 13 19C13 18.4477 12.5523 18 12 18C11.4477 18 11 18.4477 11 19C11 19.5523 11.4477 20 12 20Z"
                      fill="currentColor"
                    />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {showMenu && (
                  <div className="absolute right-0 top-full mt-1 w-24 bg-[#FFE478] rounded-lg shadow-lg z-10">
                    <div className="py-1">
                      <button
                        onClick={handleEdit}
                        className="w-full px-3 py-1.5 text-[#2D2726] text-base font-['Fira_Sans'] hover:bg-white/30 transition-colors text-center"
                      >
                        Edit
                      </button>
                      <button
                        onClick={handleDelete}
                        className="w-full px-3 py-1.5 text-[#2D2726] text-base font-['Fira_Sans'] hover:bg-white/30 transition-colors text-center"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}
