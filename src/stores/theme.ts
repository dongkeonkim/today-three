import { watchEffect } from 'vue'
import { defineStore } from 'pinia'
import { useStorage, usePreferredDark } from '@vueuse/core'

export const useThemeStore = defineStore('theme', () => {
  const prefersDark = usePreferredDark()
  const theme = useStorage<'light' | 'dark'>(
    'today-three:theme',
    prefersDark.value ? 'dark' : 'light',
  )

  watchEffect(() => {
    document.documentElement.setAttribute('data-theme', theme.value)
  })

  function toggle(): void {
    theme.value = theme.value === 'dark' ? 'light' : 'dark'
  }

  return { theme, toggle }
})
