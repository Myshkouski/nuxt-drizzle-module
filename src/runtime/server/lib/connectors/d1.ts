import cloudflareD1Connector from 'db0/connectors/cloudflare-d1'
import { defineDrizzle } from '../../utils/db/defineDrizzle'
import type { D1Database } from '@cloudflare/workers-types'
import type { SQL, DrizzleConfig, RelationalSchemaConfig, TablesRelationalConfig } from 'drizzle-orm'
import { DefaultLogger, extractTablesRelationalConfig, createTableRelationsHelpers } from 'drizzle-orm'
import type { BatchItem } from 'drizzle-orm/batch'
import { DrizzleD1Database, SQLiteD1Session, type AnyD1Database } from 'drizzle-orm/d1'
import type { SQLiteAsyncDialect, type SQLiteSession } from 'drizzle-orm/sqlite-core'
import { SQLiteRaw } from 'drizzle-orm/sqlite-core/query-builders/raw'
import { SQLiteD1Dialect } from './d1/dialect'

export default defineDrizzle(async <
  TSchema extends Record<string, any>,
>(
  options: D1Options,
  schema: TSchema,
) => {
  const connector = cloudflareD1Connector({
    bindingName: options.binding,
  })
  const client = await connector.getInstance()
  return drizzle(client, { schema })
})

export type D1Options = {
  binding: string
}

function drizzle<
  TSchema extends Record<string, unknown> = Record<string, never>,
  TClient extends AnyD1Database = AnyD1Database,
>(
  client: TClient,
  config: DrizzleConfig<TSchema> = {},
): DrizzleD1Database<TSchema> & {
  $client: TClient
} {
  const dialect = new SQLiteD1Dialect({ casing: config.casing })
  let logger
  if (config.logger === true) {
    logger = new DefaultLogger()
  }
  else if (config.logger !== false) {
    logger = config.logger
  }

  let schema: RelationalSchemaConfig<TablesRelationalConfig> | undefined
  if (config.schema) {
    const tablesConfig = extractTablesRelationalConfig(
      config.schema,
      createTableRelationsHelpers,
    )
    schema = {
      fullSchema: config.schema,
      schema: tablesConfig.tables,
      tableNamesMap: tablesConfig.tableNamesMap,
    }
  }

  const session = new SQLiteD1Session(client as D1Database, dialect, schema, { logger, cache: config.cache })
  const db = new DrizzleD1Database('async', dialect, session, schema) as DrizzleD1Database<TSchema>;
  (<any>db).$client = client;
  (<any>db).$cache = config.cache
  if ((<any>db).$cache) {
    (<any>db).$cache['invalidate'] = config.cache?.onMutate
  }

  return db as any
}

export function createBatchItem<TResult>({ session, dialect, sql }: CreateBatchItemOptions): BatchItem<'sqlite'> {
  return new SQLiteRaw<TResult>(
    async () => await session.run(sql),
    () => sql,
    'run',
    dialect,
    result => result,
  )
}

type CreateBatchItemOptions = {
  session: SQLiteSession<'async', any, any, any>
  dialect: SQLiteAsyncDialect
  sql: SQL<unknown>
}
