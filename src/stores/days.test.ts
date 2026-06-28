import { describe, it, expect, beforeEach } from 'vitest'
import { nextTick } from 'vue'
import { setActivePinia, createPinia } from 'pinia'
import { useDaysStore, doneCount, filledCount, SLOTS, type Day } from './days'

const flush = () => new Promise((r) => setTimeout(r, 0))

beforeEach(() => {
  localStorage.clear()
  setActivePinia(createPinia())
})

describe('days store', () => {
  it('오늘을 빈 3칸으로 초기화한다', () => {
    const store = useDaysStore()
    expect(store.today.tasks).toHaveLength(SLOTS)
    expect(store.today.tasks.every((t) => t.text === '' && !t.done)).toBe(true)
  })

  it('toggleDone은 텍스트가 있는 할 일만 토글한다', () => {
    const store = useDaysStore()
    store.toggleDone(0) // 빈 칸 → 무시
    expect(store.today.tasks[0].done).toBe(false)

    store.today.tasks[0].text = '운동'
    store.toggleDone(0)
    expect(store.today.tasks[0].done).toBe(true)
    store.toggleDone(0)
    expect(store.today.tasks[0].done).toBe(false)
  })

  it('doneCount / filledCount는 빈 칸을 무시한다', () => {
    const store = useDaysStore()
    store.today.tasks[0].text = 'a'
    store.today.tasks[1].text = 'b'
    store.toggleDone(0)
    expect(filledCount(store.today)).toBe(2)
    expect(doneCount(store.today)).toBe(1)
  })

  it('doneCount / filledCount는 undefined를 0으로 처리한다', () => {
    expect(doneCount(undefined)).toBe(0)
    expect(filledCount(undefined as Day | undefined)).toBe(0)
  })

  it('localStorage에 영속된다', async () => {
    const store = useDaysStore()
    store.today.tasks[0].text = '저장됨'
    await nextTick()
    await flush()
    expect(localStorage.getItem('today-three:days:v1')).toContain('저장됨')
  })
})
