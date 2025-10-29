import { RecipeCategory } from '../../types';
import CustomSelect from './CustomSelect';

interface RecipeFormFieldsProps {
  formData: {
    title: string;
    description: string;
    introduction: string;
    category: RecipeCategory;
    cuisine: string;
    prepTime: number;
    rating: number;
  };
  onInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  onCategoryChange: (category: RecipeCategory) => void;
}

export default function RecipeFormFields({
  formData,
  onInputChange,
  onCategoryChange,
}: RecipeFormFieldsProps) {
  return (
    <div className="bg-[rgba(255,255,255,0.1)] rounded-xl p-6 border border-[rgba(230,221,214,0.2)]">
      <h3 className="text-xl font-semibold text-white mb-6 font-['Fira_Sans']">
        Basic Information
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-white mb-2 font-['Fira_Sans']">
            Recipe Title
          </label>
          <input
            type="text"
            name="title"
            required
            value={formData.title}
            onChange={onInputChange}
            className="w-full px-3 py-2 border border-[rgba(230,221,214,0.5)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFE478] focus:border-transparent bg-[rgba(255,255,255,0.1)] text-white placeholder-gray-300"
            placeholder="e.g., Lemon Drizzle Cake"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-2 font-['Fira_Sans']">
            Category
          </label>
          <CustomSelect
            value={formData.category}
            onChange={val => onCategoryChange(val as RecipeCategory)}
            placeholder="Select Category"
            hidePlaceholderOption={true}
            options={[
              { label: 'Dessert', value: 'dessert' },
              { label: 'Main Course', value: 'main' },
              { label: 'Snack', value: 'snack' },
              { label: 'Breakfast', value: 'breakfast' },
              { label: 'Vegan', value: 'vegan' },
            ]}
            className="w-full"
            buttonClassName="w-full px-3 py-2 border border-[rgba(230,221,214,0.5)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFE478] focus:border-transparent bg-[rgba(255,255,255,0.1)] text-white placeholder-gray-300 flex items-center justify-between"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-2 font-['Fira_Sans']">
            Cuisine
          </label>
          <input
            type="text"
            name="cuisine"
            required
            value={formData.cuisine}
            onChange={onInputChange}
            className="w-full px-3 py-2 border border-[rgba(230,221,214,0.5)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFE478] focus:border-transparent bg-[rgba(255,255,255,0.1)] text-white placeholder-gray-300"
            placeholder="e.g., British, Italian, Mexican"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-2 font-['Fira_Sans']">
            Prep Time (minutes)
          </label>
          <input
            type="number"
            name="prepTime"
            required
            min="1"
            value={formData.prepTime === 0 ? '' : formData.prepTime}
            onChange={onInputChange}
            className="w-full px-3 py-2 border border-[rgba(230,221,214,0.5)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFE478] focus:border-transparent bg-[rgba(255,255,255,0.1)] text-white placeholder-gray-300"
            placeholder="0"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-2 font-['Fira_Sans']">
            Rating
          </label>
          <input
            type="number"
            name="rating"
            required
            min="0"
            max="5"
            step="0.1"
            value={formData.rating === 0 ? '' : formData.rating}
            onChange={onInputChange}
            className="w-full px-3 py-2 border border-[rgba(230,221,214,0.5)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFE478] focus:border-transparent bg-[rgba(255,255,255,0.1)] text-white placeholder-gray-300"
            placeholder="0"
          />
        </div>
      </div>

      <div className="mt-6">
        <label className="block text-sm font-medium text-white mb-2 font-['Fira_Sans']">
          Description
        </label>
        <textarea
          name="description"
          required
          rows={4}
          value={formData.description}
          onChange={onInputChange}
          className="w-full px-3 py-2 border border-[rgba(230,221,214,0.5)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFE478] focus:border-transparent bg-[rgba(255,255,255,0.1)] text-white placeholder-gray-300"
          placeholder="Describe your recipe..."
        />
      </div>

      <div className="mt-6">
        <label className="block text-sm font-medium text-white mb-2 font-['Fira_Sans']">
          Introduction
        </label>
        <textarea
          name="introduction"
          required
          rows={5}
          value={formData.introduction}
          onChange={onInputChange}
          className="w-full px-3 py-2 border border-[rgba(230,221,214,0.5)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFE478] focus:border-transparent bg-[rgba(255,255,255,0.1)] text-white placeholder-gray-300"
          placeholder="Tell a short story, context, or serving tips..."
        />
      </div>
    </div>
  );
}

