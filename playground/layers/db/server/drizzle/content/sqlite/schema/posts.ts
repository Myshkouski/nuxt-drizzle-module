import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'

export const posts = sqliteTable('posts', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  image: text('image').notNull(),
  date: integer('date', { mode: 'timestamp' }).notNull(),
  authors: text('authors', { mode: 'json' }).$type<string[]>(),
})
