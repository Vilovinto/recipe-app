'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import { recipeService } from '../../lib/firebase-utils';
import { Recipe } from '../../types';
import Header from '../../components/main/Header';
import toast from 'react-hot-toast';

export default function RecipeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      // Спочатку перевіряємо sessionStorage для прикладу рецепту
      const storedRecipe = sessionStorage.getItem('currentRecipe');
      if (storedRecipe) {
        try {
          const recipeData = JSON.parse(storedRecipe);
          // Перетворюємо дати з рядків назад в Date об'єкти
          recipeData.createdAt = new Date(recipeData.createdAt);
          recipeData.updatedAt = new Date(recipeData.updatedAt);
          setRecipe(recipeData);
          setLoading(false);
          return;
        } catch (error) {
          console.error('Error parsing stored recipe:', error);
        }
      }
      
      // Якщо немає в sessionStorage, завантажуємо з Firebase
      loadRecipe(params.id as string);
    }
  }, [params.id]);

  const loadRecipe = async (id: string) => {
    setLoading(true);
    try {
      const recipeData = await recipeService.getRecipe(id);
      setRecipe(recipeData);
    } catch (error) {
      console.error('Error loading recipe:', error);
      toast.error('Failed to load recipe');
      router.push('/recipes');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    // Очищаємо sessionStorage при поверненні назад
    sessionStorage.removeItem('currentRecipe');
    router.push('/recipes');
  };

  const handleSearch = (query: string) => {
    // Очищаємо sessionStorage при пошуку
    sessionStorage.removeItem('currentRecipe');
    router.push(`/recipes?search=${encodeURIComponent(query)}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#2D2726] flex items-center justify-center">
        <div className="text-[#E6D8D6] text-xl">Loading...</div>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="min-h-screen bg-[#2D2726] flex items-center justify-center">
        <div className="text-[#E6D8D6] text-xl">Recipe not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#2D2726] px-12">
      {/* Header */}
      <Header onSearch={handleSearch} />

      {/* Article Page Headline with Author */}
      <div className="flex flex-col items-start py-6 gap-6 w-full max-w-[1344px] mx-auto">
        {/* Back Button */}
        <button
          onClick={handleBack}
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

        {/* Category */}
        <div className="w-full h-5 font-['Fira_Sans'] font-semibold text-[15px] leading-5 text-[#FFE478]">
          Dessert, Baking, Lemon
        </div>

        {/* Title */}
        <h1 className="w-full h-[52px] font-['Hepta_Slab'] font-medium text-[48px] leading-[52px] tracking-[-0.01em] text-[#E6D8D6]">
          Exquisite Lemon Drizzle Cake
        </h1>

        {/* Description */}
        <p className="w-full h-6 font-['Fira_Sans'] font-normal text-xl leading-6 text-[#E6D8D6]">
          Discover the secrets to making the perfect lemon drizzle cake with this easy-to-follow recipe.
        </p>

        {/* Image Section */}
        <div className="flex flex-col justify-center items-center py-6 gap-1.5 w-full h-[572px]">
          {/* Recipe Image */}
          <div className="w-full h-[502px] relative">
            <img
              src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=1344&h=502&fit=crop"
              alt="Exquisite Lemon Drizzle Cake"
              className="w-full h-full object-cover rounded-lg"
            />
          </div>

          {/* Image Caption */}
          <p className="w-full h-4 font-['Fira_Sans'] font-normal text-[13px] leading-4 text-[rgba(230,216,214,0.62)]">
            A slice of lemon drizzle cake on a plate.
          </p>
        </div>

        {/* Date and Author */}
        <div className="flex flex-col items-start gap-4 w-full h-[72px]">
          {/* Date */}
          <div className="w-full h-5 font-['Fira_Sans'] font-normal text-[15px] leading-5 text-[#E6D8D6]">
            {recipe.createdAt.toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </div>

          {/* Author */}
          <div className="flex flex-row items-center gap-3 w-full h-9">
            {/* Avatar */}
            <div className="w-9 h-9 relative">
              <div className="w-9 h-9 bg-linear-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">
                  {user?.displayName?.charAt(0) || user?.email?.charAt(0) || 'U'}
                </span>
              </div>
            </div>

            {/* Author Info */}
            <div className="flex flex-col items-start w-[248px] h-8">
              <div className="w-[248px] h-4 font-['Fira_Sans'] font-semibold text-[13px] leading-4 text-[#E6D8D6]">
                {user?.displayName || user?.email || 'Anonymous User'}
              </div>
              <div className="w-[248px] h-4 font-['Fira_Sans'] font-normal text-[13px] leading-4 text-[rgba(230,216,214,0.62)]">
                Pastry Chef
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recipe Content */}
      <div className="max-w-[1344px] mx-auto py-6">
        {/* Introduction */}
        <div className="mb-8">
          <h2 className="text-[#E6D8D6] font-['Fira_Sans'] font-semibold text-2xl mb-4">
            Introduction
          </h2>
          <p className="text-[#E6D8D6] font-['Fira_Sans'] font-normal text-base leading-6">
            This lemon drizzle cake is a timeless classic that combines the tartness of lemons with the sweetness of sugar, creating a moist and flavorful dessert. Perfect for afternoon tea or as a delightful treat for any occasion.
          </p>
        </div>

        {/* Ingredients */}
        <div className="flex flex-col justify-center items-center py-6 gap-2 w-full h-[332px]">
          {/* Ingredients Title */}
          <h2 className="w-full h-8 font-['Hepta_Slab'] font-medium text-[28px] leading-8 tracking-[-0.01em] text-[#E6D8D6]">
            Ingredients
          </h2>

          {/* Ingredients List */}
          <div className="flex flex-col gap-2 w-full">
            {/* Item 1 */}
            <div className="flex flex-row items-center gap-1.5 w-full h-7">
              <div className="w-6 h-6 relative">
                <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 border-[1.5px] border-[#E6D8D6]"></div>
              </div>
              <span className="w-full h-7 font-['Fira_Sans'] font-normal text-[17px] leading-7 text-[#E6D8D6]">
                1 cup all-purpose flour
              </span>
            </div>

            {/* Item 2 */}
            <div className="flex flex-row items-center gap-1.5 w-full h-7">
              <div className="w-6 h-6 relative">
                <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 border-[1.5px] border-[#E6D8D6]"></div>
              </div>
              <span className="w-full h-7 font-['Fira_Sans'] font-normal text-[17px] leading-7 text-[#E6D8D6]">
                1/2 cup sugar
              </span>
            </div>

            {/* Item 3 */}
            <div className="flex flex-row items-center gap-1.5 w-full h-7">
              <div className="w-6 h-6 relative">
                <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 border-[1.5px] border-[#E6D8D6]"></div>
              </div>
              <span className="w-full h-7 font-['Fira_Sans'] font-normal text-[17px] leading-7 text-[#E6D8D6]">
                1/4 cup unsalted butter
              </span>
            </div>

            {/* Item 4 */}
            <div className="flex flex-row items-center gap-1.5 w-full h-7">
              <div className="w-6 h-6 relative">
                <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 border-[1.5px] border-[#E6D8D6]"></div>
              </div>
              <span className="w-full h-7 font-['Fira_Sans'] font-normal text-[17px] leading-7 text-[#E6D8D6]">
                2 eggs
              </span>
            </div>

            {/* Item 5 */}
            <div className="flex flex-row items-center gap-1.5 w-full h-7">
              <div className="w-6 h-6 relative">
                <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 border-[1.5px] border-[#E6D8D6]"></div>
              </div>
              <span className="w-full h-7 font-['Fira_Sans'] font-normal text-[17px] leading-7 text-[#E6D8D6]">
                1 lemon, zested and juiced
              </span>
            </div>

            {/* Item 6 */}
            <div className="flex flex-row items-center gap-1.5 w-full h-7">
              <div className="w-6 h-6 relative">
                <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 border-[1.5px] border-[#E6D8D6]"></div>
              </div>
              <span className="w-full h-7 font-['Fira_Sans'] font-normal text-[17px] leading-7 text-[#E6D8D6]">
                1 tsp baking powder
              </span>
            </div>

            {/* Item 7 */}
            <div className="flex flex-row items-center gap-1.5 w-full h-7">
              <div className="w-6 h-6 relative">
                <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 border-[1.5px] border-[#E6D8D6]"></div>
              </div>
              <span className="w-full h-7 font-['Fira_Sans'] font-normal text-[17px] leading-7 text-[#E6D8D6]">
                1/4 tsp salt
              </span>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="flex flex-col justify-center items-center py-6 gap-2 w-full max-w-[1344px] h-[404px]">
          {/* Instructions Title */}
          <h2 className="w-full h-8 font-['Hepta_Slab'] font-medium text-[28px] leading-8 tracking-[-0.01em] text-[#E6D8D6]">
            Instructions
          </h2>

          {/* Instructions List */}
          <div className="flex flex-col gap-2 w-full">
            {/* Step 1 */}
            <div className="flex flex-row items-baseline gap-1.5 w-full h-7">
              <span className="w-8 h-6 font-['Fira_Sans'] font-semibold text-[17px] leading-6 text-right text-[#E6D8D6] flex-none">
                1.
              </span>
              <span className="w-[1306px] h-7 font-['Fira_Sans'] font-normal text-[17px] leading-7 text-[#E6D8D6] grow">
                Preheat your oven to 350°F (175°C).
              </span>
            </div>

            {/* Step 2 */}
            <div className="flex flex-row items-baseline gap-1.5 w-full h-7">
              <span className="w-8 h-6 font-['Fira_Sans'] font-semibold text-[17px] leading-6 text-right text-[#E6D8D6] flex-none">
                2.
              </span>
              <span className="w-[1306px] h-7 font-['Fira_Sans'] font-normal text-[17px] leading-7 text-[#E6D8D6] grow">
                In a bowl, mix flour, baking powder, and salt.
              </span>
            </div>

            {/* Step 3 */}
            <div className="flex flex-row items-baseline gap-1.5 w-full h-7">
              <span className="w-8 h-6 font-['Fira_Sans'] font-semibold text-[17px] leading-6 text-right text-[#E6D8D6] flex-none">
                3.
              </span>
              <span className="w-[1306px] h-7 font-['Fira_Sans'] font-normal text-[17px] leading-7 text-[#E6D8D6] grow">
                In another bowl, cream butter and sugar until light and fluffy.
              </span>
            </div>

            {/* Step 4 */}
            <div className="flex flex-row items-baseline gap-1.5 w-full h-7">
              <span className="w-8 h-6 font-['Fira_Sans'] font-semibold text-[17px] leading-6 text-right text-[#E6D8D6] flex-none">
                4.
              </span>
              <span className="w-[1306px] h-7 font-['Fira_Sans'] font-normal text-[17px] leading-7 text-[#E6D8D6] grow">
                Add eggs one at a time, beating well after each addition.
              </span>
            </div>

            {/* Step 5 */}
            <div className="flex flex-row items-baseline gap-1.5 w-full h-7">
              <span className="w-8 h-6 font-['Fira_Sans'] font-semibold text-[17px] leading-6 text-right text-[#E6D8D6] flex-none">
                5.
              </span>
              <span className="w-[1306px] h-7 font-['Fira_Sans'] font-normal text-[17px] leading-7 text-[#E6D8D6] grow">
                Stir in lemon zest and juice.
              </span>
            </div>

            {/* Step 6 */}
            <div className="flex flex-row items-baseline gap-1.5 w-full h-7">
              <span className="w-8 h-6 font-['Fira_Sans'] font-semibold text-[17px] leading-6 text-right text-[#E6D8D6] flex-none">
                6.
              </span>
              <span className="w-[1306px] h-7 font-['Fira_Sans'] font-normal text-[17px] leading-7 text-[#E6D8D6] grow">
                Gradually add dry ingredients to wet ingredients, mixing until just combined.
              </span>
            </div>

            {/* Step 7 */}
            <div className="flex flex-row items-baseline gap-1.5 w-full h-7">
              <span className="w-8 h-6 font-['Fira_Sans'] font-semibold text-[17px] leading-6 text-right text-[#E6D8D6] flex-none">
                7.
              </span>
              <span className="w-[1306px] h-7 font-['Fira_Sans'] font-normal text-[17px] leading-7 text-[#E6D8D6] grow">
                Pour batter into a greased and floured loaf pan.
              </span>
            </div>

            {/* Step 8 */}
            <div className="flex flex-row items-baseline gap-1.5 w-full h-7">
              <span className="w-8 h-6 font-['Fira_Sans'] font-semibold text-[17px] leading-6 text-right text-[#E6D8D6] flex-none">
                8.
              </span>
              <span className="w-[1306px] h-7 font-['Fira_Sans'] font-normal text-[17px] leading-7 text-[#E6D8D6] grow">
                Bake for 45-50 minutes or until a toothpick inserted into the center comes out clean.
              </span>
            </div>

            {/* Step 9 */}
            <div className="flex flex-row items-baseline gap-1.5 w-full h-7">
              <span className="w-8 h-6 font-['Fira_Sans'] font-semibold text-[17px] leading-6 text-right text-[#E6D8D6] flex-none">
                9.
              </span>
              <span className="w-[1306px] h-7 font-['Fira_Sans'] font-normal text-[17px] leading-7 text-[#E6D8D6] grow">
                Let the cake cool before drizzling with a lemon glaze.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}