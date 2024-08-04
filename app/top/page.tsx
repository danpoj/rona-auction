import { GoToHome } from '@/components/go-to-home';
import { SearchBarLoading } from '@/components/search-bar-loading';
import { SearchBarWrapper } from '@/components/search-bar-wrapper';
import { db } from '@/db/drizzle';
import { itemTable, transactionTable } from '@/db/schema';
import { and, eq, gte, sql } from 'drizzle-orm';
import { Metadata } from 'next';
import { Suspense } from 'react';
import { Lists } from './lists';

export const metadata: Metadata = {
  title: '인기매물',
};

export default async function Page() {
  const result = await db
    .select({
      date: sql<string>`DATE(${transactionTable.date} AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Seoul')`.as(
        'date'
      ),
      id: itemTable.id,
      name: itemTable.name,
      transactionCount: sql<number>`cast(count(${transactionTable.id}) as int)`,
    })
    .from(itemTable)
    .leftJoin(transactionTable, eq(itemTable.id, transactionTable.itemId))
    .where(
      and(
        gte(
          sql`${transactionTable.date} AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Seoul'`,
          sql`DATE(NOW() AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Seoul' - INTERVAL '60 days')`
        )
      )
    )
    .groupBy(
      sql`DATE(${transactionTable.date} AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Seoul')`,
      itemTable.id,
      itemTable.name
    );

  const itemsOBJ: Record<
    string,
    { id: number; name: string; value: number }[]
  > = {};

  for (const item of result) {
    if (itemsOBJ[item.date]) {
      itemsOBJ[item.date].push({
        name: item.name,
        value: item.transactionCount,
        id: item.id,
      });
    } else {
      itemsOBJ[item.date] = [
        {
          name: item.name,
          value: item.transactionCount,
          id: item.id,
        },
      ];
    }
  }

  for (const items of Object.values(itemsOBJ)) {
    items.sort((a, b) => b.value - a.value);
  }

  return (
    <div className='max-w-[46rem] mx-auto h-full p-4'>
      <div className='flex flex-col  gap-6 pt-[5.8rem] pb-10'>
        <GoToHome />

        <Suspense fallback={<SearchBarLoading />}>
          <SearchBarWrapper />
        </Suspense>

        <p className='text-2xl font-semibold flex items-center'>
          <span>인기 매물</span>
        </p>
      </div>

      <Lists itemsOBJ={itemsOBJ} />
    </div>
  );
}
