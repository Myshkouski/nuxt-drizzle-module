import { drizzle } from 'drizzle-orm/libsql'
import { createClient, type Config as LibSQLConfig } from '@libsql/client'
import { defineDrizzleDb } from '../../utils/drizzle'
import type { PrimitiveProps } from './types'

export default defineDrizzleDb(<
  TSchema extends Record<string, any>,
>(
  config: PrimitiveProps<LibSQLConfig>,
  schema: TSchema,
) => {
  const sqlite = createClient(config)
  return drizzle(sqlite, { schema })
})
