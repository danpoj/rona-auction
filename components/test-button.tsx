'use client';

import {
  clearAction,
  deleteItemsWithoutTransactions,
  getItemsWithoutTransactions,
  getTransactionsAction,
  query,
  saveItemsAction,
  saveTransactionsAction,
  updateDate,
  updateItemsAction,
} from '@/actions/save-action';
import { Button } from './ui/button';

export const TestButton = () => {
  return <Button onClick={() => getTransactionsAction()}>run!</Button>;
};
