import { fetchTransactions } from '@/actions/transactions';
import { SearchBarLoading } from '@/components/search-bar-loading';
import { SearchBarWrapper } from '@/components/search-bar-wrapper';
import { ThemeButton } from '@/components/theme-button';
import { TypewriterEffectSmooth } from '@/components/typewriter-effect';
import { words } from '@/constants';
import { Suspense } from 'react';
import { HomeLists } from './home-lists';
import { db } from '@/db/drizzle';
import { transactionTable } from '@/db/schema';
import { sql } from 'drizzle-orm';

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
  const [initialLists, transactionsCountPerDay] = await Promise.all([
    fetchTransactions({ pageParam: 0 }),

    db
      .select({
        date: sql<string>`DATE(${transactionTable.date} AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Seoul')`.as(
          'date'
        ),
        count: sql<number>`count(*)`.mapWith(Number),
      })
      .from(transactionTable)
      .groupBy(
        sql`DATE(${transactionTable.date} AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Seoul')`
      )
      .orderBy(
        sql`DATE(${transactionTable.date} AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Seoul')`
      ),
  ]);

  return (
    <HomeLists
      initialLists={initialLists}
      transactionsCountPerDay={transactionsCountPerDay}
    />
  );
};
