/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// 정적 빌드만 생성한다. 백엔드/서버 없음 → 무료 정적 호스팅에 그대로 배포.
export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'happy-dom',
    globals: true,
  },
})
