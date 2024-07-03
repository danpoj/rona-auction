'use server';

import { ITEMS_PER_PAGE } from '@/constants';
import { db } from '@/db/drizzle';
import { itemTable, transactionTable } from '@/db/schema';
import { desc, eq } from 'drizzle-orm';

export async function fetchTransactions({ pageParam = 0 }) {
  const transactions = await db
    .select()
    .from(transactionTable)
    .orderBy(desc(transactionTable.date))
    .limit(ITEMS_PER_PAGE)
    .offset(pageParam * ITEMS_PER_PAGE);

  return transactions;
}
