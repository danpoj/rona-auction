import { GoToHome } from '@/components/go-to-home';
import { NoImage } from '@/components/no-image';
import { SearchBarLoading } from '@/components/search-bar-loading';
import { SearchBarWrapper } from '@/components/search-bar-wrapper';
import { Badge } from '@/components/ui/badge';
import { db } from '@/db/drizzle';
import { itemTable, transactionTable } from '@/db/schema';
import { cn } from '@/lib/utils';
import { desc, sql } from 'drizzle-orm';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: '인기매물',
};

const BASE = process.env.NEXT_PUBLIC_API_BASE!;

export default async function Page() {
  const items = await db
    .select({
      id: itemTable.id,
      name: itemTable.name,
      transactionCount: sql<number>`cast(count(${transactionTable.id}) as int)`,
    })
    .from(itemTable)
    .leftJoin(
      transactionTable,
      sql`${itemTable.id} = ${transactionTable.itemId}`
    )
    .groupBy(itemTable.id, itemTable.name)
    .orderBy(desc(sql`count(${transactionTable.id})`))
    .limit(300);

  return (
    <div className='max-w-[52rem] mx-auto h-full p-4'>
      <div className='flex flex-col  gap-6 pt-[5.8rem] pb-10'>
        <GoToHome />

        <Suspense fallback={<SearchBarLoading />}>
          <SearchBarWrapper />
        </Suspense>

        <p className='text-2xl font-semibold flex items-center'>
          <span>인기 매물</span>
        </p>
      </div>

      <div className='flex flex-col pb-40'>
        {items.map((item, index) => (
          <Link
            href={`/item/${item.id}`}
            key={item.id}
            className={cn(
              'flex items-center gap-2 py-2 hover:bg-primary/5',
              index === 0 &&
                'bg-gradient-to-r from-blue-600 via-violet-600 to-violet-300 bg-clip-text text-transparent font-black',
              index === 1 &&
                'bg-gradient-to-r from-green-600 via-teal-500 to-emerald-200 bg-clip-text text-transparent font-black',
              index === 2 &&
                'bg-gradient-to-r from-red-600 via-amber-500 to-yellow-300 bg-clip-text text-transparent font-black'
            )}
          >
            <span className='font-semibold justify-center text-sm'>
              #{index + 1}
            </span>
            <Badge variant='secondary'>{item.transactionCount}건</Badge>
            {item.id >= 666666660 ? (
              <NoImage />
            ) : (
              <Image
                src={`${BASE}/item/${item.id}/icon?resize=2`}
                alt={item.name}
                width={50}
                height={50}
                className='size-10 object-contain'
              />
            )}
            <p>{item.name}</p>
          </Link>
        ))}

        <div className='pt-10'>
          <GoToHome />
        </div>
      </div>
    </div>
  );
}
