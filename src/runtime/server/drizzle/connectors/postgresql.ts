import { drizzle } from 'drizzle-orm/postgres-js'
import createPostgres, { type Options as PostgresOptions } from 'postgres'
import { defineDrizzleDb } from '../../utils/drizzle'
import type { PrimitiveProps } from './types'

export default defineDrizzleDb(<
  TSchema extends Record<string, any>,
>(config: PrimitiveProps<PostgresOptions<{}>>, schema: TSchema) => {
  const client = createPostgres(config)
  return drizzle(client, { schema })
})
