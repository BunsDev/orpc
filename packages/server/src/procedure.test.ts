import { ContractProcedure } from '@orpc/contract'
import { isProcedure, Procedure } from './procedure'

describe('isProcedure', () => {
  const procedure = new Procedure({
    contract: new ContractProcedure({
      InputSchema: undefined,
      OutputSchema: undefined,
      errorMap: undefined,
    }),
    handler: () => {},
    postMiddlewares: [],
    preMiddlewares: [],
  })

  it('works', () => {
    expect(procedure).toSatisfy(isProcedure)
    expect({}).not.toSatisfy(isProcedure)
    expect(true).not.toSatisfy(isProcedure)
  })

  it('works with raw object', () => {
    expect(Object.assign({}, procedure)).toSatisfy(isProcedure)
  })
})
