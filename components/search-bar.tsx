'use client';

import { Input } from '@/components/ui/input';
import { itemTable } from '@/db/schema';
import { InferSelectModel } from 'drizzle-orm';
import { Search } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useRef, useState } from 'react';
import { useDebounceValue, useOnClickOutside } from 'usehooks-ts';
import { NoImage } from './no-image';
import {
  DisplayAD,
  DisplayADFlexRowSmall,
} from './google-adsense/adsense-banner';

type Props = {
  items: InferSelectModel<typeof itemTable>[];
};

export const SearchBar = ({ items }: Props) => {
  const [value, setValue] = useState('');
  const [debouncedValue] = useDebounceValue(value, 100);
  const [show, setShow] = useState(false);
  const ref = useRef<HTMLDivElement>(null!);

  const matchedLists = useMemo(() => {
    if (debouncedValue.trim() === '') return [];

    return items.filter((item) =>
      item.trimmedName.includes(debouncedValue.replace(/\s+/g, ''))
    );
  }, [debouncedValue, items]);

  useOnClickOutside(ref, () => show && setShow(false));

  return (
    <div className='px-4 pb-6 space-y-8'>
      {/* <iframe
        src='https://ads-partners.coupang.com/widgets.html?id=807035&template=carousel&trackingCode=AF0905237&subId=&width=680&height=140&tsource='
        referrerPolicy='unsafe-url'
        className='w-full'
      /> */}

      <div ref={ref} className='max-w-[24rem] relative'>
        <Input
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !show) setShow(true);
            else if (e.key === 'Escape') setShow(false);
          }}
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            if (!show) setShow(true);
          }}
          placeholder='아이템 검색...'
          className='h-14 border-primary/50 w-full rounded-full pl-11 font-semibold'
        />
        <Search className='absolute left-4 size-5 stroke-primary/70 top-1/2 -translate-y-1/2' />

        {matchedLists && matchedLists.length !== 0 && show && (
          <div className='absolute border border-primary/30 bg-background z-10 rounded-xl flex flex-col divide-y divide-primary/30 w-full top-[4.4rem] max-h-[24rem] overflow-y-scroll'>
            {matchedLists.map((item) => (
              <Link
                href={`/item/${item.id}`}
                key={item.id}
                className='flex gap-2 items-center p-3 hover:bg-primary/5'
              >
                {item.id >= 666666660 ? (
                  <NoImage className='size-7 sm:size-7 rounded-xl sm:rounded-xl' />
                ) : (
                  <Image
                    priority
                    src={`${process.env.NEXT_PUBLIC_API_BASE}/item/${item.id}/icon?resize=2`}
                    alt={item.name}
                    width={40}
                    height={40}
                    className='size-7 object-contain'
                  />
                )}
                <p className='text-sm font-semibold text-primary/80'>
                  {item.name}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
