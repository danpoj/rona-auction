import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ArrowLeftIcon, HelpCircle, Settings } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function Page() {
  return (
    <div className='max-w-[52rem] mx-auto h-full p-4'>
      <div className='flex gap-4 pt-[5.8rem] pb-10'>
        <Button
          variant='expandIcon'
          Icon={ArrowLeftIcon}
          iconPlacement='left'
          asChild
          className='rounded-full w-fit'
        >
          <Link href='/'>홈으로 이동</Link>
        </Button>

        <Popover>
          <PopoverTrigger>
            <Settings className='size-8 stroke-primary/60 hover:stroke-primary/70 hover:animate-spin' />
          </PopoverTrigger>
          <PopoverContent className='text-sm text-muted-foreground'>
            ⚙️ 작업중... <br />
            <br />
            1. 장비 아이템 옵션 별 필터링 <br />
            2. 날짜별 가격, 거래량 - chart <br />
            3. 즐겨찾기 <br />
          </PopoverContent>
        </Popover>
      </div>

      <article className='prose dark:prose-invert'>
        <h1>7/5(금) 업데이트</h1>
        <ul>
          <li>7/4(목) 거래내역 추가</li>
          <li>옥션 거래내역에 있는 아이템들만 검색되도록 수정</li>
          <li>검색속도 개선</li>
          <li>검색내용과 매칭되는 모든 아이템이 보여지도록 수정</li>
          <li>모바일 브라우저 사용성 개선</li>
          <li>다크모드 추가 (홈페이지 우측상단)</li>
          <li>아이템 상세페이지 로딩속도 개선</li>
          <li>
            <span>og image 추가</span>
            <Image
              src='/og.png'
              alt='og image'
              width={400}
              height={200}
              className='w-full rounded-xl max-w-[400px]'
            />
          </li>
        </ul>
      </article>
    </div>
  );
}
