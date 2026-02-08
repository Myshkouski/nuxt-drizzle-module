import stripIndent from 'strip-indent'
import type { ModuleContext } from '@nuxt-drizzle/utils/context'
import { VirtualModules } from '../utils/const'

export async function typeDeclarations(context: ModuleContext) {
  const datasources = await context.resolve()

  return stripIndent(/* ts */`
    type DrizzleHelpers = {
      ${
        datasources.length > 0
          ? datasources.map(({ name, dialect, imports: { helpers } }) => {
              if (['postgresql', 'mysql', 'sqlite'].includes(dialect)) {
                return `['${name}']: typeof import('${helpers}/${dialect}');\n`
              }
              return ''
            }).join('')
          : `[TName in DrizzleDatasourceName]: any;`
      }
    };

    declare module '${VirtualModules.HELPERS}' {
      export type { DrizzleHelpers };
      export const helpers: DrizzleHelpers;
    }
  `)
}

export async function runtime(context: ModuleContext) {
  const datasources = await context.resolve()

  return stripIndent(/* js */ `
    const helpers = {};
    ${
      datasources.map(({ name, dialect, imports: { helpers } }, index) => {
        if (['postgresql', 'mysql', 'sqlite'].includes(dialect)) {
          return stripIndent(/* js */`
            import * as helpers_${index} from '${helpers}/${dialect}';
            helpers['${name}'] = helpers_${index};
          `)
        }

        return ''
      }).join('\n')
    }
    export { helpers };
  `)
}
