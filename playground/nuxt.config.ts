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
        // url: 'postgresql://postgres:postgres@localhost:5432/postgres'
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
        // connector: 'postgresql',
      },
      users: {
        connector: 'sqlite',
      },
    },
  },
})
