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
  { type: 'brand', duration: 4500 },
  { type: 'photo', src: '/hero1.webp', duration: 3500 },
  { type: 'photo', src: '/hero4.webp', duration: 3500 },
  { type: 'photo', src: '/hero3.webp', duration: 3500 },
]

// Teks slide brand
const PRE_TEXT = 'FLAVOUR YOU CAN TRUST, ONLY AT'
const TAGLINE = 'PREMIUM HALAL, CRAFTED WITH HERITAGE'

function BrandSlide() {
  return (
    <motion.div
      className="absolute inset-0 bg-[#CC0000] flex items-center justify-center px-4 pt-[84px] sm:pt-[110px] pb-[60px] sm:pb-[90px] max-md:pb-[45px]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <div className="w-full max-w-4xl flex flex-col items-center text-center">
        {/* KALIMAT PEMBUKA */}
        {PRE_TEXT && (
          <motion.h2
            className={`${heinz.className} text-white tracking-wide leading-tight text-balance text-lg sm:text-3xl lg:text-4xl mb-6 sm:mb-8`}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
          >
            {PRE_TEXT}
          </motion.h2>
        )}

        {/* LOGO AWANG BRAND (putih, tanpa shadow) */}
        <motion.div
          className="w-full flex justify-center"
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          <img
            src="/logo.webp"
            alt="AWANG Brand"
            className="w-[260px] sm:w-[380px] md:w-[440px] lg:w-[500px] h-auto object-contain brightness-0 invert select-none"
            draggable={false}
          />
        </motion.div>

        {/* TAGLINE */}
        {TAGLINE && (
          <motion.p
            className={`${heinz.className} text-white/95 text-balance tracking-[0.12em] sm:tracking-[0.2em] text-[11px] sm:text-xl mt-6 sm:mt-8 px-2`}
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

  // Loop otomatis: teks brand -> foto1 -> foto2 -> foto3 -> teks brand ...
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
    <section className="relative w-full h-screen min-h-[500px] max-md:min-h-[500px] flex flex-col bg-[#CC0000] overflow-hidden">
      {/* LAYER SLIDESHOW (foto + slide teks brand) */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence>
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
            className="w-full h-full text-[#CC0000] fill-current overflow-visible"
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