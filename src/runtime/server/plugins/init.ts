import { defineNitroPlugin, useRuntimeConfig } from 'nitropack/runtime'
import { createDrizzle } from '../utils/db/createDrizzle'
import {
  datasourceFactories,
  type DrizzleDatasourceName,
} from '#nuxt-drizzle/virtual/datasources'
import type { DrizzleDatasources, NamedDrizzleDatasource } from '../utils/types'
import type { H3Event } from 'h3'
import type { HookResult } from 'nuxt/schema'

export default defineNitroPlugin(async (nitro) => {
  let datasources: DrizzleDatasources
  nitro.hooks.hookOnce('drizzle:init', async (event) => {
    const runtimeConfig = useRuntimeConfig(event)
    datasources = await createDatasources(runtimeConfig.drizzle || {})
    await nitro.hooks.callHook('drizzle:init:after', datasources)
  })

  nitro.hooks.hook('request', async (event) => {
    await nitro.hooks.callHook('drizzle:init', event)
    event.context.drizzle = datasources
  })

  await nitro.hooks.callHook('drizzle:init')
})

async function createDatasources<
  TConfig extends Record<DrizzleDatasourceName, any>,
>(config: TConfig): Promise<DrizzleDatasources> {
  const datasources: {
    [TName in DrizzleDatasourceName]: NamedDrizzleDatasource<TName>
  } = {}

  for (const name in datasourceFactories) {
    datasources[name] = await createDrizzle(name, config[name])
  }

  return datasources
}

declare module 'nitropack/types' {
  interface NitroRuntimeHooks {
    'drizzle:init': (event?: H3Event) => HookResult
    'drizzle:init:after': (datasources: DrizzleDatasources) => HookResult
  }
}
