import { siteConfig } from '@/config';
import { db } from '@/db/drizzle';
import { itemTable, transactionTable } from '@/db/schema';
import { desc, eq } from 'drizzle-orm';
import { Loader2 } from 'lucide-react';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { ItemPage } from './item-page';
import { ItemPageWithFilteringWrapper } from './item-page-with-filtering-wrapper';
import { Top } from './top';

type Props = {
  params: {
    id: string;
  };
};

export async function generateMetadata({ params }: Props) {
  const item = await db.query.itemTable.findFirst({
    where: eq(itemTable.id, Number(params.id)),
  });

  return {
    title: item?.name || '',
    description: item?.desc || siteConfig.description,
    openGraph: {
      type: 'website',
      locale: 'ko_KR',
      url: `${siteConfig.url}item/${item?.id}`,
      title: `${item?.name} - ${siteConfig.name}`,
      description: item?.desc
        ? `${item.desc} - ${siteConfig.description}`
        : siteConfig.description,
      siteName: `${item?.name} - ${siteConfig.name}`,
      images: [
        {
          url:
            Number(item?.id) >= 666666660
              ? siteConfig.ogImage
              : `https://maplestory.io/api/kms/384/item/${item?.id}/icon?resize=3`,
          width: 1200,
          height: 630,
          alt: `${item?.name}-${siteConfig.name}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${item?.name}-${siteConfig.name}`,
      description: item?.desc
        ? `${item.desc} - ${siteConfig.description}`
        : siteConfig.description,
      images: [
        Number(item?.id) >= 666666660
          ? siteConfig.ogImage
          : `https://maplestory.io/api/kms/384/item/${item?.id}/icon?resize=3`,
      ],
      creator: '@danpoj',
    },
  };
}

export async function generateStaticParams() {
  const items = await db.query.itemTable.findMany({
    columns: { id: true },
  });

  return items.map((item) => ({
    id: String(item.id),
  }));
}

// export const dynamic = 'force-dynamic';
// export const fetchCache = 'default-no-store';

export default async function Page({ params: { id } }: Props) {
  const idAsNumber = Number(id);

  const itemPromise = db.query.itemTable.findFirst({
    where: eq(itemTable.id, idAsNumber),
  });

  const transactionsPromise = db
    .select({
      date: transactionTable.date,
      price: transactionTable.price,
      count: transactionTable.count,
      id: transactionTable.id,
      additional: transactionTable.additional,
    })
    .from(transactionTable)
    .orderBy(desc(transactionTable.date))
    .limit(1)
    .where(eq(transactionTable.itemId, idAsNumber));

  const [item, transactions] = await Promise.all([
    itemPromise,
    transactionsPromise,
  ]);

  if (!item) notFound();

  return (
    <article className='max-w-[46rem] mx-auto pb-40'>
      <Suspense
        key={id}
        fallback={
          <header className='px-4 py-10 space-y-6 flex items-center justify-center h-80'>
            <Loader2 className='animate-spin w-5 h-5' />
          </header>
        }
      >
        <Top id={idAsNumber} item={item} />
      </Suspense>

      {!!transactions[0].additional ? (
        <ItemPageWithFilteringWrapper id={idAsNumber} item={item} />
      ) : (
        <ItemPage initialLists={transactions} item={item} id={idAsNumber} />
      )}
    </article>
  );
}
