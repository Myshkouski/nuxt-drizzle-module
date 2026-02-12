export function defineDrizzle<
  TCreate extends <TSchema extends Record<string, any>>(config: any, schema: TSchema) => any,
>(
  create: TCreate,
): TCreate {
  return create
}
