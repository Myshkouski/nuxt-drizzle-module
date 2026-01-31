import type { Datasources } from './utils/drizzle'

declare module 'nitropack/types' {
  interface NitroRuntimeHooks {
    'drizzle:created': (datasources: Datasources) => HookResult
  }
}

declare module '#nuxt-drizzle/virtual/datasources' {
  export type { Datasources }
}

declare module 'h3' {
  interface H3EventContext {
    drizzle: Datasources
  }
}

export {}
