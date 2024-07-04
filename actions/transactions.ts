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

export async function fetchTransactionsPerItem({
  pageParam = 0,
  id,
}: {
  pageParam: number;
  id: number;
}) {
  const transactions = await db
    .select({
      date: transactionTable.date,
      price: transactionTable.price,
      count: transactionTable.count,
      id: transactionTable.id,
      additional: transactionTable.additional,
    })
    .from(transactionTable)
    .orderBy(desc(transactionTable.date))
    .limit(ITEMS_PER_PAGE)
    .offset(pageParam * ITEMS_PER_PAGE)
    .where(eq(transactionTable.itemId, id));

  return transactions;
}
