import { Loader } from 'lucide-react';

export default function Loading() {
  return (
    <header className='px-4 py-10 space-y-6 flex items-center justify-center h-80'>
      <Loader className='animate-spin w-5 h-5' />
    </header>
  );
}
