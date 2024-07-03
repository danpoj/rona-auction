import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeftIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function Loading() {
  return (
    <div className='max-w-[62rem] mx-auto h-full p-4'>
      <div className='flex items-center gap-4 justify-center'>
        <Image
          src='https://maplestory.io/api/KMS/389/mob/8140555/render/stand'
          alt='로나월드 옥션'
          width={240}
          height={240}
          className='size-32 object-contain'
        />
        <div className='flex flex-col gap-2'>
          <h1 className='font-black text-2xl'>로나월드 옥션</h1>
          <Button
            variant='expandIcon'
            Icon={ArrowLeftIcon}
            iconPlacement='left'
            asChild
            className='rounded-full'
          >
            <Link href='/'>홈으로 이동</Link>
          </Button>
        </div>
      </div>

      <div className='flex flex-col gap-2 my-4 px-2'>
        <p className='text-2xl font-semibold flex items-center'>
          <span>거래량 순위 TOP 100</span>
        </p>
      </div>

      <div className='flex flex-col divide-y gap-3 pb-40'>
        {new Array(40).fill(0).map((_, i) => (
          <Skeleton key={i} className='h-16 w-full' />
        ))}

        <div className='pt-10'>
          <Button
            variant='expandIcon'
            Icon={ArrowLeftIcon}
            iconPlacement='left'
            asChild
            className='rounded-full'
          >
            <Link href='/'>홈으로 이동</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
