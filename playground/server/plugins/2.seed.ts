import { consola } from 'consola'

export default defineNitroPlugin((nitro) => {
  nitro.hooks.hookOnce('drizzle:migrated', async (datasources) => {
    consola.info('Seed started...')
    await datasources.bar.db.insert(datasources.bar.schema.baz).values([
      { id: '1', data: 'hello, I\'m baz from bar!' },
    ])
    await datasources.foo.db.insert(datasources.foo.schema.qux).values([
      { id: '1', data: 'hello, I\'m qux from foo!' },
    ])
    consola.info('Seed completed!')
  })
})
