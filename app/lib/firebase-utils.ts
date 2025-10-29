import {
  collection,
  doc,
  addDoc,
  getDocs,
  getDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  startAt,
  endAt,
  QueryDocumentSnapshot,
  DocumentData,
  serverTimestamp,
  getCountFromServer,
} from 'firebase/firestore';
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';
import { db, storage } from './firebase';
import { Recipe, RecipeFilters } from '../types';
import {
  convertFirestoreDocToRecipe,
  applyFiltersToQuery,
  extractImagePathFromUrl,
} from './recipe-utils';

const RECIPES_COLLECTION = 'recipes';
const FAVORITES_COLLECTION = 'favorites';

export const recipeService = {
  async createRecipe(
    recipe: Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<string> {
    const docRef = await addDoc(collection(db, RECIPES_COLLECTION), {
      ...recipe,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  },

  async getRecipe(id: string): Promise<Recipe | null> {
    const docRef = doc(db, RECIPES_COLLECTION, id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return convertFirestoreDocToRecipe(docSnap);
    }
    return null;
  },

  async getRecipes(
    filters?: RecipeFilters,
    lastDoc?: QueryDocumentSnapshot<DocumentData>
  ): Promise<{
    recipes: Recipe[];
    lastDoc?: QueryDocumentSnapshot<DocumentData>;
  }> {
    const hasPrepTimeFilter = !!(filters?.prepTime || filters?.customPrepTime);
    const hasCategoryFilter = !!filters?.category;
    const filtersWithoutCategory: RecipeFilters = {
      ...filters,
      category: undefined,
    };

    let q = query(collection(db, RECIPES_COLLECTION));

    if (hasPrepTimeFilter) {
      q = applyFiltersToQuery(q, filtersWithoutCategory);
      q = query(q, orderBy('prepTime', 'asc'));
    } else {
      q = applyFiltersToQuery(q, filtersWithoutCategory);
      q = query(q, orderBy('createdAt', 'desc'));
    }

    if (lastDoc) {
      q = query(q, startAfter(lastDoc));
    }

    q = query(q, limit(12));

    const querySnapshot = await getDocs(q);
    let recipes: Recipe[] = [];
    let newLastDoc: QueryDocumentSnapshot<DocumentData> | undefined;

    querySnapshot.forEach(doc => {
      recipes.push(convertFirestoreDocToRecipe(doc));
      newLastDoc = doc;
    });

    if (hasCategoryFilter && filters?.category) {
      recipes = recipes.filter(r => r.category === filters.category);
    }

    return { recipes, lastDoc: newLastDoc };
  },

  async searchRecipes(
    searchTerm: string,
    filters?: RecipeFilters,
    lastDoc?: QueryDocumentSnapshot<DocumentData>
  ): Promise<{
    recipes: Recipe[];
    lastDoc?: QueryDocumentSnapshot<DocumentData>;
  }> {
    if (!searchTerm.trim()) {
      return this.getRecipes(filters, lastDoc);
    }

    const hasPrepTimeFilter = !!(filters?.prepTime || filters?.customPrepTime);
    const hasCategoryFilter = !!filters?.category;
    const filtersWithoutPrepTimeAndCategory: RecipeFilters = {
      ...filters,
      prepTime: undefined,
      customPrepTime: undefined,
      category: undefined,
    };

    let q = query(collection(db, RECIPES_COLLECTION));
    q = applyFiltersToQuery(q, filtersWithoutPrepTimeAndCategory);
    q = query(q, orderBy('title', 'asc'));

    const searchLower = searchTerm.toLowerCase();
    const searchEnd = searchTerm.toLowerCase() + '\uf8ff';

    if (lastDoc) {
      q = query(q, startAfter(lastDoc), endAt(searchEnd), limit(50));
    } else {
      q = query(q, startAt(searchLower), endAt(searchEnd), limit(50));
    }

    const querySnapshot = await getDocs(q);
    const recipes: Recipe[] = [];
    let newLastDoc: QueryDocumentSnapshot<DocumentData> | undefined;

    const searchLowerTerm = searchTerm.toLowerCase();
    querySnapshot.forEach(doc => {
      const recipe = convertFirestoreDocToRecipe(doc);
      if (
        recipe.title.toLowerCase().includes(searchLowerTerm) ||
        recipe.description.toLowerCase().includes(searchLowerTerm) ||
        recipe.introduction?.toLowerCase().includes(searchLowerTerm) ||
        false ||
        recipe.cuisine?.toLowerCase().includes(searchLowerTerm)
      ) {
        recipes.push(recipe);
        newLastDoc = doc;
      }
    });

    let filteredRecipes = recipes;

    if (hasCategoryFilter && filters?.category) {
      filteredRecipes = filteredRecipes.filter(
        r => r.category === filters.category
      );
    }

    if (hasPrepTimeFilter && filters) {
      if (filters.prepTime) {
        const timeFilter = filters.prepTime;
        if (timeFilter === '<15') {
          filteredRecipes = filteredRecipes.filter(r => r.prepTime < 15);
        } else if (timeFilter === '<30') {
          filteredRecipes = filteredRecipes.filter(r => r.prepTime < 30);
        } else if (timeFilter === '<60') {
          filteredRecipes = filteredRecipes.filter(r => r.prepTime < 60);
        } else if (timeFilter === '>60') {
          filteredRecipes = filteredRecipes.filter(r => r.prepTime > 60);
        }
      }

      if (filters.customPrepTime) {
        if (filters.customPrepTime.min !== undefined) {
          filteredRecipes = filteredRecipes.filter(
            r => r.prepTime >= filters.customPrepTime!.min!
          );
        }
        if (filters.customPrepTime.max !== undefined) {
          filteredRecipes = filteredRecipes.filter(
            r => r.prepTime <= filters.customPrepTime!.max!
          );
        }
      }
    }

    filteredRecipes.sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );

    return { recipes: filteredRecipes.slice(0, 50), lastDoc: newLastDoc };
  },

  async updateRecipe(id: string, updates: Partial<Recipe>): Promise<void> {
    const docRef = doc(db, RECIPES_COLLECTION, id);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
  },

  async deleteRecipe(id: string): Promise<void> {
    const docRef = doc(db, RECIPES_COLLECTION, id);
    await deleteDoc(docRef);
  },

  async getUserRecipes(userId: string): Promise<Recipe[]> {
    const q = query(
      collection(db, RECIPES_COLLECTION),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(q);
    const recipes: Recipe[] = [];

    querySnapshot.forEach(doc => {
      recipes.push(convertFirestoreDocToRecipe(doc));
    });

    return recipes;
  },

  async getRecipesCount(
    filters?: RecipeFilters,
    searchTerm?: string
  ): Promise<number> {
    if (searchTerm?.trim()) {
      let q = query(collection(db, RECIPES_COLLECTION));

      const filtersWithoutPrepTime: RecipeFilters = {
        ...filters,
        prepTime: undefined,
        customPrepTime: undefined,
      };

      q = applyFiltersToQuery(q, filtersWithoutPrepTime);
      if (filters?.category) {
        q = query(q, orderBy('category', 'asc'), orderBy('title', 'asc'));
      } else {
        q = query(q, orderBy('title', 'asc'));
      }

      const searchLower = searchTerm.toLowerCase();
      const searchEnd = searchTerm.toLowerCase() + '\uf8ff';
      q = query(q, startAt(searchLower), endAt(searchEnd), limit(1000));

      const querySnapshot = await getDocs(q);
      const searchLowerTerm = searchTerm.toLowerCase();

      const hasPrepTimeFilter = !!(
        filters?.prepTime || filters?.customPrepTime
      );
      const recipes: Recipe[] = [];

      querySnapshot.forEach(doc => {
        const recipe = convertFirestoreDocToRecipe(doc);
        if (
          recipe.title.toLowerCase().includes(searchLowerTerm) ||
          recipe.description.toLowerCase().includes(searchLowerTerm) ||
          recipe.introduction?.toLowerCase().includes(searchLowerTerm) ||
          false ||
          recipe.cuisine?.toLowerCase().includes(searchLowerTerm)
        ) {
          recipes.push(recipe);
        }
      });

      let filteredRecipes = recipes;

      if (hasPrepTimeFilter && filters) {
        if (filters.prepTime) {
          const timeFilter = filters.prepTime;
          if (timeFilter === '<15') {
            filteredRecipes = filteredRecipes.filter(r => r.prepTime < 15);
          } else if (timeFilter === '<30') {
            filteredRecipes = filteredRecipes.filter(r => r.prepTime < 30);
          } else if (timeFilter === '<60') {
            filteredRecipes = filteredRecipes.filter(r => r.prepTime < 60);
          } else if (timeFilter === '>60') {
            filteredRecipes = filteredRecipes.filter(r => r.prepTime > 60);
          }
        }

        if (filters.customPrepTime) {
          if (filters.customPrepTime.min !== undefined) {
            filteredRecipes = filteredRecipes.filter(
              r => r.prepTime >= filters.customPrepTime!.min!
            );
          }
          if (filters.customPrepTime.max !== undefined) {
            filteredRecipes = filteredRecipes.filter(
              r => r.prepTime <= filters.customPrepTime!.max!
            );
          }
        }
      }

      return filteredRecipes.length;
    }

    const hasCategoryFilter = !!filters?.category;
    const filtersWithoutCategory: RecipeFilters = {
      ...filters,
      category: undefined,
    };

    let q = query(collection(db, RECIPES_COLLECTION));
    q = applyFiltersToQuery(q, filtersWithoutCategory);

    try {
      const countSnapshot = await getCountFromServer(q);
      let count = countSnapshot.data().count;

      if (hasCategoryFilter && filters?.category) {
        const querySnapshot = await getDocs(q);
        const recipes: Recipe[] = [];
        querySnapshot.forEach(doc => {
          recipes.push(convertFirestoreDocToRecipe(doc));
        });
        count = recipes.filter(r => r.category === filters.category).length;
      }

      return count;
    } catch (error) {
      console.error('Error getting recipes count:', error);
      const querySnapshot = await getDocs(q);
      let recipes: Recipe[] = [];
      querySnapshot.forEach(doc => {
        recipes.push(convertFirestoreDocToRecipe(doc));
      });

      if (hasCategoryFilter && filters?.category) {
        recipes = recipes.filter(r => r.category === filters.category);
      }

      return recipes.length;
    }
  },
};

export const favoritesService = {
  async addFavorite(userId: string, recipeId: string): Promise<void> {
    const q = query(
      collection(db, FAVORITES_COLLECTION),
      where('userId', '==', userId),
      where('recipeId', '==', recipeId)
    );
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      await addDoc(collection(db, FAVORITES_COLLECTION), {
        userId,
        recipeId,
        createdAt: serverTimestamp(),
      });
    }
  },

  async removeFavorite(userId: string, recipeId: string): Promise<void> {
    const q = query(
      collection(db, FAVORITES_COLLECTION),
      where('userId', '==', userId),
      where('recipeId', '==', recipeId)
    );
    const snapshot = await getDocs(q);

    await Promise.all(snapshot.docs.map(docSnap => deleteDoc(docSnap.ref)));
  },

  async isFavorite(userId: string, recipeId: string): Promise<boolean> {
    if (!userId) return false;
    const q = query(
      collection(db, FAVORITES_COLLECTION),
      where('userId', '==', userId),
      where('recipeId', '==', recipeId)
    );
    const snapshot = await getDocs(q);
    return !snapshot.empty;
  },

  async getFavoriteRecipeIds(userId: string): Promise<string[]> {
    if (!userId) return [];
    const q = query(
      collection(db, FAVORITES_COLLECTION),
      where('userId', '==', userId)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data().recipeId);
  },

  async getFavoriteRecipes(userId: string): Promise<Recipe[]> {
    if (!userId) return [];
    const recipeIds = await this.getFavoriteRecipeIds(userId);
    if (recipeIds.length === 0) return [];

    const recipes: Recipe[] = [];
    for (const recipeId of recipeIds) {
      const recipe = await recipeService.getRecipe(recipeId);
      if (recipe) {
        recipes.push(recipe);
      }
    }

    return recipes.sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  },
};

export const fileService = {
  async uploadImage(file: File, path: string): Promise<string> {
    const storageRef = ref(storage, path);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  },

  async deleteImage(url: string): Promise<void> {
    const imageRef = ref(storage, url);
    await deleteObject(imageRef);
  },
};
