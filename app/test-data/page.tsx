'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { recipeService } from '../lib/firebase-utils';
import toast from 'react-hot-toast';

export default function TestDataPage() {
  const [loading, setLoading] = useState(false);
  const { user, appUser } = useAuth();

  const createSampleRecipes = async () => {
    if (!user || !appUser) {
      toast.error('You must be logged in to create sample data');
      return;
    }

    setLoading(true);
    try {
      const sampleRecipes = [
        {
          title: 'Lemon Drizzle Cake',
          description:
            'A classic lemon cake with a tangy drizzle. Perfect for afternoon tea or as a dessert.',
          category: 'dessert' as const,
          cuisine: 'British',
          prepTime: 60,
          rating: 4.9,
          ingredients: [
            '1 cup all-purpose flour',
            '2 large eggs',
            '1 lemon (zest and juice)',
            '1/2 cup butter, softened',
            '3/4 cup granulated sugar',
            '1 tsp vanilla extract',
            '1/2 tsp baking powder',
            '1/4 tsp salt',
          ],
          instructions: [
            'Preheat oven to 350°F (175°C). Grease and flour a 9-inch round cake pan.',
            'In a large bowl, cream together butter and sugar until light and fluffy.',
            'Beat in eggs one at a time, then stir in vanilla, lemon zest, and lemon juice.',
            'Combine flour, baking powder, and salt; gradually blend into the creamed mixture.',
            'Pour batter into prepared pan and bake for 45-50 minutes, or until a toothpick inserted into the center comes out clean.',
            'Allow cake to cool in pan for 10 minutes, then turn out onto a wire rack to cool completely.',
            'For the drizzle: Mix lemon juice with powdered sugar until smooth. Drizzle over cooled cake.',
          ],
          image: '',
          author: `${appUser.firstName} ${appUser.lastName}`,
          userId: user.uid,
        },
        {
          title: 'Spaghetti Carbonara',
          description:
            'Classic Italian pasta dish with eggs, cheese, and pancetta.',
          category: 'main' as const,
          cuisine: 'Italian',
          prepTime: 25,
          rating: 4.7,
          ingredients: [
            '400g spaghetti',
            '200g pancetta or guanciale',
            '4 large eggs',
            '100g Pecorino Romano cheese',
            '2 cloves garlic',
            'Black pepper',
            'Salt',
          ],
          instructions: [
            'Bring a large pot of salted water to boil and cook spaghetti according to package directions.',
            'Cut pancetta into small cubes and cook in a large skillet until crispy.',
            'In a bowl, whisk together eggs, grated cheese, and black pepper.',
            'Drain pasta, reserving 1 cup of pasta water.',
            'Add hot pasta to the skillet with pancetta, remove from heat.',
            'Quickly stir in egg mixture, adding pasta water as needed to create a creamy sauce.',
            'Serve immediately with extra cheese and black pepper.',
          ],
          image: '',
          author: `${appUser.firstName} ${appUser.lastName}`,
          userId: user.uid,
        },
        {
          title: 'Avocado Toast',
          description:
            'Simple and healthy breakfast option with mashed avocado on toast.',
          category: 'breakfast' as const,
          cuisine: 'International',
          prepTime: 10,
          rating: 4.5,
          ingredients: [
            '2 slices whole grain bread',
            '1 ripe avocado',
            '1 lemon',
            'Salt and pepper',
            'Red pepper flakes (optional)',
            'Cherry tomatoes (optional)',
          ],
          instructions: [
            'Toast the bread slices until golden brown.',
            'Cut the avocado in half, remove the pit, and scoop the flesh into a bowl.',
            'Mash the avocado with a fork, add lemon juice, salt, and pepper to taste.',
            'Spread the mashed avocado evenly on the toast.',
            'Top with red pepper flakes and cherry tomatoes if desired.',
            'Serve immediately.',
          ],
          image: '',
          author: `${appUser.firstName} ${appUser.lastName}`,
          userId: user.uid,
        },
      ];

      for (const recipe of sampleRecipes) {
        await recipeService.createRecipe(recipe);
      }

      toast.success('Sample recipes created successfully!');
    } catch (error) {
      console.error('Error creating sample recipes:', error);
      toast.error('Failed to create sample recipes');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Please sign in first
          </h1>
          <a
            href="/auth/signin"
            className="text-indigo-600 hover:text-indigo-700"
          >
            Go to Sign In
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Test Data Generator
          </h1>

          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
              <h2 className="text-lg font-semibold text-blue-800 mb-2">
                📋 Sample Recipes
              </h2>
              <p className="text-sm text-blue-700 mb-4">
                Create sample recipes to test the application functionality.
              </p>
              <button
                onClick={createSampleRecipes}
                disabled={loading}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating...' : 'Create Sample Recipes'}
              </button>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-md p-4">
              <h2 className="text-lg font-semibold text-green-800 mb-2">
                ✅ What will be created:
              </h2>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• Lemon Drizzle Cake (Dessert)</li>
                <li>• Spaghetti Carbonara (Main Course)</li>
                <li>• Avocado Toast (Breakfast)</li>
              </ul>
            </div>

            <div className="flex space-x-4">
              <Link
                href="/recipes"
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
              >
                View Recipes
              </Link>
              <Link
                href="/recipes/new"
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
              >
                Create New Recipe
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
