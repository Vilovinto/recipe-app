'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../contexts/AuthContext';
import { recipeService } from '../../lib/firebase-utils';
import { Recipe } from '../../types';
import FavoriteButton from '../../components/FavoriteButton';
import toast from 'react-hot-toast';

export default function RecipeDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const { user, appUser } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const loadRecipe = async () => {
      try {
        const recipeData = await recipeService.getRecipe(params.id);
        if (recipeData) {
          setRecipe(recipeData);
        } else {
          toast.error('Recipe not found');
          router.push('/recipes');
        }
      } catch (error) {
        console.error('Error loading recipe:', error);
        toast.error('Failed to load recipe');
        router.push('/recipes');
      } finally {
        setLoading(false);
      }
    };

    loadRecipe();
  }, [params.id, router]);

  const handleDelete = async () => {
    if (!recipe || !user) return;

    if (recipe.userId !== user.uid) {
      toast.error('You can only delete your own recipes');
      return;
    }

    if (confirm('Are you sure you want to delete this recipe?')) {
      try {
        await recipeService.deleteRecipe(recipe.id);
        toast.success('Recipe deleted successfully');
        router.push('/recipes');
      } catch (error) {
        console.error('Error deleting recipe:', error);
        toast.error('Failed to delete recipe');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Recipe not found
          </h1>
          <Link
            href="/recipes"
            className="text-indigo-600 hover:text-indigo-700"
          >
            ← Back to Recipes
          </Link>
        </div>
      </div>
    );
  }

  const isOwner = user && recipe.userId === user.uid;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Link
                href="/recipes"
                className="mr-4 text-gray-600 hover:text-gray-900"
              >
                ← Back
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">
                Recipe Details
              </h1>
            </div>
            {isOwner && (
              <div className="flex items-center space-x-4">
                <Link
                  href={`/recipes/${recipe.id}/edit`}
                  className="text-indigo-600 hover:text-indigo-700"
                >
                  Edit Recipe
                </Link>
                <button
                  onClick={handleDelete}
                  className="text-red-600 hover:text-red-700"
                >
                  Delete Recipe
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {/* Recipe Image */}
          <div className="h-96 bg-gray-200 flex items-center justify-center">
            {recipe.image ? (
              <img
                src={recipe.image}
                alt={recipe.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-gray-500 text-xl">No Image</span>
            )}
          </div>

          <div className="p-8">
            {/* Recipe Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {recipe.title}
              </h1>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600">
                    By {recipe.author}
                  </span>
                  <span className="text-sm text-gray-600">•</span>
                  <span className="text-sm text-gray-600">
                    Published {recipe.createdAt.toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <span className="text-yellow-400 text-lg">
                      {'★'.repeat(Math.floor(recipe.rating))}
                      {'☆'.repeat(5 - Math.floor(recipe.rating))}
                    </span>
                    <span className="ml-2 text-sm text-gray-600">
                      {recipe.rating}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500">
                    {recipe.prepTime} min
                  </span>
                </div>
              </div>
              <p className="text-gray-700 text-lg">{recipe.description}</p>
              <div className="mt-4 flex space-x-2">
                <span className="inline-block bg-indigo-100 text-indigo-800 text-sm px-3 py-1 rounded-full">
                  {recipe.category}
                </span>
                <span className="inline-block bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full">
                  {recipe.cuisine}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Ingredients */}
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  Ingredients
                </h2>
                <ul className="space-y-3">
                  {recipe.ingredients.map((ingredient, index) => (
                    <li key={index} className="flex items-center">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded mr-3"
                      />
                      <span className="text-gray-700">{ingredient}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Instructions */}
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  Instructions
                </h2>
                <ol className="space-y-4">
                  {recipe.instructions.map((instruction, index) => (
                    <li key={index} className="flex">
                      <span className="flex-shrink-0 w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-sm font-semibold mr-3">
                        {index + 1}
                      </span>
                      <span className="text-gray-700">{instruction}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <FavoriteButton recipeId={recipe.id} />
                <div className="flex space-x-2">
                  <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200">
                    Share
                  </button>
                  <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
                    Print Recipe
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
