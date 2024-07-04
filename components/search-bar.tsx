'use client';

import { fetchItems } from '@/actions/items';
import { Input } from '@/components/ui/input';
import { useQuery } from '@tanstack/react-query';
import { Search } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRef, useState } from 'react';
import { useDebounceValue } from 'usehooks-ts';
import { NoImage } from './no-image';

export const SearchBar = () => {
  const [value, setValue] = useState('');
  const [show, setShow] = useState(false);
  const [debouncedValue] = useDebounceValue(value, 100);
  const inputRef = useRef<HTMLInputElement>(null!);

  const { data: items } = useQuery({
    enabled: !!debouncedValue.trim(),
    queryKey: ['itemName', debouncedValue.replace(/\s+/g, '')],
    queryFn: () => fetchItems(debouncedValue.replace(/\s+/g, '')),
  });

  return (
    <div className='px-4 pb-8'>
      <div className='max-w-[24rem] relative'>
        <Input
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !show) setShow(true);
            else if (e.key === 'Escape') setShow(false);
          }}
          onBlur={() => setShow(false)}
          ref={inputRef}
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            if (!show) setShow(true);
          }}
          placeholder='아이템 검색...'
          className='h-14 border-primary/50 w-full rounded-full pl-11 font-semibold'
        />
        <Search className='absolute left-4 size-5 stroke-primary/70 top-1/2 -translate-y-1/2' />

        {items && items.length !== 0 && show && (
          <div className='absolute border border-primary/30 bg-background z-10 rounded-xl flex flex-col divide-y divide-primary/30 w-full top-[4.4rem] max-h-[24rem] overflow-y-scroll'>
            {items.map((item) => (
              <Link
                href={`/item/${item.id}`}
                key={item.id}
                className='flex gap-2 items-center p-3 hover:bg-primary/5'
              >
                {item.id >= 666666660 ? (
                  <NoImage className='size-7 sm:size-7' />
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
