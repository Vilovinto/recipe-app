import FilterCheckbox from './FilterCheckbox';
import FilterRadio from './FilterRadio';
import CustomTimeRange from './CustomTimeRange';

interface SidebarProps {
  categories: string[];
  selectedCategories: string[];
  onCategoryChange: (category: string, checked: boolean) => void;
  prepTimeFilter: string;
  onPrepTimeChange: (time: string) => void;
  customMinTime: string;
  customMaxTime: string;
  onCustomMinTimeChange: (value: string) => void;
  onCustomMaxTimeChange: (value: string) => void;
  topPrepTimeFilter?: string;
  className?: string;
}

export default function Sidebar({
  categories,
  selectedCategories,
  onCategoryChange,
  prepTimeFilter,
  onPrepTimeChange,
  customMinTime,
  customMaxTime,
  onCustomMinTimeChange,
  onCustomMaxTimeChange,
  topPrepTimeFilter = '',
  className = '',
}: SidebarProps) {
  const prepTimeOptions = [
    'Under 15 mins',
    '15-30 mins',
    '30-60 mins',
    'Over 1 hr',
    'Custom',
  ];

  return (
    <aside className={`w-60 space-y-6 ${className}`}>
      {/* Category Filter */}
      <div className="space-y-6">
        <h3 className="text-[#E6D8D6] font-semibold text-lg leading-[27px] font-['Fira_Sans']">
          Filter by Category
        </h3>
        <div className="space-y-3">
          {categories.map(category => (
            <FilterCheckbox
              key={category}
              label={category}
              checked={selectedCategories.includes(category)}
              onChange={checked => onCategoryChange(category, checked)}
            />
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-[rgba(182,160,145,0.2)]"></div>

      {/* Prep Time Filter */}
      <div className="space-y-6">
        <h3 className="text-[#E6D8D6] font-semibold text-lg leading-[27px] font-['Fira_Sans']">
          Filter by Prep Time
        </h3>
        <div className="space-y-3">
          {prepTimeOptions.map(option => (
            <div key={option}>
              <FilterRadio
                label={option}
                checked={prepTimeFilter === option}
                onChange={() => onPrepTimeChange(option)}
                disabled={!!topPrepTimeFilter}
              />
              {option === 'Custom' && prepTimeFilter === 'Custom' && (
                <div className="ml-8 mt-2">
                  <CustomTimeRange
                    minTime={customMinTime}
                    maxTime={customMaxTime}
                    onMinTimeChange={onCustomMinTimeChange}
                    onMaxTimeChange={onCustomMaxTimeChange}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
