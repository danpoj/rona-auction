import { cn } from '@/lib/utils';

export const NoImage = ({ className }: { className?: string }) => {
  return (
    <div
      className={cn(
        'size-8 sm:size-10 rounded-2xl bg-gradient-to-tr from-blue-500 to-violet-200 dark:from-blue-600 dark:to-violet-300  border-2 border-background',
        className
      )}
    ></div>
  );
};
