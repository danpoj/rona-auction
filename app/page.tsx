import { fetchTransactions } from '@/actions/transactions';
import { SearchBar } from '@/components/search-bar';
import { TypewriterEffectSmooth } from '@/components/typewriter-effect';
import { HomeLists } from './home-lists';
import { words } from '@/constants';

export default function Page() {
  return (
    <div className='max-w-[52rem] mx-auto pb-40'>
      <div className='p-4 pb-0'>
        <TypewriterEffectSmooth words={words} />
      </div>

      <SearchBar />

      <HomeListsWrapper />
    </div>
  );
}

const HomeListsWrapper = async () => {
  const initialLists = await fetchTransactions({ pageParam: 0 });

  return <HomeLists initialLists={initialLists} />;
};
