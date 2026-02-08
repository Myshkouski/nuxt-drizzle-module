import type { PgInsertBase } from 'drizzle-orm/pg-core'
import type { InferColumns, InferTable, OnConflictDoUpdateOptions } from './types'

export function onConflictDoUpdate<
  TInsert extends PgInsertBase<any, any, any, any, any, any>,
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
  TInsert extends PgInsertBase<any, any, any, any, any, any>,
>(
  _: Partial<InferColumns<InferTable<TInsert>>>,
  insert: TInsert,
) {
  return insert.onConflictDoNothing()
}

export type InferPgTable<T extends PgInsertBase<any, any, any, any, any, any>>
  = T extends PgInsertBase<infer TTable, any, any, any, any, any>
    ? TTable
    : never
