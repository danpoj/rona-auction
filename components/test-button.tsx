'use client';

import { clearAction, saveTransactionsAction } from '@/actions/save-action';
import { Button } from './ui/button';

export const TestButton = () => {
  return <Button onClick={() => saveTransactionsAction()}>run!</Button>;
};
