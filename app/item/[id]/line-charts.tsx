'use client';

import { LineChart } from '@tremor/react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

type Props = {
  datas: { date: string; averagePrice: number | string; totalCount: number }[];
};

export const LineCharts = ({ datas }: Props) => {
  const countData = datas.map((data) => ({
    date: format(data.date, 'LL/dd', { locale: ko }),
    거래량: Number(data.totalCount),
  }));

  const priceData = datas.map((data) => ({
    date: format(data.date, 'LL/dd', { locale: ko }),
    시세: Math.round(Number(data.averagePrice)),
  }));

  return (
    <div className='flex flex-col sm:flex-row sm:divide-x'>
      <LineChart
        className='mt-4 h-60 w-full'
        data={priceData}
        index='date'
        categories={['시세']}
        colors={['blue']}
        showYAxis={false}
        valueFormatter={(value) => `${value.toLocaleString('ko-KR')} 메소`}
      />

      <LineChart
        className='mt-4 h-60'
        data={countData}
        index='date'
        categories={['거래량']}
        colors={['violet']}
        showYAxis={false}
        valueFormatter={(value) => `${value.toLocaleString('ko-KR')} 개`}
      />
    </div>
  );
};
