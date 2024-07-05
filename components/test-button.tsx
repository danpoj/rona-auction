'use client';

import {
  clearAction,
  deleteItemsWithoutTransactions,
  getItemsWithoutTransactions,
  query,
  saveItemsAction,
  saveTransactionsAction,
  updateDate,
  updateItemsAction,
} from '@/actions/save-action';
import { Button } from './ui/button';

export const TestButton = () => {
  return <Button onClick={() => deleteItemsWithoutTransactions()}>run!</Button>;
};
