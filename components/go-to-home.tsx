import { ArrowLeftIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export const GoToHome = () => (
  <Button
    variant='linkHover2'
    Icon={ArrowLeftIcon}
    iconPlacement='left'
    asChild
    className='rounded-full w-fit'
  >
    <Link href='/' className=''>
      <ArrowLeftIcon className='size-4 mr-1' />
      <span>홈으로 이동</span>
    </Link>
  </Button>
);
