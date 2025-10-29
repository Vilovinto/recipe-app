'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { favoritesService } from '../../lib/firebase-utils';
import toast from 'react-hot-toast';

interface FavoriteButtonProps {
  recipeId: string;
  className?: string;
}

export default function FavoriteButton({ recipeId, className = '' }: FavoriteButtonProps) {
  const { user } = useAuth();
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && recipeId) {
      favoritesService.isFavorite(user.uid, recipeId).then(setIsFavorite);
    }
  }, [user, recipeId]);

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast.error('Please sign in to add favorites');
      return;
    }

    setLoading(true);
    try {
      if (isFavorite) {
        await favoritesService.removeFavorite(user.uid, recipeId);
        setIsFavorite(false);
        toast.success('Removed from favorites');
      } else {
        await favoritesService.addFavorite(user.uid, recipeId);
        setIsFavorite(true);
        toast.success('Added to favorites');
      }
      
      window.dispatchEvent(new CustomEvent('favoriteChanged'));
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast.error('Failed to update favorite');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`transition-colors duration-200 ease-out ${className}`}
      aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill={isFavorite ? '#FFE478' : 'none'}
        stroke={isFavorite ? '#FFE478' : '#E6D8D6'}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="transition-colors duration-200 ease-out"
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    </button>
  );
}

