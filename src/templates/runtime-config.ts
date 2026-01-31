import stripIndent from 'strip-indent'

export function typeDeclarations() {
  return stripIndent(/* ts */`
    declare module '@nuxt/schema' {
      interface RuntimeConfig {
        drizzle?: {
          [TName in DrizzleDatasourceName]?: NamedDrizzleDatasourceFactory<TName>['createDb'] extends (...args: [infer TConfig, ...any]) => any
            ? TConfig
            : unknown;
          [x: string]: any
        }
      }
    }
  `)
}
