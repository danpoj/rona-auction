import { GoToHome } from '@/components/go-to-home';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Settings } from 'lucide-react';
import Image from 'next/image';

export default function Page() {
  return (
    <section className='max-w-[52rem] mx-auto h-full p-4'>
      <div className='flex gap-4 pt-[5.8rem] pb-10'>
        <GoToHome />

        <Popover>
          <PopoverTrigger>
            <Settings className='size-7 stroke-primary/60 hover:stroke-primary/70 hover:animate-spin' />
          </PopoverTrigger>
          <PopoverContent className='text-sm text-muted-foreground'>
            ⚙️ 작업중... <br />
            <br />
            1. 장비 아이템 옵션 별 필터링 ✅ <br />
            2. 날짜별 가격, 거래량 - chart ✅ <br /> 3. 즐겨찾기 ✅ <br />
          </PopoverContent>
        </Popover>
      </div>

      <div className='space-y-20'>
        <article className='prose dark:prose-invert'>
          <h3>7/24(수)</h3>
          <ul>
            <li>모바일에서도 거래날짜 보이게 수정</li>
          </ul>
        </article>

        <article className='prose dark:prose-invert'>
          <h3>7/18(월)</h3>
          <ul>
            <li>모든아이템 날짜 / 가격 정렬 추가</li>
            <li>옵션 정렬 망가지던 이슈 수정</li>
          </ul>
        </article>

        <article className='prose dark:prose-invert'>
          <h3>7/15(월)</h3>
          <ul>
            <li>장비아이템 날짜 / 가격 정렬 추가</li>
            <li>장비아이템 옵션 정렬</li>
          </ul>
        </article>

        <article className='prose dark:prose-invert'>
          <h3>7/11(일)</h3>
          <ul>
            <li>장비아이템 보기 옵션 (리스트, 그리드) 추가</li>
            <li>검색바 유지</li>
          </ul>
        </article>

        <article className='prose dark:prose-invert'>
          <h3>7/9(화)</h3>
          <ul>
            <li>인기매물 날짜별로 변경</li>
            <li>경험치 계산기 추가</li>
          </ul>
        </article>

        <article className='prose dark:prose-invert'>
          <h3>7/7(일)</h3>
          <ul>
            <li>장비아이템 보기 옵션 (리스트, 그리드) 추가</li>
            <li>검색바 유지</li>
          </ul>
        </article>

        <article className='prose dark:prose-invert'>
          <h3>7/6(토)</h3>
          <ul>
            <li className='font-black bg-gradient-to-r from-blue-600 via-teal-300 to-teal-400 bg-clip-text text-transparent'>
              장비아이템 옵션검색 ✨
            </li>
            <li>즐겨찾기</li>
            <li>
              아이템 페이지로 넘어가지않는 일부 아이템들 수정
              <pre>
                {`
- 뱃지 공격력 주문서 30%
- 투구 민첩성 주문서 60%
- 하의 민첩성 주문서 10%
- 하의 민첩성 주문서 60%
- 백의 주문서 1%
- 글로벌 포션
- ...`.trim()}
              </pre>
            </li>
          </ul>
        </article>

        <article className='prose dark:prose-invert'>
          <h3>7/5(금)</h3>
          <ul>
            <li>옥션 거래내역에 있는 아이템들만 검색되도록 수정</li>
            <li>검색속도 개선</li>
            <li>검색내용과 매칭되는 모든 아이템이 보여지도록 수정</li>
            <li>모바일 브라우저 사용성 개선</li>
            <li>다크모드 추가 (홈페이지 우측상단)</li>
            <li>아이템 상세페이지 로딩속도 개선</li>
            <li>날짜별 가격, 거래량 + 차트 추가</li>
            <li>
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
    </section>
  );
}
