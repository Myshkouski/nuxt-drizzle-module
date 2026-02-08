import type { SQL, Column, Table } from 'drizzle-orm'
import type { MySqlInsertBase } from 'drizzle-orm/mysql-core'
import type { InferMysqlTable } from './mysql'
import type { PgInsertBase } from 'drizzle-orm/pg-core'
import type { InferPgTable } from './postgresql'
import type { SQLiteInsertBase } from 'drizzle-orm/sqlite-core'
import type { InferSqliteTable } from './sqlite'

interface OnConflictOptions<TSet extends Record<string, SQL | undefined>> {
  set: TSet
}

export type OnConflictDoUpdateOptions<T extends AnyInsert> = OnConflictOptions<{
  [K in keyof InferColumns<InferTable<T>>]?: SQL
}>

export type InferColumns<TTable extends Table>
  = TTable extends Table<infer TTableConfig>
    ? TTableConfig['columns']
    : never

type AnyInsert =
  MySqlInsertBase<any, any, any, any, any, any> |
  PgInsertBase<any, any, any, any, any, any> |
  SQLiteInsertBase<any, any, any, any, any, any>

export type InferTable<T extends AnyInsert>
  = T extends MySqlInsertBase<any, any, any, any, any, any> ? InferMysqlTable<T>
  : T extends PgInsertBase<any, any, any, any, any, any> ? InferPgTable<T>
  : T extends SQLiteInsertBase<any, any, any, any, any, any> ? InferSqliteTable<T>
  : never

type RemoveNeverProps<T extends Record<string, any>> = {
  [K in keyof T as T[K] extends never ? never : K]: T[K]
}

export type InferPrimaryColumns<T extends Table> = RemoveNeverProps<{
  [K in keyof InferColumns<T>]: InferColumns<T>[K] extends Column<infer TColumnConfig>
    ? Extract<TColumnConfig, { isPrimaryKey: true }> extends never
      ? never
      : InferColumns<T>[K]
    : never
}>
