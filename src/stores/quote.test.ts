import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useQuoteStore, type Quote } from './quote'

const flush = () => new Promise((r) => setTimeout(r, 0))

function okFetch(quote: Quote) {
  return vi.fn().mockResolvedValue({ ok: true, json: async () => quote })
}

beforeEach(() => {
  localStorage.clear()
  setActivePinia(createPinia())
})
afterEach(() => {
  vi.unstubAllGlobals()
})

describe('quote store', () => {
  const q: Quote = { message: '명언입니다', author: '작가', authorProfile: '프로필' }

  it('캐시가 없으면 ensureToday가 fetch해서 quote를 채운다', async () => {
    const spy = okFetch(q)
    vi.stubGlobal('fetch', spy)
    const store = useQuoteStore()
    store.ensureToday()
    await flush()
    expect(store.quote).toEqual(q)
    expect(store.loading).toBe(false)
    expect(spy).toHaveBeenCalledTimes(1)
  })

  it('캐시가 있으면 ensureToday가 재호출하지 않는다', async () => {
    const spy = okFetch(q)
    vi.stubGlobal('fetch', spy)
    const store = useQuoteStore()
    store.ensureToday()
    await flush()
    expect(spy).toHaveBeenCalledTimes(1)
    store.ensureToday() // 캐시 적중
    await flush()
    expect(spy).toHaveBeenCalledTimes(1)
  })

  it('응답이 not-ok이면 error를 설정한다', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 500 }))
    const store = useQuoteStore()
    store.refresh()
    await flush()
    expect(store.error).not.toBe('')
    expect(store.quote).toBeNull()
  })

  it('fetch가 reject되면 error 메시지를 설정한다', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('네트워크 오류')))
    const store = useQuoteStore()
    store.refresh()
    await flush()
    expect(store.error).toBe('네트워크 오류')
  })

  it('refresh는 캐시를 무시하고 다시 가져온다', async () => {
    const spy = vi
      .fn()
      .mockResolvedValueOnce({ ok: true, json: async () => ({ ...q, message: '첫번째' }) })
      .mockResolvedValueOnce({ ok: true, json: async () => ({ ...q, message: '두번째' }) })
    vi.stubGlobal('fetch', spy)
    const store = useQuoteStore()
    store.ensureToday()
    await flush()
    expect(store.quote?.message).toBe('첫번째')
    store.refresh()
    await flush()
    expect(store.quote?.message).toBe('두번째')
    expect(spy).toHaveBeenCalledTimes(2)
  })
})
