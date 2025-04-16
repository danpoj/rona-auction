'use server';

import { db } from '@/db/drizzle';
import { itemTable, transactionTable } from '@/db/schema';
import { parseString } from '@/lib/parse-string';
import { InferSelectModel, and, eq, gte, isNull, lt, sql } from 'drizzle-orm';
import fs from 'fs';
import path from 'path';

export const getTransWithoutItemId = async () => {
  const transactions = await db.query.transactionTable.findMany({
    where: isNull(transactionTable.itemId),
  });

  console.log(transactions);
};

export const getTransactionsWithoutItemId = async () => {
  const res = await db
    .update(transactionTable)
    .set({ itemId: 666666829 })
    .where(
      and(
        isNull(transactionTable.itemId),
        eq(transactionTable.itemName, '리버스 그라베')
      )
    );

  console.log(res);
  console.log('done');

  // const itemsFromAPI = await fetch(
  //   `https://maplestory.io/api/kms/384/item`
  // ).then((res) => res.json());

  // const itemsWithName = itemsFromAPI.filter(
  //   (d) => !(!d.name || !d.name.trim())
  // );

  // const obj: Record<
  //   string,
  //   {
  //     id: number;
  //     name: string;
  //     desc: string;
  //   }
  // > = {};

  // for (const item of itemsWithName) {
  //   obj[item.name.replace(/\s+/g, '')] = {
  //     id: item.id,
  //     name: item.name,
  //     desc: item.desc,
  //   };
  // }

  // const items = await db.query.transactionTable.findMany({
  //   where: isNull(transactionTable.itemId),
  // });

  // console.log(items);

  // const itemsLinked = items.filter(
  //   (item) => !!obj[item.itemName.replace(/\s+/g, '')]
  // );

  // const itemsLinkedSet = [...new Set(itemsLinked.map((item) => item.itemName))];

  // const dd = itemsLinkedSet
  //   .filter((link) => obj[link.replace(/\s+/g, '')])
  //   .map((l) => ({
  //     id: obj[l.replace(/\s+/g, '')].id,
  //     name: obj[l.replace(/\s+/g, '')].name,
  //     desc: obj[l.replace(/\s+/g, '')].desc,
  //     trimmedName: obj[l.replace(/\s+/g, '')].name.replace(/\s+/g, ''),
  //   }));

  // for (const el of dd) {
  //   try {
  //     await db.insert(itemTable).values(el);
  //   } catch (error) {
  //     console.log(el);
  //   }
  // }

  // for await (const transaction of itemsLinkedSet) {
  //   await db
  //     .update(transactionTable)
  //     .set({
  //       itemId: obj[transaction.replace(/\s+/g, '')].id,
  //     })
  //     .where(
  //       eq(transactionTable.itemName, obj[transaction.replace(/\s+/g, '')].name)
  //     );

  //   console.log(transaction);
  // }
};

export const updateTransactionsWithoutItemId = async () => {
  const items = await db.query.itemTable.findMany();

  const obj = items.reduce((acc: Record<string, number>, item) => {
    acc[item.trimmedName] = item.id;
    return acc;
  }, {});

  console.log(obj);

  // await db.update(transactionTable).set({
  //   itemId:
  // })
};

export const clearAction = async () => {
  await db.delete(transactionTable);
};

export const updateDate = async () => {
  await db
    .update(transactionTable)
    .set({
      date: sql`'2024-07-01 15:00:00'::timestamp at time zone 'Asia/Seoul' at time zone 'UTC'`,
    })
    .where(
      sql`${transactionTable.date} AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Seoul' = '2024-07-04 03:00:00'::timestamp`
    );
};

export const query = async () => {
  const items = await db.query.transactionTable.findMany({
    where: isNull(transactionTable.itemId),
  });

  let obj: Record<string, InferSelectModel<typeof transactionTable>[]> = {};

  items.forEach((item) => {
    if (obj[item.itemName]) {
      obj[item.itemName].push(item);
    } else {
      obj[item.itemName] = [item];
    }
  });

  const entries = Object.entries(obj);

  let itemId = 666666663;

  for await (const entrie of entries) {
    console.log(entrie[0]);

    await db.insert(itemTable).values({
      id: itemId,
      name: entrie[0],
      trimmedName: entrie[0].replace(/\s+/g, ''),
      desc: '',
    });

    await db
      .update(transactionTable)
      .set({
        itemId: itemId,
      })
      .where(eq(transactionTable.itemName, entrie[0]));

    itemId += 1;
  }
};

export const deleteItemsWithoutTransactions = async () => {
  console.log('deleting... ');
  const deleteItemsWithoutTransactions = await db.execute(sql`
    DELETE FROM ${itemTable}
    WHERE ${itemTable.id} NOT IN (
      SELECT DISTINCT ${transactionTable.itemId}
      FROM ${transactionTable}
      WHERE ${transactionTable.itemId} IS NOT NULL
    )
  `);

  console.log('success!');
};

export const getItemsWithoutTransactions = async () => {
  const itemsWithTransactionCount = await db
    .select({
      id: itemTable.id,
      transactionCount: sql<number>`cast(count(${transactionTable.id}) as integer)`,
    })
    .from(itemTable)
    .leftJoin(transactionTable, eq(itemTable.id, transactionTable.itemId))
    .groupBy(itemTable.id);

  console.log(itemsWithTransactionCount);

  // const itemsLength = await db
  //   .select({
  //     count: count(),
  //   })
  //   .from(itemTable);

  // console.log(itemsLength);

  // const transactions = await db.select().from(transactionTable);

  // const obj: Record<string, boolean> = {};

  // transactions.forEach((t) => {
  //   if (t.itemId) {
  //     obj[t.itemId] = true;
  //   }
  // });

  // console.log(Object.keys(obj).length);
};

export const deleteTransactions = async () => {
  const startDate = new Date('2024-06-29T00:00:00+09:00'); // 한국 시간 7월 7일 00:00:00
  const endDate = new Date('2024-10-01T00:00:00+09:00'); // 한국 시간 7월 8일 00:00:00

  const result = await db
    .delete(transactionTable)
    .where(
      and(
        gte(transactionTable.date, startDate),
        lt(transactionTable.date, endDate)
      )
    );

  // const result = await db
  //   .select()
  //   .from(transactionTable)
  //   .where(
  //     and(
  //       gte(transactionTable.date, startDate),
  //       lt(transactionTable.date, endDate)
  //     )
  //   );

  console.log(`Deleted ${result.rowCount} rows`);
};

export const getTransactionsAction = async () => {
  const fullPath = path.join(process.cwd(), '/data/4.15.txt');
  const fileContents = fs.readFileSync(fullPath, 'utf8');

  const arr = fileContents.split('\n\n');

  const newArr = arr
    .map((item, index) => {
      if (item.trim().length === 0) return;
      const temp = item.split('\n');

      if (temp.length === 1) {
        return parseString({
          str: temp[0],
          index,
        });
      } else if (temp.length === 2) {
        return parseString({
          str: temp[0],
          index,
          addi: temp[1],
        });
      }
    })
    .filter((i) => i?.count && i.date && i.name && i.price);

  return newArr;
};

export const saveTransactionsAction = async () => {
  const items = await db.query.itemTable.findMany();

  const obj = items.reduce((acc, item) => {
    // @ts-ignore
    acc[item.trimmedName] = { ...item };
    return acc;
  }, {});

  const transactions = await getTransactionsAction();

  const batchSize = 1000;
  for (let i = 0; i < transactions.length; i += batchSize) {
    console.log(`${i} ~ ${i + 1000} start...`);
    const batch = transactions.slice(i, i + batchSize);
    const batchWithItemId = batch.map((b) => ({
      count: b?.count,
      date: b?.date && new Date(b?.date),
      name: b?.name.trim(),
      price: String(b?.price),
      additional: b?.additional || '',
      itemName: b?.name.trim(),
      // @ts-ignore
      ...(obj[b?.name.trim()?.replace(/\s+/g, '')] && {
        // @ts-ignore
        itemId: obj[b?.name.trim()?.replace(/\s+/g, '')].id,
      }),
    }));

    await db.insert(transactionTable).values(batchWithItemId);

    console.log(`${i} ~ ${i + 1000} success!`);
  }
};

type Item = {
  name: string;
  id: number;
  desc: string;
};

export const saveItemsAction = async () => {
  console.log('saving...');

  const items = (await fetch('https://maplestory.io/api/kms/384/item').then(
    (res) => res.json()
  )) as Item[];

  const obj: Record<string, boolean> = {};

  const validItems = items.filter((item) => {
    if (!(item.name && typeof item.name === 'string' && !!item.name.trim()))
      return false;

    if (obj[item.name.trim()]) {
      return false;
    } else {
      obj[item.name.trim()] = true;
      return true;
    }
  });

  const batchSize = 1000; // Adjust this value based on your database limits
  for (let i = 0; i < validItems.length; i += batchSize) {
    console.log(`${i} ~ ${i + 1000} start...`);
    const batch = validItems.slice(i, i + batchSize);
    await db.insert(itemTable).values(
      batch.map((item) => ({
        id: item.id,
        name: item.name.trim(),
        trimmedName: item.name.trim().replace(/\s+/g, ''),
        desc: item.desc || '',
      }))
    );

    console.log(`${i} ~ ${i + 1000} success!`);
  }

  console.log('items saved! 🎉');
};

export const updateItemsAction = async () => {
  console.log('saving...');

  const allItems = await db.query.transactionTable.findMany();
  const allRealItems = await db.query.itemTable.findMany();

  let obj: Record<string, boolean> = {};
  let obj2: Record<string, boolean> = {};

  allItems.forEach((item) => {
    obj[item.itemId!] = true;
  });

  allRealItems.forEach((item) => {
    obj2[item.id] = true;
  });

  const ids = Object.keys(obj);
  const ids2 = Object.keys(obj2);

  for await (const id of ids) {
    if (!obj2[id]) {
      const data = await fetch(
        `https://maplestory.io/api/kms/389/item/${id}`
      ).then((res) => res.json());

      if (!data || !data.description) continue;

      // await db.insert(itemTable).values({
      //   desc: data.description.description,
      //   id,
      //   name: data.description.name,
      //   trimmedName: data.description.name.trim().replace(/\s+/g, ''),
      // });

      console.log(id);
    }
  }
};
