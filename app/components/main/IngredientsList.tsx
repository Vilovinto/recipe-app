interface IngredientsListProps {
  ingredients: string[];
  onIngredientChange: (index: number, value: string) => void;
  onAddIngredient: () => void;
  onRemoveIngredient: (index: number) => void;
}

export default function IngredientsList({
  ingredients,
  onIngredientChange,
  onAddIngredient,
  onRemoveIngredient,
}: IngredientsListProps) {
  return (
    <div className="bg-[rgba(255,255,255,0.1)] rounded-xl p-6 border border-[rgba(230,221,214,0.2)]">
      <h3 className="text-xl font-semibold text-white mb-6 font-['Fira_Sans']">
        Ingredients
      </h3>

      <div className="space-y-4">
        {ingredients.map((ingredient, index) => (
          <div key={index} className="flex items-center space-x-4">
            <input
              type="text"
              value={ingredient}
              onChange={e => onIngredientChange(index, e.target.value)}
              className="flex-1 px-3 py-2 border border-[rgba(230,221,214,0.5)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFE478] focus:border-transparent bg-[rgba(255,255,255,0.1)] text-white placeholder-gray-300"
              placeholder={`Ingredient ${index + 1}`}
            />
            {ingredients.length > 1 && (
              <button
                type="button"
                onClick={() => onRemoveIngredient(index)}
                className="text-red-600 hover:text-red-700 font-['Fira_Sans']"
              >
                Remove
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={onAddIngredient}
          className="w-full py-2 border-2 border-dashed border-[rgba(230,221,214,0.5)] rounded-lg text-white hover:text-white/80 hover:border-[rgba(230,221,214,0.8)] font-['Fira_Sans']"
        >
          + Add Ingredient
        </button>
      </div>
    </div>
  );
}
