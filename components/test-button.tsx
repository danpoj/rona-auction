'use client';

import {
  clearAction,
  deleteItemsWithoutTransactions,
  deleteTransactions,
  getItemsWithoutTransactions,
  getTransactionsAction,
  getTransactionsWithoutItemId,
  getTransWithoutItemId,
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
