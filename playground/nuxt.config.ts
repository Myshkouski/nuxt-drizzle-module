export default defineNuxtConfig({
  modules: [
    '@nuxt/devtools',
    '@nuxt/ui',
  ],
  devtools: {
    enabled: true,
    timeline: {
      enabled: true,
    },
  },
  runtimeConfig: {
    drizzle: {
      content: {
        url: 'file::memory:?cache=shared',
      },
      users: {
        url: 'file::memory:?cache=shared',
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
