'use client';

import { useLocalStorage } from 'usehooks-ts';

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

  return (
    <div
      onClick={(e) => {
        if (likedIndex !== -1) {
          setLikedArray((prev) => [
            ...prev.slice(0, likedIndex),
            ...prev.slice(likedIndex + 1),
          ]);
        } else {
          setLikedArray((prev) => [item, ...prev]);
        }

        e.stopPropagation();
      }}
      className='flex items-center w-10 h-10 cursor-pointer bg-primary/10 hue-rotate-[240deg] rounded-full'
    >
      <div className='bg-[rgba(255,192,200,0)] border-[50%] w-full h-full flex items-center justify-center transition-all duration-100 scale-[70%] '>
        <div
          className={`h-[100px] w-[100px] bg-[url("/heart.png")] pointer-events-none bg-left absolute ${
            likedIndex !== -1 && 'animate-like-anime'
          }`}
        ></div>
      </div>
    </div>
  );
};

export default Heart;
