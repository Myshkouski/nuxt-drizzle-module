import type { SQLiteInsertBase } from 'drizzle-orm/sqlite-core'
import type { InferColumns, InferTable, OnConflictDoUpdateOptions } from './types'

export function onConflictDoUpdate<
  TInsert extends SQLiteInsertBase<any, any, any, any, any, any>,
>(
  target: Partial<InferColumns<InferTable<TInsert>>>,
  insert: TInsert,
  options: OnConflictDoUpdateOptions<TInsert>,
) {
  return insert.onConflictDoUpdate({
    target: Object.values(target),
    set: options.set,
  })
}

export function onConflictDoNothing<
  TInsert extends SQLiteInsertBase<any, any, any, any, any, any>,
>(
  _: Partial<InferColumns<InferTable<TInsert>>>,
  insert: TInsert,
) {
  return insert.onConflictDoNothing()
}

export type InferSqliteTable<T extends SQLiteInsertBase<any, any, any, any, any, any>>
  = T extends SQLiteInsertBase<infer TTable, any, any, any, any, any>
    ? TTable
    : never
