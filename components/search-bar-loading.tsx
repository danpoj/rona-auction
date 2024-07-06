import { Skeleton } from '@/components/ui/skeleton';

export const SearchBarLoading = () => {
  return (
    <div className='px-4 pb-8'>
      <div className='max-w-[24rem] relative'>
        <Skeleton className='h-14 w-full rounded-full pl-11' />
      </div>
    </div>
  );
};
