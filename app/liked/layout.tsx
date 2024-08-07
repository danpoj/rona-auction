import { GoToHome } from '@/components/go-to-home';
import { SearchBarLoading } from '@/components/search-bar-loading';
import { SearchBarWrapper } from '@/components/search-bar-wrapper';
import { ReactNode, Suspense } from 'react';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className='p-4 pt-16'>
      <div className='mb-6'>
        <GoToHome />
      </div>
      <Suspense fallback={<SearchBarLoading />}>
        <SearchBarWrapper />
      </Suspense>

      {children}
    </div>
  );
}
