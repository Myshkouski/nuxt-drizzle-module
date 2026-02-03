import { resolve } from 'node:path'
import { describe, it, expect } from 'vitest'
import { setup, $fetch } from '@nuxt/test-utils/e2e'

describe('drizzle datasources', async () => {
  await setup({
    rootDir: resolve(import.meta.dirname, '..'),
  })

  describe('users datasource', () => {
    it('should return seeded authors', async () => {
      const response = await $fetch('/api/v1/users')
      expect(response).toHaveProperty('authors')
      expect(response.authors).toBeInstanceOf(Array)
      expect(response.authors).toHaveLength(2)

      // Verify author data structure
      const johnDoe = response.authors.find((a: any) => a.id === '1')
      expect(johnDoe).toBeDefined()
      expect(johnDoe!.name).toBe('John Doe')
      expect(johnDoe!.email).toBe('john@example.com')

      const janeSmith = response.authors.find((a: any) => a.id === '2')
      expect(janeSmith).toBeDefined()
      expect(janeSmith!.name).toBe('Jane Smith')
      expect(janeSmith!.email).toBe('jane@example.com')
    })
  })

  describe('content datasource', () => {
    it('should return seeded posts', async () => {
      const response = await $fetch('/api/v1/content')
      expect(response).toHaveProperty('posts')
      expect(response.posts).toBeInstanceOf(Array)
      expect(response.posts).toHaveLength(2)

      // Verify post data structure
      const firstPost = response.posts.find((p: any) => p.id === '1')
      expect(firstPost).toBeDefined()
      expect(firstPost!.title).toBe('First Post')
      expect(firstPost!.content).toBe('Content of first post')
      expect(firstPost!.authorId).toBe('1')
      expect(firstPost!.createdAt).toBeDefined()
    })

    it('should return seeded comments', async () => {
      const response = await $fetch('/api/v1/content')
      expect(response).toHaveProperty('comments')
      expect(response.comments).toBeInstanceOf(Array)
      expect(response.comments).toHaveLength(2)

      // Verify comment data structure
      const firstComment = response.comments.find((c: any) => c.id === '1')
      expect(firstComment).toBeDefined()
      expect(firstComment!.postId).toBe('1')
      expect(firstComment!.authorId).toBe('2')
      expect(firstComment!.content).toBe('Great first post!')
      expect(firstComment!.createdAt).toBeDefined()
    })
  })
})
