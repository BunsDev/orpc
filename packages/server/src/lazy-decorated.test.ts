import { ContractProcedure } from '@orpc/contract'
import { z } from 'zod'
import { isLazy, lazy, unwrapLazy } from './lazy'
import { decorateLazy } from './lazy-decorated'
import { Procedure } from './procedure'
import { createProcedureCaller } from './procedure-caller'

vi.mock('./procedure-caller', () => ({
  createProcedureCaller: vi.fn(() => vi.fn()),
}))

beforeEach(() => {
  vi.clearAllMocks()
})

describe('decorated lazy', () => {
  const schema = z.object({ val: z.string().transform(val => Number(val)) })

  const ping = new Procedure<undefined, undefined, typeof schema, undefined, unknown>({
    contract: new ContractProcedure({
      InputSchema: schema,
      OutputSchema: undefined,
    }),
    func: vi.fn(),
    middlewares: [],
  })

  const lazyPing = lazy(() => Promise.resolve({ default: ping }))

  it('still a lazy', async () => {
    expect(decorateLazy(lazyPing)).toSatisfy(isLazy)

    expect((await unwrapLazy(decorateLazy(lazyPing))).default).toBe(ping)

    const l2 = lazy(() => Promise.resolve({ default: { ping } }))
    expect(decorateLazy(l2)).toSatisfy(isLazy)
    expect((await unwrapLazy(decorateLazy(l2))).default.ping).toBe(ping)

    const l3 = lazy(() => Promise.resolve({ default: { ping: lazyPing } }))
    expect(decorateLazy(l3)).toSatisfy(isLazy)
    expect((await unwrapLazy(decorateLazy(l3))).default.ping).toBe(lazyPing)
  })

  describe('callable', () => {
    const nested = { ping: lazyPing }
    const router = { nested }
    /** decorated lazy is recursive proxy no does need to care what is the original on logic test, (typed will do it) */
    const lazied = lazy(() => Promise.resolve({ default: lazy(() => Promise.resolve({ default: router })) }))

    const controller = new AbortController()
    const signal = controller.signal

    const caller = vi.fn(() => '__mocked__')
    vi.mocked(createProcedureCaller).mockReturnValue(caller as any)

    it('on root', async () => {
      const decorated = decorateLazy(lazied) as any
      expect(decorated).toBeInstanceOf(Function)

      expect(createProcedureCaller).toHaveBeenCalledTimes(1)
      expect(createProcedureCaller).toHaveBeenCalledWith({
        procedure: expect.any(Object),
        context: undefined,
      })
      expect(vi.mocked(createProcedureCaller).mock.calls[0]![0].procedure).toSatisfy(isLazy)
      const unwrapped = await unwrapLazy(vi.mocked(createProcedureCaller).mock.calls[0]![0].procedure as any)
      expect(unwrapped.default).toBe(router)

      expect(await decorated({ val: '1' }, { signal })).toBe('__mocked__')
      expect(caller).toHaveBeenCalledTimes(1)
      expect(caller).toHaveBeenCalledWith({ val: '1' }, { signal })
    })

    it('on nested', async () => {
      const decorated = decorateLazy(lazied).nested.ping as any
      expect(decorated).toBeInstanceOf(Function)

      expect(createProcedureCaller).toHaveBeenCalledTimes(3)
      expect(createProcedureCaller).toHaveBeenNthCalledWith(3, {
        procedure: expect.any(Object),
        context: undefined,
      })
      expect(vi.mocked(createProcedureCaller).mock.calls[2]![0].procedure).toSatisfy(isLazy)
      const unwrapped = await unwrapLazy(vi.mocked(createProcedureCaller).mock.calls[2]![0].procedure as any)
      expect(unwrapped.default).toBe(ping)

      expect(await decorated({ val: '1' }, { signal })).toBe('__mocked__')
      expect(caller).toHaveBeenCalledTimes(1)
      expect(caller).toHaveBeenCalledWith({ val: '1' }, { signal })
    })
  })
})
