import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'
import { dateKey } from '../lib/date'

export interface Quote {
  message: string
  author: string
  authorProfile: string
}

interface QuoteCache {
  date: string
  quote: Quote | null
}

// 키 없는 + CORS 열린 공개 API → 브라우저에서 직접 호출 (서버 불필요)
const ENDPOINT = 'https://korean-advice-open-api.vercel.app/api/advice'
const TIMEOUT_MS = 8000

export const useQuoteStore = defineStore('quote', () => {
  // 하루 1개만 캐시. 기본값은 반드시 객체 — null이면 useStorage가 직렬화 타입을 추론 못 해 round-trip이 깨진다.
  const cache = useStorage<QuoteCache>('today-three:quote:v1', { date: '', quote: null })

  function cachedToday(): Quote | null {
    return cache.value.date === dateKey() ? cache.value.quote : null
  }

  const quote = ref<Quote | null>(cachedToday())
  const loading = ref(false)
  const error = ref('')

  async function fetchQuote(): Promise<void> {
    loading.value = true
    error.value = ''
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)
    try {
      const res = await fetch(ENDPOINT, { signal: controller.signal })
      if (!res.ok) throw new Error(`불러오기 실패 (${res.status})`)
      const data = (await res.json()) as Partial<Quote>
      if (!data || typeof data.message !== 'string') throw new Error('명언 형식이 올바르지 않아요')
      const q: Quote = {
        message: data.message,
        author: data.author ?? '',
        authorProfile: data.authorProfile ?? '',
      }
      quote.value = q
      cache.value = { date: dateKey(), quote: q }
    } catch (e) {
      const err = e as Error
      error.value =
        err.name === 'AbortError' ? '응답이 너무 느려요' : err.message || '명언을 불러오지 못했어요'
    } finally {
      clearTimeout(timer)
      loading.value = false
    }
  }

  // 오늘 캐시가 있으면 그대로, 없으면 새로 불러온다.
  function ensureToday(): void {
    const cached = cachedToday()
    if (cached) {
      quote.value = cached
      return
    }
    void fetchQuote()
  }

  // 캐시를 무시하고 다른 명언을 강제로 불러온다(새로고침·재시도).
  function refresh(): void {
    void fetchQuote()
  }

  return { quote, loading, error, ensureToday, refresh }
})
