import { computed } from 'vue'
import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'
import { dateKey } from '../lib/date'

export interface Task {
  id: string
  text: string
  done: boolean
  /** 선택 시간대 메모 (예: "오전 10–11시"). 자유 입력. */
  time: string
}

export interface Day {
  date: string
  tasks: Task[]
  reflection: string
}

export const SLOTS = 3

function newId(): string {
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.floor(Math.random() * 1e9)}`
}

function makeTask(): Task {
  return { id: newId(), text: '', done: false, time: '' }
}

function makeDay(key: string): Day {
  return { date: key, tasks: [makeTask(), makeTask(), makeTask()], reflection: '' }
}

// 완료/입력 개수는 store 상태에 의존하지 않는 순수 함수 → 따로 두어 테스트하기 쉽게.
export function doneCount(d: Day | undefined): number {
  if (!d) return 0
  return d.tasks.filter((t) => t.text.trim() && t.done).length
}

export function filledCount(d: Day | undefined): number {
  if (!d) return 0
  return d.tasks.filter((t) => t.text.trim()).length
}

export const useDaysStore = defineStore('days', () => {
  // 모든 데이터는 브라우저 localStorage에만 저장된다. 서버·DB 없음.
  const days = useStorage<Record<string, Day>>('today-three:days:v1', {})

  const key = dateKey()
  // 오늘 항목 보장 + 과거 데이터 누락 필드 보정
  if (!days.value[key]) {
    days.value[key] = makeDay(key)
  } else {
    const d = days.value[key]
    while (d.tasks.length < SLOTS) d.tasks.push(makeTask())
    for (const t of d.tasks) if (typeof t.time !== 'string') t.time = ''
    if (typeof d.reflection !== 'string') d.reflection = ''
  }

  const today = computed(() => days.value[key])

  function toggleDone(i: number): void {
    const t = today.value.tasks[i]
    if (t && t.text.trim()) t.done = !t.done
  }

  return { days, today, toggleDone }
})
