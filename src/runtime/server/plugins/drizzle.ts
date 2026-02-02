import { defineNitroPlugin, useRuntimeConfig } from 'nitropack/runtime'
import { createDatasources } from '../utils/drizzle'

export default defineNitroPlugin(async (nitroApp) => {
  const runtimeConfig = useRuntimeConfig()
  const datasources = await createDatasources(runtimeConfig.drizzle || {})
  if (Object.keys(datasources).length) {
    await nitroApp.hooks.callHook('drizzle:created', datasources)
  }
  nitroApp.hooks.hook('request', async (event) => {
    event.context.drizzle = datasources
  })
})
