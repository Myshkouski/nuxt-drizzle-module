import { defineConfig } from '@nuxt-drizzle/utils'

export default defineConfig({
  dialect: 'sqlite',
  schema: './schema.ts',
  out: './migrations',
  dbCredentials: {
    url: 'file::memory:',
  },
}, __dirname)
