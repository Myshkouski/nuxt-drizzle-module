import type { DrizzleDatasourceName } from '#nuxt-drizzle/virtual/datasources'
import { helpers } from '#nuxt-drizzle/virtual/helpers'

export function useDrizzleHelpers<TName extends DrizzleDatasourceName>(name: TName) {
  return helpers[name]
}
