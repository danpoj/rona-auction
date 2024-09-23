import { Button } from '@/components/ui/button';
import { AreaChart, LineChart } from '@tremor/react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { ArrowRightIcon } from 'lucide-react';
import Link from 'next/link';

type Props = {
  transactionsCountPerDay: { date: string; count: number }[];
};

export const TransactionsLineChart = ({ transactionsCountPerDay }: Props) => {
  const trans = transactionsCountPerDay.map((t) => ({
    date: format(t.date, 'L.d', { locale: ko }),
    거래량: t.count,
  }));

  return (
    <div>
      <div className='flex justify-between'>
        <div>
          <h3 className='text-tremor-default text-tremor-content dark:text-dark-tremor-content'>
            옥션 총 거래량
          </h3>
          <p className='text-tremor-metric text-tremor-content-strong dark:text-dark-tremor-content-strong font-semibold'>
            {trans
              .reduce((acc, cur) => acc + cur.거래량, 0)
              .toLocaleString('ko-KR')}
            건
          </p>
        </div>
        <Button
          size='sm'
          className='rounded-full w-fit text-xs font-semibold px-4 h-8'
          variant='shine'
          Icon={ArrowRightIcon}
          iconPlacement='right'
          asChild
        >
          <Link href='/top'>거래량 순</Link>
        </Button>
      </div>
      <AreaChart
        className='mt-4 h-60 w-full'
        data={trans}
        index='date'
        categories={['거래량']}
        colors={['blue']}
        showYAxis={false}
        valueFormatter={(value) => `${value.toLocaleString('ko-KR')}건`}
        showAnimation
        animationDuration={700}
      />
    </div>
  );
};
