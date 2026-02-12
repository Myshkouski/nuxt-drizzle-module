import type { DrizzleDatasources, NamedDrizzleDatasource } from './utils/types'
import type { DrizzleDatasourceName, NamedDrizzleDatasourceFactory } from '#nuxt-drizzle/virtual/datasources'

declare module '#nuxt-drizzle/virtual/datasources' {
  export type { DrizzleDatasources, NamedDrizzleDatasource }
}

export type DrizzleRuntimeConfig = {
  drizzle?: {
    [TName in DrizzleDatasourceName]?: NamedDrizzleDatasourceFactory<TName>['createDb'] extends (...args: [infer TConfig, ...any]) => any
      ? TConfig
      : unknown;
  }
}

declare module '@nuxt/schema' {
  interface RuntimeConfig extends DrizzleRuntimeConfig {}
}

declare module 'nitropack/types' {
  interface NitroRuntimeHooks {
    'drizzle:init': (event?: H3Event) => HookResult;
    'drizzle:init:after': (datasources: DrizzleDatasources) => HookResult;
  }
}
declare module 'h3' {
  interface H3EventContext {
    drizzle: DrizzleDatasources;
  }
}

export {}
