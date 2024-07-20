'use client';

import { NoImage } from '@/components/no-image';
import { ScrollTop } from '@/components/scroll-top';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { transactionTable } from '@/db/schema';
import { useCountdown } from '@/hooks/use-count-down';
import { useInfiniteTransactions } from '@/hooks/use-infinite-transactions';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { InferSelectModel } from 'drizzle-orm';
import {
  ArrowRightIcon,
  ArrowUpRight,
  CandyCane,
  Loader,
  Pause,
  RotateCcw,
  Triangle,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Fragment, useEffect, useState } from 'react';
import { TransactionsLineChart } from './charts';
import {
  DisplayAD,
  DisplayADSmall,
} from '@/components/google-adsense/adsense-banner';

type Props = {
  initialLists: InferSelectModel<typeof transactionTable>[];
  transactionsCountPerDay: { date: string; count: number }[];
};

export const HomeLists = ({ initialLists, transactionsCountPerDay }: Props) => {
  const { data, fetchNextPage, hasNextPage, isFetching, error } =
    useInfiniteTransactions({ initialLists });

  if (error) return notFound();

  return (
    <>
      <article className='flex flex-col gap-10 pl-4 pr-2 pb-6'>
        <TransactionsLineChart
          transactionsCountPerDay={transactionsCountPerDay}
        />

        <div className='flex items-center justify-between w-full'>
          <div className='space-y-2 w-full'>
            <section className='flex items-center justify-end w-full'>
              <CounterModal />
              <Button
                className='rounded-full w-fit text-xs font-semibold'
                variant='linkHover2'
                Icon={ArrowRightIcon}
                iconPlacement='right'
                asChild
              >
                <Link href='/liked'>즐겨찾기</Link>
              </Button>
            </section>

            <div className='text-xl sm:text-2xl font-semibold flex items-center gap-2'>
              <h2>거래 최신 순</h2>
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
        </div>
      </article>

      <section className='flex flex-col divide-y'>
        {data.pages.map((page, i) => (
          <Fragment key={i}>
            {page.map((transaction, index) => (
              <Fragment key={transaction.id}>
                {index === 8 && i % 3 === 1 && (
                  <DisplayADSmall adId={`ad-slot-${7695782604}`} />
                )}
                <Link
                  href={
                    transaction.itemId ? `/item/${transaction.itemId}` : '#'
                  }
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
                      <h3 className='text-sm sm:text-base font-semibold'>
                        {transaction.itemName}
                      </h3>
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
            >
              {isFetching ? (
                <Loader className='size-4 animate-spin' />
              ) : (
                '더 보기'
              )}
            </Button>
          </div>
        )}
      </section>

      <div className='flex justify-between pl-2 pt-4'>
        <div className='flex flex-col'>
          <p className='text-sm font-semibold pb-1'>Built with</p>

          <Link
            className='hover:underline underline-offset-4 text-xs text-muted-foreground mb-0.5'
            href={'https://discord.com/invite/pkpu2guJpE'}
            target='_blank'
            rel='noreferrer noopener'
          >
            로나월드 옥션로그
          </Link>

          <Link
            className='hover:underline underline-offset-4 text-xs text-muted-foreground'
            href={'https://maplestory.io/'}
            target='_blank'
            rel='noreferrer noopener'
          >
            https://maplestory.io/
          </Link>
        </div>
        <ScrollTop />
      </div>
    </>
  );
};

function CounterModal() {
  const [countStart, setCountStart] = useState(0);
  const [count, { startCountdown, stopCountdown, resetCountdown, setCount }] =
    useCountdown({
      countStart: countStart,
      intervalMs: 1000,
    });
  const [isCounting, setIsCounting] = useState(false);

  const hour = Math.floor(count / 3600);
  const minute = Math.floor((count % 3600) / 60);
  const second = count % 60;

  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');

  useEffect(() => {
    if (count === 0) {
      setIsCounting(false);
    }
  }, [count]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          size='sm'
          className='rounded-full w-fit text-xs font-semibold px-4 h-8'
          variant='linkHover2'
        >
          경험치 계산기
        </Button>
      </DialogTrigger>
      <DialogContent
        className={cn(
          isCounting && count < 10 && 'bg-red-200 dark:bg-red-950',
          isCounting &&
            count >= 10 &&
            count < 30 &&
            'bg-yellow-200 dark:bg-yellow-950'
        )}
      >
        <DialogHeader className='sr-only'>
          <DialogTitle>경험치 계산기</DialogTitle>
        </DialogHeader>
        <div className='flex flex-col pt-6 gap-8'>
          <div className='space-y-2'>
            <p
              className={cn(
                'text-4xl font-bold flex gap-2',
                isCounting && count >= 30 && 'text-blue-600'
              )}
            >
              {hour > 0 && <span>{String(hour).padStart(2, '0')}시간</span>}
              <span>{String(minute).padStart(2, '0')}분</span>
              <span>{String(second).padStart(2, '0')}초</span>
            </p>

            <div className='flex gap-1'>
              <Button
                onClick={() => {
                  setCountStart(count + 3600);
                }}
                variant='secondary'
                className='hover:bg-primary/10 font-semibold transition-none'
              >
                +1시간
              </Button>
              <Button
                onClick={() => {
                  setCountStart(count + 300);
                }}
                variant='secondary'
                className='hover:bg-primary/10 font-semibold transition-none'
              >
                +5분
              </Button>
              <Button
                onClick={() => {
                  setCountStart(count + 60);
                }}
                variant='secondary'
                className='hover:bg-primary/10 font-semibold transition-none'
              >
                +1분
              </Button>
            </div>
          </div>

          <div className='space-y-4'>
            <div className='flex gap-2'>
              <div className='space-y-2 flex-1'>
                <span
                  className={cn('text-muted-foreground text-lg font-semibold')}
                >
                  시작 경험치
                </span>
                <Input
                  value={start}
                  onChange={(e) => {
                    if (Number.isNaN(Number(e.target.value))) return;
                    setStart(e.target.value);
                  }}
                />
              </div>
              <div className='space-y-2 flex-1'>
                <span
                  className={cn('text-muted-foreground text-lg font-semibold')}
                >
                  종료 경험치
                </span>
                <Input
                  value={end}
                  onChange={(e) => {
                    if (Number.isNaN(Number(e.target.value))) return;
                    setEnd(e.target.value);
                  }}
                />
              </div>
            </div>

            {start && end && (
              <>
                {Number(end) < Number(start) ? (
                  <p className='text-destructive font-semibold'>
                    시작 경험치가 더 높습니다.
                  </p>
                ) : (
                  <p className='text-2xl font-bold'>
                    + {(Number(end) - Number(start)).toLocaleString('ko-KR')}
                  </p>
                )}
              </>
            )}
          </div>

          <div className='flex self-end gap-2'>
            <Button
              disabled={count === 0}
              onClick={() => {
                if (isCounting) {
                  stopCountdown();
                } else {
                  startCountdown();
                }

                setIsCounting((prev) => !prev);
              }}
              className='p-0 size-12'
              variant='outline'
            >
              {isCounting ? (
                <Pause className='size-5 fill-primary stroke-primary' />
              ) : (
                <Triangle className='rotate-[90deg] size-4 stroke-[3px] fill-primary stroke-primary ' />
              )}
            </Button>
            <Button
              className='size-12 p-0'
              variant='outline'
              onClick={() => {
                setIsCounting(false);
                resetCountdown();
                setCount(0);
              }}
            >
              <RotateCcw className='stroke-[3px]' />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
