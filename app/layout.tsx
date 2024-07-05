import { BackgroundPattern } from '@/components/background-pattern';
import AdsenseScript from '@/components/google-adsense/adsense-script';
import { QueryProvider } from '@/components/provider/query-provider';
import { TracingBeam } from '@/components/tracing-beam';
import { siteConfig } from '@/config';
import { cn } from '@/lib/utils';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
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
  manifest: `${siteConfig.url}/site.webmanifest`,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='ko'>
      <AdsenseScript />
      <meta
        name='google-adsense-account'
        content={`ca-pub-${process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_PID}`}
      />

      <body className={cn(inter.className, 'overscroll-none')}>
        <BackgroundPattern />
        <QueryProvider>
          <main className='h-full max-h-full'>
            <TracingBeam>{children}</TracingBeam>
          </main>
        </QueryProvider>
      </body>
    </html>
  );
}
