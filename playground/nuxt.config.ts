export default defineNuxtConfig({
  modules: [
    '@nuxt/devtools',
    '@nuxt/ui',
    // 'nuxt-drizzle',
    '../src/module',
  ],
  devtools: {
    enabled: true,
    timeline: {
      enabled: true,
    },
  },
  runtimeConfig: {
    drizzle: {
      bar: {
        url: 'file::memory:',
      },
      foo: {
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
      bar: {
        connector: 'sqlite',
      },
      foo: {
        connector: 'sqlite',
      },
    },
  },
})
