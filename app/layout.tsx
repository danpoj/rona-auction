import { BackgroundPattern } from '@/components/background-pattern';
import AdsenseScript from '@/components/google-adsense/adsense-script';
import { QueryProvider } from '@/components/provider/query-provider';
import { ThemeProvider } from '@/components/provider/theme-provider';
import { TracingBeam } from '@/components/tracing-beam';
import { Toaster } from '@/components/ui/sonner';
import { siteConfig } from '@/config';
import { cn } from '@/lib/utils';
import { GoogleAnalytics } from '@next/third-parties/google';
import type { Metadata, Viewport } from 'next';
import { Gothic_A1 } from 'next/font/google';
import './globals.css';
import DisplayADVertical from '@/components/google-adsense/adsense-banner';

const gothic_A1 = Gothic_A1({
  subsets: ['latin'],
  weight: ['500', '700'],
});

export const metadata: Metadata = {
  applicationName: '로나오프',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: '로나오프',
  },
  formatDetection: {
    telephone: false,
  },

  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  metadataBase: new URL(siteConfig.url),
  description: siteConfig.description,
  keywords: ['로나월드', '거래내역', '옥션', '메이플월드'],
  authors: [
    {
      name: 'danpoj',
      url: 'https://ronaoff.com',
    },
  ],
  creator: 'danpoj',
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: '@danpoj',
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
};

export const viewport: Viewport = {
  themeColor: '#FFFFFF',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='ko' suppressHydrationWarning>
      <AdsenseScript />
      <meta
        name='google-adsense-account'
        content={`ca-pub-${process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_PID}`}
      />

      <body className={cn(gothic_A1.className, 'overscroll-none')}>
        <ThemeProvider
          attribute='class'
          defaultTheme='system'
          enableSystem
          disableTransitionOnChange
        >
          <BackgroundPattern />
          <QueryProvider>
            <main className='h-full max-h-full dark:text-primary/80'>
              <TracingBeam>
                <div className='hidden xl:block min-h-full w-[22rem] shrink-0 absolute top-0 -left-[22rem]'>
                  <DisplayADVertical />
                </div>
                {children}
                <div className='hidden xl:block min-h-full w-[22rem] shrink-0 absolute top-0 -right-[22rem]'>
                  <DisplayADVertical />
                </div>
              </TracingBeam>
            </main>
          </QueryProvider>
        </ThemeProvider>
        <Toaster position='top-right' />
      </body>
      <GoogleAnalytics gaId={process.env.GOOGLE_ANALYTICS_GAID!} />
    </html>
  );
}
