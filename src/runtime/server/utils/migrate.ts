import { createError } from 'h3'
import { migrate, type Migration, type DrizzleDatabase } from "@nuxt-drizzle/utils"
import type { NamedDrizzleDatasource } from './drizzle'

export async function migrateDrizzle<
  TDatasource extends NamedDrizzleDatasource<DrizzleDatasourceName>,
>(datasource: TDatasource, migrations: Iterable<Migration> | AsyncIterable<Migration>) {
  try {
    await migrate(datasource.db as any as DrizzleDatabase, migrations)
  }
  catch (cause) {
    throw createError({
      fatal: true,
      cause,
    })
  }
}
