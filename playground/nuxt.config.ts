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
        url: 'file::memory:',
      },
      users: {
        url: 'file::memory:',
      },
    },
  },
  compatibilityDate: 'latest',
  nitro: {
    experimental: {
      database: true,
    },
    database: {
      content: {
        connector: 'sqlite',
      },
      users: {
        connector: 'sqlite',
      },
    },
  },
})
