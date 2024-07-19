'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';

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

const DisplayAD = ({ adId }: { adId: string }) => {
  const adsLoaded = useRef<any>(false);

  useEffect(() => {
    const loadAd = () => {
      if (typeof window !== 'undefined' && window.adsbygoogle) {
        window.adsbygoogle = window.adsbygoogle || [];
        window.adsbygoogle.push({});
        adsLoaded.current = true;
      }
    };

    if (adId && !adsLoaded.current) {
      setTimeout(loadAd, 0);
    }
  }, [adId]);

  return (
    <div className='rounded-md bg-black h-full w-[300px] shrink-0'>
      <ins
        key={adId}
        ref={adsLoaded}
        id={adId}
        className='adsbygoogle w-full h-full'
        style={{ display: 'block' }}
        data-ad-client={`ca-pub-${process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_PID}`}
        data-ad-slot='6874118547'
        data-ad-format='auto'
        data-full-width-responsive='true'
      />
    </div>
  );
};

const MultiFlexAD = ({ adId }: { adId: string }) => {
  const adsLoaded = useRef<any>(false);

  useEffect(() => {
    const loadAd = () => {
      if (typeof window !== 'undefined' && window.adsbygoogle) {
        window.adsbygoogle = window.adsbygoogle || [];
        window.adsbygoogle.push({});
        adsLoaded.current = true;
      }
    };

    if (adId && !adsLoaded.current) {
      setTimeout(loadAd, 0);
    }
  }, [adId]);

  return (
    <div className='rounded-lg h-52 w-full'>
      <ins
        key={adId}
        ref={adsLoaded}
        id={adId}
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

export const GoogleDisplayAD = () => {
  const pathname = usePathname();

  return <DisplayAD key={pathname} adId={pathname} />;
};

export const GoogleMultiflexAD = () => {
  const pathname = usePathname();

  return <MultiFlexAD key={pathname} adId={pathname} />;
};
