import { Button } from '@/components/ui/button';
import { ITEMS_PER_PAGE } from '@/constants';
import { db } from '@/db/drizzle';
import { itemTable, transactionTable } from '@/db/schema';
import { InferSelectModel, and, count, desc, eq, gte, sql } from 'drizzle-orm';
import { ArrowLeftIcon, Loader } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { ItemPage } from './item-page';

type Props = {
  params: {
    id: string;
  };
};

// export async function generateMetadata({ params }: Props): Promise<Metadata> {
//   const id = params.id;

//   const item = await fetch(`https://maplestory.io/api/kms/384/item/${id}`).then(
//     (res) => res.json()
//   );

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
  const result = await db
    .select({
      totalPrice:
        sql<string>`SUM(CAST(${transactionTable.price} AS DECIMAL(38,2)))`.as(
          'total_price'
        ),
      totalCount: sql<number>`SUM(${transactionTable.count})`.as('total_count'),
      totalRows: count(),
    })
    .from(transactionTable)
    .where(
      and(
        gte(transactionTable.date, sql`DATE(NOW() - INTERVAL '3 days')`),
        eq(transactionTable.itemId, Number(id))
      )
    );

  const averagePrice = parseFloat(result[0].totalPrice) / result[0].totalCount;

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
        <Image
          src={`${process.env.NEXT_PUBLIC_API_BASE}/item/${item.id}/icon?resize=3`}
          alt={`${item.name} - ${item.desc}`}
          width={140}
          height={140}
          className='size-[100px] sm:size-[140px] object-contain'
        />
        <div className='flex flex-col justify-between'>
          <h1 className='text-2xl sm:text-3xl font-black'>{item.name}</h1>

          <p className='flex flex-col gap-2'>
            <span className='text-lg sm:text-xl text-muted-foreground'>
              최근 3일 평균 거래가
            </span>
            <span className='font-black text-3xl sm:text-4xl bg-gradient-to-r from-green-500 to-teal-400 bg-clip-text text-transparent drop-shadow-sm'>
              {Math.round(averagePrice).toLocaleString('ko-KR')} 메소
            </span>
          </p>
        </div>
      </div>
      <h2
        className='text-muted-foreground'
        dangerouslySetInnerHTML={{
          __html: item.desc.replace(/\\r\\n|\\n|\\r/gm, '<br/>'),
        }}
      />
      <div className='space-y-2'>
        <p className='text-muted-foreground'>최근 3일 동안</p>
        <p className='text-muted-foreground'>
          <span className='text-xl sm:text-2xl font-semibold text-primary/90'>
            총 {result[0].totalRows || 0}건
          </span>
          <span className=''>
            의 <span className='font-semibold text-primary'>{item.name}</span>가
            거래 되었습니다.
          </span>
        </p>
        <p className='text-muted-foreground'>
          <span className='text-xl sm:text-2xl font-semibold text-primary/90'>
            총 {result[0].totalCount || 0}개
          </span>
          <span className=''>
            의 <span className='font-semibold text-primary'>{item.name}</span>가
            거래 되었습니다.
          </span>
        </p>
      </div>
    </header>
  );
};
