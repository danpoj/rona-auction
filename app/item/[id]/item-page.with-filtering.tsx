'use client';

import { GoToHome } from '@/components/go-to-home';
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
import { CandyCane } from 'lucide-react';
import Image from 'next/image';
import { FormEvent, useRef, useState } from 'react';
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

    const newTransactions = transactions.filter((t) => {
      for (const [key] of ops) {
        if (!t.additional[key]) t.additional[key] = 0;

        if (
          t.additional[key] < values[key].min ||
          t.additional[key] > values[key].max
        ) {
          return false;
        }
      }

      return true;
    });

    setFilteredTransactions(newTransactions);

    toast('검색 완료 🎉', {
      description: `총 ${newTransactions.length}개의 거래내역이 검색되었습니다.`,
      position: 'top-right',
    });
  };

  return (
    <>
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

      <div className='flex flex-col divide-y'>
        {filteredTransactions.length === 0 ? (
          <p className='text-2xl p-4 font-bold'>검색 결과가 없습니다</p>
        ) : (
          <p className='p-4 pt-0 text-2xl font-bold'>
            총 {filteredTransactions.length}개의 내역이 검색되었습니다
          </p>
        )}
        {filteredTransactions
          .slice(0, page * ITEMS_PER_PAGE)
          .map((transaction) => (
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
          ))}
      </div>

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
