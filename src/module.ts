import { resolvePath, defineNuxtModule, createResolver, addServerImports, addServerTemplate, addTypeTemplate, addServerPlugin, useLogger, updateTemplates } from '@nuxt/kit'
import type { HookResult } from 'nuxt/schema'
import { createModuleContext, type DatasourceInfo } from './context'
import { runParallel } from './utils/async'
import { getDatasourceOptions, updateServerAssets, type DatasourceOptions } from './utils/nitro'
import { MODULE_NAME, VIRTUAL_MODULE_ID_PREFIX, VirtualModules } from './utils/const'
import * as datasourceTemplates from './templates/datasource'
import * as runtimeConfigTemplates from './templates/runtime-config'

declare module '@nuxt/schema' {
  interface NuxtHooks {
    'nuxt-drizzle:datasources': (datasources: DatasourceInfo[]) => HookResult
  }
}

export interface ModuleOptions {
  /**
   * Patterns to search Drizzle configs
   */
  configPattern: string | string[]
  /**
   * @deprecated Use 'nitro.database' instead.
   */
  datasource?: DatasourceOptions
}

export default defineNuxtModule<ModuleOptions>().with({
  meta: {
    name: MODULE_NAME,
    configKey: 'drizzle',
  },

  defaults: {
    configPattern: [
      '*/drizzle.config.*',
      '*/drizzle-*.config.*',
    ],
    datasource: {},
  },

  async setup(moduleOptions, nuxt) {
    const logger = useLogger(MODULE_NAME)
    const resolver = createResolver(import.meta.url)

    const runtimeServerUtilsFilename = resolver.resolve('./runtime/server/utils/drizzle')
    addServerImports({
      name: 'useDrizzle',
      from: runtimeServerUtilsFilename,
    })
    addServerImports({
      name: 'defineDrizzleDb',
      from: runtimeServerUtilsFilename,
    })
    addServerImports({
      name: 'useDrizzleMigrations',
      from: runtimeServerUtilsFilename,
    })

    const runtimeServerPluginFilename = resolver.resolve('./runtime/server/plugins/drizzle')
    addServerPlugin(runtimeServerPluginFilename)

    const baseDir = await resolvePath('~~/server/drizzle', { type: 'dir' })

    const context = createModuleContext({
      cwd: process.cwd(),
      baseDir,
      logger,
      resolver,
      configPattern: moduleOptions.configPattern,
      datasource: getDatasourceOptions(nuxt, moduleOptions.datasource),
    })

    addServerTemplate({
      filename: VirtualModules.DATASOURCE,
      async getContents() {
        return await datasourceTemplates.runtime(context)
      },
    })

    addTypeTemplate({
      filename: VirtualModules.MODULE_TYPES_DTS,
      async getContents() {
        return await datasourceTemplates.typeDeclarations(context)
      },
    }, {
      node: true,
      nitro: true,
      nuxt: false,
      shared: false,
    })

    nuxt.hook('prepare:types', ({ nodeReferences }) => {
      nodeReferences.push({
        types: runtimeConfigTemplates.typeDeclarations(),
      })
    })

    // nuxt.options.watch = [nuxt.options.watch].flat().filter(watch => {
    //   return './server/drizzle/**' !== watch
    // }).concat(["./server/drizzle/**"])

    nuxt.hook('builder:watch', async (event, path) => {
      if (path.startsWith(baseDir)) {
        await context.resolve(true)
        logger.info('Datasources updated.')

        await runParallel(
          () => updateServerAssets(context, nuxt),
          () => updateTemplates({
            filter(template) {
              return template.filename.startsWith(VIRTUAL_MODULE_ID_PREFIX)
            },
          }),
        )
      }
    })

    nuxt.hook('modules:done', async () => {
      await updateServerAssets(context, nuxt)
    })
  },
})
