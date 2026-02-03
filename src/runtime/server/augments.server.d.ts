import type { DrizzleDatasources, NamedDrizzleDatasource, Migration } from './utils/drizzle'

declare module 'nitropack/types' {
  interface NitroRuntimeHooks {
    'drizzle:created': (datasources: DrizzleDatasources) => void
  }
}

declare module '#nuxt-drizzle/virtual/datasources' {
  export type { DrizzleDatasources, NamedDrizzleDatasource, Migration }
}

declare module 'h3' {
  interface H3EventContext {
    drizzle: DrizzleDatasources
  }
}

export {}
