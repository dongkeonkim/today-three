<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useDaysStore, doneCount, filledCount, type Day } from '../stores/days'
import { lastNDays, shortDate, weekday, dateKey } from '../lib/date'

const { days } = storeToRefs(useDaysStore())
const todayKey = dateKey()

const week = computed(() =>
  lastNDays(7).map((key) => {
    const d = days.value[key] as Day | undefined
    return { key, done: doneCount(d), filled: filledCount(d) }
  }),
)

const totalDone = computed(() => week.value.reduce((s, d) => s + d.done, 0))

// 오늘부터 거슬러 올라가며 "하나라도 완료한 날"이 연속된 일수
const streak = computed(() => {
  const keys = lastNDays(90)
  let s = 0
  for (let i = keys.length - 1; i >= 0; i--) {
    if (doneCount(days.value[keys[i]] as Day | undefined) > 0) s++
    else break
  }
  return s
})
</script>

<template>
  <section class="week">
    <div class="stats">
      <div class="stat">
        <span class="num">{{ streak }}</span>
        <span class="lbl">연속 일수</span>
      </div>
      <div class="stat">
        <span class="num">{{ totalDone }}</span>
        <span class="lbl">이번 주 완료</span>
      </div>
    </div>

    <ul class="week-list">
      <li
        v-for="d in week"
        :key="d.key"
        class="week-row"
        :class="{ today: d.key === todayKey }"
      >
        <span class="wd">{{ weekday(d.key) }}</span>
        <span class="dt">{{ shortDate(d.key) }}</span>
        <span class="dots">
          <span v-for="i in 3" :key="i" class="dot" :class="{ filled: i <= d.done }" />
        </span>
        <span class="cnt">{{ d.done }}/{{ d.filled }}</span>
      </li>
    </ul>

    <p class="week-note">매일 조금씩. 연속 기록이 쌓이는 재미를 느껴보세요.</p>
  </section>
</template>
