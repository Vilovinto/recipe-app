import { Recipe } from '../../types';

interface RecipeAuthorInfoProps {
  recipe: Recipe;
}

export default function RecipeAuthorInfo({ recipe }: RecipeAuthorInfoProps) {
  return (
    <div className="flex flex-col items-start gap-4 w-full max-w-[1344px] mx-auto">
      <div className="w-full font-['Fira_Sans'] font-normal text-[15px] leading-5 text-[#E6D8D6]">
        {recipe.createdAt.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}
      </div>

      <div className="flex flex-row items-center gap-3 w-full">
        <div className="w-9 h-9 relative">
          <div className="w-9 h-9 rounded-full overflow-hidden flex items-center justify-center">
            <img
              src="https://firebasestorage.googleapis.com/v0/b/recipe-app-caa91.firebasestorage.app/o/recipe-images%2FjfU84aSjTTX2qZlIyJpYyCM753K2%2Fb45fff6b8e9ca09258e544c7bd3e6cd00180d427.png?alt=media&token=fdc18eed-8f34-4278-b3dd-cb4ddcedc1ca"
              alt={recipe.author || 'Recipe Creator'}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="flex flex-col items-start">
          <div className="font-['Fira_Sans'] font-semibold text-[13px] leading-4 text-[#E6D8D6]">
            {recipe.author}
          </div>
          <div className="font-['Fira_Sans'] font-normal text-[13px] leading-4 text-[rgba(230,216,214,0.62)]">
            Recipe Creator
          </div>
        </div>
      </div>
    </div>
  );
}
