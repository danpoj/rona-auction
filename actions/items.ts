'use server';

import { db } from '@/db/drizzle';
import { itemTable } from '@/db/schema';
import { like } from 'drizzle-orm';

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
