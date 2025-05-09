'use client';

import { GoToHome } from '@/components/go-to-home';
import { NoImage } from '@/components/no-image';
import { ScrollTop } from '@/components/scroll-top';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { itemTable, transactionTable } from '@/db/schema';
import { useInfiniteTransactionsPerItem } from '@/hooks/use-infinite-transactions';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { InferSelectModel } from 'drizzle-orm';
import { CandyCane, HelpCircleIcon, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Fragment, useState } from 'react';

type Props = {
  initialLists: Pick<
    InferSelectModel<typeof transactionTable>,
    'date' | 'count' | 'price' | 'id' | 'additional'
  >[];
  item: InferSelectModel<typeof itemTable>;
  id: number;
};

export const ItemPage = ({ item, id }: Props) => {
  const [sortType, setSortType] = useState<
    'timeASC' | 'timeDESC' | 'priceASC' | 'priceDESC'
  >('timeDESC');

  const { data, fetchNextPage, hasNextPage, isPending, isFetching, error } =
    useInfiniteTransactionsPerItem({ id, sortType });

  if (error) return notFound();

  return (
    <>
      {/* <div className='mb-4'>
        <DisplayAD />
      </div> */}

      <div className='rounded-lg overflow-hidden mb-6 px-3 flex items-center'>
        <Button
          onClick={() => {
            if (sortType === 'timeDESC') {
              setSortType('timeASC');
            } else {
              setSortType('timeDESC');
            }
          }}
          variant={sortType.startsWith('time') ? 'default' : 'ghost'}
          className={cn(
            'h-9 rounded-none transition-none border border-r-0 text-xs'
          )}
        >
          {sortType === 'timeASC' ? '오래된순' : '최신순'}
        </Button>
        <Button
          onClick={() => {
            if (sortType === 'priceDESC') {
              setSortType('priceASC');
            } else if (sortType === 'priceASC') {
              setSortType('priceDESC');
            } else {
              setSortType('priceDESC');
            }
          }}
          variant={sortType.startsWith('price') ? 'default' : 'ghost'}
          className={cn(
            'h-9 rounded-none transition-none border border-l-0 text-xs items-center gap-0.5'
          )}
        >
          {sortType === 'priceASC' ? '가격낮은순' : '가격높은순'}{' '}
          <Image
            src='/meso.png'
            alt='meso image'
            width={20}
            height={20}
            className='size-4 object-contain'
          />
        </Button>

        <Popover>
          <PopoverTrigger className='ml-2'>
            <HelpCircleIcon className='size-4 stroke-primary/40 hover:stroke-primary/70' />
          </PopoverTrigger>
          <PopoverContent
            className='text-sm text-muted-foreground w-fit'
            align='start'
          >
            ✔ 최신순
            <br />
            ✔ 오래된순
            <br />
            ✔ 가격높은순
            <br />✔ 가격낮은순
          </PopoverContent>
        </Popover>
      </div>

      <section className='flex flex-col divide-y'>
        {isPending && (
          <div className='w-full p-2 space-y-1 flex justify-center mt-10 h-screen'>
            <Loader2 className='animate-spin size-4' />
          </div>
        )}
        {data?.pages.map((page, i) => (
          <Fragment key={i}>
            {page.map((transaction, index) => (
              <Fragment key={transaction.id}>
                <div
                  className={cn(
                    'p-2 space-y-1',
                    item.id ? '' : 'cursor-default'
                  )}
                >
                  <div className='flex items-center justify-between relative'>
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
                      <div className='text-sm flex gap-2'>
                        <span>{transaction.count}개</span>
                        <p className='flex gap-1 items-center'>
                          <span>개당</span>
                          <span className='font-bold'>
                            {Math.round(
                              Number(transaction.price) / transaction.count
                            ).toLocaleString('ko-KR')}
                          </span>
                          <Image
                            src='/meso.png'
                            alt='meso image'
                            width={20}
                            height={20}
                            className='size-4 object-contain'
                          />
                        </p>
                      </div>
                    </div>

                    {transaction.date && (
                      <>
                        <p className='text-sm hidden sm:block text-muted-foreground'>
                          {format(transaction.date, 'LL-dd HH:mm')}
                        </p>
                        <p className='text-xs block sm:hidden text-muted-foreground absolute -top-4 right-0'>
                          {format(transaction.date, 'L.dd HH:mm')}
                        </p>
                      </>
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
                              variant='secondary'
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
              </Fragment>
            ))}
          </Fragment>
        ))}

        {hasNextPage && (
          <div className='w-full flex items-center justify-center pt-4'>
            <Button
              className='w-40 rounded-full'
              onClick={() => fetchNextPage()}
              disabled={isFetching}
              variant='secondary'
            >
              {isFetching ? (
                <Loader2 className='size-4 animate-spin' />
              ) : (
                '더 보기'
              )}
            </Button>
          </div>
        )}
      </section>

      <div className='mt-10 mx-2 flex justify-between'>
        <GoToHome />
        <ScrollTop />
      </div>
    </>
  );
};
