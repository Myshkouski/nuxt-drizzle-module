import { defineConfig } from '@nuxt-drizzle/utils'

export default defineConfig({
  strict: true,
  dialect: 'sqlite',
  schema: './schema.ts',
  out: './migrations',
  casing: 'snake_case',
}, __dirname)
