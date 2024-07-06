import { GoToHome } from '@/components/go-to-home';
import { TypewriterEffectSmooth } from '@/components/typewriter-effect';
import { words } from '@/constants';
import Image from 'next/image';

export default function NotFound() {
  return (
    <div className='flex flex-col gap-10 md:flex-row md:gap-0 items-center justify-center pt-20'>
      <div className='space-y-4'>
        <TypewriterEffectSmooth words={words} />
        <h1 className='text-4xl font-bold'>페이지를 찾을 수 없습니다</h1>
        <p className='text-xl text-muted-foreground'>404 Not Found</p>
        <GoToHome />
      </div>
      <Image
        src='https://maplestory.io/api/KMS/389/mob/2600622/render/stand'
        alt='not found image'
        width={400}
        height={400}
        className='size-[320px] object-contain'
      />
    </div>
  );
}
