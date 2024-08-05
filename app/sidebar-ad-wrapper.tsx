'use client';

import DisplayADVertical, {
  DisplayADVertical2,
} from '@/components/google-adsense/adsense-banner';
import { usePathname } from 'next/navigation';
import { Fragment, ReactNode } from 'react';

export const SidebarAdWrapper = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();

  return (
    <Fragment key={pathname}>
      <div className='hidden xl:flex w-[16rem] shrink-0 absolute top-0 -left-[18rem] flex-col justify-center'>
        <DisplayADVertical height='500px' />
      </div>
      {children}
      <div className='hidden xl:flex w-[16rem] shrink-0 absolute top-0 -right-[18rem] flex-col items-center justify-center'>
        <DisplayADVertical />
      </div>
    </Fragment>
  );
};
