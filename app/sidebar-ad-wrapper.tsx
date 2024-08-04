'use client';

import DisplayADVertical from '@/components/google-adsense/adsense-banner';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

export const SidebarAdWrapper = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();

  return (
    <>
      <div className='hidden xl:block min-h-[800px] w-[16rem] shrink-0 absolute top-0 -left-[18rem]'>
        <DisplayADVertical key={pathname} />
      </div>
      {children}
      <div className='hidden xl:block min-h-[800px] w-[16rem] shrink-0 absolute top-0 -right-[18rem]'>
        <DisplayADVertical key={pathname} />
      </div>
    </>
  );
};
