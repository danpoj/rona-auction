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
          sql`DATE(NOW() AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Seoul' - INTERVAL '60 days')`
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
      transactions={transactionsWithTransformedAddis.map((t) => {
        const temp = { ...t };
        temp.additional = {
          ...('업그레이드 가능 횟수' in temp.additional && {
            '업그레이드 가능 횟수': temp.additional['업그레이드 가능 횟수'],
          }),
          ...('공격력' in temp.additional && {
            공격력: temp.additional['공격력'],
          }),
          ...('마력' in temp.additional && { 마력: temp.additional['마력'] }),

          ...('MP' in temp.additional && { MP: temp.additional['MP'] }),
          ...('HP' in temp.additional && { HP: temp.additional['HP'] }),
          ...('STR' in temp.additional && { STR: temp.additional['STR'] }),
          ...('DEX' in temp.additional && { DEX: temp.additional['DEX'] }),
          ...('INT' in temp.additional && { INT: temp.additional['INT'] }),
          ...('LUK' in temp.additional && { LUK: temp.additional['LUK'] }),
          ...('명중률' in temp.additional && {
            명중률: temp.additional['명중률'],
          }),
          ...('회피율' in temp.additional && {
            회피율: temp.additional['회피율'],
          }),
          ...('이동속도' in temp.additional && {
            이동속도: temp.additional['이동속도'],
          }),
          ...('점프력' in temp.additional && {
            점프력: temp.additional['점프력'],
          }),
          ...('마법방어력' in temp.additional && {
            마법방어력: temp.additional['마법방어력'],
          }),

          ...('물리방어력' in temp.additional && {
            물리방어력: temp.additional['물리방어력'],
          }),
        };

        return temp;
      })}
      addiOptions={addiOptions}
    />
  );
};
