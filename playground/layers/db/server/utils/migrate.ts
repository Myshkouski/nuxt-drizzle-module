import type { NamedDrizzleDatasource, DrizzleDatasourceName, Migration } from '#nuxt-drizzle/virtual/datasources'
import type { MigrationConfig, MigrationMeta } from 'drizzle-orm/migrator'

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

export async function migrate<
  TDatasource extends NamedDrizzleDatasource<DrizzleDatasourceName>
>(datasource: TDatasource, migrations: AsyncIterable<Migration, void, unknown>) {
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
