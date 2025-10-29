'use client';

import { useState, useEffect, Suspense, useCallback, useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useSearchParams } from 'next/navigation';
import {
  favoritesService,
  fileService,
  recipeService,
} from '../lib/firebase-utils';
import { Recipe } from '../types';
import { isRecipeOwner, extractImagePathFromUrl } from '../lib/recipe-utils';
import RecipeGrid from '../components/main/RecipeGrid';
import RecipeCardSkeleton from '../components/RecipeCardSkeleton';
import EditRecipeModal from '../components/main/EditRecipeModal';
import toast from 'react-hot-toast';

function FavoritesPageContent() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const [allRecipes, setAllRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const searchParam = searchParams.get('search');
    setSearchQuery(searchParam || '');
  }, [searchParams]);

  const loadFavorites = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      const favoriteRecipes = await favoritesService.getFavoriteRecipes(
        user.uid
      );
      setAllRecipes(favoriteRecipes);
    } catch (error) {
      console.error('Error loading favorites:', error);
      toast.error('Failed to load favorites');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      loadFavorites();
    } else {
      setLoading(false);
    }

    const handleFavoriteChanged = () => {
      if (user) {
        loadFavorites();
      }
    };

    window.addEventListener('favoriteChanged', handleFavoriteChanged);
    return () => {
      window.removeEventListener('favoriteChanged', handleFavoriteChanged);
    };
  }, [user, loadFavorites]);

  const filteredRecipes = useMemo(() => {
    if (!searchQuery.trim()) {
      return allRecipes;
    }

    const searchLower = searchQuery.toLowerCase();
    return allRecipes.filter(recipe => {
      return (
        recipe.title.toLowerCase().includes(searchLower) ||
        recipe.description.toLowerCase().includes(searchLower) ||
        recipe.introduction?.toLowerCase().includes(searchLower) ||
        false ||
        recipe.cuisine?.toLowerCase().includes(searchLower) ||
        recipe.ingredients.some(ing => ing.toLowerCase().includes(searchLower))
      );
    });
  }, [allRecipes, searchQuery]);

  const handleEdit = (recipe: Recipe) => {
    if (!isRecipeOwner(recipe, user?.uid)) {
      toast.error('You can only edit your own recipes');
      return;
    }
    setSelectedRecipe(recipe);
    setIsEditModalOpen(true);
  };

  const handleRecipeUpdated = async (updatedRecipe: Recipe) => {
    setAllRecipes(prev =>
      prev.map(r => (r.id === updatedRecipe.id ? updatedRecipe : r))
    );
    toast.success('Recipe updated successfully!');
  };

  const handleDelete = async (recipe: Recipe) => {
    if (!isRecipeOwner(recipe, user?.uid)) {
      toast.error('You can only delete your own recipes');
      return;
    }

    try {
      if (!recipe.id.startsWith('local-')) {
        try {
          await recipeService.deleteRecipe(recipe.id);
        } catch (firebaseError: any) {
          if (firebaseError?.code !== 'not-found') {
            console.error('Error deleting from Firebase:', firebaseError);
          }
        }
      }

      if (recipe.image) {
        const imagePath = extractImagePathFromUrl(recipe.image);
        if (imagePath) {
          try {
            await fileService.deleteImage(imagePath);
          } catch (storageError) {
            console.error('Error deleting image from Storage:', storageError);
          }
        }
      }

      await favoritesService.removeFavorite(user!.uid, recipe.id);
      setAllRecipes(prev => prev.filter(r => r.id !== recipe.id));
      toast.success('Recipe deleted successfully');
    } catch (error) {
      console.error('Error deleting recipe:', error);
      toast.error('Failed to delete recipe');
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#2D2726] px-12 py-6 flex items-center justify-center">
        <div className="text-[#E6D8D6] text-xl font-['Fira_Sans']">
          Please sign in to view your favorites
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#2D2726] px-12">
      <EditRecipeModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedRecipe(null);
        }}
        recipe={selectedRecipe}
        onRecipeUpdated={handleRecipeUpdated}
      />

      <div className="py-6">
        <div className="space-y-8">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <h1 className="text-white font-semibold text-xl leading-5 font-['Fira_Sans']">
                Favorite Recipes
              </h1>
              <p className="text-[rgba(255,255,255,0.5)] text-sm leading-5 font-['Fira_Sans']">
                {filteredRecipes.length}{' '}
                {filteredRecipes.length === 1 ? 'recipe' : 'recipes'}
              </p>
            </div>
          </div>

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
          ) : filteredRecipes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <svg
                width="64"
                height="64"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-[rgba(230,216,214,0.5)] mb-4"
              >
                <path
                  d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <p className="text-[rgba(230,216,214,0.7)] text-lg font-['Fira_Sans']">
                {searchQuery.trim()
                  ? 'No recipes found'
                  : 'No favorite recipes yet'}
              </p>
              <p className="text-[rgba(230,216,214,0.5)] text-sm font-['Fira_Sans'] mt-2">
                {searchQuery.trim()
                  ? 'Try adjusting your search'
                  : 'Start adding recipes to your favorites!'}
              </p>
            </div>
          ) : (
            <RecipeGrid
              recipes={filteredRecipes}
              onEdit={handleEdit}
              onDelete={handleDelete}
              currentUserId={user?.uid}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default function FavoritesPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#2D2726] px-12 py-6">
          <div className="flex flex-col gap-8">
            {Array.from({ length: 2 }).map((_, rowIndex) => (
              <div key={rowIndex} className="flex flex-row items-start gap-8">
                {Array.from({ length: 3 }).map((_, colIndex) => (
                  <RecipeCardSkeleton key={`${rowIndex}-${colIndex}`} />
                ))}
              </div>
            ))}
          </div>
        </div>
      }
    >
      <FavoritesPageContent />
    </Suspense>
  );
}
