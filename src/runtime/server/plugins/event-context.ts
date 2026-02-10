import { defineNitroPlugin, useRuntimeConfig } from 'nitropack/runtime'
import { createDrizzle } from '../utils/db/createDrizzle'
import {
  datasourceFactories,
  type DrizzleDatasourceName,
} from '#nuxt-drizzle/virtual/datasources'
import type { DrizzleDatasources, NamedDrizzleDatasource } from '../utils/types'

export default defineNitroPlugin(async (nitroApp) => {
  const runtimeConfig = useRuntimeConfig()
  const datasources = await createDatasources(runtimeConfig.drizzle || {})
  nitroApp.hooks.hook('request', event => {
    event.context.drizzle = datasources
  })
  if (Object.keys(datasources).length) {
    await nitroApp.hooks.callHook('drizzle:created', datasources)
  }
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
