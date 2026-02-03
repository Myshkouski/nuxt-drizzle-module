export default defineEventHandler(async (event) => {
  const { db, schema } = useDrizzle(event, 'content')
  const posts = await db.select().from(schema.posts).limit(10)
  const comments = await db.select().from(schema.comments).limit(10)
  return {
    posts,
    comments,
  }
})
