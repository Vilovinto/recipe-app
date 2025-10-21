'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';
import { recipeService } from '../lib/firebase-utils';
import { Recipe } from '../types';
import RecipeCardSkeleton from '../components/RecipeCardSkeleton';
import toast from 'react-hot-toast';
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  deleteDoc,
} from 'firebase/firestore';
import { db } from '../lib/firebase';

export default function FavoritesPage() {
  const [favoriteRecipes, setFavoriteRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadFavoriteRecipes();
    } else {
      setLoading(false);
    }
  }, [user]);

  const loadFavoriteRecipes = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Отримуємо список улюблених рецептів
      const favoritesQuery = query(
        collection(db, 'favorites'),
        where('userId', '==', user.uid)
      );
      const favoritesSnap = await getDocs(favoritesQuery);

      const recipeIds = favoritesSnap.docs.map(doc => doc.data().recipeId);

      if (recipeIds.length === 0) {
        setFavoriteRecipes([]);
        return;
      }

      // Завантажуємо дані рецептів
      const recipes: Recipe[] = [];
      for (const recipeId of recipeIds) {
        try {
          const recipe = await recipeService.getRecipe(recipeId);
          if (recipe) {
            recipes.push(recipe);
          }
        } catch (error) {
          console.error(`Error loading recipe ${recipeId}:`, error);
        }
      }

      setFavoriteRecipes(recipes);
    } catch (error) {
      console.error('Error loading favorite recipes:', error);
      toast.error('Failed to load favorite recipes');
    } finally {
      setLoading(false);
    }
  };

  const removeFromFavorites = async (recipeId: string) => {
    if (!user) return;

    try {
      const favoriteRef = doc(db, 'favorites', `${user.uid}_${recipeId}`);
      await deleteDoc(favoriteRef);

      setFavoriteRecipes(prev => prev.filter(recipe => recipe.id !== recipeId));
      toast.success('Removed from favorites');
    } catch (error) {
      console.error('Error removing from favorites:', error);
      toast.error('Failed to remove from favorites');
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Please sign in
          </h1>
          <p className="text-gray-600 mb-4">
            You need to be logged in to view your favorites
          </p>
          <Link
            href="/auth/signin"
            className="text-indigo-600 hover:text-indigo-700"
          >
            Go to Sign In
          </Link>
        </div>
      </div>
    );
  }

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
                ← Back to Recipes
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">My Favorites</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <RecipeCardSkeleton key={i} />
            ))}
          </div>
        ) : favoriteRecipes.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg mb-4">
              No favorite recipes yet
            </div>
            <p className="text-gray-600 mb-6">
              Start adding recipes to your favorites!
            </p>
            <Link
              href="/recipes"
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
            >
              Browse Recipes
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favoriteRecipes.map(recipe => (
              <div
                key={recipe.id}
                className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow"
              >
                <Link href={`/recipes/${recipe.id}`}>
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
                </Link>
                <div className="p-4">
                  <Link href={`/recipes/${recipe.id}`}>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-indigo-600">
                      {recipe.title}
                    </h3>
                  </Link>
                  <p className="text-sm text-gray-600 mb-2">{recipe.cuisine}</p>
                  <div className="flex items-center justify-between mb-2">
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
                  <div className="flex items-center justify-between">
                    <span className="inline-block bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full">
                      {recipe.category}
                    </span>
                    <button
                      onClick={() => removeFromFavorites(recipe.id)}
                      className="text-red-600 hover:text-red-700 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
