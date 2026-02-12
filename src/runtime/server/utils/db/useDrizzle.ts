import type { H3Event } from 'h3'
import type { DrizzleDatasourceName } from '#nuxt-drizzle/virtual/datasources'
import type { NamedDrizzleDatasource } from '../types'

export function useDrizzle<TName extends DrizzleDatasourceName>(event: H3Event, name: TName): NamedDrizzleDatasource<TName> {
  return event.context.drizzle[name]!
}
