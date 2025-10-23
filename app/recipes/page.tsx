'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { recipeService } from '../lib/firebase-utils';
import { Recipe } from '../types';
import Header from '../components/main/Header';
import Sidebar from '../components/main/Sidebar';
import RecipeGrid from '../components/main/RecipeGrid';
import RecipeCard from '../components/main/RecipeCard';
import Pagination from '../components/main/Pagination';
import RecipeCardSkeleton from '../components/RecipeCardSkeleton';
import toast from 'react-hot-toast';

export default function RecipesPage() {
  const { user } = useAuth();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [prepTimeFilter, setPrepTimeFilter] = useState('');
  const [customMinTime, setCustomMinTime] = useState('');
  const [customMaxTime, setCustomMaxTime] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const categories = [
    'Vegan',
    'Dessert',
    'Italian',
    'Breakfast',
    'Mexican',
    'Asian'
  ];

  useEffect(() => {
    // Додаємо приклад рецепту з даними поточного користувача
    const exampleRecipe: Recipe = {
      id: 'example-1',
      title: 'Exquisite Lemon Drizzle Cake',
      description: 'Discover the secrets to making the perfect lemon drizzle cake with this easy-to-follow recipe.',
      category: 'dessert',
      cuisine: 'Baking, Lemon',
      prepTime: 60,
      rating: 4.8,
      ingredients: [
        '1 cup all-purpose flour',
        '1/2 cup sugar',
        '1/4 cup unsalted butter',
        '2 eggs',
        '1 lemon, zested and juiced',
        '1 tsp baking powder',
        '1/4 tsp salt'
      ],
      instructions: [
        'Preheat your oven to 350° F (175°C).',
        'In a bowl, mix flour, baking powder, and salt.',
        'In another bowl, cream butter and sugar until light and fluffy.',
        'Add eggs one at a time, beating well after each addition.',
        'Stir in lemon zest and juice.',
        'Gradually add dry ingredients to wet ingredients, mixing until just combined.',
        'Pour batter into a greased and floured loaf pan.',
        'Bake for 45-50 minutes or until a toothpick inserted into the center comes out clean.',
        'Let the cake cool before drizzling with a lemon glaze.'
      ],
      image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&h=600&fit=crop',
      author: user?.displayName || user?.email || 'Anonymous User',
      userId: user?.uid || 'example-user',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    setRecipes([exampleRecipe]);
    setLoading(false);
  }, [user]);

  const loadRecipes = async () => {
    setLoading(true);
    try {
      const filters = {
        category: selectedCategories.length > 0 ? selectedCategories[0] : undefined,
        prepTime: prepTimeFilter === 'Custom' ? undefined : prepTimeFilter
      };

      const result = await recipeService.getRecipes(filters);
      setRecipes(result.recipes);
      setTotalPages(Math.ceil(result.recipes.length / 12));
    } catch (error) {
      console.error('Error loading recipes:', error);
      toast.error('Failed to load recipes');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      setLoading(true);
      try {
        const searchResults = await recipeService.searchRecipes(query);
        setRecipes(searchResults);
        setTotalPages(1);
      } catch (error) {
        console.error('Error searching recipes:', error);
        toast.error('Failed to search recipes');
      } finally {
        setLoading(false);
      }
    } else {
      loadRecipes();
    }
  };

  const handleCategoryChange = (category: string, checked: boolean) => {
    if (checked) {
      setSelectedCategories([...selectedCategories, category]);
    } else {
      setSelectedCategories(selectedCategories.filter(c => c !== category));
    }
    setCurrentPage(1);
  };

  const handlePrepTimeChange = (time: string) => {
    setPrepTimeFilter(time);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleEdit = (recipe: Recipe) => {
    // TODO: Implement edit functionality
    toast.success('Edit functionality coming soon!');
  };

  const handleDelete = async (recipe: Recipe) => {
    if (window.confirm('Are you sure you want to delete this recipe?')) {
      try {
        await recipeService.deleteRecipe(recipe.id);
        setRecipes(recipes.filter(r => r.id !== recipe.id));
        toast.success('Recipe deleted successfully');
      } catch (error) {
        console.error('Error deleting recipe:', error);
        toast.error('Failed to delete recipe');
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#2D2726] px-12">
      {/* Header */}
      <Header onSearch={handleSearch} />

      {/* Main Content */}
      <div className="flex gap-12 py-6">
        {/* Sidebar */}
        <Sidebar
          categories={categories}
          selectedCategories={selectedCategories}
          onCategoryChange={handleCategoryChange}
          prepTimeFilter={prepTimeFilter}
          onPrepTimeChange={handlePrepTimeChange}
          customMinTime={customMinTime}
          customMaxTime={customMaxTime}
          onCustomMinTimeChange={setCustomMinTime}
          onCustomMaxTimeChange={setCustomMaxTime}
        />

        {/* Main Content Area */}
        <div className="flex-1 space-y-8">
          {/* Results Header */}
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <h1 className="text-white font-semibold text-xl leading-5 font-['Fira_Sans']">
                All Recipes
              </h1>
              <p className="text-[rgba(255,255,255,0.5)] text-sm leading-5 font-['Fira_Sans']">
                {recipes.length} recipes found
              </p>
            </div>

            {/* Filter Dropdowns */}
            <div className="flex items-center gap-2">
              <select className="px-4 py-2 bg-[#2D2726] border border-[rgba(182,160,145,0.2)] rounded-lg text-[#E6D8D6] font-semibold text-[15px] leading-5 font-['Fira_Sans'] focus:outline-none focus:border-[#FFE478]">
                <option>Cuisine</option>
              </select>
              <select className="px-4 py-2 bg-[#2D2726] border border-[rgba(182,160,145,0.2)] rounded-lg text-[#E6D8D6] font-semibold text-[15px] leading-5 font-['Fira_Sans'] focus:outline-none focus:border-[#FFE478]">
                <option>Difficulty</option>
              </select>
              <select className="px-4 py-2 bg-[#2D2726] border border-[rgba(182,160,145,0.2)] rounded-lg text-[#E6D8D6] font-semibold text-[15px] leading-5 font-['Fira_Sans'] focus:outline-none focus:border-[#FFE478]">
                <option>Prep Time</option>
              </select>
            </div>
          </div>

          {/* Recipe Grid */}
          {loading ? (
            <div className="flex flex-col gap-8">
              {Array.from({ length: 2 }).map((_, rowIndex) => (
                <div key={rowIndex} className="flex flex-row items-start gap-8">
                  {Array.from({ length: 3 }).map((_, colIndex) => (
                    <RecipeCardSkeleton key={`${rowIndex}-${colIndex}`} />
                  ))}
                </div>
              ))}
            </div>
          ) : (
            <RecipeGrid
              recipes={recipes}
              onEdit={handleEdit}
              onDelete={handleDelete}
              currentUserId={user?.uid}
            />
          )}

          {/* Pagination */}
          {!loading && recipes.length > 0 && (
            <div className="flex justify-start">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}