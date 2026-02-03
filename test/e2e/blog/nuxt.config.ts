export default defineNuxtConfig({
  modules: [
    '../../../src/module',
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
    },
  },
})
