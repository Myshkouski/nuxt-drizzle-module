export default defineNuxtConfig({
  extends: [
    '../test/fixtures/nuxt-app',
  ],
  modules: [
    '@nuxt/devtools',
  ],
  devtools: {
    enabled: false,
  //   timeline: {
  //     enabled: true,
  //   },
  },
  runtimeConfig: {
    drizzle: {
      content: {
        database: 'content',
      },
      users: {
        database: 'users',
      },
    },
  },
  compatibilityDate: 'latest',
  drizzle: {
    datasource: {
      content: {
        connector: 'pglite',
      },
      users: {
        connector: 'pglite',
      },
    },
  },
})
