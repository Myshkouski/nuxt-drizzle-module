import { consola } from 'consola'
import { colorize } from 'consola/utils'
import type { DrizzleDatasources, DrizzleDatasourceName } from '#nuxt-drizzle/virtual/datasources'

export default defineNitroPlugin((nitro) => {
  nitro.hooks.hookOnce('drizzle:created', async (datasources) => {
    for (const [name, datasource] of Object.entries(datasources)) {
      const migrations = await useDrizzleMigrations(name as DrizzleDatasourceName)
      consola.info(`Running migrations:`, colorize('greenBright', name))
      await migrateDrizzle(datasource, migrations)
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
