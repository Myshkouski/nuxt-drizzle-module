import { createError } from 'h3'
import type { MigrationConfig, MigrationMeta } from 'drizzle-orm/migrator'
import type { Migration, NamedDrizzleDatasource } from './drizzle'

interface DbDialect<TSession = any> {
  migrate(
    migrations: Iterable<MigrationMeta>,
    session: TSession,
    config: Partial<MigrationConfig> | string
  ): any
}

interface Db<TSession = any> {
  dialect: DbDialect<TSession>
  session: TSession
}

export async function migrateDrizzle<
  TDatasource extends NamedDrizzleDatasource<DrizzleDatasourceName>
>(datasource: TDatasource, migrations: Iterable<Migration> | AsyncIterable<Migration>) {
  for await (const { filename, idx, ...migrationsMeta } of migrations) {
    try {
      const db = datasource.db as any as Db
      await db.dialect.migrate([migrationsMeta], db.session, {})
    }
    catch (cause) {
      throw createError({
        fatal: true,
        message: `Migration failed: ${filename}`,
        cause,
        data: {
          filename,
          idx,
        },
      })
    }
  }
}
