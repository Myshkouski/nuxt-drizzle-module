import { consola } from 'consola'
import { colorize } from 'consola/utils'

import type { DrizzleDatasources } from '#nuxt-drizzle/virtual/datasources'

const STATEMENT_BREAKPOINT = '--> statement-breakpoint' as const

export default defineNitroPlugin((nitro) => {
  nitro.hooks.hookOnce('drizzle:created', async (datasources) => {
    for (const [name, datasource] of Object.entries(datasources)) {
      const migrations = await useDrizzleMigrations(name as keyof DrizzleDatasources)
      if (!migrations) {
        consola.info(`Found no migrations for ${JSON.stringify(name)} datasource`)
        continue
      }

      consola.info(`Running migrations:`, colorize("greenBright", name))

      for await (const { id, query } of migrations) {
        const statements = query.split(STATEMENT_BREAKPOINT)
        try {
          for (const statement of statements) {
            await datasource.db.run(statement)
          }
        } catch (cause) {
          consola.warn(`Migrations rolled back:`, colorize("greenBright", name))

          throw createError({
            fatal: true,
            message: `Migrations for ${JSON.stringify(name)} rolled back`,
            cause,
            data: {
              id,
              statement: query,
            },
          })
        }
      }

      consola.success(`Migrations completed` )
    }

    nitro.hooks.callHook('drizzle:migrated', datasources)
  })
})

declare module 'nitropack/types' {
  interface NitroRuntimeHooks {
    'drizzle:migrated': (datasources: DrizzleDatasources) => void
  }
}
