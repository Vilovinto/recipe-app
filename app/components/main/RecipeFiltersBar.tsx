import CustomSelect from './CustomSelect';

interface RecipeFiltersBarProps {
  cuisineFilter: string;
  difficultyFilter: string;
  topPrepTimeFilter: string;
  allCuisines: string[];
  onCuisineChange: (value: string) => void;
  onDifficultyChange: (value: string) => void;
  onPrepTimeChange: (value: string) => void;
}

export default function RecipeFiltersBar({
  cuisineFilter,
  difficultyFilter,
  topPrepTimeFilter,
  allCuisines,
  onCuisineChange,
  onDifficultyChange,
  onPrepTimeChange,
}: RecipeFiltersBarProps) {
  return (
    <div className="flex items-center gap-2">
      <CustomSelect
        value={cuisineFilter}
        onChange={onCuisineChange}
        placeholder="Cuisine"
        options={allCuisines.map(c => ({ label: c, value: c }))}
        buttonClassName="px-4 py-2 bg-[#2D2726] border border-[rgba(182,160,145,0.2)] rounded-lg text-[#E6D8D6] font-semibold text-[15px] leading-5 font-['Fira_Sans'] focus:outline-none focus:border-[#FFE478] flex items-center gap-2"
      />
      <CustomSelect
        value={difficultyFilter}
        onChange={onDifficultyChange}
        placeholder="Difficulty"
        options={[
          { label: 'Easy', value: 'Easy' },
          { label: 'Medium', value: 'Medium' },
          { label: 'Hard', value: 'Hard' },
        ]}
        buttonClassName="px-4 py-2 bg-[#2D2726] border border-[rgba(182,160,145,0.2)] rounded-lg text-[#E6D8D6] font-semibold text-[15px] leading-5 font-['Fira_Sans'] focus:outline-none focus:border-[#FFE478] flex items-center gap-2"
      />
      <CustomSelect
        value={topPrepTimeFilter}
        onChange={onPrepTimeChange}
        placeholder="Prep Time"
        options={[
          { label: 'Under 15 mins', value: 'Under 15 mins' },
          { label: '15-30 mins', value: '15-30 mins' },
          { label: '30-60 mins', value: '30-60 mins' },
          { label: 'Over 1 hour', value: 'Over 1 hour' },
        ]}
        buttonClassName="px-4 py-2 bg-[#2D2726] border border-[rgba(182,160,145,0.2)] rounded-lg text-[#E6D8D6] font-semibold text-[15px] leading-5 font-['Fira_Sans'] focus:outline-none focus:border-[#FFE478] flex items-center gap-2"
      />
    </div>
  );
}

