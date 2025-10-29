import { QueryDocumentSnapshot, DocumentData } from 'firebase/firestore';
import { query, where, Query } from 'firebase/firestore';
import { Recipe, RecipeFilters } from '../types';

export function convertFirestoreDocToRecipe(
  doc: QueryDocumentSnapshot<DocumentData>
): Recipe {
  const data = doc.data();
  return {
    id: doc.id,
    ...data,
    createdAt: data.createdAt?.toDate() || new Date(),
    updatedAt: data.updatedAt?.toDate() || new Date(),
  } as Recipe;
}

export function applyFiltersToQuery(
  q: Query<DocumentData>,
  filters?: RecipeFilters
): Query<DocumentData> {
  if (filters?.category) {
    q = query(q, where('category', '==', filters.category));
  }

  if (filters?.cuisine) {
    q = query(q, where('cuisine', '==', filters.cuisine));
  }

  if (filters?.difficulty) {
    q = query(q, where('difficulty', '==', filters.difficulty));
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

  if (filters?.customPrepTime) {
    if (filters.customPrepTime.min !== undefined) {
      q = query(q, where('prepTime', '>=', filters.customPrepTime.min));
    }
    if (filters.customPrepTime.max !== undefined) {
      q = query(q, where('prepTime', '<=', filters.customPrepTime.max));
    }
  }

  return q;
}

export function formatPrepTime(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60);
  const remainingMinutes = totalMinutes % 60;

  if (remainingMinutes === 0) {
    const unit = hours === 1 ? 'hr' : 'hrs';
    return `${hours} ${unit}`;
  }

  let minutesPart = remainingMinutes.toString().padStart(2, '0');
  if (remainingMinutes % 10 === 0) {
    minutesPart = String(remainingMinutes / 10);
  }

  const unit = hours === 1 && remainingMinutes === 0 ? 'hr' : 'hrs';
  return `${hours}.${minutesPart} ${unit}`;
}

export function parseHoursToMinutes(hoursString: string): number | null {
  if (!hoursString.trim()) return null;
  
  const parsed = parseFloat(hoursString);
  if (isNaN(parsed) || parsed < 0) return null;
  
  const parts = hoursString.split('.');
  let hours = Math.floor(parsed);
  let minutes = 0;
  
  if (parts.length > 1 && parts[1]) {
    const decimalPart = parts[1];
    if (decimalPart.length === 1) {
      minutes = parseInt(decimalPart) * 10;
    } else if (decimalPart.length === 2) {
      minutes = parseInt(decimalPart.substring(0, 2));
    }
  }
  
  return hours * 60 + minutes;
}

export function formatMinutesToHours(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60);
  const remainingMinutes = totalMinutes % 60;

  if (remainingMinutes === 0) {
    return hours.toString();
  }

  let minutesPart = remainingMinutes.toString().padStart(2, '0');
  if (remainingMinutes % 10 === 0) {
    minutesPart = String(remainingMinutes / 10);
  }

  return `${hours}.${minutesPart}`;
}

export function isRecipeOwner(recipe: Recipe, userId?: string): boolean {
  return recipe.userId === userId;
}

export function extractImagePathFromUrl(url: string): string | null {
  if (!url.includes('firebasestorage.googleapis.com')) {
    return null;
  }
  
  const urlParts = url.split('/o/');
  if (urlParts.length > 1) {
    const encodedPath = urlParts[1].split('?')[0];
    return decodeURIComponent(encodedPath);
  }
  
  return null;
}

