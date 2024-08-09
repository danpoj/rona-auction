'use client';

import Script from 'next/script';
import { useEffect } from 'react';

declare global {
  interface Window {
    wcs_add?: {
      [key: string]: string;
    };
    wcs_do?: () => void;
  }
}

export const NaverAnalytics = () => {
  useEffect(() => {
    if (!window.wcs_add) window.wcs_add = {};
    window.wcs_add['wa'] = process.env.NEXT_PUBLIC_NAVER_KEY as string;
    if (window.wcs) {
      window.wcs_do?.();
    }
  }, []);

  return (
    <Script
      type='text/javascript'
      src='//wcs.naver.net/wcslog.js'
      strategy='afterInteractive'
    />
  );
};
