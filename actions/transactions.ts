'use server';

import { ITEMS_PER_PAGE } from '@/constants';
import { db } from '@/db/drizzle';
import { itemTable, transactionTable } from '@/db/schema';
import { asc, desc, eq, sql } from 'drizzle-orm';

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
  sortType,
}: {
  pageParam: number;
  id: number;
  sortType: 'timeASC' | 'timeDESC' | 'priceASC' | 'priceDESC';
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
    .orderBy(
      sortType === 'timeDESC'
        ? desc(transactionTable.date)
        : sortType === 'timeASC'
        ? asc(transactionTable.date)
        : sortType === 'priceASC'
        ? asc(
            sql`CAST(${transactionTable.price} AS DECIMAL) / ${transactionTable.count}`
          )
        : desc(
            sql`CAST(${transactionTable.price} AS DECIMAL) / ${transactionTable.count}`
          )
    )
    .limit(ITEMS_PER_PAGE)
    .offset(pageParam * ITEMS_PER_PAGE)
    .where(eq(transactionTable.itemId, id));

  return transactions;
}
