import { defineConfig } from '@nuxt-drizzle/utils'

export default defineConfig({
  dialect: 'sqlite',
  schema: [
    './schema/posts.ts',
    './schema/comments.ts',
  ],
  out: './migrations',
}, __dirname)
