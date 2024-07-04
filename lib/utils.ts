import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const delay = async (ms: number) => {
  return new Promise((r) => setTimeout(r, ms));
};
