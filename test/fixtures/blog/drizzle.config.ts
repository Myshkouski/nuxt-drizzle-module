import { defineConfig } from '@nuxt-drizzle/utils'

export default defineConfig({
  dialect: 'sqlite',
  schema: './server/db/schema.ts',
  out: './server/db/migrations',
  dbCredentials: {
    url: 'file:./db.sqlite',
  },
}, __dirname)
