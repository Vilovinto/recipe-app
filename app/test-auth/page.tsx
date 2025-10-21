'use client';

import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';

export default function TestAuthPage() {
  const { user, appUser, loading, logout } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Authentication Test
          </h1>

          {user ? (
            <div className="space-y-6">
              <div className="bg-green-50 border border-green-200 rounded-md p-4">
                <h2 className="text-lg font-semibold text-green-800 mb-2">
                  ✅ User is authenticated!
                </h2>
                <div className="space-y-2 text-sm text-green-700">
                  <p>
                    <strong>UID:</strong> {user.uid}
                  </p>
                  <p>
                    <strong>Email:</strong> {user.email}
                  </p>
                  <p>
                    <strong>Display Name:</strong>{' '}
                    {user.displayName || 'Not set'}
                  </p>
                  <p>
                    <strong>Email Verified:</strong>{' '}
                    {user.emailVerified ? 'Yes' : 'No'}
                  </p>
                </div>
              </div>

              {appUser && (
                <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                  <h3 className="text-lg font-semibold text-blue-800 mb-2">
                    📋 User Profile Data
                  </h3>
                  <div className="space-y-2 text-sm text-blue-700">
                    <p>
                      <strong>First Name:</strong> {appUser.firstName}
                    </p>
                    <p>
                      <strong>Last Name:</strong> {appUser.lastName}
                    </p>
                    <p>
                      <strong>Created At:</strong>{' '}
                      {appUser.createdAt.toLocaleDateString()}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex space-x-4">
                <button
                  onClick={logout}
                  className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                >
                  Logout
                </button>
                <Link
                  href="/recipes"
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                >
                  Go to Recipes
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                <h2 className="text-lg font-semibold text-yellow-800 mb-2">
                  ⚠️ User is not authenticated
                </h2>
                <p className="text-sm text-yellow-700">
                  You need to sign in to access protected routes.
                </p>
              </div>

              <div className="flex space-x-4">
                <a
                  href="/auth/signin"
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                >
                  Sign In
                </a>
                <a
                  href="/auth/signup"
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                >
                  Sign Up
                </a>
              </div>
            </div>
          )}

          <div className="mt-8 pt-8 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              🔧 Debug Information
            </h3>
            <div className="bg-gray-50 rounded-md p-4">
              <pre className="text-sm text-gray-700 overflow-auto">
                {JSON.stringify(
                  {
                    user: user
                      ? {
                          uid: user.uid,
                          email: user.email,
                          displayName: user.displayName,
                          emailVerified: user.emailVerified,
                        }
                      : null,
                    appUser: appUser
                      ? {
                          uid: appUser.uid,
                          email: appUser.email,
                          firstName: appUser.firstName,
                          lastName: appUser.lastName,
                          createdAt: appUser.createdAt,
                        }
                      : null,
                    loading,
                  },
                  null,
                  2
                )}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
