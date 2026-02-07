import path from 'node:path'
import nuxtDrizzle from '../../../src/module'

export default defineNuxtConfig({
  modules: [
    nuxtDrizzle,
  ],
  compatibilityDate: 'latest',
  nitro: {
    typescript: {
      tsConfig: {
        include: [
          // Fix types when referencing module using import statement
          path.resolve(import.meta.dirname, '../../../src/runtime/server'),
        ],
      },
    },
  },
  drizzle: {
    baseDir: path.resolve(import.meta.dirname, './server/drizzle'),
    datasource: {
      content: {
        connector: 'sqlite',
      },
      users: {
        connector: 'pglite',
      },
    },
  },
})
