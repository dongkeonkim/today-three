import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useTimerStore } from './timer'

beforeEach(() => {
  setActivePinia(createPinia())
})
afterEach(() => {
  vi.useRealTimers()
})

describe('timer store', () => {
  it('기본값은 25:00', () => {
    expect(useTimerStore().display).toBe('25:00')
  })

  it('실행 중이 아니면 setMinutes가 표시를 갱신한다', () => {
    const t = useTimerStore()
    t.setMinutes(15)
    expect(t.display).toBe('15:00')
  })

  it('실행 중에는 1초마다 카운트다운한다', () => {
    vi.useFakeTimers()
    const t = useTimerStore()
    t.setMinutes(1) // 60초
    t.start()
    vi.advanceTimersByTime(3000)
    expect(t.remaining).toBe(57)
    expect(t.running).toBe(true)
    t.reset()
    expect(t.remaining).toBe(60)
    expect(t.running).toBe(false)
  })
})
