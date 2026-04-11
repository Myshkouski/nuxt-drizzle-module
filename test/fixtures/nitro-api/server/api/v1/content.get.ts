export default defineEventHandler(async (event) => {
  const { db, schema } = useDrizzle(event, 'content')
  const [posts, comments] = await Promise.all([
    db.select().from(schema.posts).limit(10),
    db.select().from(schema.comments).limit(10),
  ])
  return {
    posts,
    comments,
  }
})
