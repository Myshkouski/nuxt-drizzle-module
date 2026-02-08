import { Table } from 'drizzle-orm'
import type { InferPrimaryColumns } from '../../lib/helpers/types'

// @ts-expect-error Internal Drizzle API
const ColumnsSymbol = Table.Symbol.Columns as symbol

export function useDrizzlePrimaryKey<
  TTable extends Table,
>(table: TTable) {
  // @ts-expect-error Internal Drizzle API
  const columns = table[ColumnsSymbol] as typeof table._.columns
  return Object.fromEntries(
    Object.entries(columns).filter(([_, column]) => {
      return column.primary
    }),
  ) as InferPrimaryColumns<TTable>
}
