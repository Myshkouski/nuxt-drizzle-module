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
  nitro: {
    // preset: 'cloudflare-module',
    cloudflare: {
      nodeCompat: true,
      deployConfig: true,
      wrangler: {
        d1_databases: [
          {
            binding: process.env.NUXT_DRIZZLE_CONTENT_BINDING || process.env.NITRO_CLOUDFLARE_D1_CONTENT_BINDING,
            database_id: process.env.NUXT_DRIZZLE_CONTENT_DATABASE_ID || process.env.NITRO_CLOUDFLARE_D1_CONTENT_DATABASE_ID,
          },
        ],
      },
    },
  },
})
