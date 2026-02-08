import { drizzle } from 'drizzle-orm/postgres-js'
import createPostgres, { type Options as PostgresOptions } from 'postgres'
import { defineDrizzle } from '../../utils/db/defineDrizzle'
import type { PrimitiveProps } from './types'

export default defineDrizzle(<
  TSchema extends Record<string, any>,
>(options: Options, schema: TSchema) => {
  const { url, ...other } = options
  const client = url
    ? createPostgres(url, other)
    : createPostgres(other)
  return drizzle(client, { schema })
})

type Options = PrimitiveProps<PostgresOptions<Record<string, createPostgres.PostgresType>>> & {
  url?: string
}
