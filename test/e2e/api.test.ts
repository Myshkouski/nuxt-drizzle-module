import { describe, it, expect } from 'vitest'
import { setup, $fetch } from '@nuxt/test-utils/e2e'

describe('drizzle datasources', async () => {
  await setup({
    rootDir: import.meta.dirname,
  })

  describe('users datasource', () => {
    it('should return seeded authors', async () => {
      const response = await $fetch('/api/v1/users')
      expect(response).toHaveProperty('authors')
      expect(response.authors).toBeInstanceOf(Array)
      expect(response.authors).toHaveLength(2)

      expect(response.authors).toEqual(
        JSON.parse(
          JSON.stringify([
            { id: 1, name: 'John Doe', email: 'john@example.com' },
            { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
          ]),
        ),
      )
    })
  })

  describe('content datasource', () => {
    it('should return seeded posts', async () => {
      const response = await $fetch('/api/v1/content')
      expect(response).toHaveProperty('posts')
      expect(response.posts).toBeInstanceOf(Array)
      expect(response.posts).toHaveLength(3)

      expect(response.posts).toEqual(
        JSON.parse(
          JSON.stringify([
            { id: 1, title: 'Nuxt Icon v1', description: 'Discover Nuxt Icon v1!', image: 'https://nuxt.com/assets/blog/nuxt-icon/cover.png', date: new Date('2024-11-25'), authors: [1, 2] },
            { id: 2, title: 'Nuxt 3.14', description: 'Nuxt 3.14 is out!', image: 'https://nuxt.com/assets/blog/v3.14.png', date: new Date('2024-11-04'), authors: [1] },
            { id: 3, title: 'Nuxt 3.13', description: 'Nuxt 3.13 is out!', image: 'https://nuxt.com/assets/blog/v3.13.png', date: new Date('2024-08-22'), authors: [2] },
          ]),
        ),
      )
    })

    it('should return seeded comments', async () => {
      const response = await $fetch('/api/v1/content')
      expect(response).toHaveProperty('comments')
      expect(response.comments).toBeInstanceOf(Array)
      expect(response.comments).toHaveLength(2)

      expect(response.comments).toEqual(
        JSON.parse(
          JSON.stringify([
            { id: 1, postId: 1, authorId: 2, content: 'Great first post!', createdAt: new Date('2024-11-25') },
            { id: 2, postId: 1, authorId: 1, content: 'Thanks for the comment!', createdAt: new Date('2024-11-25') },
          ]),
        ),
      )
    })
  })
})
