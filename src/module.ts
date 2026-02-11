import { defineNuxtModule, createResolver, addServerTemplate, addTypeTemplate, addServerPlugin, useLogger, updateTemplates, addServerImportsDir } from '@nuxt/kit'
import { createModuleContext, createStubModuleContext, type ModuleContext } from '@nuxt-drizzle/utils/context'
import { runParallel } from './utils/async'
import { getDatasourceOptions, updateServerAssets, type DatasourceOptions } from './utils/nitro'
import { MODULE_NAME, VIRTUAL_MODULE_ID_PREFIX, VirtualModules } from './utils/const'
import * as datasourceTemplates from './templates/datasource'
import * as helpersTemplates from './templates/helpers'

export interface ModuleOptions {
  /**
   * Directory to search datasources
   */
  baseDir: string
  /**
   * Patterns to search Drizzle configs
   */
  configPattern: string | string[]
  /**
   * @deprecated Use 'nitro.database' instead.
   */
  datasource?: DatasourceOptions

  /**
   * Enable migrations storage
   */
  migrations: boolean
}

const resolver = createResolver(import.meta.url)
const logger = useLogger(MODULE_NAME)

export default defineNuxtModule<ModuleOptions>().with({
  meta: {
    name: MODULE_NAME,
    configKey: 'drizzle',
  },

  async defaults(nuxt) {
    return {
      baseDir: resolver.resolve(nuxt.options.serverDir, 'drizzle'),
      configPattern: [
        '*/drizzle.config.*',
        '*/drizzle-*.config.*',
      ],
      datasource: {},
      migrations: true,
    }
  },

  async setup(moduleOptions, nuxt) {
    const runtimeServerUtilsDir = resolver.resolve('./runtime/server/utils/db')
    addServerImportsDir(runtimeServerUtilsDir)

    addServerImportsDir(resolver.resolve('./runtime/server/utils/migrations'))

    const runtimeServerPluginFilename = resolver.resolve('./runtime/server/plugins/init')
    addServerPlugin(runtimeServerPluginFilename)

    const baseDir = await resolver.resolvePath(moduleOptions.baseDir, { type: 'dir' })

    const context: ModuleContext = nuxt.options.rootDir == await resolver.resolvePath('..', { type: 'dir' })
      ? createStubModuleContext({
          logger,
        })
      : createModuleContext({
          cwd: process.cwd(),
          baseDir,
          connectorsDir: resolver.resolve('./runtime/server/lib/connectors'),
          helpersDir: resolver.resolve('./runtime/server/lib/helpers'),
          logger,
          resolver,
          configPattern: moduleOptions.configPattern,
          datasource: getDatasourceOptions(nuxt.options, moduleOptions.datasource) || {},
        })

    addServerTemplate({
      filename: VirtualModules.DATASOURCE,
      async getContents() {
        return await datasourceTemplates.runtime(context)
      },
    })

    addTypeTemplate({
      filename: VirtualModules.DATASOURCE_TYPES,
      async getContents() {
        return await datasourceTemplates.typeDeclarations(context)
      },
    }, {
      node: true,
      nitro: true,
      nuxt: false,
      shared: false,
    })

    addServerTemplate({
      filename: VirtualModules.HELPERS,
      async getContents() {
        return await helpersTemplates.runtime(context)
      },
    })

    addTypeTemplate({
      filename: VirtualModules.HELPERS_TYPES,
      async getContents() {
        return await helpersTemplates.typeDeclarations(context)
      },
    }, {
      node: true,
      nitro: true,
      nuxt: false,
      shared: false,
    })

    nuxt.hook('nitro:prepare:types', (options) => {
      options.references.push({ path: resolver.resolve('./runtime/server/augments.d.ts') })
    })

    nuxt.hook('builder:watch', async (event, path) => {
      if (path.startsWith(baseDir)) {
        await context.resolve(true)
        logger.info('Datasources updated.')

        await runParallel(
          () => updateServerAssets(moduleOptions, context, nuxt.options),
          () => updateTemplates({
            filter(template) {
              return template.filename.startsWith(VIRTUAL_MODULE_ID_PREFIX)
            },
          }),
        )
      }
    })

    nuxt.hook('modules:done', async () => {
      await updateServerAssets(moduleOptions, context, nuxt.options)
    })
  },
})
