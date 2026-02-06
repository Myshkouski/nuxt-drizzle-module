import path from "path";

export default defineNuxtConfig({
  modules: [
    '@nuxt/devtools',
  ],
  extends: [
    '../test/fixtures/nuxt-app',
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
