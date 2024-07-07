'use client';

import { NoImage } from '@/components/no-image';
import { ScrollTop } from '@/components/scroll-top';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { transactionTable } from '@/db/schema';
import { useInfiniteTransactions } from '@/hooks/use-infinite-transactions';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { InferSelectModel } from 'drizzle-orm';
import {
  ArrowRightIcon,
  ArrowUpRight,
  CandyCane,
  Loader,
  Star,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
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
          <div className='text-xl sm:text-2xl font-semibold flex items-center gap-2'>
            <span>거래 최신 순</span>

            <Button
              size='sm'
              variant='ringHover'
              className='rounded-full h-6 text-xs bg-secondary text-primary hover:text-primary-foreground'
              asChild
            >
              <Link href='/new'>New</Link>
            </Button>

            <Button
              size='sm'
              variant='ringHover'
              className='rounded-full h-6 text-xs bg-secondary text-primary hover:text-primary-foreground'
              asChild
            >
              <Link
                href='https://tally.so/r/wg4M74'
                target='_blank'
                rel='noreferrer noopener'
              >
                문의 <ArrowUpRight className='size-3 ml-0.5' />
              </Link>
            </Button>
          </div>
          {data.pages[0][0].date && (
            <p className='text-sm sm:text-base space-x-2 text-muted-foreground items-center flex'>
              <span>마지막 업데이트</span>
              <span>{format(data.pages[0][0].date, 'yyyy-LL-dd HH:mm')}</span>
            </p>
          )}
        </div>

        <div className='flex flex-col items-end gap-2'>
          <Button
            size='sm'
            className='rounded-full w-fit text-xs font-semibold px-4 h-8'
            variant='shine'
            Icon={ArrowRightIcon}
            iconPlacement='right'
            asChild
          >
            <Link href='/top'>인기 매물 ✨</Link>
          </Button>
          <Button
            className='rounded-full w-fit'
            variant='linkHover2'
            Icon={ArrowRightIcon}
            iconPlacement='right'
            asChild
          >
            <Link href='/liked'>
              즐겨찾기
              <Star className='size-4 stroke-yellow-400 fill-yellow-400 ml-1' />
            </Link>
          </Button>
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

        <ScrollTop />
      </div>
    </>
  );
};
