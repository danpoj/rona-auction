'use client';

import { NoImage } from '@/components/no-image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { itemTable, transactionTable } from '@/db/schema';
import { useInfiniteTransactionsPerItem } from '@/hooks/use-infinite-transactions';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { InferSelectModel } from 'drizzle-orm';
import { ArrowLeftIcon, CandyCane, Loader } from 'lucide-react';
import Image from 'next/image';
import { Link } from 'next-view-transitions';
import { notFound } from 'next/navigation';
import { Fragment } from 'react';

type Props = {
  initialLists: Pick<
    InferSelectModel<typeof transactionTable>,
    'date' | 'count' | 'price' | 'id' | 'additional'
  >[];
  item: InferSelectModel<typeof itemTable>;
  id: number;
};

export const ItemPage = ({ initialLists, item, id }: Props) => {
  const { data, fetchNextPage, hasNextPage, isPending, isFetching, error } =
    useInfiniteTransactionsPerItem({ initialLists, id });

  if (error) return notFound();

  return (
    <div className='flex flex-col divide-y'>
      {data.pages.map((page, i) => (
        <Fragment key={i}>
          {page.map((transaction) => (
            <div
              key={transaction.id}
              className={cn(
                'p-2 space-y-1',
                item.id ? 'hover:bg-primary/5' : 'cursor-default'
              )}
            >
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                  {item.id ? (
                    item.id >= 666666660 ? (
                      <NoImage />
                    ) : (
                      <Image
                        src={`${process.env.NEXT_PUBLIC_API_BASE}/item/${item.id}/icon?resize=2`}
                        alt={item.name}
                        width={100}
                        height={100}
                        className='size-8 sm:size-10 object-contain'
                      />
                    )
                  ) : (
                    <div className='size-8 sm:size-10 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center'>
                      <CandyCane className='size-4 sm:size-5' />
                    </div>
                  )}
                  <p className='text-sm sm:text-base font-semibold'>
                    {item.name}
                  </p>
                  <p className='text-sm flex gap-2'>
                    <span>{transaction.count}개</span>
                    <span>
                      개당{' '}
                      {Math.round(
                        Number(transaction.price) / transaction.count
                      ).toLocaleString('ko-KR')}
                    </span>
                  </p>
                </div>

                {transaction.date && (
                  <p className='text-sm hidden sm:block text-muted-foreground'>
                    {format(transaction.date, 'LL-dd HH:mm')}
                  </p>
                )}
              </div>

              <div className='flex justify-between'>
                {transaction.additional ? (
                  <div className='space-x-1 mt-1'>
                    {transaction.additional
                      .split(',')
                      .map((addi) => addi.split(':'))
                      .map(([key, value]) => (
                        <Badge
                          variant='outline'
                          key={`${key}-${value}`}
                          className='rounded'
                        >
                          {key} {value}
                        </Badge>
                      ))}
                  </div>
                ) : (
                  <div />
                )}
              </div>
            </div>
          ))}
        </Fragment>
      ))}
      {hasNextPage && (
        <div className='w-full flex items-center justify-center pt-4'>
          <Button
            className='w-40 rounded-full'
            onClick={() => fetchNextPage()}
            disabled={isFetching}
          >
            {isFetching ? (
              <Loader className='size-4 animate-spin' />
            ) : (
              '더 보기'
            )}
          </Button>
        </div>
      )}

      <Button
        variant='expandIcon'
        Icon={ArrowLeftIcon}
        iconPlacement='left'
        asChild
        className='rounded-full w-fit mx-2 mt-10'
      >
        <Link href='/'>홈으로 이동</Link>
      </Button>
    </div>
  );
};
