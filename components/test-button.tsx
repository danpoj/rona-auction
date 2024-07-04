'use client';

import {
  clearAction,
  query,
  saveItemsAction,
  saveTransactionsAction,
  updateDate,
} from '@/actions/save-action';
import { Button } from './ui/button';

export const TestButton = () => {
  return <Button onClick={() => query()}>run!</Button>;
};
