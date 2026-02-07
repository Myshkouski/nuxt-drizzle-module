import { defineConfig } from '@nuxt-drizzle/utils/config'

export default defineConfig({
  strict: true,
  dialect: 'mysql',
  schema: [
    './mysql/schema/posts.ts',
    './mysql/schema/comments.ts',
  ],
  out: './mysql/migrations',
}, __dirname)
