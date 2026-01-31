export default defineEventHandler(async (event) => {
  const { db, schema } = useDrizzle(event, 'bar')
  const baz = await db.select().from(schema.baz).limit(10)
  return { baz }
})
