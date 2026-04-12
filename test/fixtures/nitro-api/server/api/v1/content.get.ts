export default defineEventHandler(async (event) => {
  const { db, schema } = useDrizzle(event, 'content')
  const { batch } = useDrizzleHelpers('content')
  const [posts, comments] = await batch(db, [
    db.select().from(schema.posts).limit(10),
    db.select().from(schema.comments).limit(10),
  ])
  return {
    posts,
    comments,
  }
})
