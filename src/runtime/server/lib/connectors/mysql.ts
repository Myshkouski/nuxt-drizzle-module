import { drizzle } from 'drizzle-orm/mysql2'
import { createConnection } from 'mysql2/promise'
import { defineDrizzle } from '../../utils/db/defineDrizzle'

export default defineDrizzle(async <
  TSchema extends Record<string, any>,
>(config: { url: string }, schema: TSchema) => {
  const connection = await createConnection(config.url)
  return drizzle(connection, { schema, mode: 'default' })
})
