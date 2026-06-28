import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createPinia } from 'pinia'
import QuoteCard from './QuoteCard.vue'

beforeEach(() => {
  localStorage.clear()
})
afterEach(() => {
  vi.unstubAllGlobals()
})

function mountCard() {
  return mount(QuoteCard, { global: { plugins: [createPinia()] } })
}

describe('QuoteCard.vue', () => {
  it('성공 시 명언을 렌더한다', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ message: '성공 명언', author: '작가', authorProfile: '' }),
      }),
    )
    const wrapper = mountCard()
    await flushPromises()
    expect(wrapper.find('.quote-msg').text()).toContain('성공 명언')
    expect(wrapper.find('.quote-error').exists()).toBe(false)
  })

  it('실패 시 에러와 다시 시도 버튼을 보여준다', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('실패')))
    const wrapper = mountCard()
    await flushPromises()
    expect(wrapper.find('.quote-error').exists()).toBe(true)
    expect(wrapper.find('.quote-retry').exists()).toBe(true)
  })

  it('다시 시도하면 재요청 후 명언을 렌더한다', async () => {
    vi.stubGlobal(
      'fetch',
      vi
        .fn()
        .mockRejectedValueOnce(new Error('실패'))
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ message: '복구 명언', author: '', authorProfile: '' }),
        }),
    )
    const wrapper = mountCard()
    await flushPromises()
    expect(wrapper.find('.quote-error').exists()).toBe(true)

    await wrapper.find('.quote-retry').trigger('click')
    await flushPromises()
    expect(wrapper.find('.quote-msg').text()).toContain('복구 명언')
  })
})
