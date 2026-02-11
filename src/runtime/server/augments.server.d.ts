import type { HookResult } from 'nuxt/schema'
import type { DrizzleDatasources, NamedDrizzleDatasource } from './utils/types'
import type { H3Event } from 'h3'

declare module 'nitropack/types' {
  interface NitroRuntimeHooks {
    'drizzle:init': (event?: H3Event) => HookResult
    'drizzle:init:after': (datasources: DrizzleDatasources) => HookResult
    'drizzle:migrate': (datasources: DrizzleDatasources) => HookResult
    'drizzle:migrate:after': (datasources: DrizzleDatasources) => HookResult
  }
}

declare module '#nuxt-drizzle/virtual/datasources' {
  export type { DrizzleDatasources, NamedDrizzleDatasource }
}

declare module 'h3' {
  interface H3EventContext {
    drizzle: DrizzleDatasources
  }
}

export {}
