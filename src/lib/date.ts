const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토']

/** 로컬 타임존 기준 YYYY-MM-DD 키 */
export function dateKey(d = new Date()): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function parse(key: string): Date {
  const [y, m, d] = key.split('-').map(Number)
  return new Date(y, m - 1, d)
}

/** "6월 28일 (일)" */
export function prettyDate(key: string): string {
  const d = parse(key)
  return `${d.getMonth() + 1}월 ${d.getDate()}일 (${WEEKDAYS[d.getDay()]})`
}

/** "6/28" */
export function shortDate(key: string): string {
  const d = parse(key)
  return `${d.getMonth() + 1}/${d.getDate()}`
}

export function weekday(key: string): string {
  return WEEKDAYS[parse(key).getDay()]
}

/** 오래된 → 최신 순으로 최근 n일의 키 배열 */
export function lastNDays(n: number): string[] {
  const now = new Date()
  const out: string[] = []
  for (let i = n - 1; i >= 0; i--) {
    out.push(dateKey(new Date(now.getFullYear(), now.getMonth(), now.getDate() - i)))
  }
  return out
}
