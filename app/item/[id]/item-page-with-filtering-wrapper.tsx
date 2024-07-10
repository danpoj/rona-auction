import { db } from '@/db/drizzle';
import { itemTable, transactionTable } from '@/db/schema';
import { InferSelectModel, and, desc, eq, gte, sql } from 'drizzle-orm';
import { ItemPageWithFiltering } from './item-page.with-filtering';

type Props = {
  id: number;
  item: InferSelectModel<typeof itemTable>;
};

export const ItemPageWithFilteringWrapper = async ({ id, item }: Props) => {
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
    .where(
      and(
        eq(transactionTable.itemId, id),
        gte(
          sql`${transactionTable.date} AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Seoul'`,
          sql`DATE(NOW() AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Seoul' - INTERVAL '30 days')`
        )
      )
    );

  const addiOptions: Record<string, number[]> = {};

  const transactionsWithTransformedAddis = transactions.map((t) => ({
    ...t,
    additional: t.additional
      .split(',')
      .map((addi) => addi.split(':'))
      .reduce((acc: Record<string, number>, [key, value]) => {
        if (!addiOptions[key.trim()]) {
          addiOptions[key.trim()] = [Number(value)];
        } else {
          if (!addiOptions[key.trim()].includes(Number(value))) {
            addiOptions[key.trim()].push(Number(value));
          }
        }

        acc[key.trim()] = Number(value);
        return acc;
      }, {}),
  }));

  return (
    <ItemPageWithFiltering
      id={id}
      item={item}
      transactions={transactionsWithTransformedAddis}
      addiOptions={addiOptions}
    />
  );
};
