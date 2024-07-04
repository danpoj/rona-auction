import { NoImage } from '@/components/no-image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { db } from '@/db/drizzle';
import { itemTable, transactionTable } from '@/db/schema';
import { desc, sql } from 'drizzle-orm';
import { ArrowLeftIcon, Sparkles } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

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
    .limit(100);

  return (
    <div className='max-w-[52rem] mx-auto h-full p-4'>
      <div className='flex flex-col  gap-6 pt-[5.8rem] pb-10'>
        <Button
          variant='expandIcon'
          Icon={ArrowLeftIcon}
          iconPlacement='left'
          asChild
          className='rounded-full w-fit'
        >
          <Link href='/'>홈으로 이동</Link>
        </Button>
        <p className='text-2xl font-semibold flex items-center'>
          <span>거래량 순위 TOP 100</span>
        </p>
      </div>

      <div className='flex flex-col pb-40'>
        {items.map((item, index) => (
          <Link
            href={`/item/${item.id}`}
            key={item.id}
            className='flex items-center gap-2 py-2 hover:bg-primary/5'
          >
            <span className='font-semibold justify-center text-sm'>
              #{index + 1}
            </span>
            <Badge>{item.transactionCount}건</Badge>
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
          <Button
            variant='expandIcon'
            Icon={ArrowLeftIcon}
            iconPlacement='left'
            asChild
            className='rounded-full'
          >
            <Link href='/'>홈으로 이동</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
