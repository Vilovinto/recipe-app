interface RecipeIngredientsListProps {
  ingredients: string[];
}

export default function RecipeIngredientsList({
  ingredients,
}: RecipeIngredientsListProps) {
  return (
    <div className="flex flex-col justify-center items-center py-6 gap-2 w-full">
      <h2 className="w-full font-['Hepta_Slab'] font-medium text-[28px] leading-8 tracking-[-0.01em] text-[#E6D8D6]">
        Ingredients
      </h2>

      <div className="flex flex-col gap-2 w-full">
        {ingredients.map((ingredient, index) => (
          <div
            key={index}
            className="flex flex-row items-center gap-1.5 w-full"
          >
            <div className="w-6 h-6 relative">
              <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 border-[1.5px] border-[#E6D8D6]"></div>
            </div>
            <span className="w-full font-['Fira_Sans'] font-normal text-[17px] leading-7 text-[#E6D8D6]">
              {ingredient}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
