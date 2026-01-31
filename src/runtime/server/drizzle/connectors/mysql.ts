import { drizzle } from 'drizzle-orm/mysql2'
import { createConnection } from 'mysql2/promise'
import { defineDrizzleDb } from '../../utils/drizzle'

export default defineDrizzleDb(async <
  TSchema extends Record<string, any>,
>(config: { url: string }, schema: TSchema) => {
  const connection = await createConnection(config.url)
  return drizzle(connection, { schema, mode: 'default' })
})
