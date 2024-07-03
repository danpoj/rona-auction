'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Skeleton } from '@/components/ui/skeleton';
import { useInfiniteTransactions } from '@/hooks/use-infinite-transactions';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ArrowRightIcon, CandyCane, HelpCircle, Loader } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Fragment } from 'react';

export default function Page() {
  const { data, fetchNextPage, hasNextPage, isPending, isFetching, error } =
    useInfiniteTransactions();

  if (isPending) return <LoadingScreen />;
  if (error) return notFound();

  return (
    <div className='max-w-[62rem] mx-auto p-4 pb-40'>
      <div className='flex items-center gap-4 justify-center'>
        <Image
          priority
          src='https://maplestory.io/api/KMS/389/mob/8140555/render/stand'
          alt='로나월드 옥션'
          width={240}
          height={240}
          className='size-32 object-contain'
        />
        <div className='flex flex-col gap-2'>
          <h1 className='font-black text-2xl'>로나월드 옥션</h1>
          <Button
            className='rounded-full'
            variant='expandIcon'
            Icon={ArrowRightIcon}
            iconPlacement='right'
            asChild
          >
            <Link href='/top'>거래량 순위</Link>
          </Button>
        </div>
      </div>

      <div className='flex flex-col gap-2 my-4 px-2'>
        <span className='text-2xl font-semibold'>거래 최신 순</span>
        {data.pages[0][0].date && (
          <p className='space-x-2 text-muted-foreground items-center flex'>
            <span>마지막 업데이트</span>
            <span>{format(data.pages[0][0].date, 'yyyy-LL-dd HH:mm')}</span>
            <Popover>
              <PopoverTrigger>
                <HelpCircle className='size-5 hover:stroke-primary/70' />
              </PopoverTrigger>
              <PopoverContent className='text-sm text-muted-foreground'>
                🚀 하루마다 업데이트 됩니다.
              </PopoverContent>
            </Popover>
          </p>
        )}
      </div>

      <div className='flex flex-col'>
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
                      <Image
                        src={`${process.env.NEXT_PUBLIC_API_BASE}/item/${transaction.itemId}/icon?resize=2`}
                        alt={transaction.itemName}
                        width={100}
                        height={100}
                        className='size-8 sm:size-10 object-contain'
                      />
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
                          transaction.price / transaction.count
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
                    <div className='space-x-1'>
                      {transaction.additional
                        .split(',')
                        .map((addi) => addi.split(':'))
                        .map(([key, value]) => (
                          <Badge key={`${key}-${value}`} className='rounded'>
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
    </div>
  );
}

function LoadingScreen() {
  return (
    <div className='max-w-[62rem] mx-auto p-4 pb-40'>
      <div className='flex items-center gap-4 justify-center'>
        <Image
          src='https://maplestory.io/api/KMS/389/mob/8140555/render/stand'
          alt='로나월드 옥션'
          width={240}
          height={240}
          className='size-32 object-contain'
        />
        <div className='flex flex-col gap-2'>
          <h1 className='font-black text-2xl'>로나월드 옥션</h1>
          <Button
            className='rounded-full'
            variant='expandIcon'
            Icon={ArrowRightIcon}
            iconPlacement='right'
            asChild
          >
            <Link href='/top'>거래량 순위</Link>
          </Button>
        </div>
      </div>

      <div className='flex flex-col gap-2 my-4 px-2'>
        <span className='text-2xl font-semibold'>거래 최신 순</span>
        <div className='flex items-center gap-2 text-muted-foreground'>
          <span>마지막 업데이트</span>
          <Skeleton className='w-36 h-6' />
          <Popover>
            <PopoverTrigger>
              <HelpCircle className='size-5 hover:stroke-primary/70' />
            </PopoverTrigger>
            <PopoverContent className='text-sm text-muted-foreground'>
              🚀 하루마다 업데이트 됩니다.
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className='flex flex-col gap-3'>
        {new Array(40).fill(0).map((_, i) => (
          <Skeleton key={i} className='h-[4.5rem] w-full' />
        ))}
      </div>
    </div>
  );
}
