'use client';

import { usePathname } from 'next/navigation';
import Layout from './Layout';

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

export default function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname();
  
  // Сторінки, які не повинні мати Layout
  const noLayoutPages = ['/auth/signin', '/auth/signup', '/auth/forgot-password', '/recipes'];
  
  // Перевіряємо чи поточний шлях не повинен мати Layout
  const shouldHideLayout = noLayoutPages.includes(pathname);
  
  // Якщо це сторінка без Layout - показуємо тільки children
  if (shouldHideLayout) {
    return <>{children}</>;
  }
  
  // Для всіх інших сторінок показуємо Layout
  return <Layout>{children}</Layout>;
}
