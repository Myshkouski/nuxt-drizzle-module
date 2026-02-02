export default defineNitroPlugin((nitro) => {
  nitro.hooks.hookOnce('drizzle:migrated', async (datasources) => {
    // Seed authors
    await datasources.users.db.insert(datasources.users.schema.authors).values([
      { id: '1', name: 'John Doe', email: 'john@example.com' },
      { id: '2', name: 'Jane Smith', email: 'jane@example.com' },
    ])

    // Seed posts
    await datasources.content.db.insert(datasources.content.schema.posts).values([
      { id: '1', title: 'First Post', content: 'Content of first post', authorId: '1', createdAt: new Date() },
      { id: '2', title: 'Second Post', content: 'Content of second post', authorId: '2', createdAt: new Date() },
    ])

    // Seed comments
    await datasources.content.db.insert(datasources.content.schema.comments).values([
      { id: '1', postId: '1', authorId: '2', content: 'Great first post!', createdAt: new Date() },
      { id: '2', postId: '1', authorId: '1', content: 'Thanks for the comment!', createdAt: new Date() },
    ])
  })
})
