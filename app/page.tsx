import { fetchTransactions } from '@/actions/transactions';
import { SearchBarLoading } from '@/components/search-bar-loading';
import { SearchBarWrapper } from '@/components/search-bar-wrapper';
import { ThemeButton } from '@/components/theme-button';
import { TypewriterEffectSmooth } from '@/components/typewriter-effect';
import { words } from '@/constants';
import { Suspense } from 'react';
import { HomeLists } from './home-lists';

export default function Page() {
  return (
    <div className='max-w-[52rem] mx-auto pb-40'>
      <div className='p-4 pb-0 flex items-center justify-between'>
        <TypewriterEffectSmooth words={words} />
        <ThemeButton />
      </div>

      <Suspense fallback={<SearchBarLoading />}>
        <SearchBarWrapper />
      </Suspense>

      <HomeListsWrapper />
    </div>
  );
}

const HomeListsWrapper = async () => {
  const initialLists = await fetchTransactions({ pageParam: 0 });

  return <HomeLists initialLists={initialLists} />;
};
