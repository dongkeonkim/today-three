import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { useIntervalFn } from '@vueuse/core'

export const TIMER_PRESETS = [15, 25, 50] as const

export const useTimerStore = defineStore('timer', () => {
  const minutes = ref(25)
  const remaining = ref(25 * 60) // 초
  const running = ref(false)

  const { pause, resume } = useIntervalFn(
    () => {
      if (remaining.value > 0) {
        remaining.value -= 1
        if (remaining.value === 0) stop()
      }
    },
    1000,
    { immediate: false },
  )

  function start(): void {
    if (remaining.value === 0) remaining.value = minutes.value * 60
    running.value = true
    resume()
  }

  function pauseTimer(): void {
    running.value = false
    pause()
  }

  function reset(): void {
    running.value = false
    pause()
    remaining.value = minutes.value * 60
  }

  function stop(): void {
    running.value = false
    pause()
  }

  function setMinutes(m: number): void {
    minutes.value = m
    if (!running.value) remaining.value = m * 60
  }

  const display = computed(() => {
    const m = Math.floor(remaining.value / 60)
    const s = remaining.value % 60
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  })

  const finished = computed(() => remaining.value === 0)

  return { minutes, remaining, running, display, finished, start, pause: pauseTimer, reset, setMinutes }
})
