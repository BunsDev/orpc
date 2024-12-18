import type { ANY_CONTRACT_PROCEDURE, ContractRouter, HTTPPath, RouteOptions, Schema, SchemaInput, SchemaOutput } from '@orpc/contract'
import type { DecoratedLazy } from './lazy-decorated'
import type { Router } from './router'
import type { AdaptedRouter } from './router-builder'
import type { Context, MergeContext, WELL_CONTEXT } from './types'
import { ContractProcedure } from '@orpc/contract'
import { type ChainableImplementer, createChainableImplementer } from './implementer-chainable'
import { type DecoratedMiddleware, decorateMiddleware, type Middleware } from './middleware'
import { Procedure, type ProcedureFunc } from './procedure'
import { ProcedureBuilder } from './procedure-builder'
import { type DecoratedProcedure, decorateProcedure } from './procedure-decorated'
import { RouterBuilder } from './router-builder'

export interface BuilderDef<TContext extends Context, TExtraContext extends Context> {
  middlewares?: Middleware<MergeContext<TContext, TExtraContext>, Partial<TExtraContext> | undefined, unknown, any>[]
}

export class Builder<TContext extends Context, TExtraContext extends Context> {
  '~type' = 'Builder' as const
  '~orpc': BuilderDef<TContext, TExtraContext>

  constructor(def: BuilderDef<TContext, TExtraContext>) {
    this['~orpc'] = def
  }

  context<UContext extends Context = WELL_CONTEXT>(): Builder<UContext, undefined> {
    return new Builder({})
  }

  use<U extends Context & Partial<MergeContext<TContext, TExtraContext>> | undefined = undefined>(
    middleware: Middleware<
      MergeContext<TContext, TExtraContext>,
      U,
      unknown,
      unknown
    >,
  ): Builder<TContext, MergeContext<TExtraContext, U>> {
    return new Builder({
      ...this['~orpc'],
      middlewares: [...(this['~orpc'].middlewares ?? []), middleware as any],
    })
  }

  middleware<
    UExtraContext extends Context & Partial<MergeContext<TContext, TExtraContext>> | undefined = undefined,
    TInput = unknown,
    TOutput = any,
  >(
    middleware: Middleware<
      MergeContext<TContext, TExtraContext>,
      UExtraContext,
      TInput,
      TOutput
    >,
  ): DecoratedMiddleware<
      MergeContext<TContext, TExtraContext>,
      UExtraContext,
      TInput,
      TOutput
    > {
    return decorateMiddleware(middleware)
  }

  route(route: RouteOptions): ProcedureBuilder<TContext, TExtraContext, undefined, undefined> {
    return new ProcedureBuilder({
      middlewares: this['~orpc'].middlewares,
      contract: new ContractProcedure({
        route,
        InputSchema: undefined,
        OutputSchema: undefined,
      }),
    })
  }

  input<USchema extends Schema = undefined>(
    schema: USchema,
    example?: SchemaInput<USchema>,
  ): ProcedureBuilder<TContext, TExtraContext, USchema, undefined> {
    return new ProcedureBuilder({
      middlewares: this['~orpc'].middlewares,
      contract: new ContractProcedure({
        OutputSchema: undefined,
        InputSchema: schema,
        inputExample: example,
      }),
    })
  }

  output<USchema extends Schema = undefined>(
    schema: USchema,
    example?: SchemaOutput<USchema>,
  ): ProcedureBuilder<TContext, TExtraContext, undefined, USchema> {
    return new ProcedureBuilder({
      middlewares: this['~orpc'].middlewares,
      contract: new ContractProcedure({
        InputSchema: undefined,
        OutputSchema: schema,
        outputExample: example,
      }),
    })
  }

  func<UFuncOutput = undefined>(
    func: ProcedureFunc<TContext, TExtraContext, undefined, undefined, UFuncOutput>,
  ): DecoratedProcedure<TContext, TExtraContext, undefined, undefined, UFuncOutput> {
    return decorateProcedure(new Procedure({
      middlewares: this['~orpc'].middlewares,
      contract: new ContractProcedure({
        InputSchema: undefined,
        OutputSchema: undefined,
      }),
      func,
    }))
  }

  prefix(prefix: HTTPPath): RouterBuilder<TContext, TExtraContext> {
    return new RouterBuilder({
      middlewares: this['~orpc'].middlewares,
      prefix,
    })
  }

  tags(...tags: string[]): RouterBuilder<TContext, TExtraContext> {
    return new RouterBuilder({
      middlewares: this['~orpc'].middlewares,
      tags,
    })
  }

  router<U extends Router<MergeContext<TContext, TExtraContext>, any>>(
    router: U,
  ): AdaptedRouter<TContext, U> {
    return new RouterBuilder<TContext, TExtraContext>(this['~orpc']).router(router)
  }

  lazy<U extends Router<MergeContext<TContext, TExtraContext>, any>>(
    loader: () => Promise<{ default: U }>,
  ): DecoratedLazy<AdaptedRouter<TContext, U>> {
    return new RouterBuilder<TContext, TExtraContext>(this['~orpc']).lazy(loader)
  }

  contract<U extends ANY_CONTRACT_PROCEDURE | ContractRouter>(
    contract: U,
  ): ChainableImplementer<TContext, TExtraContext, U> {
    return createChainableImplementer(contract, this['~orpc'].middlewares)
  }
}
