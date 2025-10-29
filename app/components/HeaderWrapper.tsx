'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import Header from './main/Header';
import { Recipe } from '../types';

export default function HeaderWrapper() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const noHeaderPages = [
    '/auth/signin',
    '/auth/signup',
    '/auth/forgot-password',
  ];

  const shouldHideHeader = noHeaderPages.includes(pathname);

  if (shouldHideHeader) {
    return null;
  }

  const searchQuery = searchParams.get('search') || '';

  const handleSearch = (query: string) => {
    if (pathname === '/recipes' || pathname === '/favorites') {
      if (query.trim()) {
        router.push(`${pathname}?search=${encodeURIComponent(query)}`);
      } else {
        router.push(pathname);
      }
    } else {
      return;
    }
  };

  const handleRecipeCreated = (recipe: Recipe) => {
    window.dispatchEvent(new CustomEvent('recipeCreated', { detail: recipe }));

    if (pathname !== '/recipes') {
      router.push('/recipes');
    }
  };

  return (
    <div className="bg-[#2D2726] px-12">
      <Header
        onSearch={handleSearch}
        onRecipeCreated={handleRecipeCreated}
        searchQuery={searchQuery}
        instantSearch={false}
      />
    </div>
  );
}
