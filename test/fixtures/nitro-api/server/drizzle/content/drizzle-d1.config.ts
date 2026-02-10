import { defineConfig } from '@nuxt-drizzle/utils/config'

export default defineConfig({
  strict: true,
  dialect: 'sqlite',
  driver: 'd1-http',
  schema: [
    './sqlite/schema/posts.ts',
    './sqlite/schema/comments.ts',
  ],
  out: './sqlite/migrations',
}, __dirname)
