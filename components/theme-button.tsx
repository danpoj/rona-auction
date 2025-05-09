'use client';

import { ComputerIcon, Moon, MoonIcon, Sun, SunIcon } from 'lucide-react';
import { useTheme } from 'next-themes';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function ThemeButton() {
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='outline'
          size='icon'
          className='border-primary/10 rounded-lg dark:bg-slate-800 dark:ring-2 dark:ring-primary/40 dark:ring-offset-2'
        >
          <Sun className='h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 ' />
          <Moon className='absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 dark:stroke-white' />
          <span className='sr-only'>Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuItem
          className='font-light'
          onClick={() => setTheme('light')}
        >
          <SunIcon className='size-4 mr-1' /> Light
        </DropdownMenuItem>
        <DropdownMenuItem
          className='font-light'
          onClick={() => setTheme('dark')}
        >
          <MoonIcon className='size-4 mr-1' /> Dark
        </DropdownMenuItem>
        <DropdownMenuItem
          className='font-light'
          onClick={() => setTheme('system')}
        >
          <ComputerIcon className='size-4 mr-1' /> System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
