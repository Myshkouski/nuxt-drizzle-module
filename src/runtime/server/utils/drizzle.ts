import { type H3Event, createError } from 'h3'
import {
  datasourceFactories,
  type DrizzleDatasourceName,
  type NamedDrizzleDatasourceFactory,
} from '#nuxt-drizzle/virtual/datasources'
import { useStorage } from 'nitropack/runtime'
import type { Storage } from 'unstorage'
import type { Migration } from '@nuxt-drizzle/utils'
import { digest } from 'ohash'

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
    schema,
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
  const storage = useStorage<string>(`assets:drizzle:migrations:${name}`)
  const journal = await storage.getItem<MigrationJournal>(`meta/_journal.json`)
  if (!journal) {
    throw createError({
      fatal: true,
      message: `Cannot find migration journal for '${name}'`,
      data: {
        datasource: name,
      },
    })
  }

  return generate(journal, storage)
}

const STATEMENT_BREAKPOINT = '--> statement-breakpoint' as const

async function* generate(journal: MigrationJournal, storage: Storage<string>) {
  for (const { idx, when, tag, breakpoints } of journal.entries) {
    const filename = tag + '.sql'
    const query = await storage.getItem<string>(filename)

    if (!query) {
      throw createError({
        fatal: true,
        message: `Cannot find migration filename: ${filename}`,
        data: {
          filename,
        },
      })
    }

    const migration: Migration = {
      filename,
      idx,
      sql: query.split(STATEMENT_BREAKPOINT),
      hash: digest(query),
      folderMillis: when,
      bps: breakpoints,
    }

    yield migration
  }
}

interface MigrationJournal {
  entries: Iterable<{
    idx: number
    version: string
    when: number
    tag: string
    breakpoints: true
  }>
}
