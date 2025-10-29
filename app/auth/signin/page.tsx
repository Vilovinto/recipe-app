'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';
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
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-10">
          <div className="w-full">
            <Image
              src="https://firebasestorage.googleapis.com/v0/b/recipe-app-caa91.firebasestorage.app/o/recipe-images%2FjfU84aSjTTX2qZlIyJpYyCM753K2%2FFrame.png?alt=media&token=75972c34-1be9-45c2-926a-abfa9b087f6f"
              alt="RecipeFinder"
              width={220}
              height={60}
              priority
              className="w-[220px] h-auto"
            />
          </div>

          <div className="space-y-8">
            <WelcomeSection />
            <LoginForm onSubmit={handleLogin} loading={loading} />
            <Divider />
            <GoogleSignInButton
              onClick={handleGoogleSignIn}
              loading={loading}
            />
            <SignUpLink />
          </div>
        </div>
      </div>

      <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-center p-8">
        <div className="w-full max-w-[675px] h-[900px]">
          <RecipeImage
            src="https://firebasestorage.googleapis.com/v0/b/recipe-app-caa91.firebasestorage.app/o/recipe-images%2FjfU84aSjTTX2qZlIyJpYyCM753K2%2F93972fa1807371d859c8ff53772a54afa46a9168.png?alt=media&token=33a2ef37-1786-4336-95de-1939a7f4c4b4"
            alt="Recipe collage"
          />
        </div>
      </div>
    </div>
  );
}
