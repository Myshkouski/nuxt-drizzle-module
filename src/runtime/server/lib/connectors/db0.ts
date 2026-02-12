import { useDatabase } from 'nitropack/runtime'
import { defineDrizzle } from '../../utils/db/defineDrizzle'
import { drizzle } from 'db0/integrations/drizzle'

export default defineDrizzle(<
  TSchema extends Record<string, any>,
>() => {
  const db0 = useDatabase()
  return drizzle<TSchema>(db0)
})
