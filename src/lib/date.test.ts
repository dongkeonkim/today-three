import { describe, it, expect } from 'vitest'
import { dateKey, prettyDate, shortDate, weekday, lastNDays } from './date'

describe('date utils', () => {
  it('dateKey: YYYY-MM-DD 형식 + 0 패딩', () => {
    expect(dateKey(new Date(2026, 5, 8))).toBe('2026-06-08') // 월 인덱스 5 = 6월
  })

  it('prettyDate: 한국어 월/일/요일', () => {
    expect(prettyDate('2026-06-28')).toBe('6월 28일 (일)')
  })

  it('shortDate: M/D', () => {
    expect(shortDate('2026-06-08')).toBe('6/8')
  })

  it('weekday: 한국어 요일', () => {
    expect(weekday('2026-06-28')).toBe('일')
  })

  it('lastNDays: n개, 오래된→최신, 마지막이 오늘', () => {
    const days = lastNDays(7)
    expect(days).toHaveLength(7)
    expect(days[6]).toBe(dateKey()) // 마지막 = 오늘
    expect([...days].sort()).toEqual(days) // 오름차순
  })
})
