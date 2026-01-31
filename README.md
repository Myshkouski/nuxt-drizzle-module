<!--
Get your module up and running quickly.

Find and replace all on all files (CMD+SHIFT+F):
- Name: My Module
- Package name: my-module
- Description: My new Nuxt module
-->

# Nuxt Drizzle

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![License][license-src]][license-href]
[![Nuxt][nuxt-src]][nuxt-href]

Nuxt module for automating Drizzle ORM setup with conditional database driver imports to prevent unused dependencies in the final bundle.

- [✨ &nbsp;Release Notes](/CHANGELOG.md)
<!-- - [🏀 Online playground](https://stackblitz.com/github/your-org/my-module?file=playground%2Fapp.vue) -->
<!-- - [📖 &nbsp;Documentation](https://example.com) -->

## Features

- 🚀 Automatic database type detection from drizzle config
- 📦 Conditional imports to avoid bundling unused database drivers
- 🔧 Seamless integration with Nuxt's build process
- 🛠️ Simple API for database connections and migrations
- ✅ Support for SQLite, PostgreSQL, and MySQL

## Quick Setup

1. Install the module and required dependencies:

```bash
npx nuxt module add nuxt-drizzle
```

2. Install the database driver(s) you need (only the ones you'll use):

```bash
# For SQLite
npm install drizzle-orm better-sqlite3

# For PostgreSQL
npm install drizzle-orm postgres

# For MySQL
npm install drizzle-orm mysql2
```

3. Set your database URL in environment variables:

```bash
# .env
DRIZZLE_DATABASE_URL="sqlite:./database.db"
# or
DRIZZLE_DATABASE_URL="postgresql://user:password@localhost:5432/db"
# or
DRIZZLE_DATABASE_URL="mysql://user:password@localhost:3306/db"
```

4. Add to your `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  modules: ['nuxt-drizzle'],
  drizzle: {
    // Optional: customize paths
    schemaPath: './server/db/schema.ts',
    migrationFolder: './server/db/migrations'
  }
})
```

That's it! The module will automatically detect your database type and set up Drizzle ORM ✨

## Supported Databases

- **SQLite**: URLs starting with `sqlite:` (uses `better-sqlite3`)
- **PostgreSQL**: URLs starting with `postgresql:` or `postgres:` (uses `postgres`)
- **MySQL**: URLs starting with `mysql:` (uses `mysql2`)

## Usage

In your server-side code (API routes, server utils, etc.):

```ts
// server/api/users.get.ts
import { useDrizzle } from '#imports'
import { users } from '~/server/db/schema'

export default defineEventHandler(async () => {
  const db = useDrizzle()
  return await db.select().from(users)
})
```

Define your schema in `server/db/schema.ts`:

```ts
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'

export const users = sqliteTable('users', {
  id: integer('id').primaryKey(),
  name: text('name').notNull(),
})
```

## Migrations

The module automatically runs migrations on startup if a `migrationFolder` is configured.

To create and manage migrations, use `drizzle-kit`:

```bash
npx drizzle-kit generate
npx drizzle-kit push
```


## Contribution

<details>
  <summary>Local development</summary>
  
  ```bash
  # Install dependencies
  npm install
  
  # Generate type stubs
  npm run dev:prepare
  
  # Develop with the playground
  npm run dev
  
  # Build the playground
  npm run dev:build
  
  # Run ESLint
  npm run lint
  
  # Run Vitest
  npm run test
  npm run test:watch
  
  # Release new version
  npm run release
  ```

</details>


<!-- Badges -->
[npm-version-src]: https://img.shields.io/npm/v/nuxt-drizzle/latest.svg?style=flat&colorA=020420&colorB=00DC82
[npm-version-href]: https://npmjs.com/package/nuxt-drizzle

[npm-downloads-src]: https://img.shields.io/npm/dm/nuxt-drizzle.svg?style=flat&colorA=020420&colorB=00DC82
[npm-downloads-href]: https://npm.chart.dev/nuxt-drizzle

[license-src]: https://img.shields.io/npm/l/nuxt-drizzle.svg?style=flat&colorA=020420&colorB=00DC82
[license-href]: https://npmjs.com/package/nuxt-drizzle

[nuxt-src]: https://img.shields.io/badge/Nuxt-020420?logo=nuxt
[nuxt-href]: https://nuxt.com
