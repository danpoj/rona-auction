'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { ChevronDown } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

type Props = {
  datas: {
    date: string;
    averagePrice: number;
    totalCount: number;
  }[];
};

export const TopLists = ({ datas }: Props) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const length = datas.length;

  datas = isExpanded ? datas : datas.slice(0, 7);

  return (
    <div className='flex flex-col justify-between shrink-0 gap-2'>
      <div className='divide-y text-sm sm:text-base'>
        <div className='flex items-center font-semibold px-2 py-1.5'>
          <p className='text-sm sm:text-base text-muted-foreground tracking-tight w-16'>
            날짜
          </p>
          <p className='w-24'>거래량</p>
          <p>시세</p>
        </div>
        {datas.map((data) => (
          <div key={data.date} className='flex items-center p-2'>
            <p className='text-xs sm:text-sm text-muted-foreground tracking-tight w-16'>
              {format(data.date, 'L/d(iii)', { locale: ko })}
            </p>
            <p className='w-24'>{data.totalCount.toLocaleString('ko-KR')}개</p>
            <p className='flex items-center gap-1.5'>
              {Math.round(Number(data.averagePrice)).toLocaleString('ko-KR')}
              <Image
                src='/meso.png'
                alt='meso image'
                width={20}
                height={20}
                className='size-4 object-contain'
              />
            </p>
          </div>
        ))}
      </div>

      {length > 7 && (
        <Button
          onClick={() => setIsExpanded((prev) => !prev)}
          className='text-xs hover:bg-primary/5 transition-none'
          variant='secondary'
        >
          <span>{isExpanded ? '닫기' : '더보기'}</span>
          <ChevronDown
            className={cn(
              'size-4 ml-0.5',
              isExpanded ? 'rotate-180' : 'rotate-0'
            )}
          />
        </Button>
      )}
    </div>
  );
};
