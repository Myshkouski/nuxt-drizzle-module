export const MODULE_NAME = 'nuxt-drizzle' as const
export const VIRTUAL_MODULE_ID_PREFIX = `#${MODULE_NAME}/virtual` as const
export const VirtualModules = {
  DATASOURCE: `${VIRTUAL_MODULE_ID_PREFIX}/datasources` as const,
  DATASOURCE_TYPES: `types/${MODULE_NAME}-datasources.d.ts` as const,
  HELPERS: `${VIRTUAL_MODULE_ID_PREFIX}/helpers` as const,
  HELPERS_TYPES: `types/${MODULE_NAME}-helpers.d.ts` as const,
} as const
