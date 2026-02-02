export default defineEventHandler(async (event) => {
  const { db, schema } = useDrizzle(event, 'users')
  const authors = await db.select().from(schema.authors).limit(10)
  return { authors }
})
