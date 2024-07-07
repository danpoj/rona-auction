'use server';

import { db } from '@/db/drizzle';
import { itemTable } from '@/db/schema';
import { like } from 'drizzle-orm';
import { cache } from 'react';

export const fetchItems = async (name: string) => {
  const items = await db
    .select({
      id: itemTable.id,
      name: itemTable.name,
    })
    .from(itemTable)
    .where(like(itemTable.trimmedName, `%${name}%`))
    .limit(10);

  return items;
};

export const fetchAllItems = cache(async () => {
  const items = await db.query.itemTable.findMany();

  return items;
});
