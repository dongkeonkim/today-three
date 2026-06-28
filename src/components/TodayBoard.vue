<script setup lang="ts">
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useDaysStore, doneCount, filledCount } from '../stores/days'
import FocusTimer from './FocusTimer.vue'
import ReviewCard from './ReviewCard.vue'
import QuoteCard from './QuoteCard.vue'

const daysStore = useDaysStore()
const { today } = storeToRefs(daysStore)
const toggleDone = daysStore.toggleDone

const showReview = ref(false)
</script>

<template>
  <section class="board">
    <QuoteCard />
    <p class="prompt">오늘 진짜 중요한 일, 딱 세 개만.</p>

    <ul class="tasks">
      <li
        v-for="(t, i) in today.tasks"
        :key="t.id"
        class="task"
        :class="{ done: t.done && t.text.trim() }"
      >
        <button
          class="check"
          :class="{ on: t.done && t.text.trim() }"
          aria-label="완료 표시"
          @click="toggleDone(i)"
        >
          <span v-if="t.done && t.text.trim()">✓</span>
        </button>
        <div class="task-body">
          <input
            v-model="t.text"
            class="task-input"
            :placeholder="`${i + 1}번째 할 일`"
            maxlength="80"
            @keydown.enter="($event.target as HTMLInputElement).blur()"
          />
          <input
            v-if="t.text.trim()"
            v-model="t.time"
            class="task-time"
            placeholder="시간 (선택) · 예: 오전 10–11시"
            maxlength="24"
          />
        </div>
      </li>
    </ul>

    <p class="progress">
      <strong>{{ doneCount(today) }}</strong> / {{ filledCount(today) }} 완료
    </p>

    <FocusTimer />

    <button class="primary block" @click="showReview = true">오늘 마무리하고 카드 만들기</button>

    <ReviewCard v-if="showReview" @close="showReview = false" />
  </section>
</template>
