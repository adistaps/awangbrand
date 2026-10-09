'use client'

import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { useInView } from 'framer-motion'
import { useLanguage } from '@/context/LanguageContext'
import TimelineBlock01 from '@/components/ui/timeline-01'
import { MarqueeSection } from '@/components/Homepage/MarqueeSection'
import { ProductCarouselSection } from '@/components/Homepage/ProductCarouselSection'

// Komponen Counter Perbaikan (Menggunakan requestAnimationFrame & inline-block)
function Counter({ target, suffix = "", duration = 2 }: { target: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  useEffect(() => {
    if (!isInView) return

    let startTime: number | null = null
    let animationFrame: number

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1)

      setCount(Math.floor(progress * target))

      if (progress < 1) {
        animationFrame = requestAnimationFrame(step)
      } else {
        setCount(target)
      }
    }

    animationFrame = requestAnimationFrame(step)

    return () => cancelAnimationFrame(animationFrame)
  }, [isInView, target, duration])

  return (
    <span ref={ref} className="inline-block min-w-[1ch]">
      {count.toLocaleString()}
      {suffix}
    </span>
  )
}

export function AboutUsClient() {
  const { language } = useLanguage()

  return (
    <div className="w-full bg-[#FDFBF7] font-sans">

      {/* ==========================================
          BAGIAN 1: HERO SECTION ("WHO WE ARE")
      ========================================== */}
      <section
        className="relative w-full min-h-[750px] sm:min-h-[850px] lg:min-h-[900px] bg-cover bg-center text-white pt-28 sm:pt-36 pb-20 px-6 sm:px-12 flex items-center overflow-hidden"
        style={{ backgroundImage: "url('/bgabout.webp')" }}
      >
        <div className="relative z-10 w-full max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-8 sm:pt-12">

          {/* Sisi Kiri Dibiarkan Kosong (Kolom 1-6) */}
          <div className="hidden lg:block lg:col-span-6" />

          {/* Sisi Kanan (Kolom 7-12) */}
          <div className="lg:col-span-6 flex flex-col text-left justify-center pl-0 sm:pl-6 lg:pl-12">

            <h1
              className="text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-wider mb-2 text-white leading-tight"
              style={{ fontFamily: 'Impact, "Arial Black", sans-serif' }}
            >
              WHO WE ARE
            </h1>

            <h2 className="text-lg sm:text-xl md:text-2xl font-bold italic text-white/95 mb-6 leading-snug">
              Awang Brand Brings a Burst of Flavours to Your Cuisine
            </h2>

            <div className="space-y-4 text-xs sm:text-sm md:text-base font-normal leading-relaxed text-white/90 max-w-xl">
              <p>
                Awang Brand is a leading Malaysian paste manufacturer dedicated to reviving authentic Malay heritage cuisine. We specialize in ready-to-cook pastes crafted to save kitchen prep time while preserving the original, rich, and natural flavors of traditional recipes.
              </p>

              <p>
                Using carefully calibrated spices and the freshest ingredients—such as red chilli, garlic, ginger, and onions—our products contain no added sugar or artificial preservatives, delivering a healthy and delicious dining experience for modern families.
              </p>

              <p className="font-semibold text-white pt-1">
                All Awang Brand products are certified HALAL, adhering strictly to international quality and testing standards for the food industry.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* ==========================================
          BAGIAN 2: FOUNDER / CEO QUOTE GRID
      ========================================== */}
      <section className="w-full py-20 sm:py-28 px-4 sm:px-6 bg-[#FDFBF7] flex justify-center items-center overflow-hidden">
        <div className="relative max-w-5xl w-full">

          {/* Garis Horizontal Top & Bottom (Gradasi Ditarik Lebih Jauh Ke Luar) */}
          <div className="absolute -left-48 -right-48 sm:-left-96 sm:-right-96 top-0 h-[1px] bg-gradient-to-r from-transparent via-[#4A1521]/25 via-50% to-transparent" />
          <div className="absolute -left-48 -right-48 sm:-left-96 sm:-right-96 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-[#4A1521]/25 via-50% to-transparent" />

          {/* Garis Vertikal (Gradasi Ditarik Lebih Jauh Ke Atas & Bawah) */}
          <div className="absolute -top-24 -bottom-24 left-0 w-[1px] bg-gradient-to-b from-transparent via-[#4A1521]/25 via-50% to-transparent" />
          <div className="absolute -top-24 -bottom-24 left-0 sm:left-[260px] w-[1px] bg-gradient-to-b from-transparent via-[#4A1521]/25 via-50% to-transparent hidden sm:block" />

          {/* Konten Utama Grid (Foto Diperbesar ke 260px) */}
          <div className="grid grid-cols-1 sm:grid-cols-[260px_1fr] items-stretch">

            {/* Foto CEO (/ceo.webp) */}
            <div className="relative w-full aspect-square bg-[#F3EFE6] flex items-center justify-center overflow-hidden">
              <Image
                src="/people.webp"
                alt="Founder & CEO AWANG"
                fill
                className="object-cover"
              />
            </div>

            {/* Kutipan & Informasi Detail */}
            <div className="flex flex-col justify-center p-6 sm:p-10 md:p-12 space-y-5">
              <blockquote className="text-lg sm:text-xl md:text-2xl font-medium text-[#111111] leading-relaxed tracking-tight">
                &ldquo;<span className="font-bold text-[#C8102E]">AWANG</span> {language === 'en'
                  ? 'is dedicated to preserving authentic heritage recipes while continuously advancing culinary innovation for everyday cooking.'
                  : 'berkomitmen melestarikan cita rasa warisan autentik sekaligus memajukan inovasi kuliner modern agar kelezatan tradisi dapat dinikmati dengan mudah.'
                }&rdquo;
              </blockquote>

              <div className="space-y-0.5">
                <h4 className="text-base sm:text-lg font-bold text-[#111111]">
                  Founder & CEO
                </h4>
                <p className="text-xs sm:text-sm font-semibold text-[#4A1521]/70">
                  AWANG Brand
                </p>
              </div>
            </div>

          </div>

        </div>
      </section>
      {/* ==========================================
          BAGIAN 3: STATS & METRICS SECTION (ANIMATED COUNTER & /about1.webp)
      ========================================== */}
      <section className="w-full max-w-[1200px] mx-auto pb-16 sm:pb-24 px-6 text-[#111111]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">

          <div className="lg:col-span-7 flex flex-col sm:flex-row sm:items-center gap-6 md:gap-8">
            <h2
              className="text-6xl sm:text-7xl md:text-8xl font-black text-[#111111] tracking-tight leading-none shrink-0"
              style={{ fontFamily: 'Impact, "Arial Black", sans-serif' }}
            >
              <Counter target={10} suffix="M+" />
            </h2>

            <div className="flex flex-col justify-center space-y-1">
              <h3 className="text-lg md:text-xl font-bold text-[#111111] leading-snug">
                {language === 'en' ? 'Pastes Produced Annually' : 'Total Produksi Bumbu Pertahun'}
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 font-medium leading-relaxed max-w-sm">
                {language === 'en'
                  ? 'Serving households, conscious consumers, and global hypermarkets with authentic Malaysian flavors.'
                  : 'Melayani ribuan keluarga, konsumen modern, dan hipermarket global dengan kelezatan autentik.'
                }
              </p>
            </div>
          </div>

          <div className="lg:col-span-5 w-full">
            <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] rounded-2xl overflow-hidden shadow-lg border border-gray-100 bg-gray-100">
              <Image
                src="/stats.webp"
                alt="AWANG Global Distribution"
                fill
                className="object-cover"
              />
            </div>
          </div>

        </div>

        <div className="w-full h-[1px] bg-gray-200 my-12 sm:my-16" />

        <div className="grid grid-cols-3 gap-6 sm:gap-12 text-left">

          <div className="flex flex-col">
            <span
              className="text-3xl sm:text-4xl md:text-5xl font-black text-[#111111] mb-1"
              style={{ fontFamily: 'Impact, "Arial Black", sans-serif' }}
            >
              <Counter target={150} suffix="+" />
            </span>
            <span className="text-[10px] sm:text-xs md:text-sm font-extrabold uppercase text-gray-500 tracking-wider">
              {language === 'en' ? 'PASTE VARIETIES' : 'VARIAN PASTA BUMBU'}
            </span>
          </div>

          <div className="flex flex-col">
            <span
              className="text-3xl sm:text-4xl md:text-5xl font-black text-[#111111] mb-1"
              style={{ fontFamily: 'Impact, "Arial Black", sans-serif' }}
            >
              <Counter target={10} suffix="+" />
            </span>
            <span className="text-[10px] sm:text-xs md:text-sm font-extrabold uppercase text-gray-500 tracking-wider">
              {language === 'en' ? 'GLOBAL REGIONS' : 'JARINGAN PASAR GLOBAL'}
            </span>
          </div>

          <div className="flex flex-col">
            <span
              className="text-3xl sm:text-4xl md:text-5xl font-black text-[#111111] mb-1"
              style={{ fontFamily: 'Impact, "Arial Black", sans-serif' }}
            >
              <Counter target={100} suffix="%" />
            </span>
            <span className="text-[10px] sm:text-xs md:text-sm font-extrabold uppercase text-gray-500 tracking-wider">
              {language === 'en' ? 'HALAL & NATURAL' : 'HALAL & ALAMI'}
            </span>
          </div>

        </div>
      </section>


      <MarqueeSection />

      {/* ==========================================
          BAGIAN 6: TIMELINE SECTION (21st.dev Component)
      ========================================== */}
      <TimelineBlock01 />

    </div>
  )
}