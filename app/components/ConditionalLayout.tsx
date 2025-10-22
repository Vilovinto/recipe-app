'use client';

import { usePathname } from 'next/navigation';
import Layout from './Layout';

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

export default function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname();
  
  // Сторінки аутентифікації, які не повинні мати Layout
  const authPages = ['/auth/signin', '/auth/signup', '/auth/forgot-password'];
  
  // Перевіряємо чи поточний шлях є сторінкою аутентифікації
  const isAuthPage = authPages.includes(pathname);
  
  // Якщо це сторінка аутентифікації - показуємо тільки children
  if (isAuthPage) {
    return <>{children}</>;
  }
  
  // Для всіх інших сторінок показуємо Layout
  return <Layout>{children}</Layout>;
}
