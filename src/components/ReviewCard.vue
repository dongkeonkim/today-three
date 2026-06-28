<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useDaysStore } from '../stores/days'
import { drawShareCard } from '../lib/shareCard'

const { today } = storeToRefs(useDaysStore())

const emit = defineEmits<{ close: [] }>()

const previewUrl = ref('')
const canShareFiles = ref(false)

function redraw(): void {
  previewUrl.value = drawShareCard(today.value).toDataURL('image/png')
}

onMounted(() => {
  redraw()
  try {
    canShareFiles.value =
      typeof navigator.canShare === 'function' &&
      navigator.canShare({ files: [new File([new Blob()], 'x.png', { type: 'image/png' })] })
  } catch {
    canShareFiles.value = false
  }
})

function download(): void {
  const a = document.createElement('a')
  a.href = previewUrl.value
  a.download = `오늘세개-${today.value.date}.png`
  a.click()
}

async function share(): Promise<void> {
  try {
    const blob = await (await fetch(previewUrl.value)).blob()
    const file = new File([blob], `오늘세개-${today.value.date}.png`, { type: 'image/png' })
    await navigator.share({ files: [file], title: '오늘 세 개' })
  } catch {
    /* 사용자가 취소했거나 미지원 — 무시 */
  }
}
</script>

<template>
  <div class="modal-backdrop" @click.self="emit('close')">
    <div class="modal">
      <h2>오늘 회고 카드</h2>

      <textarea
        v-model="today.reflection"
        class="reflection"
        rows="2"
        maxlength="60"
        placeholder="오늘 한 줄 회고 (선택)"
        @input="redraw"
      />

      <img v-if="previewUrl" :src="previewUrl" class="card-preview" alt="오늘 카드 미리보기" />

      <div class="modal-actions">
        <button class="primary" @click="download">이미지 저장</button>
        <button v-if="canShareFiles" class="ghost" @click="share">공유</button>
        <button class="ghost" @click="emit('close')">닫기</button>
      </div>
    </div>
  </div>
</template>
