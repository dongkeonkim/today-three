<script setup lang="ts">
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useDaysStore } from './stores/days'
import { useThemeStore } from './stores/theme'
import { prettyDate } from './lib/date'
import TodayBoard from './components/TodayBoard.vue'
import WeeklyReview from './components/WeeklyReview.vue'

const { today } = storeToRefs(useDaysStore())
const themeStore = useThemeStore()
const { theme } = storeToRefs(themeStore)
const toggleTheme = themeStore.toggle

const tab = ref<'today' | 'week'>('today')
</script>

<template>
  <div class="app">
    <header class="header">
      <div class="brand">
        <span class="brand-mark">3</span>
        <div class="brand-text">
          <h1>오늘 세 개</h1>
          <p class="date">{{ prettyDate(today.date) }}</p>
        </div>
      </div>
      <button class="icon-btn" :title="theme === 'dark' ? '라이트 모드' : '다크 모드'" @click="toggleTheme">
        {{ theme === 'dark' ? '☀️' : '🌙' }}
      </button>
    </header>

    <nav class="tabs">
      <button :class="{ active: tab === 'today' }" @click="tab = 'today'">오늘</button>
      <button :class="{ active: tab === 'week' }" @click="tab = 'week'">주간</button>
    </nav>

    <main class="main">
      <TodayBoard v-if="tab === 'today'" />
      <WeeklyReview v-else />
    </main>

    <footer class="foot">하루에 딱 세 개. 그거면 충분해요.</footer>
  </div>
</template>
