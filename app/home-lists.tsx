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
  Loader2,
  Pause,
  RotateCcw,
  Triangle,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Fragment, useEffect, useState } from 'react';
import { TransactionsLineChart } from './charts';

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
      <article className='flex flex-col gap-4 pl-4 pr-2 pb-6'>
        <TransactionsLineChart
          transactionsCountPerDay={transactionsCountPerDay}
        />

        <div className='prose dark:prose-invert w-full max-w-full'>
          <pre className='w-full max-w-full text-xs leading-6 max-h-[14rem]'>
            {`
✔ 8.9 (금)

장난감 북, [마스터리북]이프리트 30, 청일, 적월, 다크 숄더메일 바지, 초록색 자일즈의 망토, 쇠 도끼, 웨어울프의 발톱,
블루 피에르슈즈, 레드 루티드 바지, 버섯의 포자, 지저분한 대걸레, 브론즈 플라틴 바지, 
팥죽, 카노푸스 부츠, 골드 노르만 헬름, 레드 바즈라, 천도복숭아, 베이지 플레로브, 다크 웨어캡, 
다크 하이드후드, 몽둥이, 베이지 리넥스, 레드 버글러, 퍼플 미스트슈트, 강철 반장갑, 다크 가너, 
석궁전용 화살, 블러드 카멜부츠, 미스릴 플레닛, 다크 숄더메일, 황진일갑주 바지, 두손도끼 명중률 주문서 100%, 쇠도끼

✔ 8.3 (토)

적 흑일모자, 메탈 완드, 묘목, 루이넬의 꼬리, 불독의 송곳니, 버크의 씹던 풀, 파란색 수련복 바지, 다크 길티언, 
스틸 브리스트, 갈색 가죽 모자, 블랙 루티아, 산양 석궁, 에메랄드 배틀 그리브, 파이어보어의 송곳니, 
아쿠아 플라티나 바지, 다크 네펜데스의 씨앗, 반월 자마다르, 황월 바지, 버드빌, 아이보리 숄더메일, 골드 브레이스, 
브라운 피에뜨, 뱀가죽, 옐로우 피에르슈즈, 뱀방울, 블루 스타드, 적일, 다크 잉그리트, 아쿠아 골든서클릿, 
미스릴 노르만 헬름, 비급의 낱장, 블러드 발퀴레 치마, 블랙 너클베스트 바지, 브라운 피에뜨 바지, 회색 노가다 목장갑, 
아이언 체인슈즈, 적월 바지, MT-09의 연료, 우드 레전드 실드, 흑룡포, 하드우드 완드, 블루 브레이스룩, 레드 고어부츠, 
젝커, 블루 카운터, 사파이어 카멜부츠, [마스터리북]쇼다운 30, [마스터리북]닌자 스톰 30, 블루 키튼서클렛, 
[마스터리북]속성강화 30, 피스톨, 크로노, 오리할콘 플라틴 바지, 메이플 너클, 스틸 슬레인, 파란 달팽이의 껍질, 다크 너클, 다크 세라피스
`.trim()}
          </pre>
        </div>

        {/* <div className='flex flex-col gap-1 sm:flex-row'>
          <DisplayAD />
        </div> */}

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
                <Link
                  href={
                    transaction.itemId ? `/item/${transaction.itemId}` : '#'
                  }
                  className={cn(
                    'p-2 space-y-1',
                    transaction.itemId
                      ? 'md:hover:bg-primary/5'
                      : 'cursor-default'
                  )}
                >
                  <div className='flex items-center justify-between relative'>
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
                <Loader2 className='size-4 animate-spin' />
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
