'use client';

import { useRouter } from 'next/router';
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
    ></ins>
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

const GoogleAdPcItem = ({ adId }: { adId: string }) => {
  const router = useRouter();
  const adsLoaded = useRef<any>(false);

  useEffect(() => {
    const loadAd = () => {
      if (typeof window !== 'undefined' && window.adsbygoogle) {
        window.adsbygoogle = window.adsbygoogle || [];
        window.adsbygoogle.push({});
        adsLoaded.current = true;
      }
    };

    if (router.query && !adsLoaded.current) {
      setTimeout(loadAd, 0);
    }
  }, [router.query]);

  return (
    <div
      className='googleAd-container flex items-center justify-center border rounded-md'
      style={{ maxWidth: '282px', maxHeight: '282px' }}
    >
      <ins
        key={adId}
        ref={adsLoaded}
        id={adId}
        className='adsbygoogle h-full'
        style={{ display: 'inline-block', width: '282px', height: '282px' }}
        data-ad-client='ca-pub-1111111'
        data-full-width-responsive='true'
        data-ad-slot='11111111'
      />
    </div>
  );
};

export default GoogleAdPcItem;
