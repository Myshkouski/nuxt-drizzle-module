import { type H3Event, createError } from 'h3'
import { datasources } from '#nuxt-drizzle/virtual/datasources'
import { useStorage } from '#imports'
import type { Storage } from 'unstorage'

export function useDrizzle<TName extends keyof typeof datasources>(event: H3Event, name: TName) {
  return event.context.drizzle[name]
}

export type Datasources = Awaited<ReturnType<typeof createDatasources>>

export async function createDatasources<
  TConfig extends Record<keyof typeof datasources, any>,
>(config: TConfig) {
  const result: {
    [TName in keyof typeof datasources]: Awaited<ReturnType<typeof createDrizzleDatasource<TName, TConfig>>>
  } = {}
  for (const name in datasources) {
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

    result[name] = datasource
  }
  return result
}

export interface DrizzleDatasource<TDatabase, TSchema> {
  db: TDatabase
  schema: TSchema
}

async function createDrizzleDatasource<
  TName extends keyof typeof datasources,
  TConfig,
>(name: TName, config: TConfig) {
  const { createDb, schema } = datasources[name] as {
    [K in keyof typeof datasources[typeof name]]: typeof datasources[typeof name][K]
  }
  const db = await createDb(config, schema)
  return { db, schema } as DrizzleDatasource<typeof db, typeof schema>
}

export function defineDrizzleDb<
  TCreate extends (config: any, schema: any) => any,
>(
  create: TCreate,
) {
  return create
}

export async function useDrizzleMigrations<
  TName extends keyof typeof datasources,
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
