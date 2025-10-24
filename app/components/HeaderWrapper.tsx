'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import Header from './main/Header';
import { Recipe } from '../types';

export default function HeaderWrapper() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Сторінки, які не повинні мати Header (тільки auth)
  const noHeaderPages = [
    '/auth/signin',
    '/auth/signup',
    '/auth/forgot-password',
  ];

  // Перевіряємо чи поточний шлях не повинен мати Header
  const shouldHideHeader = noHeaderPages.includes(pathname);

  // Якщо це сторінка без Header - не показуємо нічого
  if (shouldHideHeader) {
    return null;
  }

  // Отримуємо пошуковий запит з URL
  const searchQuery = searchParams.get('search') || '';

  // Обробник пошуку
  const handleSearch = (query: string) => {
    if (pathname === '/recipes') {
      // Якщо ми вже на головній сторінці - просто оновлюємо URL
      if (query.trim()) {
        router.push(`/recipes?search=${encodeURIComponent(query)}`);
      } else {
        router.push('/recipes');
      }
    } else {
      // Якщо на іншій сторінці - перенаправляємо на головну з пошуком
      if (query.trim()) {
        router.push(`/recipes?search=${encodeURIComponent(query)}`);
      } else {
        router.push('/recipes');
      }
    }
  };

  // Обробник створення рецепту
  const handleRecipeCreated = (recipe: Recipe) => {
    // Відправляємо custom event для головної сторінки
    window.dispatchEvent(
      new CustomEvent('recipeCreated', { detail: recipe })
    );
    
    // Якщо не на головній сторінці - перенаправляємо
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
      />
    </div>
  );
}

