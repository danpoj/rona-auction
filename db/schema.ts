import { relations } from 'drizzle-orm';
import {
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';

export const itemTable = pgTable('item', {
  id: integer('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  desc: text('desc').notNull(),
});

export const transactionTable = pgTable('transaction', {
  id: serial('id').primaryKey(),
  date: timestamp('date', { mode: 'date' }),
  count: integer('count').notNull(),
  price: integer('price').notNull(),
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
