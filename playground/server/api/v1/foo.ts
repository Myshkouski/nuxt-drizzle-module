export default defineEventHandler(async (event) => {
  const { db, schema } = useDrizzle(event, 'foo')
  const qux = await db.select().from(schema.qux).limit(10)
  return { qux }
})
