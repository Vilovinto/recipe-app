// User types
export interface User {
  uid: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: Date;
}

// Recipe types
export interface Recipe {
  id: string;
  title: string;
  description: string;
  category: RecipeCategory;
  cuisine: string;
  prepTime: number; // in minutes
  rating: number;
  ingredients: string[];
  instructions: string[];
  image: string; // Firebase Storage URL
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

// Filter types
export interface RecipeFilters {
  search?: string;
  category?: RecipeCategory;
  prepTime?: PrepTimeFilter;
}

export type PrepTimeFilter = '<15' | '<30' | '<60' | '>60';

// Auth types
export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
}

// Form types
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
  category: RecipeCategory;
  cuisine: string;
  prepTime: number;
  rating: number;
  ingredients: string[];
  instructions: string[];
  image?: File;
}
