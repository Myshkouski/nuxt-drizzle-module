import type { ModuleContext } from '@nuxt-drizzle/utils/context'
import type { ServerAssetDir, NitroConfig } from 'nitropack/types'
import type { ConnectorName } from 'db0'
import type { NuxtOptions } from '@nuxt/schema'
import type { ModuleOptions } from '../module'
import { VirtualModules } from './const'
import * as datasourceTemplates from '../templates/datasource'
import * as helpersTemplates from '../templates/helpers'

/**
 * @see [function serverAssets(nitro: Nitro)](https://github.com/nitrojs/nitro/blob/ef01b092b5fa09d28acb5bd0668ae80505f7c6b4/src/build/virtual/server-assets.ts#L18)
 */
export async function updateServerAssets(moduleOptions: ModuleOptions, context: ModuleContext, nitroOptions: NitroConfig) {
  if (moduleOptions.migrations) {
    await updateMigrationAssets(context, nitroOptions)
  }
}

const MIGRATION_ASSETS_BASE = 'drizzle:migrations' as const

async function updateMigrationAssets(context: ModuleContext, nitroOptions: NitroConfig) {
  const datasources = await context.resolve()

  const drizzleMigrationAssets: ServerAssetDir[] = datasources.map(({ name, imports }) => {
    const dir = imports.migrations
    if (dir) {
      return { name, dir }
    }
  }).filter(value => !!value).map(({ name, dir }) => {
    return {
      baseName: `${MIGRATION_ASSETS_BASE}:${name}`,
      dir,
      /**
       * @todo Doesn't work in dev mode - 'fs' driver does not support 'pattern'
       * Disabled - include all files to use with meta/_journal.json
       */
      // pattern: '*.sql',
    }
  })

  nitroOptions.serverAssets = [nitroOptions.serverAssets].flat().filter((serverAsset) => {
    return serverAsset?.baseName?.startsWith(MIGRATION_ASSETS_BASE)
  }).concat(drizzleMigrationAssets)
}

export function getDatasourceOptions(nitroOptions: NitroConfig, options: DatasourceOptions) {
  return nitroOptions.experimental?.database
    ? nitroOptions.dev
      ? nitroOptions.devDatabase
      : nitroOptions.database
    : options
}

export type DatasourceOptions = {
  [name: string & {}]: {
    connector: ConnectorName
  }
}

export type NitroVirtualModule = {
  filename: string
  getContents: () => Promise<string> | string
}

export function getNitroVirtualModules(context: ModuleContext): Iterable<NitroVirtualModule> {
  return Object.entries({
    [VirtualModules.DATASOURCE]: async () => await datasourceTemplates.runtime(context),
    [VirtualModules.HELPERS]: async () => await helpersTemplates.runtime(context)
  }).map(([filename, getContents]) => ({ filename, getContents }))
}
