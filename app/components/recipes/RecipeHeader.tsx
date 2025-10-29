import { Recipe } from '../../types';
import FavoriteButton from '../main/FavoriteButton';

interface RecipeHeaderProps {
  recipe: Recipe;
  onBack: () => void;
}

export default function RecipeHeader({ recipe, onBack }: RecipeHeaderProps) {
  const capitalizeFirst = (str: string) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  return (
    <div className="flex flex-col items-start py-6 gap-6 w-full max-w-[1344px] mx-auto">
      <button
        onClick={onBack}
        className="flex flex-row justify-center items-center px-4 py-3 gap-1.5 w-[93px] h-12 bg-[#FFE478] rounded-xl hover:bg-[#FFE478]/90 transition-colors"
      >
        <div className="w-5 h-5 relative">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"
          >
            <path
              d="M19 12H5M12 19L5 12L12 5"
              stroke="#0D0702"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <span className="w-[35px] h-6 font-['Fira_Sans'] font-semibold text-base leading-6 text-[#0D0702]">
          Back
        </span>
      </button>

      <div className="w-full font-['Fira_Sans'] font-semibold text-[15px] leading-5 text-[#FFE478]">
        {capitalizeFirst(recipe.category)}, {recipe.cuisine}
      </div>

      <div className="flex items-center gap-4 w-full">
        <h1 className="flex-1 font-['Hepta_Slab'] font-medium text-[48px] leading-[52px] tracking-[-0.01em] text-[#E6D8D6]">
          {recipe.title}
        </h1>
        <FavoriteButton recipeId={recipe.id} />
      </div>

      <p className="w-full font-['Fira_Sans'] font-normal text-xl leading-6 text-[#E6D8D6]">
        {recipe.description}
      </p>
    </div>
  );
}
