import type { HookResult } from 'nuxt/schema'

declare module '@nuxt/schema' {
  interface RuntimeConfig {
    drizzle?: {
      [TName in DrizzleDatasourceName]?: NamedDrizzleDatasourceFactory<TName>['createDb'] extends (...args: [infer TConfig, ...any]) => any
        ? TConfig
        : unknown;
      [x: string]: any;
    }
  }
}
