import { NoImage } from '@/components/no-image';
import { Button } from '@/components/ui/button';
import { ITEMS_PER_PAGE } from '@/constants';
import { db } from '@/db/drizzle';
import { itemTable, transactionTable } from '@/db/schema';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { InferSelectModel, and, desc, eq, gte, sql } from 'drizzle-orm';
import { ArrowLeftIcon, Loader } from 'lucide-react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { ItemPage } from './item-page';
import { LineCharts } from './line-charts';

const Heart = dynamic(() => import('@/components/heart'), { ssr: false });

type Props = {
  params: {
    id: string;
  };
};

export async function generateStaticParams() {
  const items = await db.query.itemTable.findMany({
    columns: { id: true },
  });

  return items.map((item) => ({
    id: String(item.id),
  }));
}

// export async function generateMetadata({ params }: Props): Promise<Metadata> {
//   const id = params.id;

//   const item = await fetch(`https://maplestory.io/api/kms/384/item/${id}`).then(
//     (res) => res.json()
//   );

//   if (!item) {
//     const dbItem = await db.query.itemTable.findFirst({
//       where: eq(itemTable.id, Number(id)),
//     });
//     return {
//       title: dbItem?.name,
//     };
//   }
//   return {
//     title: item?.description?.name || '',
//     description: item?.description?.description || '',
//     openGraph: {
//       type: 'website',
//       locale: 'ko_KR',
//       url: siteConfig.url,
//       title: siteConfig.name,
//       description: siteConfig.description,
//       siteName: siteConfig.name,
//       images: [
//         {
//           url: `https://maplestory.io/api/kms/384/item/${id}/icon?resize=10`,
//           width: 600,
//           height: 600,
//           alt: siteConfig.name,
//         },
//       ],
//     },
//     twitter: {
//       card: 'summary_large_image',
//       title: siteConfig.name,
//       description: siteConfig.description,
//       images: [`https://maplestory.io/api/kms/384/item/${id}/icon?resize=10`],
//       creator: '@danpoj',
//     },
//   };
// }

export default async function Page({ params: { id } }: Props) {
  const idAsNumber = Number(id);

  const itemPromise = await db.query.itemTable.findFirst({
    where: eq(itemTable.id, idAsNumber),
  });

  const transactionsPromise = await db
    .select({
      date: transactionTable.date,
      price: transactionTable.price,
      count: transactionTable.count,
      id: transactionTable.id,
      additional: transactionTable.additional,
    })
    .from(transactionTable)
    .orderBy(desc(transactionTable.date))
    .limit(ITEMS_PER_PAGE)
    .where(eq(transactionTable.itemId, idAsNumber));

  const [item, transactions] = await Promise.all([
    itemPromise,
    transactionsPromise,
  ]);

  if (!item) notFound();

  return (
    <div className='max-w-[52rem] mx-auto pb-40'>
      <Suspense
        key={id}
        fallback={
          <header className='px-4 py-10 space-y-6 flex items-center justify-center h-80'>
            <Loader className='animate-spin w-5 h-5' />
          </header>
        }
      >
        <Top id={idAsNumber} item={item} />
      </Suspense>
      <ItemPage initialLists={transactions} item={item} id={idAsNumber} />
    </div>
  );
}

const Top = async ({
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
      <Button
        variant='expandIcon'
        Icon={ArrowLeftIcon}
        iconPlacement='left'
        asChild
        className='rounded-full w-fit'
      >
        <Link href='/'>홈으로 이동</Link>
      </Button>
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
              <p className='text-sm sm:text-base text-muted-foreground tracking-tight w-14'>
                날짜
              </p>
              <p className='w-24'>거래량</p>
              <p>시세</p>
            </div>
            {datas.reverse().map((data) => (
              <div key={data.date} className='flex items-center p-2'>
                <p className='text-sm sm:text-base text-muted-foreground tracking-tight w-14'>
                  {format(data.date, 'L/d', { locale: ko })}
                </p>
                <p className='w-24'>
                  {data.totalCount.toLocaleString('ko-KR')}
                </p>
                <p>
                  {Math.round(Number(data.averagePrice)).toLocaleString(
                    'ko-KR'
                  )}
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
