'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

// Import components
import Logo from '../../components/auth/Logo';
import WelcomeSection from '../../components/auth/WelcomeSection';
import LoginForm from '../../components/auth/LoginForm';
import Divider from '../../components/auth/Divider';
import GoogleSignInButton from '../../components/auth/GoogleSignInButton';
import SignUpLink from '../../components/auth/SignUpLink';
import RecipeImage from '../../components/auth/RecipeImage';

export default function SignInPage() {
  const [loading, setLoading] = useState(false);
  const { signIn, signInWithGoogle } = useAuth();
  const router = useRouter();

  const handleLogin = async (email: string, password: string) => {
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      await signIn(email, password);
      toast.success('Welcome back!');
      router.push('/recipes');
    } catch (error: any) {
      toast.error(error.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      await signInWithGoogle();
      toast.success('Welcome back!');
      router.push('/recipes');
    } catch (error: any) {
      toast.error(error.message || 'Failed to sign in with Google');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#2D2726] flex">
      {/* Left Side - Login Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-10">
          {/* Logo */}
          <Logo />

          {/* Welcome Section */}
          <div className="space-y-8">
            <WelcomeSection />

            {/* Login Form */}
            <LoginForm onSubmit={handleLogin} loading={loading} />

            {/* Divider */}
            <Divider />

            {/* Google Sign In Button */}
            <GoogleSignInButton
              onClick={handleGoogleSignIn}
              loading={loading}
            />

            {/* Sign Up Link */}
            <SignUpLink />
          </div>
        </div>
      </div>

      {/* Right Side - Image */}
      <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-center p-8">
        <div className="w-full max-w-[675px] h-[900px]">
          <RecipeImage />
        </div>
      </div>
    </div>
  );
}
