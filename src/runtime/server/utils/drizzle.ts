import { type H3Event, createError } from 'h3'
import { 
  datasourceFactories, 
  type DrizzleDatasourceName, 
  type NamedDrizzleDatasourceFactory
} from '#nuxt-drizzle/virtual/datasources'
import { useStorage } from 'nitropack/runtime'
import type { Storage } from 'unstorage'

export function useDrizzle<TName extends DrizzleDatasourceName>(event: H3Event, name: TName): NamedDrizzleDatasource<TName> {
  return event.context.drizzle[name]
}

export type DrizzleDatasources = {
  readonly [TName in DrizzleDatasourceName]: NamedDrizzleDatasource<TName>
}

export async function createDatasources<
  TConfig extends Record<DrizzleDatasourceName, any>,
>(config: TConfig): Promise<DrizzleDatasources> {
  const datasources: {
    [TName in DrizzleDatasourceName]: NamedDrizzleDatasource<TName>
  } = {}

  for (const name in datasourceFactories) {
    let datasource
    try {
      datasource = await createDrizzleDatasource(name, config[name])
    }
    catch (cause) {
      throw createError({
        fatal: true,
        cause,
        message: `Unable to create drizzle datasource '${name}'`,
        data: {
          name,
          config,
        },
      })
    }

    // @ts-ignore
    datasources[name] = datasource
  }
  return datasources
}

export interface DrizzleDatasource<TDatabase, TSchema> {
  db: TDatabase
  schema: TSchema
}

export type NamedDrizzleDatasource<TName extends DrizzleDatasourceName> = {
  db: Awaited<ReturnType<NamedDrizzleDatasourceFactory<TName>['createDb']>>
  schema: NamedDrizzleDatasourceFactory<TName>['schema']
}

async function createDrizzleDatasource<
  TName extends DrizzleDatasourceName,
  TConfig,
>(name: TName, config: TConfig) {
  const { createDb, schema } = datasourceFactories[name]! satisfies NamedDrizzleDatasourceFactory<TName>
  const datasource: NamedDrizzleDatasource<TName> = {
    db: await createDb(config, schema), 
    schema
  }
  return datasource
}

export function defineDrizzleDb<
  TCreate extends <TSchema extends Record<string, any>>(config: any, schema: TSchema) => any,
>(
  create: TCreate,
) {
  return create
}

export async function useDrizzleMigrations<
  TName extends DrizzleDatasourceName,
>(name: TName) {
  const storage = useStorage<string>('assets:drizzle:migrations')
  const assets = await storage.getKeys(name)
  // todo: use ./meta/_journal.json instead of sorting by filename
  const queryFilenames = assets.filter((filename) => {
    // In dev mode, Nitro uses fs driver that does not filter assets by glob pattern.
    return filename.endsWith('.sql')
  }).toSorted()

  if (!assets.length) return

  return generate(queryFilenames, storage)
}

async function* generate(filenames: string[], storage: Storage<string>) {
  for (const id of filenames) {
    const query = await storage.getItem<string>(id)

    if (!query) {
      throw createError({
        fatal: true,
        message: `Cannot find migration query '${id}'`,
        data: {
          id,
        },
      })
    }

    yield { id, query }
  }
}
