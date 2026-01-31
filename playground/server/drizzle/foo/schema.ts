import { sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const qux = sqliteTable('qux', {
  id: text('id').primaryKey(),
  data: text('data').notNull(),
})
