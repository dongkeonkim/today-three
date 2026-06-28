import type { Day } from '../stores/days'
import { prettyDate } from './date'

const FONT = '-apple-system, "Apple SD Gothic Neo", "Noto Sans KR", "Malgun Gothic", sans-serif'

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number): void {
  if (typeof ctx.roundRect === 'function') {
    ctx.beginPath()
    ctx.roundRect(x, y, w, h, r)
    return
  }
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath()
}

/** 글자가 maxWidth를 넘으면 말줄임 처리 */
function clip(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string {
  if (ctx.measureText(text).width <= maxWidth) return text
  let t = text
  while (t.length > 1 && ctx.measureText(t + '…').width > maxWidth) {
    t = t.slice(0, -1)
  }
  return t + '…'
}

/** 하루를 공유용 정사각 카드 이미지로 그린다 (1080x1080). */
export function drawShareCard(day: Day): HTMLCanvasElement {
  const W = 1080
  const H = 1080
  const canvas = document.createElement('canvas')
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext('2d')!

  // 배경 그라데이션
  const bg = ctx.createLinearGradient(0, 0, W, H)
  bg.addColorStop(0, '#4f46e5')
  bg.addColorStop(1, '#7c3aed')
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, W, H)

  // 안쪽 흰 카드
  const pad = 80
  roundRect(ctx, pad, pad, W - pad * 2, H - pad * 2, 48)
  ctx.fillStyle = '#ffffff'
  ctx.fill()

  const x = pad + 72
  let y = pad + 140

  ctx.textBaseline = 'alphabetic'
  ctx.fillStyle = '#6366f1'
  ctx.font = `700 40px ${FONT}`
  ctx.fillText('오늘 세 개', x, y)

  y += 96
  ctx.fillStyle = '#0f172a'
  ctx.font = `800 76px ${FONT}`
  ctx.fillText(prettyDate(day.date), x, y)

  const tasks = day.tasks.filter((t) => t.text.trim())
  const maxTextWidth = W - pad * 2 - 72 * 2 - 86

  y += 70
  if (tasks.length === 0) {
    ctx.fillStyle = '#94a3b8'
    ctx.font = `500 48px ${FONT}`
    ctx.fillText('오늘의 세 가지를 적어보세요', x, y + 70)
  }

  for (const t of tasks) {
    y += 112
    const box = 56
    const boxY = y - 46
    roundRect(ctx, x, boxY, box, box, 16)
    if (t.done) {
      ctx.fillStyle = '#6366f1'
      ctx.fill()
      ctx.strokeStyle = '#ffffff'
      ctx.lineWidth = 7
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      ctx.beginPath()
      ctx.moveTo(x + 15, boxY + 30)
      ctx.lineTo(x + 24, boxY + 40)
      ctx.lineTo(x + 42, boxY + 17)
      ctx.stroke()
    } else {
      ctx.strokeStyle = '#cbd5e1'
      ctx.lineWidth = 5
      ctx.stroke()
    }

    const tx = x + box + 30
    const label = clip(ctx, t.text.trim(), maxTextWidth)
    ctx.font = `500 52px ${FONT}`
    ctx.fillStyle = t.done ? '#94a3b8' : '#0f172a'
    ctx.fillText(label, tx, y)
    if (t.done) {
      const w = ctx.measureText(label).width
      ctx.strokeStyle = '#94a3b8'
      ctx.lineWidth = 4
      ctx.beginPath()
      ctx.moveTo(tx, y - 16)
      ctx.lineTo(tx + w, y - 16)
      ctx.stroke()
    }
    if (t.time && t.time.trim()) {
      ctx.font = `400 34px ${FONT}`
      ctx.fillStyle = '#94a3b8'
      ctx.fillText(clip(ctx, t.time.trim(), maxTextWidth), tx, y + 44)
      y += 44
    }
  }

  if (day.reflection && day.reflection.trim()) {
    y += 120
    ctx.fillStyle = '#475569'
    ctx.font = `italic 400 42px ${FONT}`
    ctx.fillText('“' + clip(ctx, day.reflection.trim(), W - pad * 2 - 144) + '”', x, y)
  }

  const done = tasks.filter((t) => t.done).length
  ctx.fillStyle = '#6366f1'
  ctx.font = `700 44px ${FONT}`
  ctx.fillText(`${tasks.length}개 중 ${done}개 완료`, x, H - pad - 76)

  return canvas
}
