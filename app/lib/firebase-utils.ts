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
  QueryDocumentSnapshot,
  DocumentData,
} from 'firebase/firestore';
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';
import { db, storage } from './firebase';
import { Recipe, RecipeFilters } from '../types';

// Recipes collection
const RECIPES_COLLECTION = 'recipes';

// CRUD operations for recipes
export const recipeService = {
  // Create a new recipe
  async createRecipe(
    recipe: Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<string> {
    const docRef = await addDoc(collection(db, RECIPES_COLLECTION), {
      ...recipe,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return docRef.id;
  },

  // Get a single recipe by ID
  async getRecipe(id: string): Promise<Recipe | null> {
    const docRef = doc(db, RECIPES_COLLECTION, id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as Recipe;
    }
    return null;
  },

  // Get all recipes with optional filters
  async getRecipes(
    filters?: RecipeFilters,
    lastDoc?: QueryDocumentSnapshot<DocumentData>
  ): Promise<{
    recipes: Recipe[];
    lastDoc?: QueryDocumentSnapshot<DocumentData>;
  }> {
    let q = query(collection(db, RECIPES_COLLECTION));

    // Apply filters
    if (filters?.category) {
      q = query(q, where('category', '==', filters.category));
    }

    if (filters?.prepTime) {
      const timeFilter = filters.prepTime;
      if (timeFilter === '<15') {
        q = query(q, where('prepTime', '<', 15));
      } else if (timeFilter === '<30') {
        q = query(q, where('prepTime', '<', 30));
      } else if (timeFilter === '<60') {
        q = query(q, where('prepTime', '<', 60));
      } else if (timeFilter === '>60') {
        q = query(q, where('prepTime', '>', 60));
      }
    }

    // Order by creation date (newest first)
    q = query(q, orderBy('createdAt', 'desc'));

    // Pagination
    if (lastDoc) {
      q = query(q, startAfter(lastDoc));
    }

    // Limit results
    q = query(q, limit(12));

    const querySnapshot = await getDocs(q);
    const recipes: Recipe[] = [];
    let newLastDoc: QueryDocumentSnapshot<DocumentData> | undefined;

    querySnapshot.forEach(doc => {
      const data = doc.data();
      recipes.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as Recipe);
      newLastDoc = doc;
    });

    return { recipes, lastDoc: newLastDoc };
  },

  // Search recipes by title
  async searchRecipes(searchTerm: string): Promise<Recipe[]> {
    // Note: Firestore doesn't support full-text search natively
    // This is a simple implementation that searches for recipes containing the search term
    const q = query(
      collection(db, RECIPES_COLLECTION),
      orderBy('title'),
      limit(50)
    );

    const querySnapshot = await getDocs(q);
    const recipes: Recipe[] = [];

    querySnapshot.forEach(doc => {
      const data = doc.data();
      const recipe = {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as Recipe;

      // Simple text search
      if (
        recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        recipe.description.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        recipes.push(recipe);
      }
    });

    return recipes;
  },

  // Update a recipe
  async updateRecipe(id: string, updates: Partial<Recipe>): Promise<void> {
    const docRef = doc(db, RECIPES_COLLECTION, id);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: new Date(),
    });
  },

  // Delete a recipe
  async deleteRecipe(id: string): Promise<void> {
    const docRef = doc(db, RECIPES_COLLECTION, id);
    await deleteDoc(docRef);
  },

  // Get recipes by user ID
  async getUserRecipes(userId: string): Promise<Recipe[]> {
    const q = query(
      collection(db, RECIPES_COLLECTION),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(q);
    const recipes: Recipe[] = [];

    querySnapshot.forEach(doc => {
      const data = doc.data();
      recipes.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as Recipe);
    });

    return recipes;
  },
};

// File upload utilities
export const fileService = {
  // Upload image to Firebase Storage
  async uploadImage(file: File, path: string): Promise<string> {
    const storageRef = ref(storage, path);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  },

  // Delete image from Firebase Storage
  async deleteImage(url: string): Promise<void> {
    const imageRef = ref(storage, url);
    await deleteObject(imageRef);
  },
};
