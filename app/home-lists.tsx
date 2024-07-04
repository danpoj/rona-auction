'use client';

import { NoImage } from '@/components/no-image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { transactionTable } from '@/db/schema';
import { useInfiniteTransactions } from '@/hooks/use-infinite-transactions';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { InferSelectModel } from 'drizzle-orm';
import { ArrowRightIcon, CandyCane, HelpCircle, Loader } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Fragment } from 'react';

type Props = {
  initialLists: InferSelectModel<typeof transactionTable>[];
};

export const HomeLists = ({ initialLists }: Props) => {
  const { data, fetchNextPage, hasNextPage, isFetching, error } =
    useInfiniteTransactions({ initialLists });

  if (error) return notFound();

  return (
    <>
      <div className='flex items-center justify-between pl-4 pr-2 pb-6'>
        <div className='space-y-2'>
          <span className='text-xl sm:text-2xl font-semibold'>
            거래 최신 순
          </span>
          {data.pages[0][0].date && (
            <p className='text-sm sm:text-base space-x-2 text-muted-foreground items-center flex'>
              <span>마지막 업데이트</span>
              <span>{format(data.pages[0][0].date, 'yyyy-LL-dd HH:mm')}</span>
              <Popover>
                <PopoverTrigger>
                  <HelpCircle className='size-5 hover:stroke-primary/70' />
                </PopoverTrigger>
                <PopoverContent className='text-sm text-muted-foreground'>
                  🚀 하루마다 업데이트 됩니다. <br />
                  7월 1일 데이터의 시간은 정확하지 않습니다.
                </PopoverContent>
              </Popover>
            </p>
          )}
        </div>
        <div className='relative'>
          <Button
            className='rounded-full'
            variant='expandIcon'
            Icon={ArrowRightIcon}
            iconPlacement='right'
            asChild
          >
            <Link href='/top'>거래량 순위</Link>
          </Button>
          <Image
            src={'https://maplestory.io/api/KMS/389/mob/2230103/render/stand'}
            alt='spider'
            width={40}
            height={200}
            className='object-contain w-10 absolute -top-36 right-0'
          />
        </div>
      </div>

      <div className='flex flex-col divide-y'>
        {data.pages.map((page, i) => (
          <Fragment key={i}>
            {page.map((transaction) => (
              <Link
                href={transaction.itemId ? `/item/${transaction.itemId}` : '#'}
                key={transaction.id}
                className={cn(
                  'p-2 space-y-1',
                  transaction.itemId ? 'hover:bg-primary/5' : 'cursor-default'
                )}
              >
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-2'>
                    {transaction.itemId ? (
                      transaction.itemId >= 666666660 ? (
                        <NoImage />
                      ) : (
                        <Image
                          src={`${process.env.NEXT_PUBLIC_API_BASE}/item/${transaction.itemId}/icon?resize=2`}
                          alt={transaction.itemName}
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
                      {transaction.itemName}
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
              </Link>
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
      </div>
    </>
  );
};
