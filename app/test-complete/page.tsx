'use client';

import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';

export default function TestCompletePage() {
  const { user } = useAuth();

  const testSteps = [
    {
      title: '1. Authentication',
      description: 'Test user registration and login',
      links: [
        {
          href: '/auth/signup',
          text: 'Sign Up',
          color: 'bg-green-600 hover:bg-green-700',
        },
        {
          href: '/auth/signin',
          text: 'Sign In',
          color: 'bg-blue-600 hover:bg-blue-700',
        },
        {
          href: '/test-auth',
          text: 'Test Auth',
          color: 'bg-purple-600 hover:bg-purple-700',
        },
      ],
    },
    {
      title: '2. Recipe Management',
      description: 'Test creating, viewing, and managing recipes',
      links: [
        {
          href: '/recipes',
          text: 'Browse Recipes',
          color: 'bg-indigo-600 hover:bg-indigo-700',
        },
        {
          href: '/recipes/new',
          text: 'Create Recipe',
          color: 'bg-green-600 hover:bg-green-700',
        },
        {
          href: '/test-data',
          text: 'Create Sample Data',
          color: 'bg-yellow-600 hover:bg-yellow-700',
        },
      ],
    },
    {
      title: '3. Advanced Features',
      description: 'Test search, filters, and favorites',
      links: [
        {
          href: '/favorites',
          text: 'My Favorites',
          color: 'bg-red-600 hover:bg-red-700',
        },
        {
          href: '/recipes',
          text: 'Search & Filter',
          color: 'bg-purple-600 hover:bg-purple-700',
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🎉 Recipe App - Complete!
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Your full-stack recipe application is ready for testing
          </p>

          {user ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
              <h2 className="text-lg font-semibold text-green-800 mb-2">
                ✅ You're logged in!
              </h2>
              <p className="text-green-700">
                Welcome, {user.displayName || user.email}
              </p>
            </div>
          ) : (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
              <h2 className="text-lg font-semibold text-yellow-800 mb-2">
                ⚠️ Please sign in first
              </h2>
              <p className="text-yellow-700">
                You need to be logged in to test all features
              </p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testSteps.map((step, index) => (
            <div key={index} className="bg-white rounded-lg shadow p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                {step.title}
              </h3>
              <p className="text-gray-600 mb-6">{step.description}</p>

              <div className="space-y-3">
                {step.links.map((link, linkIndex) => (
                  <Link
                    key={linkIndex}
                    href={link.href}
                    className={`block w-full text-center text-white px-4 py-2 rounded-md ${link.color} transition-colors`}
                  >
                    {link.text}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-white rounded-lg shadow p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            🚀 Features Implemented
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Authentication
              </h3>
              <ul className="space-y-2 text-gray-600">
                <li>✅ Email/Password sign up & sign in</li>
                <li>✅ Google OAuth authentication</li>
                <li>✅ Protected routes with middleware</li>
                <li>✅ User profile management</li>
                <li>✅ Automatic redirects</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Recipe Management
              </h3>
              <ul className="space-y-2 text-gray-600">
                <li>✅ Create, read, update, delete recipes</li>
                <li>✅ Image upload with drag & drop</li>
                <li>✅ Search and filter recipes</li>
                <li>✅ Pagination with load more</li>
                <li>✅ Recipe categories and cuisine</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                User Experience
              </h3>
              <ul className="space-y-2 text-gray-600">
                <li>✅ Favorites system</li>
                <li>✅ Loading skeletons</li>
                <li>✅ Toast notifications</li>
                <li>✅ Responsive design</li>
                <li>✅ Error handling</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Technical
              </h3>
              <ul className="space-y-2 text-gray-600">
                <li>✅ Next.js 15 with App Router</li>
                <li>✅ Firebase Authentication</li>
                <li>✅ Firestore Database</li>
                <li>✅ Firebase Storage</li>
                <li>✅ TypeScript</li>
                <li>✅ Tailwind CSS</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/recipes"
            className="inline-block bg-indigo-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-indigo-700 transition-colors"
          >
            Start Using the App →
          </Link>
        </div>
      </div>
    </div>
  );
}
