'use client'

import { useEffect, useRef } from 'react'

// ─── Constants ──────────────────────────────────────────────────────────────
const ROWS     = 8          // peg rows → ROWS+1 bins, binomial B(8, 0.5)
const BINS     = ROWS + 1
const STEP     = 32         // px between adjacent pegs in same row
const ROW_H    = 36         // px between peg rows
const CX       = 190        // canvas center-x  (W/2)
const W        = 380
const H        = 530
const PEG_TOP  = 58         // y of row-0 peg
const BIN_TOP  = PEG_TOP + ROWS * ROW_H + 16
const BIN_HMAX = H - BIN_TOP - 48
const PEG_R    = 2.4
const BALL_R   = 3.4
const HOP_MS   = 270        // ms per peg-to-peg hop
const SPAWN_MS = 700        // ms between new balls

// ─── Geometry helpers ────────────────────────────────────────────────────────
// Peg (row r, col c): there are r+1 pegs in row r, symmetrically about CX
const pegX = (r: number, c: number) => CX + (c - r / 2) * STEP
const pegY = (r: number)             => PEG_TOP + r * ROW_H
// Bin b center (b = 0..ROWS)
const binX = (b: number)             => CX + (b - ROWS / 2) * STEP

// ─── Easing ──────────────────────────────────────────────────────────────────
const easeIn    = (t: number) => t * t            // gravity feel (accelerate down)
const easeInOut = (t: number) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
const lerp      = (a: number, b: number, t: number) => a + (b - a) * t

// ─── Ball ────────────────────────────────────────────────────────────────────
interface Waypoint { x: number; y: number }
interface Ball {
  wps:      Waypoint[]               // [entry, peg0, peg1, …, peg_{ROWS-1}, bin]
  wpIdx:    number                   // current segment start index
  t:        number                   // progress [0,1] in current segment
  bin:      number                   // final bin (= # right turns)
  settled:  boolean
  trail:    { x: number; y: number }[]
}

function makeBall(): Ball {
  let col = 0
  // Waypoint 0: entry point above board
  const wps: Waypoint[] = [{ x: CX, y: PEG_TOP - 28 }]

  for (let r = 0; r < ROWS; r++) {
    // Ball arrives at peg (r, col) — col = rights taken so far
    wps.push({ x: pegX(r, col), y: pegY(r) })
    if (Math.random() < 0.5) col++   // deflect right (+1 col) or left (stay)
  }

  // Final waypoint: drop into bin
  wps.push({ x: binX(col), y: BIN_TOP + 2 })

  return { wps, wpIdx: 0, t: 0, bin: col, settled: false, trail: [] }
}

// ─── Component ───────────────────────────────────────────────────────────────
export default function GaltonBoard() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const dpr = window.devicePixelRatio || 1
    canvas.width  = W * dpr
    canvas.height = H * dpr
    canvas.style.width  = W + 'px'
    canvas.style.height = H + 'px'
    const ctx = canvas.getContext('2d')!
    ctx.scale(dpr, dpr)

    // Build peg list (for rendering)
    const pegs: { x: number; y: number; flash: number }[] = []
    for (let r = 0; r < ROWS; r++)
      for (let c = 0; c <= r; c++)
        pegs.push({ x: pegX(r, c), y: pegY(r), flash: 0 })

    // Accumulator
    const bins       = new Float64Array(BINS)   // smoothed display heights
    const binsTarget = new Uint32Array(BINS)     // true drop counts
    let totalDropped = 0

    // Active balls
    const balls: Ball[] = []
    let lastSpawn = -SPAWN_MS   // so first ball spawns immediately

    // Bell curve: analytical N(μ=CX, σ)
    // σ chosen so the curve fits neatly — matches binomial std dev:
    // std dev of B(ROWS, 0.5) = sqrt(ROWS*0.25) bins = sqrt(2) bins ≈ 1.41 bins
    const SIGMA_PX = Math.sqrt(ROWS * 0.25) * STEP  // ≈ 45px
    const bellY = (x: number) =>
      Math.exp(-0.5 * ((x - CX) / SIGMA_PX) ** 2)

    let prevTs = 0
    let rafId  = 0

    function draw(ts: number) {
      const dt = Math.min(ts - prevTs, 50)  // cap at 50ms
      prevTs = ts

      // ── Spawn ──────────────────────────────────────────────────────────────
      if (ts - lastSpawn >= SPAWN_MS) {
        balls.push(makeBall())
        lastSpawn = ts
      }

      // ── Update each ball ───────────────────────────────────────────────────
      for (const b of balls) {
        if (b.settled) continue

        const src = b.wps[b.wpIdx]
        const dst = b.wps[b.wpIdx + 1]

        // Current interpolated position
        const bx = lerp(src.x, dst.x, easeInOut(b.t))
        const by = lerp(src.y, dst.y, easeIn(b.t))

        // Trail
        b.trail.push({ x: bx, y: by })
        if (b.trail.length > 16) b.trail.shift()

        // Advance
        b.t += dt / HOP_MS
        if (b.t >= 1) {
          b.t = 0
          b.wpIdx++

          // Flash the peg we just arrived at (if it's a real peg, not entry/bin)
          const arrivedAt = b.wps[b.wpIdx]
          if (arrivedAt && b.wpIdx <= ROWS) {
            const peg = pegs.find(
              p => Math.abs(p.x - arrivedAt.x) < 1 && Math.abs(p.y - arrivedAt.y) < 1
            )
            if (peg) peg.flash = 1
          }

          // Check if ball has reached its final bin waypoint
          if (b.wpIdx >= b.wps.length - 1) {
            b.settled = true
            binsTarget[b.bin]++
            totalDropped++
          }
        }
      }

      // ── Ease bin heights toward targets ────────────────────────────────────
      for (let i = 0; i < BINS; i++) {
        bins[i] += (binsTarget[i] - bins[i]) * 0.06
      }
      // Normalize by the current smoothed max so histogram and bell curve
      // always share the same scale, and the curve tracks the evolving bars.
      const maxBins = Math.max(...Array.from(bins), 0.001)
      const SCALE   = BIN_HMAX * 0.9   // shared height unit for both

      // ── Decay peg flashes ──────────────────────────────────────────────────
      for (const p of pegs) p.flash *= 0.82

      // ── Clear ──────────────────────────────────────────────────────────────
      ctx.clearRect(0, 0, W, H)

      // ── Histogram bars ─────────────────────────────────────────────────────
      const barW = STEP - 3
      for (let i = 0; i < BINS; i++) {
        const bxc = binX(i)
        const bh  = (bins[i] / maxBins) * SCALE
        ctx.fillStyle   = 'rgba(184,92,56,0.07)'
        ctx.fillRect(bxc - barW / 2, BIN_TOP + BIN_HMAX - bh, barW, bh)
        ctx.strokeStyle = 'rgba(184,92,56,0.18)'
        ctx.lineWidth   = 0.5
        ctx.strokeRect(bxc - barW / 2, BIN_TOP + BIN_HMAX - bh, barW, bh)
      }

      // ── Bell curve overlay (fades in as samples accumulate) ────────────────
      // Uses the same SCALE as histogram — curve peak = tallest bar peak.
      const op = Math.min(1, totalDropped / 28)
      if (op > 0.01) {
        const x0 = binX(0), x1 = binX(BINS - 1)

        // Glow pass
        ctx.strokeStyle = `rgba(184,92,56,${0.10 * op})`
        ctx.lineWidth   = 10
        ctx.lineJoin    = 'round'
        ctx.beginPath()
        for (let px = x0; px <= x1; px++) {
          const y = BIN_TOP + BIN_HMAX - bellY(px) * SCALE
          px === x0 ? ctx.moveTo(px, y) : ctx.lineTo(px, y)
        }
        ctx.stroke()

        // Crisp line
        ctx.strokeStyle = `rgba(184,92,56,${0.52 * op})`
        ctx.lineWidth   = 1.3
        ctx.beginPath()
        for (let px = x0; px <= x1; px++) {
          const y = BIN_TOP + BIN_HMAX - bellY(px) * SCALE
          px === x0 ? ctx.moveTo(px, y) : ctx.lineTo(px, y)
        }
        ctx.stroke()

        // μ and σ labels
        if (op > 0.6) {
          const la = Math.min(1, (op - 0.6) / 0.4)
          ctx.font      = 'italic 11px Georgia, serif'
          ctx.textAlign = 'center'
          ctx.fillStyle = `rgba(100,88,78,${0.55 * la})`
          ctx.fillText('μ', CX, BIN_TOP + BIN_HMAX + 16)

          const sx = CX + SIGMA_PX
          ctx.beginPath()
          ctx.strokeStyle = `rgba(184,92,56,${0.22 * la})`
          ctx.lineWidth   = 0.8
          ctx.setLineDash([3, 3])
          ctx.moveTo(sx, BIN_TOP + BIN_HMAX - bellY(sx) * SCALE - 4)
          ctx.lineTo(sx, BIN_TOP + BIN_HMAX + 2)
          ctx.stroke()
          ctx.setLineDash([])
          ctx.fillText('σ', sx, BIN_TOP + BIN_HMAX + 16)
          ctx.textAlign = 'left'
        }
      }

      // ── Pegs ───────────────────────────────────────────────────────────────
      for (const p of pegs) {
        const brightness = 0.38 + p.flash * 0.45
        ctx.beginPath()
        ctx.arc(p.x, p.y, PEG_R, 0, Math.PI * 2)
        ctx.fillStyle   = `rgba(175,162,150,${brightness})`
        ctx.fill()
        ctx.strokeStyle = `rgba(150,138,128,${brightness + 0.15})`
        ctx.lineWidth   = 0.7
        ctx.stroke()
      }

      // ── Balls and trails ───────────────────────────────────────────────────
      for (const b of balls) {
        if (b.settled) continue

        const src = b.wps[b.wpIdx]
        const dst = b.wps[b.wpIdx + 1] ?? src
        const bx  = lerp(src.x, dst.x, easeInOut(b.t))
        const by  = lerp(src.y, dst.y, easeIn(b.t))

        // Trail
        for (let i = 0; i < b.trail.length; i++) {
          const pt = b.trail[i]
          const a  = (i / b.trail.length) * 0.28
          ctx.beginPath()
          ctx.arc(pt.x, pt.y, 1.6, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(184,92,56,${a})`
          ctx.fill()
        }

        // Glow
        const g = ctx.createRadialGradient(bx, by, 0, bx, by, 9)
        g.addColorStop(0, 'rgba(184,92,56,0.22)')
        g.addColorStop(1, 'rgba(184,92,56,0)')
        ctx.beginPath()
        ctx.arc(bx, by, 9, 0, Math.PI * 2)
        ctx.fillStyle = g
        ctx.fill()

        // Ball
        ctx.beginPath()
        ctx.arc(bx, by, BALL_R, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(184,92,56,0.84)'
        ctx.fill()
      }

      rafId = requestAnimationFrame(draw)
    }

    rafId = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(rafId)
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{ display: 'block', width: '100%', maxWidth: `${W}px`, height: 'auto' }}
    />
  )
}
