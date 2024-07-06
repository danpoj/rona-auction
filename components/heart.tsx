'use client';

import { useLocalStorage } from 'usehooks-ts';
import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MouseEvent } from 'react';

type Item = {
  name: string;
  id: number;
};

const Heart = ({ item }: { item: Item }) => {
  const [likedArray, setLikedArray] = useLocalStorage<Item[]>('liked', [], {
    initializeWithValue: false,
  });

  const likedIndex = likedArray.findIndex(
    (localStorageItem) => localStorageItem.id === item.id
  );

  const onClick: (
    e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
  ) => any = (e) => {
    if (likedIndex !== -1) {
      setLikedArray((prev) => [
        ...prev.slice(0, likedIndex),
        ...prev.slice(likedIndex + 1),
      ]);
    } else {
      setLikedArray((prev) => [item, ...prev]);
    }

    e.stopPropagation();
  };

  return (
    <Button variant='ghost' className='size-9 p-0' onClick={onClick}>
      <Star
        className={cn(
          'w-5 h-5',
          likedIndex !== -1
            ? 'stroke-yellow-400 fill-yellow-400'
            : 'stroke-primary/60'
        )}
      />
    </Button>
  );
};

export default Heart;