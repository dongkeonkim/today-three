<script setup lang="ts">
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useQuoteStore } from '../stores/quote'

const quoteStore = useQuoteStore()
const { quote, loading, error } = storeToRefs(quoteStore)
const { ensureToday, refresh } = quoteStore

onMounted(ensureToday)
</script>

<template>
  <div class="quote-card">
    <!-- 로딩 상태 -->
    <div v-if="loading" class="quote-skeleton" aria-label="명언 불러오는 중">
      <span class="sk-line" />
      <span class="sk-line short" />
    </div>

    <!-- 에러 + 재시도 -->
    <template v-else-if="error">
      <p class="quote-error">{{ error }}</p>
      <button class="quote-retry" @click="refresh">다시 시도</button>
    </template>

    <!-- 명언 표시 -->
    <template v-else-if="quote">
      <p class="quote-msg">“{{ quote.message }}”</p>
      <p class="quote-author">
        — {{ quote.author }}<span v-if="quote.authorProfile" class="quote-profile">, {{ quote.authorProfile }}</span>
      </p>
      <button class="quote-refresh" title="다른 명언 보기" aria-label="다른 명언 보기" @click="refresh">🔄</button>
    </template>
  </div>
</template>
