import { fetchTransactions } from '@/actions/transactions';
import { SearchBarWrapper } from '@/components/search-bar-wrapper';
import { TypewriterEffectSmooth } from '@/components/typewriter-effect';
import { words } from '@/constants';
import { Suspense } from 'react';
import { HomeLists } from './home-lists';
import { Skeleton } from '@/components/ui/skeleton';

export default function Page() {
  return (
    <div className='max-w-[52rem] mx-auto pb-40'>
      <div className='p-4 pb-0'>
        <TypewriterEffectSmooth words={words} />
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

const SearchBarLoading = () => {
  return (
    <div className='px-4 pb-8'>
      <div className='max-w-[24rem] relative'>
        <Skeleton className='h-14 w-full rounded-full pl-11' />
      </div>
    </div>
  );
};
