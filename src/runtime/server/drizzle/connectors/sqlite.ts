import sqlite3, { type Options as BetterSqlite3Options } from 'better-sqlite3'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import { defineDrizzleDb } from '../../utils/drizzle'
import type { PrimitiveProps } from './types'

export default defineDrizzleDb(<
  TSchema extends Record<string, any>,
>(
  config: ConnectorOptions,
  schema: TSchema,
) => {
  const { url, ...options } = config
  const sqlite = sqlite3(url, options)
  return drizzle(sqlite, { schema })
})

type ConnectorOptions = {
  url: string
} & PrimitiveProps<BetterSqlite3Options>
