import { GoToHome } from '@/components/go-to-home';
import { NoImage } from '@/components/no-image';
import { db } from '@/db/drizzle';
import { itemTable, transactionTable } from '@/db/schema';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { InferSelectModel, and, eq, gte, sql } from 'drizzle-orm';
import Image from 'next/image';
import { LineCharts } from './line-charts';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { SearchBarLoading } from '@/components/search-bar-loading';
import { SearchBarWrapper } from '@/components/search-bar-wrapper';
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
        AVG(
          CAST(${transactionTable.price} AS DECIMAL(16,2)) / 
          NULLIF(${transactionTable.count}, 0)
        ),
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
          sql`DATE(NOW() AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Seoul' - INTERVAL '10 days')`
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

      <div className='flex gap-4'>
        <div className='flex flex-col items-center gap-4'>
          {item.id && item.id >= 666666660 ? (
            <NoImage className='size-[100px] sm:size-[140px]' />
          ) : (
            <Image
              src={`${process.env.NEXT_PUBLIC_API_BASE}/item/${item.id}/icon?resize=3`}
              alt={`${item.name} - ${item.desc}`}
              width={140}
              height={140}
              className='size-[100px] sm:size-[140px] object-contain'
            />
          )}

          <Heart
            item={{
              id: item.id,
              name: item.name,
            }}
          />
        </div>
        <div className='flex flex-col justify-between gap-4'>
          <h1 className='text-2xl sm:text-3xl font-black'>{item.name}</h1>

          <div className='divide-y text-sm sm:text-base'>
            <div className='flex items-center font-semibold px-2 py-1.5'>
              <p className='text-sm sm:text-base text-muted-foreground tracking-tight w-16'>
                날짜
              </p>
              <p className='w-24'>거래량</p>
              <p>시세</p>
            </div>
            {datas.reverse().map((data) => (
              <div key={data.date} className='flex items-center p-2'>
                <p className='text-xs sm:text-sm text-muted-foreground tracking-tight w-16'>
                  {format(data.date, 'L/d(iii)', { locale: ko })}
                </p>
                <p className='w-24'>
                  {data.totalCount.toLocaleString('ko-KR')}개
                </p>
                <p className='flex items-center gap-1.5'>
                  {Math.round(Number(data.averagePrice)).toLocaleString(
                    'ko-KR'
                  )}
                  <Image
                    src='/meso.png'
                    alt='meso image'
                    width={20}
                    height={20}
                    className='size-4 object-contain'
                  />
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <LineCharts datas={datas} />

      <h2
        className='text-muted-foreground'
        dangerouslySetInnerHTML={{
          __html: item.desc.replace(/\\r\\n|\\n|\\r/gm, '<br/>'),
        }}
      />
    </header>
  );
};
