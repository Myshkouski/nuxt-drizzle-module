import { sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const baz = sqliteTable('baz', {
  id: text('id').primaryKey(),
  data: text('data').notNull(),
})
