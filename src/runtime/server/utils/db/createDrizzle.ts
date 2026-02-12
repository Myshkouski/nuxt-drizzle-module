import { createError } from 'h3'
import {
  datasourceFactories,
  type DrizzleDatasourceName,
  type NamedDrizzleDatasourceFactory,
} from '#nuxt-drizzle/virtual/datasources'
import type { NamedDrizzleDatasource } from '../types'

export async function createDrizzle<
  TName extends DrizzleDatasourceName,
  TConfig,
>(name: TName, config: TConfig): Promise<NamedDrizzleDatasource<TName>> {
  try {
    const { createDb, schema } = datasourceFactories[name]! satisfies NamedDrizzleDatasourceFactory<TName>
    const datasource: NamedDrizzleDatasource<TName> = {
      db: await createDb(config, schema),
      schema,
    }
    return datasource
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
}
