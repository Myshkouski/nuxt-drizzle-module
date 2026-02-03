export default defineNuxtConfig({
  modules: [
    '../../../src/module',
  ],
  runtimeConfig: {
    drizzle: {
      content: {
        url: ':memory:',
      },
      users: {
        url: ':memory:',
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
