'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

// Import components
import Logo from '../../components/auth/Logo';
import WelcomeSection from '../../components/auth/WelcomeSection';
import SignUpForm from '../../components/auth/SignUpForm';
import Divider from '../../components/auth/Divider';
import GoogleSignUpButton from '../../components/auth/GoogleSignUpButton';
import SignInLink from '../../components/auth/SignInLink';
import RecipeImage from '../../components/auth/RecipeImage';

export default function SignUpPage() {
  const [loading, setLoading] = useState(false);
  const { signUp, signInWithGoogle } = useAuth();
  const router = useRouter();

  const handleSignUp = async (data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
  }) => {
    const { firstName, lastName, email, password, confirmPassword } = data;

    // Validation
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      toast.error('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      await signUp(email, password, firstName, lastName);
      toast.success('Account created successfully!');
      router.push('/recipes');
    } catch (error: any) {
      toast.error(error.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setLoading(true);
    try {
      await signInWithGoogle();
      toast.success('Account created successfully!');
      router.push('/recipes');
    } catch (error: any) {
      toast.error(error.message || 'Failed to sign up with Google');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#2D2726] flex">
      {/* Left Side - Sign Up Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          {/* Logo */}
          <Logo />

          {/* Welcome Section */}
          <div className="space-y-6">
            <WelcomeSection
              title="Get Started"
              subtitle="Welcome! We're thrilled to have you."
            />

            {/* Sign Up Form */}
            <SignUpForm onSubmit={handleSignUp} loading={loading} />

            {/* Divider */}
            <Divider />

            {/* Google Sign Up Button */}
            <GoogleSignUpButton
              onClick={handleGoogleSignUp}
              loading={loading}
            />

            {/* Sign In Link */}
            <SignInLink />
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
