'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowDown } from 'lucide-react'

// Letakkan foto di folder /public: hero1.webp, hero2.webp, hero3.webp
const SLIDES = ['/hero1.webp', '/hero4.webp', '/hero3.webp']

// Lama tiap foto tampil (ms)
const SLIDE_DURATION = 3500

export function HeroSection() {
  const [index, setIndex] = useState(0)

  // Loop otomatis: foto1 -> foto2 -> foto3 -> foto1 ...
  useEffect(() => {
    const t = setTimeout(
      () => setIndex((i) => (i + 1) % SLIDES.length),
      SLIDE_DURATION
    )
    return () => clearTimeout(t)
  }, [index])

  // Preload foto agar transisi tidak berkedip
  useEffect(() => {
    SLIDES.forEach((src) => {
      const img = new Image()
      img.src = src
    })
  }, [])

  const scrollToNext = () => {
    window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })
  }

  return (
    <section className="relative w-full h-screen min-h-[500px] max-md:min-h-[500px] flex flex-col bg-[#C8102E] overflow-hidden">
      {/* LAYER FOTO SLIDESHOW */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence initial={false}>
          <motion.img
            key={index}
            src={SLIDES[index]}
            alt=""
            draggable={false}
            className="absolute inset-0 w-full h-full object-cover"
            initial={{ opacity: 0, scale: 1.18 }}
            animate={{ opacity: 1, scale: 1.04 }}
            exit={{ opacity: 0 }}
            transition={{
              opacity: { duration: 0.6, ease: 'easeOut' },
              scale: { duration: SLIDE_DURATION / 1000 + 0.6, ease: 'easeOut' },
            }}
          />
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