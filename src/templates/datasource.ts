import stripIndent from 'strip-indent'
import type { ModuleContext } from '../context'
import { VirtualModules } from '../utils/const'

export async function typeDeclarations(context: ModuleContext) {
  const datasources = await context.resolve()

  return stripIndent(/* ts */`
    type DrizzleDatasourceName = ${
      datasources.length > 0  
    ? JSON.stringify(datasources.map(datasourceModule => datasourceModule.name)) + '[number]'
        : 'string'
    };

    interface DrizzleDatasourceFactory<
      TCreate extends (config: any, schema: TSchema) => any,
      TSchema extends {}
    > {
      readonly createDb: TCreate
      readonly schema: TSchema
    }

    type NamedDrizzleDatasourceFactory<TName extends DrizzleDatasourceName> =
      ${
        datasources.map(({ name, imports }) => {
          return stripIndent(/*ts*/`
            TName extends '${name}'
              ? DrizzleDatasourceFactory<
                  typeof import('${imports.connector}').default<${schemaType(imports.schema)}>, 
                  ${schemaType(imports.schema)}
                >
              :`
          )
        }).join('')
      }
      DrizzleDatasourceFactory<
        (
          config: any,
          schema: {}
        ) => any,
        {}
      >;

    type DrizzleDatasourceFactories = {
      readonly [TName in DrizzleDatasourceName]: NamedDrizzleDatasourceFactory<TName>
    }

    declare module '${VirtualModules.DATASOURCE}' {
      export type { DrizzleDatasourceName, NamedDrizzleDatasourceFactory, DrizzleDatasourceFactories, NamedDrizzleDatasourceFactory };
      export const datasourceFactories: DrizzleDatasourceFactories;
    }
  `)
}

function schemaType(imports: string[]) {
  const importedTypes = imports.map((id) => `& typeof import('${id}')`).join(' ')
  return /*ts*/`{} ${importedTypes}`
}

export async function runtime(context: ModuleContext) {
  const datasources = await context.resolve()

  return stripIndent(/* js */ `
    const datasourceFactories = {};
    ${
      datasources.map(({ name, imports: { schema, connector } }, dbModuleIndex) => {
        return stripIndent(/* js */`
          import dbModule${dbModuleIndex} from '${connector}';
          ${
            schema.map((id, schemaModuleIdIndex) => {
              return `import * as schemaModule${dbModuleIndex}_${schemaModuleIdIndex} from '${id}';`
            }).join('\n')
          }

          datasourceFactories['${name}'] = {
            createDb: dbModule${dbModuleIndex},
            schema:
              Object.assign(
                {}${schema.map((id, schemaModuleIdIndex) => `,\nschemaModule${dbModuleIndex}_${schemaModuleIdIndex}`).join('')}
              )
          };
        `)
      }).join('\n')
    }
    export { datasourceFactories };
  `)
}
