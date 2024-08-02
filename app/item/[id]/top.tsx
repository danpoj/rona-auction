import { GoToHome } from '@/components/go-to-home';
import { NoImage } from '@/components/no-image';
import { SearchBarLoading } from '@/components/search-bar-loading';
import { SearchBarWrapper } from '@/components/search-bar-wrapper';
import { Button } from '@/components/ui/button';
import { db } from '@/db/drizzle';
import { itemTable, transactionTable } from '@/db/schema';
import { InferSelectModel, and, eq, gte, sql } from 'drizzle-orm';
import { ArrowUpRight } from 'lucide-react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import { Suspense } from 'react';
import { LineCharts } from './line-charts';
import { TopLists } from './top-lists';

const Heart = dynamic(() => import('@/components/heart'), { ssr: false });

export const Top = async ({
  id,
  item,
}: {
  id: number;
  item: InferSelectModel<typeof itemTable>;
}) => {
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  const datas = await db
    .select({
      date: sql<string>`DATE(${transactionTable.date} AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Seoul')`.as(
        'date'
      ),
      averagePrice: sql<number>`
      ROUND(
      SUM(CAST(${transactionTable.price} AS DECIMAL(16,2))) / 
      NULLIF(SUM(${transactionTable.count}), 0),
    2
  )
    `.as('average_price'),
      totalCount:
        sql<number>`CAST(SUM(${transactionTable.count}) AS INTEGER)`.as(
          'total_count'
        ),
    })
    .from(transactionTable)
    .where(
      and(
        eq(transactionTable.itemId, id),
        gte(
          sql`${transactionTable.date} AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Seoul'`,
          sql`DATE(NOW() AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Seoul' - INTERVAL '60 days')`
        )
      )
    )
    .groupBy(
      sql`DATE(${transactionTable.date} AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Seoul')`
    )
    .orderBy(
      sql`DATE(${transactionTable.date} AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Seoul')` as any
    );

  return (
    <header className='px-4 py-10 space-y-6'>
      <GoToHome />

      <Suspense fallback={<SearchBarLoading />}>
        <SearchBarWrapper />
      </Suspense>

      <div className='flex flex-col gap-4'>
        <h1 className='text-2xl sm:text-3xl font-black'>{item.name}</h1>

        <div className='flex gap-4'>
          <div className='flex flex-col items-center gap-4 shrink-0'>
            {item.id && item.id >= 666666660 ? (
              <NoImage className='size-[76px] sm:size-[140px]' />
            ) : (
              <>
                <Image
                  src={`${process.env.NEXT_PUBLIC_API_BASE}/item/${item.id}/icon?resize=3`}
                  alt={`${item.name} - ${item.desc}`}
                  width={140}
                  height={140}
                  className='size-[76px] sm:size-[140px] object-contain'
                />

                <Button variant='linkHover2' asChild>
                  <Link
                    href={`https://maple.inven.co.kr/dataninfo/item/detail.php?code=${item.id}`}
                    target='_blank'
                    rel='noreferrer noopener'
                  >
                    인벤 <ArrowUpRight className='size-4' />
                  </Link>
                </Button>
              </>
            )}

            <Heart
              item={{
                id: item.id,
                name: item.name,
              }}
            />
          </div>

          <TopLists datas={datas} />
        </div>
      </div>

      <LineCharts datas={datas.reverse()} />

      <h2
        className='text-muted-foreground'
        dangerouslySetInnerHTML={{
          __html: item.desc.replace(/\\r\\n|\\n|\\r/gm, '<br/>'),
        }}
      />
    </header>
  );
};
