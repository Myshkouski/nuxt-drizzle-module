import { consola } from 'consola'
import { colorize } from 'consola/utils'
import type { MigrationConfig, MigrationMeta } from 'drizzle-orm/migrator'
import type { DrizzleDatasources, DrizzleDatasourceName } from '#nuxt-drizzle/virtual/datasources'

interface DbDialect<TSession = any> {
  migrate(
    migrations: Iterable<MigrationMeta>,
    session?: TSession,
    config?: Partial<MigrationConfig> | string
  ): any
}

interface Db<TSession = any> {
  dialect: DbDialect<TSession>
  session: TSession
}

export default defineNitroPlugin((nitro) => {
  nitro.hooks.hookOnce('drizzle:created', async (datasources) => {
    for (const [name, datasource] of Object.entries(datasources)) {
      const migrations = await useDrizzleMigrations(name as DrizzleDatasourceName)

      consola.info(`Running migrations:`, colorize('greenBright', name))

      for await (const { filename, idx, ...migrationsMeta } of migrations) {
        try {
          const db = datasource.db as any as Db
          await db.dialect.migrate([migrationsMeta], db.session, {})
        }
        catch (cause) {
          throw createError({
            fatal: true,
            message: `Migrations failed: ${ name }`,
            cause,
            data: {
              filename,
              idx,
            },
          })
        }
      }

      consola.success(`Migrations completed`, colorize('greenBright', name))
    }

    nitro.hooks.callHook('drizzle:migrated', datasources)
  })
})

declare module 'nitropack/types' {
  interface NitroRuntimeHooks {
    'drizzle:migrated': (datasources: DrizzleDatasources) => void
  }
}
