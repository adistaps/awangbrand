'use client'

import { useEffect, useState } from 'react'

const W = 1000
const K = 1.2 // scaleY
const GAP = 20 // jarak visual antar baris (satuan viewBox)
const PAD = 70 // sisa ruang atas = bawah (satuan viewBox)
const LS = 0.04 // jarak antar huruf (satuan em)
const WS = 0.1 // jarak antar kata (satuan em)
const BG = '#CC0000'

const LINES = [
  { text: 'KEEPING IT', size: 150, fill: '#FFFFFF' },
  { text: 'FRESH', size: 150, fill: '#540B26' },
]

export function MarqueeAbout() {
  // rasio tinggi huruf kapital terhadap font-size, diukur dari font aslinya
  const [cap, setCap] = useState(0.7)

  useEffect(() => {
    const measure = async () => {
      await document.fonts.ready
      const el = document.getElementById('marquee-about-svg')
      if (!el) return
      const cs = getComputedStyle(el)
      const ctx = document.createElement('canvas').getContext('2d')
      if (!ctx) return
      ctx.font = `${cs.fontWeight} 100px ${cs.fontFamily}`
      const m = ctx.measureText('H')
      setCap(m.actualBoundingBoxAscent / 100)
    }
    measure()
  }, [])

  // tinggi tinta tiap baris, lalu baseline masing-masing
  const inkH = LINES.map((l) => cap * l.size * K)
  const baselines: number[] = []
  let y = PAD
  inkH.forEach((h) => {
    y += h
    baselines.push(y)
    y += GAP
  })
  const H = y - GAP + PAD

  return (
    <section
      className="relative z-10 w-full flex items-center justify-center overflow-hidden px-2 sm:px-4 -my-px"
      style={{ backgroundColor: BG }}
    >
      <svg
        id="marquee-about-svg"
        viewBox={`0 0 ${W} ${H}`}
        className="w-full max-w-[1600px] h-auto font-heinz font-black uppercase"
        role="img"
        aria-label="Keeping it fresh"
      >
        {LINES.map((l, i) => (
          <text
            key={l.text}
            x={0}
            y={0}
            dx={0.5 * l.size * LS}
            fontSize={l.size}
            fill={l.fill}
            textAnchor="middle"
            transform={`translate(${W / 2} ${baselines[i]}) scale(1 ${K})`}
            style={{ letterSpacing: `${LS}em`, wordSpacing: `${WS}em` }}
          >
            {l.text}
          </text>
        ))}
      </svg>
    </section>
  )
}

export default MarqueeAbout