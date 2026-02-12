import { drizzle } from 'drizzle-orm/pglite'
import { PGlite, type PGliteOptions } from '@electric-sql/pglite'
import { defineDrizzle } from '../../utils/db/defineDrizzle'

export default defineDrizzle(<
  TSchema extends Record<string, any>,
>(options: PGliteOptions, schema: TSchema) => {
  const connector = new PGlite(undefined, options)
  return drizzle(connector, { schema })
})
