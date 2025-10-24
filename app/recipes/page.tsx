'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useSearchParams } from 'next/navigation';
import { recipeService } from '../lib/firebase-utils';
import { Recipe, RecipeCategory, PrepTimeFilter } from '../types';
import Sidebar from '../components/main/Sidebar';
import RecipeGrid from '../components/main/RecipeGrid';
import RecipeCard from '../components/main/RecipeCard';
import Pagination from '../components/main/Pagination';
import RecipeCardSkeleton from '../components/RecipeCardSkeleton';
import EditRecipeModal from '../components/main/EditRecipeModal';
import toast from 'react-hot-toast';

export default function RecipesPage() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const [allRecipes, setAllRecipes] = useState<Recipe[]>([]); // Всі рецепти
  const [recipes, setRecipes] = useState<Recipe[]>([]); // Відфільтровані рецепти
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [prepTimeFilter, setPrepTimeFilter] = useState('');
  const [customMinTime, setCustomMinTime] = useState('');
  const [customMaxTime, setCustomMaxTime] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  // Додаткові фільтри
  const [cuisineFilter, setCuisineFilter] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('');
  const [topPrepTimeFilter, setTopPrepTimeFilter] = useState('');

  const categories = [
    'Vegan',
    'Dessert',
    'Italian',
    'Breakfast',
    'Mexican',
    'Asian',
  ];

  // Отримуємо унікальні кухні з рецептів
  const availableCuisines = Array.from(
    new Set(
      allRecipes
        .map(recipe => recipe.cuisine)
        .filter(cuisine => cuisine && cuisine.trim())
    )
  ).sort();

  // Зчитуємо параметр search з URL
  useEffect(() => {
    const searchParam = searchParams.get('search');
    if (searchParam) {
      setSearchQuery(searchParam);
    }
  }, [searchParams]);

  // Слухаємо подію створення рецепту від HeaderWrapper
  useEffect(() => {
    const handleRecipeCreatedEvent = (event: CustomEvent) => {
      const recipe = event.detail as Recipe;
      handleRecipeCreated(recipe);
    };

    window.addEventListener('recipeCreated', handleRecipeCreatedEvent as EventListener);

    return () => {
      window.removeEventListener('recipeCreated', handleRecipeCreatedEvent as EventListener);
    };
  }, [allRecipes]);

  // Завантаження рецептів при монтуванні компонента
  useEffect(() => {
    // Завантажуємо збережені рецепти з localStorage
    const savedRecipes = JSON.parse(localStorage.getItem('userRecipes') || '[]');
    if (savedRecipes.length > 0) {
      setAllRecipes(savedRecipes);
      setRecipes(savedRecipes);
      setLoading(false);
      return;
    }

    // Додаємо приклади рецептів з різними кухнями
    const exampleRecipes: Recipe[] = [
      {
        id: 'example-1',
        title: 'Exquisite Lemon Drizzle Cake',
        description:
          'Discover the secrets to making the perfect lemon drizzle cake with this easy-to-follow recipe.',
        category: 'dessert',
        cuisine: 'British',
        prepTime: 60,
        rating: 4.8,
        ingredients: [
          '1 cup all-purpose flour',
          '1/2 cup sugar',
          '1/4 cup unsalted butter',
          '2 eggs',
          '1 lemon, zested and juiced',
          '1 tsp baking powder',
          '1/4 tsp salt',
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
          'Let the cake cool before drizzling with a lemon glaze.',
        ],
        image:
          'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&h=600&fit=crop',
        author: user?.displayName || user?.email || 'Anonymous User',
        userId: user?.uid || 'example-user',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'example-2',
        title: 'Classic Italian Pasta Carbonara',
        description:
          'Authentic Italian pasta carbonara with creamy sauce, crispy pancetta, and parmesan cheese.',
        category: 'main',
        cuisine: 'Italian',
        prepTime: 25,
        rating: 4.9,
        ingredients: [
          '400g spaghetti',
          '200g pancetta',
          '4 egg yolks',
          '100g parmesan cheese',
          'Black pepper',
          'Salt',
        ],
        instructions: [
          'Cook spaghetti according to package instructions.',
          'Fry pancetta until crispy.',
          'Mix egg yolks with grated parmesan.',
          'Combine hot pasta with pancetta.',
          'Remove from heat and quickly mix in egg mixture.',
          'Season with black pepper and serve immediately.',
        ],
        image:
          'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=800&h=600&fit=crop',
        author: user?.displayName || user?.email || 'Anonymous User',
        userId: user?.uid || 'example-user',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'example-3',
        title: 'Spicy Mexican Tacos',
        description:
          'Delicious homemade tacos with seasoned beef, fresh salsa, and all your favorite toppings.',
        category: 'main',
        cuisine: 'Mexican',
        prepTime: 10,
        rating: 4.7,
        ingredients: [
          '500g ground beef',
          'Taco shells',
          'Lettuce',
          'Tomatoes',
          'Cheddar cheese',
          'Sour cream',
          'Taco seasoning',
        ],
        instructions: [
          'Brown ground beef in a pan.',
          'Add taco seasoning and water, simmer.',
          'Warm taco shells in oven.',
          'Chop lettuce and tomatoes.',
          'Assemble tacos with beef and toppings.',
          'Serve with sour cream and salsa.',
        ],
        image:
          'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=800&h=600&fit=crop',
        author: user?.displayName || user?.email || 'Anonymous User',
        userId: user?.uid || 'example-user',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    // Додаємо приклади рецептів тільки якщо список порожній
    if (allRecipes.length === 0) {
      setAllRecipes(exampleRecipes);
      setRecipes(exampleRecipes);
    }
    setLoading(false);
  }, [user, allRecipes.length]);

  // Фільтрація рецептів при зміні фільтрів
  useEffect(() => {
    let filtered = [...allRecipes];

    // Фільтр за категоріями
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(recipe =>
        selectedCategories.some(
          cat => cat.toLowerCase() === recipe.category.toLowerCase()
        )
      );
    }

    // Фільтр за часом приготування (з sidebar)
    if (prepTimeFilter) {
      switch (prepTimeFilter) {
        case 'Under 15 mins':
          filtered = filtered.filter(recipe => recipe.prepTime < 15);
          break;
        case '15-30 mins':
          filtered = filtered.filter(
            recipe => recipe.prepTime >= 15 && recipe.prepTime <= 30
          );
          break;
        case '30-60 mins':
          filtered = filtered.filter(
            recipe => recipe.prepTime > 30 && recipe.prepTime <= 60
          );
          break;
        case 'Over 1 hr':
          filtered = filtered.filter(recipe => recipe.prepTime > 60);
          break;
        case 'Custom':
          const minTime = parseInt(customMinTime) || 0;
          const maxTime = parseInt(customMaxTime) || Infinity;
          filtered = filtered.filter(
            recipe => recipe.prepTime >= minTime && recipe.prepTime <= maxTime
          );
          break;
      }
    }

    // Фільтр за кухнею (з верхнього dropdown)
    if (cuisineFilter) {
      filtered = filtered.filter(recipe =>
        recipe.cuisine?.toLowerCase().includes(cuisineFilter.toLowerCase())
      );
    }

    // Фільтр за складністю (поки що не реалізований в типі Recipe)
    // Можна додати пізніше, коли додамо поле difficulty
    
    // Фільтр за часом приготування (з верхнього dropdown)
    if (topPrepTimeFilter) {
      switch (topPrepTimeFilter) {
        case 'Under 15 mins':
          filtered = filtered.filter(recipe => recipe.prepTime < 15);
          break;
        case '15-30 mins':
          filtered = filtered.filter(
            recipe => recipe.prepTime >= 15 && recipe.prepTime <= 30
          );
          break;
        case '30-60 mins':
          filtered = filtered.filter(
            recipe => recipe.prepTime > 30 && recipe.prepTime <= 60
          );
          break;
        case 'Over 1 hour':
          filtered = filtered.filter(recipe => recipe.prepTime > 60);
          break;
      }
    }

    // Фільтр за пошуковим запитом
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        recipe =>
          recipe.title.toLowerCase().includes(query) ||
          recipe.description.toLowerCase().includes(query) ||
          recipe.ingredients.some(ing => ing.toLowerCase().includes(query)) ||
          recipe.cuisine?.toLowerCase().includes(query)
      );
    }

    setRecipes(filtered);
    setTotalPages(Math.ceil(filtered.length / 12));
  }, [
    allRecipes,
    selectedCategories,
    prepTimeFilter,
    customMinTime,
    customMaxTime,
    searchQuery,
    cuisineFilter,
    difficultyFilter,
    topPrepTimeFilter,
  ]);

  const loadRecipes = async () => {
    setLoading(true);
    try {
      const filters = {
        category:
          selectedCategories.length > 0
            ? (selectedCategories[0] as RecipeCategory)
            : undefined,
        prepTime:
          prepTimeFilter === 'Custom'
            ? undefined
            : (prepTimeFilter as PrepTimeFilter),
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

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleRecipeCreated = (newRecipe: Recipe) => {
    // Add the new recipe to the beginning of the list
    setAllRecipes(prevRecipes => [newRecipe, ...prevRecipes]);
    
    // Save to localStorage to persist across page reloads
    const savedRecipes = JSON.parse(localStorage.getItem('userRecipes') || '[]');
    savedRecipes.unshift(newRecipe);
    localStorage.setItem('userRecipes', JSON.stringify(savedRecipes));
    
    toast.success('New recipe added to your collection!');
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
    // Очищаємо верхній фільтр якщо вибираємо sidebar фільтр
    if (time) {
      setTopPrepTimeFilter('');
    }
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleEdit = (recipe: Recipe) => {
    // Перевірка, чи користувач є власником рецепту
    if (recipe.userId !== user?.uid) {
      toast.error('You can only edit your own recipes');
      return;
    }
    setSelectedRecipe(recipe);
    setIsEditModalOpen(true);
  };

  const handleRecipeUpdated = (updatedRecipe: Recipe) => {
    // Оновлюємо рецепт у списку всіх рецептів
    setAllRecipes(prevRecipes =>
      prevRecipes.map(r => (r.id === updatedRecipe.id ? updatedRecipe : r))
    );

    // Оновлюємо в localStorage
    const savedRecipes = JSON.parse(localStorage.getItem('userRecipes') || '[]');
    const updatedSavedRecipes = savedRecipes.map((r: Recipe) =>
      r.id === updatedRecipe.id ? updatedRecipe : r
    );
    localStorage.setItem('userRecipes', JSON.stringify(updatedSavedRecipes));

    toast.success('Recipe updated successfully!');
  };

  const handleDelete = async (recipe: Recipe) => {
    // Перевірка, чи користувач є власником рецепту
    if (recipe.userId !== user?.uid) {
      toast.error('You can only delete your own recipes');
      return;
    }

    try {
      // Видаляємо з локального стану
      setAllRecipes(prevRecipes => prevRecipes.filter(r => r.id !== recipe.id));

      // Видаляємо з localStorage
      const savedRecipes = JSON.parse(
        localStorage.getItem('userRecipes') || '[]'
      );
      const updatedSavedRecipes = savedRecipes.filter(
        (r: Recipe) => r.id !== recipe.id
      );
      localStorage.setItem('userRecipes', JSON.stringify(updatedSavedRecipes));

      // Спробуємо видалити з Firebase (якщо рецепт там є)
      try {
        await recipeService.deleteRecipe(recipe.id);
      } catch (firebaseError) {
        // Ігноруємо помилки Firebase, оскільки рецепт може бути тільки локальним
        console.log('Recipe was only stored locally');
      }

      toast.success('Recipe deleted successfully');
    } catch (error) {
      console.error('Error deleting recipe:', error);
      toast.error('Failed to delete recipe');
    }
  };

  return (
    <div className="min-h-screen bg-[#2D2726] px-12">
      {/* Edit Recipe Modal */}
      <EditRecipeModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedRecipe(null);
        }}
        recipe={selectedRecipe}
        onRecipeUpdated={handleRecipeUpdated}
      />

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
          topPrepTimeFilter={topPrepTimeFilter}
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
              <select
                value={cuisineFilter}
                onChange={e => setCuisineFilter(e.target.value)}
                className="px-4 py-2 bg-[#2D2726] border border-[rgba(182,160,145,0.2)] rounded-lg text-[#E6D8D6] font-semibold text-[15px] leading-5 font-['Fira_Sans'] focus:outline-none focus:border-[#FFE478]"
              >
                <option value="">Cuisine</option>
                {availableCuisines.map(cuisine => (
                  <option key={cuisine} value={cuisine}>
                    {cuisine}
                  </option>
                ))}
              </select>
              <select
                value={difficultyFilter}
                onChange={e => setDifficultyFilter(e.target.value)}
                className="px-4 py-2 bg-[#2D2726] border border-[rgba(182,160,145,0.2)] rounded-lg text-[#E6D8D6] font-semibold text-[15px] leading-5 font-['Fira_Sans'] focus:outline-none focus:border-[#FFE478]"
              >
                <option value="">Difficulty</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
              <select
                value={topPrepTimeFilter}
                onChange={e => {
                  setTopPrepTimeFilter(e.target.value);
                  // Очищаємо sidebar фільтр якщо вибираємо верхній фільтр
                  if (e.target.value) {
                    setPrepTimeFilter('');
                  }
                }}
                className="px-4 py-2 bg-[#2D2726] border border-[rgba(182,160,145,0.2)] rounded-lg text-[#E6D8D6] font-semibold text-[15px] leading-5 font-['Fira_Sans'] focus:outline-none focus:border-[#FFE478]"
              >
                <option value="">Prep Time</option>
                <option value="Under 15 mins">Under 15 mins</option>
                <option value="15-30 mins">15-30 mins</option>
                <option value="30-60 mins">30-60 mins</option>
                <option value="Over 1 hour">Over 1 hour</option>
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
