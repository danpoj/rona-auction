'use client';

import DisplayADVertical, {
  DisplayADVertical2,
} from '@/components/google-adsense/adsense-banner';
import { usePathname } from 'next/navigation';
import { Fragment, ReactNode } from 'react';

export const SidebarAdWrapper = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();

  return (
    <>
      <div className='hidden lg:block w-[20rem] shrink-0 sticky bg-black bottom-0'>
        <DisplayADVertical />
      </div>

      {children}
      <div className='hidden lg:block w-[20rem] shrink-0 absolute top-0 -right-[21rem]'>
        <DisplayADVertical />
      </div>
    </>
  );
};
