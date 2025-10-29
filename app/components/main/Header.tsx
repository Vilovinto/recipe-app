'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import SearchBar from './SearchBar';
import UserProfile from './UserProfile';
import NewRecipeModal from './NewRecipeModal';
import { Recipe } from '../../types';

interface HeaderProps {
  onSearch: (query: string) => void;
  onRecipeCreated?: (recipe: Recipe) => void;
  searchQuery?: string;
  className?: string;
  instantSearch?: boolean;
}

export default function Header({
  onSearch,
  onRecipeCreated,
  searchQuery = '',
  className = '',
  instantSearch = true,
}: HeaderProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  const handleNewPostClick = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleRecipeCreated = (recipe: Recipe) => {
    if (onRecipeCreated) {
      onRecipeCreated(recipe);
    }
  };

  return (
    <>
      <header
        className={`py-6 border-b border-[rgba(230,221,214,0.2)] ${className}`}
      >
        <div className="flex items-center justify-between gap-12">
          <div className="flex items-center gap-6 flex-1">
            <button
              onClick={() => router.push('/recipes')}
              className="w-[180px] h-auto shrink-0 hover:opacity-90 transition-opacity"
              aria-label="Go to recipes"
            >
              <Image
                src="https://firebasestorage.googleapis.com/v0/b/recipe-app-caa91.firebasestorage.app/o/recipe-images%2FjfU84aSjTTX2qZlIyJpYyCM753K2%2FFrame.png?alt=media&token=75972c34-1be9-45c2-926a-abfa9b087f6f"
                alt="RecipeFinder"
                width={180}
                height={60}
                priority
                className="w-[180px] h-auto"
              />
            </button>
            <SearchBar
              onSearch={onSearch}
              initialValue={searchQuery}
              instant={instantSearch}
            />
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={() => router.push('/favorites')}
              className="w-6 h-6 hover:opacity-80 transition-opacity flex items-center justify-center"
              aria-label="Favorites"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-[#E5DDD7]"
              >
                <path
                  d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <UserProfile />
            <button
              onClick={handleNewPostClick}
              className="flex items-center gap-1.5 px-4 py-3 bg-[#FFE478] text-[#0D0702] rounded-xl font-semibold text-base font-['Fira_Sans'] hover:bg-[#FFE478]/90 transition-colors"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-[#0D0702]"
              >
                <path
                  d="M12 5V19M5 12H19"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              New post
            </button>
          </div>
        </div>
      </header>

      <NewRecipeModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onRecipeCreated={handleRecipeCreated}
      />
    </>
  );
}
