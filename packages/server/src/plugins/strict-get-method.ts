import type { StandardHandlerOptions, StandardHandlerPlugin } from '../adapters/standard'
import type { Context } from '../context'
import { fallbackContractConfig, ORPCError } from '@orpc/contract'

export interface StrictGetMethodPluginOptions {

  /**
   * The error thrown when a GET request is made to a procedure that doesn't allow GET.
   *
   * @default new ORPCError('METHOD_NOT_SUPPORTED')
   */
  error?: InstanceType<typeof ORPCError>
}

const STRICT_GET_METHOD_PLUGIN_IS_GET_METHOD_CONTEXT_SYMBOL = Symbol('STRICT_GET_METHOD_PLUGIN_IS_GET_METHOD_CONTEXT')

export class StrictGetMethodPlugin<T extends Context> implements StandardHandlerPlugin<T> {
  private readonly error: Exclude<StrictGetMethodPluginOptions['error'], undefined>

  order = 7_000_000

  constructor(options: StrictGetMethodPluginOptions = {}) {
    this.error = options.error ?? new ORPCError('METHOD_NOT_SUPPORTED')
  }

  init(options: StandardHandlerOptions<T>): void {
    options.rootInterceptors ??= []
    options.clientInterceptors ??= []

    options.rootInterceptors.unshift((options) => {
      const isGetMethod = options.request.method === 'GET'

      return options.next({
        ...options,
        context: {
          ...options.context,
          [STRICT_GET_METHOD_PLUGIN_IS_GET_METHOD_CONTEXT_SYMBOL]: isGetMethod,
        },
      })
    })

    options.clientInterceptors.unshift((options) => {
      if (typeof options.context[STRICT_GET_METHOD_PLUGIN_IS_GET_METHOD_CONTEXT_SYMBOL] !== 'boolean') {
        throw new TypeError('[StrictGetMethodPlugin] strict GET method context has been corrupted or modified by another plugin or interceptor')
      }

      const procedureMethod = fallbackContractConfig('defaultMethod', options.procedure['~orpc'].route.method)

      if (options.context[STRICT_GET_METHOD_PLUGIN_IS_GET_METHOD_CONTEXT_SYMBOL] && procedureMethod !== 'GET') {
        throw this.error
      }

      return options.next()
    })
  }
}
