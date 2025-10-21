'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';
import { recipeService } from '../lib/firebase-utils';
import {
  Recipe,
  RecipeFilters,
  RecipeCategory,
  PrepTimeFilter,
} from '../types';
import RecipeCardSkeleton from '../components/RecipeCardSkeleton';
import toast from 'react-hot-toast';

export default function RecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<RecipeFilters>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const { appUser } = useAuth();

  // Завантаження рецептів
  const loadRecipes = async (reset = false) => {
    try {
      setLoading(true);
      const result = await recipeService.getRecipes(filters);

      if (reset) {
        setRecipes(result.recipes);
        setCurrentPage(1);
      } else {
        setRecipes(prev => [...prev, ...result.recipes]);
      }

      setHasMore(result.recipes.length === 12);
    } catch (error) {
      console.error('Error loading recipes:', error);
      toast.error('Failed to load recipes');
    } finally {
      setLoading(false);
    }
  };

  // Пошук рецептів
  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      loadRecipes(true);
      return;
    }

    try {
      setLoading(true);
      const searchResults = await recipeService.searchRecipes(searchTerm);
      setRecipes(searchResults);
      setCurrentPage(1);
    } catch (error) {
      console.error('Error searching recipes:', error);
      toast.error('Failed to search recipes');
    } finally {
      setLoading(false);
    }
  };

  // Застосування фільтрів
  const applyFilters = (newFilters: Partial<RecipeFilters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    loadRecipes(true);
  };

  // Завантаження більше рецептів
  const loadMore = () => {
    if (!loading && hasMore) {
      setCurrentPage(prev => prev + 1);
      loadRecipes(false);
    }
  };

  useEffect(() => {
    loadRecipes(true);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">
                Recipe Finder
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/recipes/new"
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
              >
                + New Recipe
              </Link>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-700">
                  Welcome, {appUser?.firstName || 'User'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar - Filters */}
          <div className="w-full lg:w-64 bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Filters</h3>

            {/* Search */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Recipes
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  onKeyPress={e => e.key === 'Enter' && handleSearch()}
                  placeholder="Search by name..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  onClick={handleSearch}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  Search
                </button>
              </div>
            </div>

            {/* Category Filter */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <div className="space-y-2">
                {[
                  { value: 'dessert', label: 'Dessert' },
                  { value: 'main', label: 'Main Course' },
                  { value: 'snack', label: 'Snack' },
                  { value: 'breakfast', label: 'Breakfast' },
                  { value: 'vegan', label: 'Vegan' },
                ].map(category => (
                  <label key={category.value} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.category === category.value}
                      onChange={e => {
                        if (e.target.checked) {
                          applyFilters({
                            category: category.value as RecipeCategory,
                          });
                        } else {
                          applyFilters({ category: undefined });
                        }
                      }}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      {category.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Prep Time Filter */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prep Time
              </label>
              <div className="space-y-2">
                {[
                  { value: '<15', label: '< 15 min' },
                  { value: '<30', label: '< 30 min' },
                  { value: '<60', label: '< 1 hour' },
                  { value: '>60', label: '> 1 hour' },
                ].map(time => (
                  <label key={time.value} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.prepTime === time.value}
                      onChange={e => {
                        if (e.target.checked) {
                          applyFilters({
                            prepTime: time.value as PrepTimeFilter,
                          });
                        } else {
                          applyFilters({ prepTime: undefined });
                        }
                      }}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      {time.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Clear Filters */}
            <button
              onClick={() => {
                setFilters({});
                setSearchTerm('');
                loadRecipes(true);
              }}
              className="w-full px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Clear All Filters
            </button>
          </div>

          {/* Main Content - Recipe Grid */}
          <div className="flex-1">
            {loading && recipes.length === 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <RecipeCardSkeleton key={i} />
                ))}
              </div>
            ) : recipes.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-500 text-lg mb-4">
                  No recipes found
                </div>
                <Link
                  href="/recipes/new"
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                >
                  Create your first recipe
                </Link>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {recipes.map(recipe => (
                    <Link
                      key={recipe.id}
                      href={`/recipes/${recipe.id}`}
                      className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow"
                    >
                      <div className="h-48 bg-gray-200 flex items-center justify-center">
                        {recipe.image ? (
                          <img
                            src={recipe.image}
                            alt={recipe.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-gray-500">No Image</span>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                          {recipe.title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">
                          {recipe.cuisine}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <span className="text-yellow-400">
                              {'★'.repeat(Math.floor(recipe.rating))}
                              {'☆'.repeat(5 - Math.floor(recipe.rating))}
                            </span>
                            <span className="ml-1 text-sm text-gray-600">
                              {recipe.rating}
                            </span>
                          </div>
                          <span className="text-sm text-gray-500">
                            {recipe.prepTime} min
                          </span>
                        </div>
                        <div className="mt-2">
                          <span className="inline-block bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full">
                            {recipe.category}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Load More Button */}
                {hasMore && (
                  <div className="mt-8 flex justify-center">
                    <button
                      onClick={loadMore}
                      disabled={loading}
                      className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Loading...' : 'Load More'}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
