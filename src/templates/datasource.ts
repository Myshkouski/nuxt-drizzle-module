import stripIndent from 'strip-indent'
import type { ModuleContext } from '../context'
import { VirtualModules } from '../utils/const'

export async function typeDeclarations(context: ModuleContext) {
  const datasources = await context.resolve()

  return stripIndent(/* ts */`
    type DrizzleDatasourceName = ${JSON.stringify(datasources.map(datasourceModule => datasourceModule.name))}[number];

    type NamedDrizzleDatasourceFactory<TName extends DrizzleDatasourceName> =
      ${datasources.map(({ name, imports }) => {
        return /* ts */ `TName extends '${name}'
          ? {
              readonly createDb: typeof import('${imports.connector}').default;
              readonly schema: {} ${imports.schema.map((id) => {
                  return /* ts */`& typeof import('${id}')`
                })
              };
            }\n:`
      }).join('')}
      never;

    type DrizzleDatasourceFactories = [DrizzleDatasourceName] extends [never]
      ? Record<string, {
        createDb: <TSchema extends Record<string, unknown>>(
          config: any,
          schema: TSchema
        ) => Promise<any> | any,
        schema: {}
        $config: any
      }>
      : {
        readonly [TName in DrizzleDatasourceName]: NamedDrizzleDatasourceFactory<TName>
      }

    declare module '${VirtualModules.DATASOURCE}' {
      export type { DrizzleDatasourceName, NamedDrizzleDatasourceFactory };
      export const datasources: DrizzleDatasourceFactories
    }
  `)
}

export async function runtime(context: ModuleContext) {
  const datasources = await context.resolve()

  return stripIndent(/* js */ `
    const datasources = {};
    ${
      datasources.map(({ name, imports: { schema, connector } }, dbModuleIndex) => {
        return stripIndent(/* js */`
          import dbModule${dbModuleIndex} from '${connector}';
          ${schema.map((id, schemaModuleIdIndex) => `import * as schemaModule${dbModuleIndex}_${schemaModuleIdIndex} from '${schema}';`)}

          datasources['${name}'] = {
            createDb: dbModule${dbModuleIndex},
            schema:
              Object.assign(
                {}${schema.map((id, schemaModuleIdIndex) => `,\nschemaModule${dbModuleIndex}_${schemaModuleIdIndex}`).join('')}
              )
          };
        `)
      }).join('\n')
    }
    export { datasources };
  `)
}
