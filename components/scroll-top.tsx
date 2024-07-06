'use client';

import { ArrowUp } from 'lucide-react';
import { Button } from './ui/button';

export const ScrollTop = () => {
  return (
    <Button
      variant='secondary'
      className='w-fit size-10 p-0 self-end mx-4'
      onClick={() => {
        globalThis.scrollTo({
          left: 0,
          top: 0,
        });
      }}
    >
      <ArrowUp className='stroke-[3px] stroke-primary/40 hover:stroke-primary' />
    </Button>
  );
};
