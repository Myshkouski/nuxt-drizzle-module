import { drizzle } from 'drizzle-orm/postgres-js'
import createPostgres, { type Options as PostgresOptions } from 'postgres'
import { defineDrizzleDb } from '../../utils/drizzle'
import type { PrimitiveProps } from './types'

export default defineDrizzleDb(<
  TSchema extends Record<string, any>,
>(options: Options, schema: TSchema) => {
  const { url, ...other } = options
  const client = url
    ? createPostgres(url, other)
    : createPostgres(other)
  return drizzle(client, { schema })
})

type Options = PrimitiveProps<PostgresOptions<{}>> & {
  url?: string
}
