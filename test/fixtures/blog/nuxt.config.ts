import nuxtDrizzle from '../../../src/module'

export default defineNuxtConfig({
  modules: [
    nuxtDrizzle,
  ],
  runtimeConfig: {
    drizzle: {
      content: {
        url: 'file::memory:',
      },
      users: {
        url: 'file::memory:',
      },
    },
  },
  compatibilityDate: 'latest',
  drizzle: {
    datasource: {
      content: {
        connector: 'sqlite',
      },
      users: {
        connector: 'sqlite',
      },
    }
  },
})
