import type { H3Event } from 'h3'
import type { HookResult } from 'nuxt/schema'
import type { DrizzleDatasources, NamedDrizzleDatasource } from './utils/types'
import type { DrizzleDatasourceName, NamedDrizzleDatasourceFactory } from '#nuxt-drizzle/virtual/datasources'
import type { PrimitiveProps } from './lib/connectors/types'

declare module '#nuxt-drizzle/virtual/datasources' {
  export type { DrizzleDatasources, NamedDrizzleDatasource }
}

export type DrizzleRuntimeConfig = {
  drizzle?: {
    [TName in DrizzleDatasourceName]?: NamedDrizzleDatasourceFactory<TName>['createDb'] extends (...args: [infer TConfig, ...any]) => any
      ? PrimitiveProps<TConfig>
      : unknown;
  }
}

declare module '@nuxt/schema' {
  interface RuntimeConfig extends DrizzleRuntimeConfig {}
}

declare module 'nitropack/types' {
  interface NitroRuntimeHooks {
    'drizzle:init': (event?: H3Event) => HookResult
    'drizzle:init:after': (datasources: DrizzleDatasources) => HookResult
  }
}
declare module 'h3' {
  interface H3EventContext {
    drizzle: DrizzleDatasources
  }
}

export {}
