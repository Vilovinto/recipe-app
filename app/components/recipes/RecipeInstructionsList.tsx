interface RecipeInstructionsListProps {
  instructions: string[];
}

export default function RecipeInstructionsList({
  instructions,
}: RecipeInstructionsListProps) {
  return (
    <div className="flex flex-col justify-center items-center py-6 gap-2 w-full max-w-[1344px]">
      <h2 className="w-full font-['Hepta_Slab'] font-medium text-[28px] leading-8 tracking-[-0.01em] text-[#E6D8D6]">
        Instructions
      </h2>

      <div className="flex flex-col gap-2 w-full">
        {instructions.map((instruction, index) => (
          <div key={index} className="flex flex-row items-baseline gap-1.5 w-full">
            <span className="w-8 font-['Fira_Sans'] font-semibold text-[17px] leading-6 text-right text-[#E6D8D6] flex-none">
              {index + 1}.
            </span>
            <span className="font-['Fira_Sans'] font-normal text-[17px] leading-7 text-[#E6D8D6] grow">
              {instruction}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

