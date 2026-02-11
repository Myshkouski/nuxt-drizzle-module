import type { DrizzleDatasources, NamedDrizzleDatasource } from './utils/types'
import type { DrizzleDatasourceName, NamedDrizzleDatasourceFactory } from '#nuxt-drizzle/virtual/datasources'

declare module 'nitropack/types' {
  interface NitroRuntimeHooks {
    'drizzle:created': (datasources: DrizzleDatasources) => void
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
