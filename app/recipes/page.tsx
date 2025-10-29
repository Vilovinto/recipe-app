'use client';

import { useState, useEffect, Suspense, useCallback, useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useSearchParams } from 'next/navigation';
import { recipeService, fileService } from '../lib/firebase-utils';
import { Recipe } from '../types';
import { isRecipeOwner, extractImagePathFromUrl } from '../lib/recipe-utils';
import { useFilters } from '../hooks/useFilters';
import { usePagination } from '../hooks/usePagination';
import Sidebar from '../components/main/Sidebar';
import RecipeGrid from '../components/main/RecipeGrid';
import Pagination from '../components/main/Pagination';
import RecipeCardSkeleton from '../components/RecipeCardSkeleton';
import EditRecipeModal from '../components/main/EditRecipeModal';
import RecipeFiltersBar from '../components/main/RecipeFiltersBar';
import toast from 'react-hot-toast';
import { QueryDocumentSnapshot, DocumentData } from 'firebase/firestore';

function RecipesPageContent() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [lastDoc, setLastDoc] = useState<
    QueryDocumentSnapshot<DocumentData> | undefined
  >();
  const [allCuisines, setAllCuisines] = useState<string[]>([]);
  const [totalRecipesCount, setTotalRecipesCount] = useState<number>(0);

  const filters = useFilters();
  const pagination = usePagination();

  const categories = [
    'Vegan',
    'Dessert',
    'Italian',
    'Breakfast',
    'Mexican',
    'Asian',
  ];

  useEffect(() => {
    const searchParam = searchParams.get('search');
    setSearchQuery(searchParam || '');
  }, [searchParams]);

  const filtersKey = useMemo(() => {
    return JSON.stringify({
      categories: [...filters.selectedCategories].sort(),
      prepTime: filters.prepTimeFilter,
      topPrepTime: filters.topPrepTimeFilter,
      customMin: filters.customMinTime,
      customMax: filters.customMaxTime,
      cuisine: filters.cuisineFilter,
      difficulty: filters.difficultyFilter,
    });
  }, [
    filters.selectedCategories,
    filters.prepTimeFilter,
    filters.topPrepTimeFilter,
    filters.customMinTime,
    filters.customMaxTime,
    filters.cuisineFilter,
    filters.difficultyFilter,
  ]);

  useEffect(() => {
    if (!user) return;

    const loadRecipes = async () => {
      try {
        pagination.resetPagination();
        setLastDoc(undefined);
        setRecipes([]);
        setLoading(true);

        const firestoreFilters = filters.getFirestoreFilters();
        const page = 1;
        let targetCursor: QueryDocumentSnapshot<DocumentData> | undefined =
          undefined;
        let localCursors: Array<
          QueryDocumentSnapshot<DocumentData> | undefined
        > = [undefined];

        const result = searchQuery.trim()
          ? await recipeService.searchRecipes(
              searchQuery.trim(),
              firestoreFilters,
              targetCursor
            )
          : await recipeService.getRecipes(firestoreFilters, targetCursor);

        localCursors.push(result.lastDoc);
        const cuisines = Array.from(
          new Set(
            result.recipes.map(r => r.cuisine).filter(Boolean) as string[]
          )
        ) as string[];
        setAllCuisines(prev =>
          Array.from(new Set([...(prev || []), ...cuisines])).sort()
        );

        setRecipes(result.recipes);
        setLastDoc(result.lastDoc);
        pagination.setCursors(localCursors);

        const count = await recipeService.getRecipesCount(
          firestoreFilters,
          searchQuery.trim() || undefined
        );
        setTotalRecipesCount(count);

        const calculatedTotalPages = Math.ceil(count / 12);
        pagination.setTotalPages(Math.max(1, calculatedTotalPages));
        pagination.setHasMore(
          result.recipes.length === 12 && count > result.recipes.length
        );
      } catch (error) {
        console.error('Error loading recipes:', error);
        toast.error('Failed to load recipes');
      } finally {
        setLoading(false);
      }
    };

    loadRecipes();
  }, [user, filtersKey, searchQuery]);

  const handlePageChange = async (page: number) => {
    if (page < 1 || page === pagination.currentPage) return;
    pagination.setCurrentPage(page);

    try {
      setLoading(true);
      const firestoreFilters = filters.getFirestoreFilters();
      let targetCursor: QueryDocumentSnapshot<DocumentData> | undefined =
        pagination.cursors[page - 1];
      let localCursors = [...pagination.cursors];

      while (localCursors.length < page) {
        const prevCursor = localCursors[localCursors.length - 1];
        const res = searchQuery.trim()
          ? await recipeService.searchRecipes(
              searchQuery.trim(),
              firestoreFilters,
              prevCursor
            )
          : await recipeService.getRecipes(firestoreFilters, prevCursor);
        localCursors.push(res.lastDoc);
        const cuisines = Array.from(
          new Set(res.recipes.map(r => r.cuisine).filter(Boolean) as string[])
        ) as string[];
        setAllCuisines(prev =>
          Array.from(new Set([...(prev || []), ...cuisines])).sort()
        );
        if ((res.recipes?.length || 0) < 12) {
          pagination.setHasMore(false);
          break;
        }
      }

      targetCursor = localCursors[page - 1];

      const result = searchQuery.trim()
        ? await recipeService.searchRecipes(
            searchQuery.trim(),
            firestoreFilters,
            targetCursor
          )
        : await recipeService.getRecipes(firestoreFilters, targetCursor);

      setRecipes(result.recipes);
      setLastDoc(result.lastDoc);
      pagination.setCursors(localCursors);

      const count = await recipeService.getRecipesCount(
        firestoreFilters,
        searchQuery.trim() || undefined
      );
      setTotalRecipesCount(count);

      const calculatedTotalPages = Math.ceil(count / 12);
      pagination.setTotalPages(Math.max(1, calculatedTotalPages));
      pagination.setHasMore(result.recipes.length === 12 && count > page * 12);
    } catch (error) {
      console.error('Error loading recipes:', error);
      toast.error('Failed to load recipes');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    pagination.setCurrentPage(1);
  };

  const handleRecipeCreated = (newRecipe: Recipe) => {
    setRecipes(prev => [newRecipe, ...prev]);
    toast.success('New recipe added to your collection!');
  };

  const handleCategoryChange = (category: string, checked: boolean) => {
    filters.handleCategoryChange(category, checked);
    pagination.setCurrentPage(1);
  };

  const handlePrepTimeChange = (time: string) => {
    filters.handlePrepTimeChange(time);
    pagination.setCurrentPage(1);
  };

  const handleEdit = (recipe: Recipe) => {
    if (!isRecipeOwner(recipe, user?.uid)) {
      toast.error('You can only edit your own recipes');
      return;
    }
    setSelectedRecipe(recipe);
    setIsEditModalOpen(true);
  };

  const handleRecipeUpdated = async (updatedRecipe: Recipe) => {
    setRecipes(prev =>
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

      setRecipes(prev => prev.filter(r => r.id !== recipe.id));
      toast.success('Recipe deleted successfully');
    } catch (error) {
      console.error('Error deleting recipe:', error);
      toast.error('Failed to delete recipe');
    }
  };

  useEffect(() => {
    const handleRecipeCreatedEvent = (event: CustomEvent) => {
      const recipe = event.detail as Recipe;
      handleRecipeCreated(recipe);
    };

    window.addEventListener(
      'recipeCreated',
      handleRecipeCreatedEvent as EventListener
    );
    return () => {
      window.removeEventListener(
        'recipeCreated',
        handleRecipeCreatedEvent as EventListener
      );
    };
  }, []);

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

      <div className="flex gap-12 py-6">
        <Sidebar
          categories={categories}
          selectedCategories={filters.selectedCategories}
          onCategoryChange={handleCategoryChange}
          prepTimeFilter={filters.prepTimeFilter}
          onPrepTimeChange={handlePrepTimeChange}
          customMinTime={filters.customMinTime}
          customMaxTime={filters.customMaxTime}
          onCustomMinTimeChange={filters.setCustomMinTime}
          onCustomMaxTimeChange={filters.setCustomMaxTime}
          topPrepTimeFilter={filters.topPrepTimeFilter}
        />

        <div className="flex-1 space-y-8">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <h1 className="text-white font-semibold text-xl leading-5 font-['Fira_Sans']">
                All Recipes
              </h1>
              <p className="text-[rgba(255,255,255,0.5)] text-sm leading-5 font-['Fira_Sans']">
                {totalRecipesCount}{' '}
                {totalRecipesCount === 1 ? 'recipe' : 'recipes'}
              </p>
            </div>

            <RecipeFiltersBar
              cuisineFilter={filters.cuisineFilter}
              difficultyFilter={filters.difficultyFilter}
              topPrepTimeFilter={filters.topPrepTimeFilter}
              allCuisines={allCuisines}
              onCuisineChange={val => {
                filters.setCuisineFilter(val);
                pagination.setCurrentPage(1);
              }}
              onDifficultyChange={val => {
                filters.setDifficultyFilter(val || '');
                pagination.setCurrentPage(1);
              }}
              onPrepTimeChange={val => {
                filters.setTopPrepTimeFilter(val || '');
                if (val) {
                  filters.setPrepTimeFilter('');
                  filters.setCustomMinTime('');
                  filters.setCustomMaxTime('');
                }
                pagination.setCurrentPage(1);
              }}
            />
          </div>

          {loading && recipes.length === 0 ? (
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
            <>
              <RecipeGrid
                recipes={recipes}
                onEdit={handleEdit}
                onDelete={handleDelete}
                currentUserId={user?.uid}
              />

              {pagination.totalPages > 1 && (
                <div className="flex justify-start">
                  <Pagination
                    currentPage={pagination.currentPage}
                    totalPages={pagination.totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function RecipesPage() {
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
      <RecipesPageContent />
    </Suspense>
  );
}
