import * as keyModule from './key'
import { createGeneralUtils } from './utils-general'

const buildKeySpy = vi.spyOn(keyModule, 'buildKey')

beforeEach(() => {
  buildKeySpy.mockClear()
})

describe('key', () => {
  it('works', () => {
    const utils = createGeneralUtils('__ORPC__', ['path'])
    expect(utils.key({ input: 'input', type: 'infinite' })).toEqual(['__ORPC__', ['path'], { input: 'input', type: 'infinite' }])
    expect(buildKeySpy).toHaveBeenCalledTimes(1)
    expect(buildKeySpy).toHaveBeenCalledWith('__ORPC__', ['path'], { input: 'input', type: 'infinite' })
  })
})
