import { sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const authors = sqliteTable('authors', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
})
