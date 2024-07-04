'use client';

import {
  clearAction,
  query,
  saveItemsAction,
  saveTransactionsAction,
  updateDate,
  updateItemsAction,
} from '@/actions/save-action';
import { Button } from './ui/button';

export const TestButton = () => {
  return <Button onClick={() => updateItemsAction()}>run!</Button>;
};
