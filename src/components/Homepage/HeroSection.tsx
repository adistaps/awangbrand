'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowDown } from 'lucide-react'
import localFont from 'next/font/local'

// Font dari /public/font/Heinz_Label.ttf (path relatif dari file ini)
const heinz = localFont({
  src: '../../../public/font/Heinz_Label.ttf',
  display: 'swap',
})

// Urutan slide: foto & slide teks brand
// Letakkan foto di folder /public
type Slide =
  | { type: 'photo'; src: string; duration: number }
  | { type: 'brand'; duration: number }

const SLIDES: Slide[] = [
  { type: 'photo', src: '/hero1.webp', duration: 3500 },
  { type: 'photo', src: '/hero4.webp', duration: 3500 },
  { type: 'photo', src: '/hero3.webp', duration: 3500 },
  { type: 'brand', duration: 4500 },
]

// Teks slide brand (kosongkan PRE_TEXT / TAGLINE kalau tidak dipakai)
const PRE_TEXT = 'FLAVOUR YOU CAN TRUST, ONLY AT'
const LINE_1 = 'AWANG'
const LINE_2 = 'BRAND'
const TAGLINE = 'PREMIUM HALAL, CRAFTED WITH HERITAGE'

function BrandSlide() {
  return (
    <motion.div
      className="absolute inset-0 bg-[#C8102E] flex items-center justify-center px-4 pt-[84px] sm:pt-[110px] pb-[60px] sm:pb-[90px] max-md:pb-[45px]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <div className="w-full max-w-4xl flex flex-col items-center text-center">
        {/* KALIMAT PEMBUKA */}
        {PRE_TEXT && (
          <motion.h2
            className={`${heinz.className} text-white tracking-wide leading-tight text-balance text-lg sm:text-3xl lg:text-4xl`}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
          >
            {PRE_TEXT}
          </motion.h2>
        )}

        {/* AWANG (atas) + BRAND (bawah), keduanya melengkung */}
        <motion.div
          className="w-full"
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          <svg
            viewBox="0 -30 1000 480"
            className="w-full h-auto max-h-[50vh] overflow-visible"
            role="img"
            aria-label={`${LINE_1} ${LINE_2}`}
          >
            <defs>
              <path id="arc-1" d="M 40,230 Q 500,10 960,230" fill="none" />
              <path id="arc-2" d="M 40,430 Q 500,210 960,430" fill="none" />
            </defs>
            <text
              className={heinz.className}
              fill="#ffffff"
              fontSize="190"
              letterSpacing="4"
              textAnchor="middle"
            >
              <textPath href="#arc-1" startOffset="50%">
                {LINE_1}
              </textPath>
            </text>
            <text
              className={heinz.className}
              fill="#ffffff"
              fontSize="190"
              letterSpacing="4"
              textAnchor="middle"
            >
              <textPath href="#arc-2" startOffset="50%">
                {LINE_2}
              </textPath>
            </text>
          </svg>
        </motion.div>

        {/* TAGLINE */}
        {TAGLINE && (
          <motion.p
            className={`${heinz.className} text-white/95 text-balance tracking-[0.12em] sm:tracking-[0.2em] text-[11px] sm:text-xl mt-2 sm:mt-3 px-2`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7, ease: 'easeOut' }}
          >
            {TAGLINE}
          </motion.p>
        )}
      </div>
    </motion.div>
  )
}

export function HeroSection() {
  const [index, setIndex] = useState(0)
  const current = SLIDES[index]

  // Loop otomatis: foto1 -> foto2 -> foto3 -> teks brand -> foto1 ...
  useEffect(() => {
    const t = setTimeout(
      () => setIndex((i) => (i + 1) % SLIDES.length),
      current.duration
    )
    return () => clearTimeout(t)
  }, [index, current.duration])

  // Preload foto agar transisi tidak berkedip
  useEffect(() => {
    SLIDES.forEach((s) => {
      if (s.type === 'photo') {
        const img = new Image()
        img.src = s.src
      }
    })
  }, [])

  const scrollToNext = () => {
    window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })
  }

  return (
    <section className="relative w-full h-screen min-h-[500px] max-md:min-h-[500px] flex flex-col bg-[#C8102E] overflow-hidden">
      {/* LAYER SLIDESHOW (foto + slide teks brand) */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence initial={false}>
          {current.type === 'photo' ? (
            <motion.img
              key={index}
              src={current.src}
              alt=""
              draggable={false}
              className="absolute inset-0 w-full h-full object-cover"
              initial={{ opacity: 0, scale: 1.18 }}
              animate={{ opacity: 1, scale: 1.04 }}
              exit={{ opacity: 0 }}
              transition={{
                opacity: { duration: 0.6, ease: 'easeOut' },
                scale: { duration: current.duration / 1000 + 0.6, ease: 'easeOut' },
              }}
            />
          ) : (
            <BrandSlide key={index} />
          )}
        </AnimatePresence>
      </div>

      {/* LENGKUNGAN KHAS HERO BERWARNA MERAH DENGAN DROP-SHADOW */}
      <div className="absolute bottom-0 left-0 right-0 z-30 flex items-end pointer-events-none filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.3)]">
        <div className="w-full h-[70px] sm:h-[90px] max-md:h-[45px] relative -mb-[1px]">
          <svg
            viewBox="0 0 320 120"
            preserveAspectRatio="none"
            className="w-full h-full text-[#C8102E] fill-current overflow-visible"
          >
            <path d="M 0,0 L 0,0 C 40,0 90,110 160,110 C 230,110 280,0 320,0 L 320,120 L 0,120 Z" />
          </svg>
        </div>
      </div>

      {/* TOMBOL SCROLL */}
      <button
        onClick={scrollToNext}
        aria-label="Scroll ke bawah"
        className="absolute z-40 left-1/2 -translate-x-1/2 bottom-3 max-md:bottom-1 w-9 h-9 max-md:w-7 max-md:h-7 rounded-full border border-white/80 text-white flex items-center justify-center hover:bg-white/10 transition-colors"
      >
        <ArrowDown className="w-4 h-4 max-md:w-3 max-md:h-3" />
      </button>
    </section>
  )
}