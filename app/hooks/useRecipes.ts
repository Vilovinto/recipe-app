import { useState, useCallback, useEffect } from 'react';
import { recipeService } from '../lib/firebase-utils';
import { Recipe, RecipeFilters } from '../types';
import { QueryDocumentSnapshot, DocumentData } from 'firebase/firestore';

interface UseRecipesResult {
  recipes: Recipe[];
  loading: boolean;
  lastDoc: QueryDocumentSnapshot<DocumentData> | undefined;
  allCuisines: string[];
  loadRecipes: (reset: boolean, page: number, searchQuery: string, filters: RecipeFilters, cursors: Array<QueryDocumentSnapshot<DocumentData> | undefined>) => Promise<{
    recipes: Recipe[];
    lastDoc: QueryDocumentSnapshot<DocumentData> | undefined;
  }>;
  setRecipes: React.Dispatch<React.SetStateAction<Recipe[]>>;
  setAllCuisines: React.Dispatch<React.SetStateAction<string[]>>;
}

export function useRecipes(): UseRecipesResult {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot<DocumentData> | undefined>();
  const [allCuisines, setAllCuisines] = useState<string[]>([]);

  const loadRecipes = useCallback(async (
    reset: boolean,
    page: number,
    searchQuery: string,
    filters: RecipeFilters,
    cursors: Array<QueryDocumentSnapshot<DocumentData> | undefined>
  ) => {
    if (reset) {
      setRecipes([]);
      setLastDoc(undefined);
    }

    setLoading(true);
    try {
      let targetCursor: QueryDocumentSnapshot<DocumentData> | undefined = cursors[page - 1];
      let localCursors = [...cursors];
      
      while (localCursors.length < page) {
        const prevCursor = localCursors[localCursors.length - 1];
        const res = searchQuery.trim()
          ? await recipeService.searchRecipes(searchQuery.trim(), filters, prevCursor)
          : await recipeService.getRecipes(filters, prevCursor);
        localCursors.push(res.lastDoc);
        const cuisines = Array.from(new Set(res.recipes.map(r => r.cuisine).filter(Boolean) as string[])) as string[];
        setAllCuisines(prev => Array.from(new Set([...(prev || []), ...cuisines])).sort());
        if ((res.recipes?.length || 0) < 12) {
          break;
        }
      }

      targetCursor = localCursors[page - 1];

      const result = searchQuery.trim()
        ? await recipeService.searchRecipes(searchQuery.trim(), filters, targetCursor)
        : await recipeService.getRecipes(filters, targetCursor);

      setRecipes(result.recipes);
      setLastDoc(result.lastDoc);

      return {
        recipes: result.recipes,
        lastDoc: result.lastDoc,
      };
    } catch (error) {
      console.error('Error loading recipes:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    recipes,
    loading,
    lastDoc,
    allCuisines,
    loadRecipes,
    setRecipes,
    setAllCuisines,
  };
}

