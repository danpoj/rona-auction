'use client';

import { GoToHome } from '@/components/go-to-home';
import {
  DisplayAD,
  DisplayADFlexRowSmall,
} from '@/components/google-adsense/adsense-banner';
import { NoImage } from '@/components/no-image';
import { ScrollTop } from '@/components/scroll-top';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

export const Lists = ({
  itemsOBJ,
}: {
  itemsOBJ: Record<string, { id: number; name: string; value: number }[]>;
}) => {
  const [currentDate, setCurrentDate] = useState(
    Object.keys(itemsOBJ).sort().reverse()[0]
  );
  const [page, setPage] = useState(1);

  return (
    <div className='flex flex-col pb-40'>
      <div className='grid grid-cols-3 sm:grid-cols-4 gap-2'>
        {Object.keys(itemsOBJ)
          .sort()
          .reverse()
          .map((date) => (
            <Button
              className='font-bold'
              onClick={() => {
                setCurrentDate(date);
                setPage(1);
              }}
              key={date}
              variant={date === currentDate ? 'default' : 'secondary'}
            >
              {format(date, 'LL.dd (E)', { locale: ko })}
            </Button>
          ))}
      </div>

      <div className='mt-8'>
        <DisplayADFlexRowSmall />
      </div>

      {Object.entries(itemsOBJ).map(([date, items]) => (
        <div
          key={date}
          className={cn('mt-10', date === currentDate ? 'block' : 'hidden')}
        >
          <h3 className='text-2xl font-bold text-tremor-content-strong dark:text-dark-tremor-content-strong mb-6'>
            {format(date, 'LL.dd (E)', { locale: ko })}
          </h3>

          {items.slice(0, 100 * page).map((item, index) => (
            <Link
              href={`/item/${item.id}`}
              key={item.id}
              className={cn(
                'flex items-center gap-2 py-2 hover:bg-primary/5',
                index === 0 && 'font-black text-amber-500',
                index === 1 && 'font-black text-violet-500',
                index === 2 && 'font-black text-blue-500'
              )}
            >
              <span className='font-semibold justify-center text-sm'>
                #{index + 1}
              </span>
              <Badge variant='secondary'>{item.value}건</Badge>
              {item.id >= 666666660 ? (
                <NoImage />
              ) : (
                <Image
                  src={`${process.env.NEXT_PUBLIC_API_BASE!}/item/${
                    item.id
                  }/icon?resize=2`}
                  alt={item.name}
                  width={50}
                  height={50}
                  className='size-10 object-contain'
                />
              )}
              <p>{item.name}</p>
            </Link>
          ))}

          {100 * page <= items.length && (
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
        </div>
      ))}

      <div className='pt-10 flex justify-between'>
        <GoToHome />
        <ScrollTop />
      </div>
    </div>
  );
};
