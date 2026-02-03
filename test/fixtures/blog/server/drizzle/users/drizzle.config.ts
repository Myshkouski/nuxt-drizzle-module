import { defineConfig } from '@nuxt-drizzle/utils'

export default defineConfig({
  dialect: 'sqlite',
  schema: './schema.ts',
  out: './migrations',
}, __dirname)
