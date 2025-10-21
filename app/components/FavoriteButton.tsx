'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import toast from 'react-hot-toast';

interface FavoriteButtonProps {
  recipeId: string;
  className?: string;
}

export default function FavoriteButton({
  recipeId,
  className = '',
}: FavoriteButtonProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      checkFavoriteStatus();
    }
  }, [user, recipeId]);

  const checkFavoriteStatus = async () => {
    if (!user) return;

    try {
      const favoriteRef = doc(db, 'favorites', `${user.uid}_${recipeId}`);
      const favoriteSnap = await getDoc(favoriteRef);
      setIsFavorite(favoriteSnap.exists());
    } catch (error) {
      console.error('Error checking favorite status:', error);
    }
  };

  const toggleFavorite = async () => {
    if (!user) {
      toast.error('You must be logged in to add favorites');
      return;
    }

    setLoading(true);
    try {
      const favoriteRef = doc(db, 'favorites', `${user.uid}_${recipeId}`);

      if (isFavorite) {
        await deleteDoc(favoriteRef);
        setIsFavorite(false);
        toast.success('Removed from favorites');
      } else {
        await setDoc(favoriteRef, {
          userId: user.uid,
          recipeId: recipeId,
          createdAt: new Date(),
        });
        setIsFavorite(true);
        toast.success('Added to favorites');
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast.error('Failed to update favorites');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <button
      onClick={toggleFavorite}
      disabled={loading}
      className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
        isFavorite
          ? 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100'
          : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100'
      } disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      <span className="text-lg">{isFavorite ? '❤️' : '🤍'}</span>
      <span className="text-sm font-medium">
        {isFavorite ? 'Favorited' : 'Add to Favorites'}
      </span>
    </button>
  );
}
