import type { MySqlInsertBase } from 'drizzle-orm/mysql-core'
import type { InferColumns, InferPrimaryColumns, InferTable, OnConflictDoUpdateOptions } from './types'
import { type SQL, sql } from 'drizzle-orm/sql'

export function onConflictDoUpdate<
  TInsert extends MySqlInsertBase<any, any, any, any, any, any>,
>(
  _: InferPrimaryColumns<InferTable<TInsert>>,
  insert: TInsert,
  options: OnConflictDoUpdateOptions<TInsert>,
) {
  return insert.onDuplicateKeyUpdate({
    set: options.set,
  })
}

export function onConflictDoNothing<
  TInsert extends MySqlInsertBase<any, any, any, any, any, any>,
>(
  target: InferPrimaryColumns<InferTable<TInsert>>,
  insert: TInsert,
) {
  const set = Object.fromEntries(
    Object.entries(target).map(([name, column]) => {
      return [name, sql`${column}`]
    }),
  ) as Record<keyof InferColumns<InferTable<TInsert>>, SQL>

  return onConflictDoUpdate(target, insert, { set })
}

export type InferMysqlTable<T extends MySqlInsertBase<any, any, any, any, any, any>>
  = T extends MySqlInsertBase<infer TTable, any, any, any, any, any>
    ? TTable
    : never
