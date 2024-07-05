import dynamic from 'next/dynamic';

const LikedPage = dynamic(() => import('./liked-page'), { ssr: false });

export default function Page() {
  return <LikedPage />;
}
