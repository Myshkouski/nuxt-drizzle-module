export type PrimitiveProps<T> = {
  [K in keyof T]: T[K] extends Record<string, any>
    ? PrimitiveProps<T[K]>
    : T[K] extends (...args: any[]) => infer R
      ? Awaited<R> extends Primitive
        ? Awaited<R>
        : never
      : T[K] extends Primitive
        ? T[K]
        : never
}

export type Primitive = string | number | boolean | null | undefined
