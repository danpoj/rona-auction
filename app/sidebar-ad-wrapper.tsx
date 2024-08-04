'use client';

import DisplayADVertical from '@/components/google-adsense/adsense-banner';
import { usePathname, useRouter } from 'next/navigation';
import { ReactNode } from 'react';

export const SidebarAdWrapper = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();

  console.log(pathname);

  return (
    <>
      <div
        key={pathname}
        className='hidden lg:block min-h-[19rem] w-[19rem] shrink-0 absolute top-0 -left-[21rem]'
      >
        <DisplayADVertical key={pathname} />
      </div>
      {children}
      <div
        key={pathname}
        className='hidden lg:block min-h-[19rem] w-[19rem] shrink-0 absolute top-0 -right-[21rem]'
      >
        <DisplayADVertical key={pathname} />
      </div>
    </>
  );
};
