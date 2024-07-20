'use client';

import { GoToHome } from '@/components/go-to-home';
import {
  DisplayAD,
  DisplayADSmall,
} from '@/components/google-adsense/adsense-banner';
import { NoImage } from '@/components/no-image';
import { ScrollTop } from '@/components/scroll-top';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ITEMS_PER_PAGE } from '@/constants';
import { itemTable, transactionTable } from '@/db/schema';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { InferSelectModel } from 'drizzle-orm';
import { CandyCane, Grid2x2, Rows3 } from 'lucide-react';
import Image from 'next/image';
import { FormEvent, Fragment, useRef, useState } from 'react';
import { toast } from 'sonner';

type Props = {
  transactions: (Pick<
    InferSelectModel<typeof transactionTable>,
    'date' | 'count' | 'price' | 'id'
  > & {
    additional: Record<string, number>;
  })[];
  item: InferSelectModel<typeof itemTable>;
  id: number;
  addiOptions: Record<string, number[]>;
};

export const ItemPageWithFiltering = ({
  transactions,
  item,
  id,
  addiOptions,
}: Props) => {
  const [filteredTransactions, setFilteredTransactions] =
    useState(transactions);
  const [page, setPage] = useState(1);
  const [shape, setShape] = useState<'list' | 'item'>('list');
  const [sortType, setSortType] = useState<
    'timeASC' | 'timeDESC' | 'priceASC' | 'priceDESC'
  >('timeDESC');

  const options = useRef(
    Object.entries(addiOptions).reduce(
      (acc: Record<string, { max: number; min: number }>, [key, values]) => {
        acc[key] = {
          max: Math.max(...values),
          min: Math.min(...values),
        };

        return acc;
      },
      {}
    )
  );

  const onFilter = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const ops = Object.entries(options.current);
    const formData = new FormData(e.target as HTMLFormElement);

    const values: Record<string, { min: number; max: number }> = {};

    for (const [key] of ops) {
      const minValue = Number(formData.get(`${key}-min`));
      const maxValue = Number(formData.get(`${key}-max`));
      values[key] = { min: minValue, max: maxValue };
    }

    const newTransactions = transactions
      .filter((t) => {
        for (const [key] of ops) {
          if (
            (t.additional[key] || 0) < values[key].min ||
            (t.additional[key] || 0) > values[key].max
          ) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortType === 'priceASC') {
          return Number(a.price) - Number(b.price);
        } else if (sortType === 'priceDESC') {
          return Number(b.price) - Number(a.price);
        } else if (sortType === 'timeASC') {
          return new Date(a.date!).getTime() - new Date(b.date!).getTime();
        } else {
          return new Date(b.date!).getTime() - new Date(a.date!).getTime();
        }
      });

    setFilteredTransactions(newTransactions);

    toast(`${item.name} 🎉`, {
      description: `총 ${newTransactions.length}개의 거래내역이 검색되었습니다.`,
      position: 'top-right',
    });
  };

  return (
    <>
      <div className='mb-8'>
        <DisplayAD adId={`ad-slot-${6874118547}`} />
      </div>

      <div className='flex flex-col md:flex-row-reverse'>
        <div className='p-4 flex flex-col gap-5'>
          <p className='text-xl font-bold'>아이템 옵션 검색</p>
          <div className='prose dark:prose-invert'>
            <pre className='py-0'>
              <ul>
                <li>모든 거래내역의 최대값으로 기본값이 채워져있습니다.</li>
              </ul>
            </pre>
          </div>
        </div>
        <form
          onSubmit={onFilter}
          className='mb-10 space-y-6 w-fit flex flex-col p-4'
        >
          <div className='space-y-3 flex flex-col'>
            {Object.entries(options.current).map(([key, { min, max }]) => (
              <div key={key} className='flex items-center gap-4'>
                <div className='flex items-center gap-2'>
                  <Input
                    name={`${key}-min`}
                    className='w-24'
                    defaultValue={0}
                  />
                  <span className='text-muted-foreground'>-</span>
                  <Input
                    name={`${key}-max`}
                    className='w-24'
                    defaultValue={max}
                  />
                </div>
                <span className='text-sm font-semibold'>{key}</span>
              </div>
            ))}
          </div>
          <Button
            type='submit'
            variant='shine'
            className='rounded-full hover:hue-rotate-60'
          >
            검색
          </Button>
        </form>
      </div>

      {filteredTransactions.length === 0 ? (
        <p className='text-2xl p-4 font-bold'>검색 결과가 없습니다</p>
      ) : (
        <div className='flex items-center p-4 pt-0 pb-6 gap-4'>
          <p className='text-xl font-bold'>
            총 {filteredTransactions.length}개
          </p>

          <div className='rounded-lg overflow-hidden'>
            <Button
              onClick={() => setShape('list')}
              variant={shape === 'list' ? 'default' : 'ghost'}
              className={cn(
                'p-0 h-9 w-10 rounded-none transition-none border border-r-0'
              )}
            >
              <Rows3 className='size-4' />
            </Button>
            <Button
              onClick={() => setShape('item')}
              variant={shape === 'item' ? 'default' : 'ghost'}
              className={cn(
                'p-0 h-9 w-10 rounded-none transition-none border border-l-0'
              )}
            >
              <Grid2x2 className='size-4' />
            </Button>
          </div>

          <div className='rounded-lg overflow-hidden'>
            <Button
              onClick={() => {
                if (sortType === 'timeDESC') {
                  setSortType('timeASC');
                  setFilteredTransactions((prev) => {
                    const sorted = prev.sort(
                      (a, b) =>
                        new Date(a.date!).getTime() -
                        new Date(b.date!).getTime()
                    );

                    return sorted;
                  });
                } else {
                  setSortType('timeDESC');
                  setFilteredTransactions((prev) => {
                    const sorted = prev.sort(
                      (a, b) =>
                        new Date(b.date!).getTime() -
                        new Date(a.date!).getTime()
                    );

                    return sorted;
                  });
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
                  setFilteredTransactions((prev) => {
                    const sorted = prev.sort(
                      (a, b) => Number(a.price) - Number(b.price)
                    );

                    return [...sorted];
                  });
                } else if (sortType === 'priceASC') {
                  setSortType('priceDESC');
                  setFilteredTransactions((prev) => {
                    const sorted = prev.sort(
                      (a, b) => Number(b.price) - Number(a.price)
                    );

                    return [...sorted];
                  });
                } else {
                  setSortType('priceDESC');
                  setFilteredTransactions((prev) => {
                    const sorted = prev.sort(
                      (a, b) => Number(b.price) - Number(a.price)
                    );

                    return [...sorted];
                  });
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
          </div>
        </div>
      )}

      <section
        className={cn(
          'grid',
          shape === 'list'
            ? 'grid-cols-1 divide-y'
            : 'grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-1.5'
        )}
      >
        {filteredTransactions
          .slice(0, page * ITEMS_PER_PAGE)
          .map((transaction, index) => {
            if (shape === 'list') {
              return (
                <Fragment key={transaction.id}>
                  {index > 20 && (index + 8) % 60 === 0 && (
                    <DisplayADSmall adId={`ad-slot-${7695782604}`} />
                  )}
                  <div className={cn('p-2 space-y-1')}>
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
                          {Object.entries(transaction.additional).map(
                            ([key, value]) => (
                              <Badge
                                variant='secondary'
                                key={`${key}-${value}`}
                                className='rounded'
                              >
                                {key} {value}
                              </Badge>
                            )
                          )}
                        </div>
                      ) : (
                        <div />
                      )}
                    </div>
                  </div>
                </Fragment>
              );
            } else {
              return (
                <div
                  key={transaction.id}
                  className='p-2 space-y-1 border bg-gray-50 dark:bg-gray-900 flex flex-col items-center py-4'
                >
                  <div>
                    <div>
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
                              className='size-7 sm:size-7 object-contain'
                            />
                          )
                        ) : (
                          <div className='size-8 sm:size-10 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center'>
                            <CandyCane className='size-4 sm:size-5' />
                          </div>
                        )}
                        <p className='text-xs font-semibold'>{item.name}</p>
                      </div>
                    </div>
                  </div>

                  <div className='py-2'>
                    {transaction.additional ? (
                      <div className='flex flex-col'>
                        {Object.entries(transaction.additional).map(
                          ([key, value]) => (
                            <span
                              key={`${key}-${value}`}
                              className='text-xs font-semibold text-primary/90 dark:text-primary/80'
                            >
                              {key} {value}
                            </span>
                          )
                        )}
                      </div>
                    ) : (
                      <div />
                    )}
                  </div>

                  <div className='text-sm flex gap-2'>
                    <p className='flex gap-1 items-center'>
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

                  {transaction.date && (
                    <p className='text-xs text-muted-foreground'>
                      {format(transaction.date, 'LL-dd HH:mm')}
                    </p>
                  )}
                </div>
              );
            }
          })}
      </section>

      {ITEMS_PER_PAGE * page <= filteredTransactions.length && (
        <div className='w-full flex items-center justify-center pt-4'>
          <Button
            className='w-40 rounded-full'
            onClick={() => {
              setPage((prev) => prev + 1);
            }}
          >
            더 보기
          </Button>
        </div>
      )}

      <div className='mt-10 mx-2 flex justify-between'>
        <GoToHome />
        <ScrollTop />
      </div>
    </>
  );
};
