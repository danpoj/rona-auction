import { relations, sql } from 'drizzle-orm';
import {
  index,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';

export const itemTable = pgTable(
  'item',
  {
    id: integer('id').primaryKey(),
    name: varchar('name', { length: 100 }).notNull(),
    trimmedName: varchar('trimmed_name', { length: 100 }).notNull(),
    desc: text('desc').notNull(),
  },
  (table) => ({
    trimmedNameIndex: index('trimmed_name_idx').on(table.trimmedName),
  })
);

export const transactionTable = pgTable('transaction', {
  id: serial('id').primaryKey(),
  date: timestamp('date', { mode: 'date' }),
  count: integer('count').notNull(),
  price: varchar('price', { length: 100 }).notNull(),
  additional: varchar('additional', { length: 255 }).default('').notNull(),
  itemId: integer('item_id'),
  itemName: varchar('itemName', { length: 100 }).notNull(),
});

export const itemRelation = relations(itemTable, ({ many }) => ({
  transactions: many(transactionTable),
}));

export const transactionRelation = relations(transactionTable, ({ one }) => ({
  item: one(itemTable, {
    fields: [transactionTable.itemId],
    references: [itemTable.id],
  }),
}));
