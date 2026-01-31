import { defineConfig } from '@nuxt-drizzle/utils'

export default defineConfig({
  strict: true,
  dialect: 'postgres',
  schema: [
    './postgres/schema/baz.ts',
  ],
  out: './postgres/migrations',
  /**
   * Ignored by 'nuxt-drizzle' plugin.
   */
  dbCredentials: {
    url: process.env.DRIZZLE_CREDENTIALS_URL,
  },
}, __dirname)
