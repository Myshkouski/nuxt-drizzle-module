import { useDatabase } from 'nitropack/runtime'
import { defineDrizzleDb } from '../../utils/drizzle'
import { drizzle } from 'db0/integrations/drizzle'

export default defineDrizzleDb(<
  TSchema extends Record<string, any>,
>() => {
  const db0 = useDatabase()
  return drizzle<TSchema>(db0)
})
