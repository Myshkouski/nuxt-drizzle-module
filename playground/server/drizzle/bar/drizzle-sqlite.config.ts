import { defineConfig } from '@nuxt-drizzle/utils'

export default defineConfig({
  strict: true,
  dialect: 'sqlite',
  schema: [
    './sqlite/schema/baz.ts',
  ],
  out: './sqlite/migrations',
}, __dirname)
