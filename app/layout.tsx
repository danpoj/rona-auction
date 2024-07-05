import { BackgroundPattern } from '@/components/background-pattern';
import { QueryProvider } from '@/components/provider/query-provider';
import { TracingBeam } from '@/components/tracing-beam';
import { cn } from '@/lib/utils';
import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import './globals.css';
import dynamic from 'next/dynamic';
const AdsenseScript = dynamic(
  () => import('@/components/google-adsense/adsense-script'),
  { ssr: false }
);

const inter = Poppins({ subsets: ['latin'], weight: ['400', '600', '900'] });

export const metadata: Metadata = {
  title: '로나월드 옥션',
  description: '로나월드 옥션 거래내역 저장소입니다.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='ko'>
      <AdsenseScript />

      {/* <meta
          name='google-adsense-account'
          content={`ca-pub-${process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_PID}`}
        ></meta> */}

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
