import { db } from '@/db/drizzle';
import { ItemPage } from './item-page';
import { itemTable, transactionTable } from '@/db/schema';
import { ITEMS_PER_PAGE } from '@/constants';
import { InferSelectModel, and, desc, eq, gte, sql } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowLeftIcon } from 'lucide-react';
import Link from 'next/link';

type Props = {
  params: {
    id: string;
  };
};

export default async function Page({ params: { id } }: Props) {
  const idAsNumber = Number(id);

  const item = await db.query.itemTable.findFirst({
    where: eq(itemTable.id, idAsNumber),
  });

  if (!item) notFound();

  const transactions = await db
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

  return (
    <div className='max-w-[52rem] mx-auto pb-40'>
      <Top id={idAsNumber} item={item} />
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
          className='size-[140px] object-contain'
        />
        <div className='flex flex-col justify-between'>
          <h1 className='text-3xl font-black'>{item.name}</h1>

          <p className='flex flex-col gap-2'>
            <span className='text-xl text-muted-foreground'>
              최근 3일 평균 거래가
            </span>
            <span className='font-black text-4xl bg-gradient-to-r from-green-500 to-teal-400 bg-clip-text text-transparent drop-shadow-sm'>
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
    </header>
  );
};
