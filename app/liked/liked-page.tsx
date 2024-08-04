'use client';

import { GoToHome } from '@/components/go-to-home';
import Heart from '@/components/heart';
import { NoImage } from '@/components/no-image';
import { TypewriterEffectSmooth } from '@/components/typewriter-effect';
import { words } from '@/constants';
import Image from 'next/image';
import Link from 'next/link';
import { useLocalStorage } from 'usehooks-ts';

type Item = {
  name: string;
  id: number;
};

export default function LikedPage() {
  const [likedArray] = useLocalStorage<Item[]>('liked', []);

  if (likedArray.length === 0) return NoLikedPlaceHolder();

  return (
    <section className='max-w-[46rem] mx-auto h-full p-4'>
      <div className='flex flex-col  gap-6 pb-10'>
        <h1 className='text-2xl font-semibold flex items-center'>
          <span>즐겨찾기</span>
        </h1>
      </div>

      <div className='flex flex-col pb-40 divide-y'>
        {likedArray.map((item) => (
          <div
            key={item.id}
            className='flex items-center justify-between gap-2'
          >
            <Link
              href={`/item/${item.id}`}
              key={item.id}
              className='p-2 flex justify-between hover:bg-primary/5 w-full'
            >
              <div className='flex items-center gap-2'>
                {item.id >= 666666660 ? (
                  <NoImage />
                ) : (
                  <Image
                    src={`${process.env.NEXT_PUBLIC_API_BASE}/item/${item.id}/icon?resize=2`}
                    alt={item.name}
                    width={50}
                    height={50}
                    className='size-10 object-contain'
                  />
                )}
                <h3>{item.name}</h3>
              </div>
            </Link>

            <Heart item={item} />
          </div>
        ))}

        <div className='pt-10'>
          <GoToHome />
        </div>
      </div>
    </section>
  );
}

const NoLikedPlaceHolder = () => {
  return (
    <div className='flex flex-col gap-10 md:flex-row md:gap-0 items-center justify-center p-4'>
      <div className='space-y-4'>
        <TypewriterEffectSmooth words={words} />
        <h1 className='text-4xl font-bold'>즐겨찾기 목록이 없습니다</h1>
        <p className='text-xl text-muted-foreground'>
          자주 조회하는 아이템을 즐겨찾기 해보세요
        </p>
        <GoToHome />
      </div>
      <Image
        src='https://maplestory.io/api/GMS/62/mob/8180000/render/stand'
        alt='not found image'
        width={600}
        height={600}
        className='max-w-[260px] object-contain'
      />
    </div>
  );
};
