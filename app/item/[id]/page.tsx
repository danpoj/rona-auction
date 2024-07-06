import { ITEMS_PER_PAGE } from '@/constants';
import { db } from '@/db/drizzle';
import { itemTable, transactionTable } from '@/db/schema';
import { desc, eq } from 'drizzle-orm';
import { Loader } from 'lucide-react';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { ItemPage } from './item-page';
import { Top } from './top';

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

export default async function Page({ params: { id } }: Props) {
  const idAsNumber = Number(id);

  const item = await db.query.itemTable.findFirst({
    where: eq(itemTable.id, idAsNumber),
  });

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
