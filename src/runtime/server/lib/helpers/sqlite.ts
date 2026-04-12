import type { BaseSQLiteDatabase, SQLiteInsertBase, SQLiteTransaction } from 'drizzle-orm/sqlite-core'
import type { InferColumns, InferTable, OnConflictDoUpdateOptions } from './types'
import type { BatchItem, BatchResponse } from 'drizzle-orm/batch'
import type { Dialect, SQLWrapper } from 'drizzle-orm'
import { SqliteRemoteDatabase } from 'drizzle-orm/sqlite-proxy'

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

export async function batch<
  TSchema extends Record<string, any>,
  TDatabase extends BaseSQLiteDatabase<any, any, TSchema>,
  TBatchItem extends InferBatchItem<TSchema, TDatabase>,
  TItems extends Readonly<[TBatchItem, ...TBatchItem[]]>,
>(db: TDatabase, items: TItems): Promise<any[]> {
  let result: any[]

  if (db instanceof SqliteRemoteDatabase) {
  // if (isBatchSupported(db)) {
    result = await db.batch(items)
  } else {
    result = await db.transaction(async (tx) => {
      const result: any[] = await Promise.all([
        ...items.map(item => tx.run(item))
      ])
      return result
    })
  }

  return result
}

type InferBatchItem<
  TSchema extends Record<string, any>,
  TDatabase extends BaseSQLiteDatabase<any, any, TSchema>
> =
  TDatabase extends SqliteRemoteDatabase
    ? BatchItem<'sqlite'>
    : (SQLWrapper | string)

interface BatchDatabase<TDialect extends Dialect> {
  batch<U extends BatchItem<TDialect>, T extends Readonly<[U, ...U[]]>>(batch: T): Promise<BatchResponse<T>>
}

function isBatchSupported(db: any): db is BatchDatabase<'sqlite'> {
  return 'batch' in db
}
