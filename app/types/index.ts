export interface User {
  uid: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: Date;
}

export interface Recipe {
  id: string;
  title: string;
  description: string;
  introduction?: string;
  category: RecipeCategory;
  cuisine: string;
  difficulty?: string;
  prepTime: number;
  rating: number;
  ingredients: string[];
  instructions: string[];
  image: string;
  author: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export type RecipeCategory =
  | 'dessert'
  | 'main'
  | 'snack'
  | 'breakfast'
  | 'vegan';

export interface RecipeFilters {
  search?: string;
  category?: RecipeCategory;
  prepTime?: PrepTimeFilter;
  cuisine?: string;
  difficulty?: string;
  customPrepTime?: { min?: number; max?: number };
}

export type PrepTimeFilter = '<15' | '<30' | '<60' | '>60';

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
}

export interface SignInForm {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface SignUpForm {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface RecipeForm {
  title: string;
  description: string;
  introduction?: string;
  category: RecipeCategory;
  cuisine: string;
  prepTime: number;
  rating: number;
  ingredients: string[];
  instructions: string[];
  image?: File;
}
