import { defineConfig } from '@nuxt-drizzle/utils'

export default defineConfig({
  strict: true,
  dialect: 'sqlite',
  schema: [
    './sqlite/schema/posts.ts',
    './sqlite/schema/comments.ts',
  ],
  out: './sqlite/migrations',
}, __dirname)
