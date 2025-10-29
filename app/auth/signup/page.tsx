'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';
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
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="w-full">
            <img
              src="https://firebasestorage.googleapis.com/v0/b/recipe-app-caa91.firebasestorage.app/o/recipe-images%2FjfU84aSjTTX2qZlIyJpYyCM753K2%2FFrame.png?alt=media&token=75972c34-1be9-45c2-926a-abfa9b087f6f"
              alt="RecipeFinder"
              className="w-[220px] h-auto"
            />
          </div>

          <div className="space-y-6">
            <WelcomeSection
              title="Get Started"
              subtitle="Welcome! We're thrilled to have you."
            />
            <SignUpForm onSubmit={handleSignUp} loading={loading} />
            <Divider />
            <GoogleSignUpButton
              onClick={handleGoogleSignUp}
              loading={loading}
            />
            <SignInLink />
          </div>
        </div>
      </div>

      <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-center p-8">
        <div className="w-full max-w-[675px] h-[900px]">
          <RecipeImage src="https://firebasestorage.googleapis.com/v0/b/recipe-app-caa91.firebasestorage.app/o/recipe-images%2FjfU84aSjTTX2qZlIyJpYyCM753K2%2F93972fa1807371d859c8ff53772a54afa46a9168.png?alt=media&token=33a2ef37-1786-4336-95de-1939a7f4c4b4" alt="Recipe collage" />
        </div>
      </div>
    </div>
  );
}
