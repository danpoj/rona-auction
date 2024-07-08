'use client';

import {
  clearAction,
  delete7_7_transactions,
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
  return <Button onClick={() => saveTransactionsAction()}>run!</Button>;
};
