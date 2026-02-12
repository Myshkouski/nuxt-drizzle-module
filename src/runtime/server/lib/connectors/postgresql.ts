import { drizzle } from 'drizzle-orm/postgres-js'
import createPostgres, { type Options as PostgresOptions } from 'postgres'
import { defineDrizzle } from '../../utils/db/defineDrizzle'

export default defineDrizzle(<
  TSchema extends Record<string, any>,
>(options: Options, schema: TSchema) => {
  const { url, ...other } = options
  const client = url
    ? createPostgres(url, other)
    : createPostgres(other)
  return drizzle(client, { schema })
})

type Options = PostgresOptions<Record<string, createPostgres.PostgresType>> & {
  url?: string
}
