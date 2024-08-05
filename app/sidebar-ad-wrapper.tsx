'use client';

import DisplayADVertical, {
  DisplayADVertical2,
} from '@/components/google-adsense/adsense-banner';
import { usePathname } from 'next/navigation';
import { Fragment, ReactNode } from 'react';

export const SidebarAdWrapper = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();

  return (
    <Fragment>
      <div className='hidden xl:block w-[18rem] shrink-0 absolute top-0 -left-[19rem]'>
        <DisplayADVertical key={pathname} />
      </div>
      {children}
      <div className='hidden xl:block w-[18rem] shrink-0 absolute top-0 -right-[19rem]'>
        <DisplayADVertical key={pathname} />
      </div>
    </Fragment>
  );
};
