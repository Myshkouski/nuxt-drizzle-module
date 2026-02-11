import type { DrizzleDatasources, NamedDrizzleDatasource } from './utils/types'
import type { DrizzleDatasourceName, NamedDrizzleDatasourceFactory } from '#nuxt-drizzle/virtual/datasources'

declare module '#nuxt-drizzle/virtual/datasources' {
  export type { DrizzleDatasources, NamedDrizzleDatasource }
}

type DrizzleRuntimeConfig = Record<string, any> & {
  [TName in DrizzleDatasourceName]?: NamedDrizzleDatasourceFactory<TName>['createDb'] extends (...args: [infer TConfig, ...any]) => any
    ? TConfig
    : unknown;
}

declare module '@nuxt/schema' {
  interface RuntimeConfig {
    drizzle?: DrizzleRuntimeConfig
  }
}

export {}
