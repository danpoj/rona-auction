import Script from 'next/script';

const AdsenseScript = () => {
  return (
    <Script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-${process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_PID}`}
      crossOrigin='anonymous'
      strategy='afterInteractive'
    />
  );
};

export default AdsenseScript;
