<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useTimerStore, TIMER_PRESETS as presets } from '../stores/timer'

const timer = useTimerStore()
const { minutes, display, running, finished } = storeToRefs(timer)
const { start, pause, reset, setMinutes } = timer
</script>

<template>
  <div class="timer" :class="{ finished }">
    <div class="timer-display">{{ display }}</div>

    <div class="presets">
      <button
        v-for="p in presets"
        :key="p"
        :class="{ sel: minutes === p }"
        @click="setMinutes(p)"
      >
        {{ p }}분
      </button>
    </div>

    <div class="timer-controls">
      <button v-if="!running" class="primary sm" @click="start">집중 시작</button>
      <button v-else class="ghost sm" @click="pause">일시정지</button>
      <button class="ghost sm" @click="reset">리셋</button>
    </div>

    <p v-if="finished" class="timer-done">집중 완료! 잘했어요 🎉</p>
  </div>
</template>
