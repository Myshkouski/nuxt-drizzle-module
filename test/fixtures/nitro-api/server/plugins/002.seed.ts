import { consola } from 'consola'
import { colorize } from 'consola/utils'
import type { NamedDrizzleDatasource } from '#nuxt-drizzle/virtual/datasources'

export default defineNitroPlugin((nitro) => {
  nitro.hooks.hookOnce('drizzle:migrated', async (datasources) => {
    consola.info('Seed started:', colorize('greenBright', 'users'))
    await seedUsers(datasources.users)
    consola.info('Seed completed:', colorize('greenBright', 'users'))

    consola.info('Seed started:', colorize('greenBright', 'content'))
    await seedContent(datasources.content)
    consola.info('Seed completed:', colorize('greenBright', 'content'))
  })
})

async function seedUsers({ db, schema }: NamedDrizzleDatasource<'users'>) {
  const { onConflictDoNothing } = useDrizzleHelpers('users')

  await onConflictDoNothing(
    useDrizzlePrimaryKey(schema.authors),
    db.insert(schema.authors).values([
      { id: 1, name: 'John Doe', email: 'john@example.com' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
    ]),
  )
}

async function seedContent({ db, schema }: NamedDrizzleDatasource<'content'>) {
  const { onConflictDoNothing } = useDrizzleHelpers('content')

  // Seed posts
  await onConflictDoNothing(
    useDrizzlePrimaryKey(schema.posts),
    db.insert(schema.posts).values([
      { id: 1, title: 'Nuxt Icon v1', description: 'Discover Nuxt Icon v1!', image: 'https://nuxt.com/assets/blog/nuxt-icon/cover.png', date: new Date('2024-11-25'), authors: [1, 2] },
      { id: 2, title: 'Nuxt 3.14', description: 'Nuxt 3.14 is out!', image: 'https://nuxt.com/assets/blog/v3.14.png', date: new Date('2024-11-04'), authors: [1] },
      { id: 3, title: 'Nuxt 3.13', description: 'Nuxt 3.13 is out!', image: 'https://nuxt.com/assets/blog/v3.13.png', date: new Date('2024-08-22'), authors: [2] },
    ]),
  )

  // Seed comments
  await onConflictDoNothing(
    useDrizzlePrimaryKey(schema.comments),
    db.insert(schema.comments).values([
      { id: 1, postId: 1, authorId: 2, content: 'Great first post!', createdAt: new Date('2024-11-25') },
      { id: 2, postId: 1, authorId: 1, content: 'Thanks for the comment!', createdAt: new Date('2024-11-25') },
    ]),
  )
}
