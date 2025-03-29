import type { Client, ORPCError, ORPCErrorJSON } from '@orpc/client'
import type { AnySchema, ErrorFromErrorMap, ErrorMap, InferSchemaInput, InferSchemaOutput } from '@orpc/contract'
import { toORPCError } from '@orpc/client'

export type ActionableError<T extends Error> = T extends ORPCError<infer U, infer V> ? ORPCErrorJSON<U, V> & { defined: true } : ORPCErrorJSON<string, unknown> & { defined: false }

export type UnactionableError<T> = T extends { defined: true } & ORPCErrorJSON<infer U, infer V> ? ORPCError<U, V> : Error

export interface ActionableClient<TInput, TOutput, TError> {
  (...rest: undefined extends TInput ? [input?: TInput] : [input: TInput]): Promise<
    | [error: null, data: TOutput]
    | [error: TError, data: undefined]
  >
}

export type ProcedureActionableClient<
  TInputSchema extends AnySchema,
  TOutputSchema extends AnySchema,
  TErrorMap extends ErrorMap,
> = ActionableClient<
  InferSchemaInput<TInputSchema>,
  InferSchemaOutput<TOutputSchema>,
  ActionableError<ErrorFromErrorMap<TErrorMap>>
>

export function createActionableClient<TInput, TOutput, TError extends Error>(
  client: Client<Record<never, never>, TInput, TOutput, TError>,
): ActionableClient<TInput, TOutput, ActionableError<TError>> {
  const action = async (input: TInput) => {
    try {
      return [null, await client(input)]
    }
    catch (error) {
      return [toORPCError(error).toJSON(), undefined]
    }
  }

  return action as any
}
