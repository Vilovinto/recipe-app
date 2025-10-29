'use client';

import { useState, useEffect, Suspense } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import { recipeService } from '../../lib/firebase-utils';
import { Recipe } from '../../types';
import toast from 'react-hot-toast';
import RecipeCardSkeleton from '../../components/RecipeCardSkeleton';
import RecipeHeader from '../../components/recipes/RecipeHeader';
import RecipeImageSection from '../../components/recipes/RecipeImageSection';
import RecipeAuthorInfo from '../../components/recipes/RecipeAuthorInfo';
import RecipeIngredientsList from '../../components/recipes/RecipeIngredientsList';
import RecipeInstructionsList from '../../components/recipes/RecipeInstructionsList';

function RecipeDetailContent() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      const storedRecipe = sessionStorage.getItem('currentRecipe');
      if (storedRecipe) {
        try {
          const recipeData = JSON.parse(storedRecipe);
          recipeData.createdAt = new Date(recipeData.createdAt);
          recipeData.updatedAt = new Date(recipeData.updatedAt);
          setRecipe(recipeData);
          setLoading(false);
          return;
        } catch (error) {
          console.error('Error parsing stored recipe:', error);
        }
      }

      const savedRecipes = JSON.parse(localStorage.getItem('userRecipes') || '[]');
      const foundRecipe = savedRecipes.find((r: Recipe) => r.id === params.id);
      if (foundRecipe) {
        foundRecipe.createdAt = new Date(foundRecipe.createdAt);
        foundRecipe.updatedAt = new Date(foundRecipe.updatedAt);
        setRecipe(foundRecipe);
        setLoading(false);
        return;
      }

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
    sessionStorage.removeItem('currentRecipe');
    router.push('/recipes');
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
      <RecipeHeader recipe={recipe} onBack={handleBack} />
      <RecipeImageSection recipe={recipe} />
      <RecipeAuthorInfo recipe={recipe} />

      <div className="max-w-[1344px] mx-auto py-6">
        {recipe.introduction !== undefined && recipe.introduction !== null && (
          <div className="flex flex-col items-start py-6 gap-2 w-full">
            <h2 className="w-full font-['Hepta_Slab'] font-medium text-[28px] leading-8 tracking-[-0.01em] text-[#E6D8D6]">
              Introduction
            </h2>
            {String(recipe.introduction).trim().length > 0 && (
              <p className="font-['Fira_Sans'] font-normal text-[17px] leading-7 text-[#E6D8D6] whitespace-pre-line">
                {recipe.introduction}
              </p>
            )}
          </div>
        )}

        <RecipeIngredientsList ingredients={recipe.ingredients} />
        <RecipeInstructionsList instructions={recipe.instructions} />
      </div>
    </div>
  );
}

export default function RecipeDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#2D2726] px-12 py-6">
          <div className="flex flex-col gap-8 max-w-[1344px] mx-auto">
            <div className="flex flex-row items-start gap-8">
              <RecipeCardSkeleton />
              <RecipeCardSkeleton />
              <RecipeCardSkeleton />
            </div>
          </div>
        </div>
      }
    >
      <RecipeDetailContent />
    </Suspense>
  );
}
