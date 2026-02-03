import { defineConfig } from '@nuxt-drizzle/utils'

export default defineConfig({
  strict: true,
  dialect: 'postgresql',
  schema: [
    './postgresql/schema/posts.ts',
    './postgresql/schema/comments.ts',
  ],
  out: './postgresql/migrations',
  dbCredentials: {
    url: process.env.DRIZZLE_CONTENT_POSTGRES_URL!
  }
}, __dirname)
