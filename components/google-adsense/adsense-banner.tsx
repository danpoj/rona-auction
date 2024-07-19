'use client';

import { useEffect } from 'react';

declare global {
  interface Window {
    adsbygoogle: any;
  }
}

type Props = {
  dataAdSlot: string;
  dataAdFormat: string;
  dataFullWidthResponsive: boolean;
};

export const AdsenseBanner = ({
  dataAdSlot,
  dataAdFormat,
  dataFullWidthResponsive,
}: Props) => {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (error) {
      console.log((error as Error).message);
    }
  }, []);

  return (
    <ins
      className='adsbygoole'
      style={{ display: 'block' }}
      data-ad-client={`ca-pub-${process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_PID}`}
      data-ad-slot={dataAdSlot}
      data-ad-format={dataAdFormat}
      data-full-width-responsive={dataFullWidthResponsive.toString()}
    />
  );
};

export const BannerExample = () => {
  // copy paste dataAdSlot
  return (
    <AdsenseBanner
      dataAdFormat='auto'
      dataFullWidthResponsive={true}
      dataAdSlot=''
    />
  );
};

export const DisplayAD = ({ adId }: { adId: string }) => {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (error) {
      console.log((error as Error).message);
    }
  }, []);

  return (
    <div className='aspect-[16/8]' style={{ width: '100%' }}>
      <ins
        key={adId}
        id={adId}
        className='adsbygoogle'
        style={{ display: 'block', width: '100%', height: '100%' }}
        data-ad-client={`ca-pub-${process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_PID}`}
        data-ad-slot='6874118547'
        data-ad-format='auto'
        data-full-width-responsive='true'
      />
    </div>
  );
};

export const MultiFlexAD = ({ adId }: { adId: string }) => {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (error) {
      console.log((error as Error).message);
    }
  }, []);

  return (
    <div className='w-full aspect-video bg-black'>
      <ins
        key={adId}
        className='adsbygoogle w-full h-full'
        style={{ display: 'block' }}
        data-ad-client={`ca-pub-${process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_PID}`}
        data-ad-slot='3465340664'
        data-ad-format='autorelaxed'
        data-full-width-responsive='true'
      />
    </div>
  );
};
