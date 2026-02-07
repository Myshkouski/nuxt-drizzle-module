import { consola } from 'consola'
import { colorize } from 'consola/utils'
import type { DrizzleDatasourceName, DrizzleDatasources } from '#nuxt-drizzle/virtual/datasources'

export default defineNitroPlugin((nitro) => {
  nitro.hooks.hookOnce('drizzle:created', async (datasources) => {
    for (const [name, datasource] of Object.entries(datasources)) {
      const migrations = await useDrizzleMigrations(name as DrizzleDatasourceName)
      const printName = colorize('greenBright', name)
      consola.info('Running migrations:', printName)
      await migrateDrizzle(datasource, migrations)
      consola.success('Migrations completed:', printName)
    }

    await nitro.hooks.callHook('drizzle:migrated', datasources)
  })
})

declare module 'nitropack/types' {
  interface NitroRuntimeHooks {
    'drizzle:migrated': (datasources: DrizzleDatasources) => void
  }
}
