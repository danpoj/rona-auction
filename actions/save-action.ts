'use server';

import { db } from '@/db/drizzle';
import { itemTable, transactionTable } from '@/db/schema';
import { parseString } from '@/lib/parse-string';
import fs from 'fs';
import path from 'path';

export const clearAction = async () => {
  await db.delete(transactionTable);
};

export const getTransactionsAction = async () => {
  const fullPath = path.join(process.cwd(), '/data/6.30.txt');
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
  const items = await fetch('https://maplestory.io/api/kms/389/item')
    .then((res) => res.json())
    .then((is) => {
      const temp = is.reduce(
        (acc: Record<string, number>, item: { name: string; id: number }) => {
          if (!item.name) return acc;
          acc[item.name] = item.id;
          return acc;
        },
        {}
      );

      return temp;
    });

  const transactions = await getTransactionsAction();

  const batchSize = 1000; // Adjust this value based on your database limits
  for (let i = 0; i < transactions.length; i += batchSize) {
    console.log(`${i} ~ ${i + 1000} start...`);
    const batch = transactions.slice(i, i + batchSize);
    const batchWithItemId = batch.map((b) => ({
      count: b?.count,
      date: b?.date && new Date(b?.date),
      name: b?.name.trim(),
      price: b?.price,
      additional: b?.additional || '',
      itemName: b?.name.trim(),
      ...(items[b?.name.trim()!] && { itemId: items[b?.name.trim()!] }),
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

  const items = (await fetch('https://maplestory.io/api/kms/389/item').then(
    (res) => res.json()
  )) as Item[];

  const validItems = items.filter(
    (item) => item.name && typeof item.name === 'string' && !!item.name.trim()
  );

  const batchSize = 1000; // Adjust this value based on your database limits
  for (let i = 0; i < validItems.length; i += batchSize) {
    console.log(`${i} ~ ${i + 1000} start...`);
    const batch = validItems.slice(i, i + batchSize);
    await db.insert(itemTable).values(
      batch.map((item) => ({
        id: item.id,
        name: item.name,
        desc: item.desc || '',
      }))
    );

    console.log(`${i} ~ ${i + 1000} success!`);
  }

  console.log('items saved! 🎉');
};
