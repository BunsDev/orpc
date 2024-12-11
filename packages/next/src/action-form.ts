import type { ANY_LAZY_PROCEDURE, ANY_PROCEDURE, CreateProcedureCallerOptions } from '@orpc/server'
import { createProcedureCaller, loadProcedure, ORPCError } from '@orpc/server'
import { OpenAPIDeserializer } from '@orpc/transformer'
import { forbidden, notFound, unauthorized } from 'next/navigation'

export type FormAction = (input: FormData) => Promise<void>

export function createFormAction<T extends ANY_PROCEDURE | ANY_LAZY_PROCEDURE>(opt: CreateProcedureCallerOptions<T>): FormAction {
  const caller = createProcedureCaller(opt)

  const formAction = async (input: FormData): Promise<void> => {
    try {
      const procedure = await loadProcedure(opt.procedure)

      const deserializer = new OpenAPIDeserializer({
        schema: procedure.zz$p.contract.zz$cp.InputSchema,
      })

      const deserializedInput = deserializer.deserializeAsFormData(input)

      await caller(deserializedInput)
    }
    catch (e) {
      if (e instanceof ORPCError) {
        if (e.code === 'NOT_FOUND') {
          notFound()
        }

        if (e.code === 'FORBIDDEN') {
          forbidden()
        }

        if (e.code === 'UNAUTHORIZED') {
          unauthorized()
        }
      }

      throw e
    }
  }

  return formAction
}
