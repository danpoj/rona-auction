import { cn } from '@/lib/utils';
import { Guitar, Hammer } from 'lucide-react';

export const NoImage = ({ className }: { className?: string }) => {
  return (
    <div
      className={cn(
        'size-8 sm:size-10 rounded-full bg-blue-100 border-blue-500 border flex items-center justify-center',
        className
      )}
    >
      <Guitar className='size-5 stroke-primary/80' />
    </div>
  );
};
