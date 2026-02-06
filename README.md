# Nuxt Drizzle

> **⚠️ Under Heavy Development** - API may change until v1 release

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![License][license-src]][license-href]

Nuxt module for automating Drizzle ORM setup with support for multiple datasources and conditional database driver imports.

- [✨ &nbsp;Release Notes](/CHANGELOG.md)

## Try it Online

[![Open in Stackblitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/Myshkouski/nuxt-drizzle)

Open the playground in Stackblitz to try Nuxt Drizzle without any local setup.

## Features

- 🚅 **Multiple Datasources** - Support for multiple named database connections
- 📦 **Conditional imports** - Avoid bundling unused database drivers
- 🔧 **Seamless Nuxt integration** - Auto-discovers Drizzle configs in subdirectories
- 🛠️ **Migration support** - Built-in migration handling with hooks
- ✅ **Multi-database support** - SQLite, PostgreSQL, and MySQL

## Quick Setup

1. Install the module:

```bash
# Add Nuxt module
pnpx nuxt module add @nuxt-drizzle/module

# Add utils for Drizzle config
pnpm add -D @nuxt-drizzle/utils
```

2. Install the database driver(s) you need (optional - drivers are bundled, but installing them explicitly ensures they're available):

```bash
# For SQLite
pnpm add drizzle-orm @libsql/client

# For PostgreSQL
pnpm add drizzle-orm postgres

# For MySQL
pnpm add drizzle-orm mysql2
```

3. Configure your database connections in `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  modules: ['@nuxt-drizzle/utils'],
  runtimeConfig: {
    drizzle: {
      // Named datasources with their connection URLs
      users: {
        url: 'file::memory:',
        // or: 'postgresql://user:password@localhost:5432/db'
      },
      content: {
        url: 'file::memory:',
      },
    },
  },
  // Optional: customize where to search for drizzle configs
  drizzle: {
    baseDir: '~~/server/drizzle',
    datasource: {
      content: {
        connector: 'sqlite',
      },
      users: {
        connector: 'sqlite',
      },
    }
  }
})
```

4. Create Drizzle config files for each datasource in subdirectories:

```ts
// server/drizzle/users/drizzle.config.ts
import { defineConfig } from '@nuxt-drizzle/utils/config'

export default defineConfig({
  dialect: 'sqlite', // or 'postgresql', 'mysql'
  schema: './schema.ts',
  out: './migrations',
  strict: true,
}, __dirname)
```

## Directory Structure

```
server/
└── drizzle/
    ├── users/
    │   ├── drizzle.config.ts
    │   ├── schema.ts
    │   └── migrations/
    └── content/
        ├── drizzle.config.ts
        ├── schema.ts
        └── migrations/
```

## Usage

### Accessing a Datasource

Use `useDrizzle(event, name)` to access a specific datasource:

```ts
// server/api/users.get.ts
export default defineEventHandler(async (event) => {
  const { db, schema } = useDrizzle(event, 'users')
  return await db.select().from(schema.users)
})
```

### Defining Schema

```ts
// server/drizzle/users/schema.ts
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'

export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
})
```

### Migrations

The module provides a `useDrizzleMigrations(name)` helper and hooks for running migrations:

```ts
// server/plugins/migrate.ts
import type { DrizzleDatasources } from '#nuxt-drizzle/virtual/datasources'

export default defineNitroPlugin((nitro) => {
  nitro.hooks.hookOnce('drizzle:created', async (datasources: DrizzleDatasources) => {
    for (const [name, datasource] of Object.entries(datasources)) {
      const migrations = await useDrizzleMigrations(name as keyof DrizzleDatasources)
      if (!migrations) continue
      
      for await (const { id, query } of migrations) {
        await datasource.db.run(query)
      }
    }
    
    nitro.hooks.callHook('drizzle:migrated', datasources)
  })
})
```

### Seeding Data

Use the `drizzle:migrated` hook to seed data:

```ts
// server/plugins/seed.ts
export default defineNitroPlugin((nitro) => {
  nitro.hooks.hookOnce('drizzle:migrated', async (datasources) => {
    await datasources.users.db.insert(datasources.users.schema.users).values([
      { id: '1', name: 'John Doe', email: 'john@example.com' },
    ])
  })
})
```

## Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `baseDir` | `string` | `./server/drizzle` | Directory to search for Drizzle configs |
| `configPattern` | `string \| string[]` | `['*/drizzle.config.*', '*/drizzle-*.config.*']` | Glob patterns for Drizzle config files |

## Datasource Naming

Datasource names are derived from the directory containing the `drizzle.config.ts` file:

- `server/drizzle/users/drizzle.config.ts` → datasource named `users`
- `server/drizzle/content/drizzle.config.ts` → datasource named `content`

## Supported Databases

| Database | Dialect | Driver | Package |
|----------|---------|--------|---------|
| SQLite | `sqlite` | `libsql` | `@libsql/client` |
| PostgreSQL | `postgresql` | `postgres` | `postgres` |
| MySQL | `mysql` | `mysql2` | `mysql2` |

## Nitro Database Integration

The module integrates with Nitro's experimental database feature:

```ts
export default defineNuxtConfig({
  nitro: {
    experimental: {
      database: true,
    },
    database: {
      users: {
        connector: 'sqlite',
      },
    },
  },
})
```

## API Reference

### `useDrizzle(event, name)`

Returns the database instance and schema for a named datasource.

```ts
const { db, schema } = useDrizzle(event, 'users')
```

### `useDrizzleMigrations(name)`

Returns an async iterator of migration files for a datasource.

```ts
const migrations = await useDrizzleMigrations('users')
```

### Nitro Hooks

- `drizzle:created` - Called when datasources are created, receives `DrizzleDatasources`
- `drizzle:migrated` - Called after migrations complete, receives `DrizzleDatasources`

<details>
  <summary>Local development</summary>
  
  ```bash
  # Install dependencies
  pnpm install
  
  # Generate type stubs
  pnpm run dev:prepare
  
  # Develop with the playground
  pnpm run dev
  
  # Build the playground
  pnpm run dev:build
  
  # Run ESLint
  pnpm run lint
  
  # Run Vitest
  pnpm run test
  pnpm run test:watch
  
  # Release new version
  pnpm run release
  ```

</details>


<!-- Badges -->
[npm-version-src]: https://img.shields.io/npm/v/@nuxt-drizzle/module/latest.svg?style=flat&colorA=020420&colorB=00DC82
[npm-version-href]: https://npmjs.com/package/@nuxt-drizzle/module

[npm-downloads-src]: https://img.shields.io/npm/dm/@nuxt-drizzle/module.svg?style=flat&colorA=020420&colorB=00DC82
[npm-downloads-href]: https://npm.chart.dev/@nuxt-drizzle/module

[license-src]: https://img.shields.io/npm/l/@nuxt-drizzle/module.svg?style=flat&colorA=020420&colorB=00DC82
[license-href]: https://npmjs.com/package/@nuxt-drizzle/module
