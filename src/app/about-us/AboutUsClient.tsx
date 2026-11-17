'use client'

import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import { useInView } from 'framer-motion'
import TimelineBlock01 from '@/components/ui/timeline-01'
import { MarqueeAbout } from '@/components/Marqueeabout'
import { ProductCarouselSection } from '@/components/Homepage/ProductCarouselSection'
import { RecipePreviewSection } from '@/components/About/RecipePreviewSection'
import { QuoteFormSection } from '@/components/Homepage/QuoteFormSection'

const WorldMap = dynamic(
  () => import('@/components/ui/map').then((mod) => mod.WorldMap),
  {
    ssr: false,
    loading: () => <div className="w-full aspect-2/1 max-w-[900px] mx-auto min-h-[300px]" />,
  }
)

// Lokasi file logo halal di folder /public
const HALAL_LOGO_SRC = '/logohalal.webp'

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
  return (
    <div className="w-full bg-[#FDFBF7] font-sans">

      {/* ==========================================
          BAGIAN 1: HERO SECTION ("WHO WE ARE")
          Gaya Heinz: pola brand di kiri & kanan, teks di tengah.
          Tengah gambar /bgabout.webp sudah kosong, jadi tanpa mask.
      ========================================== */}
      <section className="relative w-full min-h-[720px] sm:min-h-[820px] lg:min-h-[900px] bg-[#DA0208] text-white pt-28 sm:pt-36 pb-20 px-6 sm:px-12 flex items-center justify-center overflow-hidden">

        {/* Layer pola: bgabout.webp dipakai apa adanya. Bagian tengah gambar sudah kosong,
            jadi tidak perlu mask/gradasi dan tidak ada garis potong di tengah. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-cover bg-center bg-no-repeat pointer-events-none
            lg:opacity-100 max-lg:opacity-[0.55]"
          style={{ backgroundImage: "url('/bgabout.webp')" }}
        />

        {/* Konten tengah */}
        <div className="relative z-10 w-full max-w-xl mx-auto flex flex-col items-center text-center">

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight leading-[0.95] mb-4 sm:mb-5 text-white font-heinz">
            WHO WE ARE
          </h1>

          <h2 className="text-base sm:text-lg lg:text-xl font-bold text-white mb-5 sm:mb-6 leading-snug">
            Awang Brand Brings a Burst of Flavours to Your Cuisine
          </h2>

          <div className="space-y-3 text-[13px] sm:text-sm lg:text-[15px] font-normal leading-relaxed text-white/95 max-w-[30rem]">
            <p>
              Awang Brand is a leading Malaysian paste manufacturer dedicated to reviving authentic Malay heritage cuisine. We specialize in ready-to-cook pastes crafted to save kitchen prep time while preserving the original, rich, and natural flavors of traditional recipes.
            </p>

            <p>
              Using carefully calibrated spices and the freshest ingredientsâ€”such as red chilli, garlic, ginger, and onionsâ€”our products contain no added sugar or artificial preservatives, delivering a healthy and delicious dining experience for modern families.
            </p>

            <p className="font-semibold text-white pt-1">
              All Awang Brand products are certified HALAL, adhering strictly to international quality and testing standards for the food industry.
            </p>
          </div>

        </div>
      </section>


      {/* ==========================================
          BAGIAN 4: OUR HALAL PROMISE SECTION
          Gaya Heinz "Invested in Quality": teks di kiri, logo halal
          di kanan. Tanpa card dan tanpa bingkai.
      ========================================== */}
      <section className="w-full bg-[#FAF6ED] py-20 sm:py-28 lg:py-32 px-6 md:px-12 overflow-hidden border-t border-stone-200">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-10 items-center">

          {/* Sisi kiri: teks */}
          <div className="flex flex-col items-center text-center max-w-xl mx-auto lg:max-w-none">
            <h2 className="text-5xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tight leading-[0.95] text-[#CC0000] font-heinz mb-6 sm:mb-8">
              OUR HALAL PROMISES
            </h2>

            <h3 className="text-sm sm:text-base font-extrabold uppercase tracking-[0.18em] text-[#4A0A1A] mb-4">
              GUARANTEED HYGIENE & TRUSTED QUALITY
            </h3>

            <p className="text-base sm:text-lg leading-relaxed text-[#4A0A1A] max-w-lg">
              We maintain our operations with the same commitment to quality as when we were first established, adhering strictly to global Syariah requirements and food safety standards. Certified permissible for Muslims by JAKIM and recognized international bodies.
            </p>
          </div>

          {/* Sisi kanan: logo halal (tanpa bingkai) */}
          <div className="relative w-full max-w-[280px] sm:max-w-[340px] lg:max-w-[420px] mx-auto aspect-square">
            <Image
              src={HALAL_LOGO_SRC}
              alt="Halal Certified"
              fill
              sizes="(max-width: 640px) 280px, (max-width: 1024px) 340px, 420px"
              className="object-contain drop-shadow-xl"
            />
          </div>

        </div>
      </section>


      {/* ==========================================
          BAGIAN 3: GLOBAL NETWORK MAP SECTION (21st.dev WorldMap)
      ========================================== */}
      <section className="w-full bg-[#FAF6ED] py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-black text-[#111111] uppercase tracking-tight mb-4 font-heinz">
              Connecting Heritage Across Borders
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-neutral-600 max-w-2xl mx-auto leading-relaxed">
              Dari dapur warisan Malaysia, citarasa otentik AWANG kini melintasi samudera menjangkau konsumen dan mitra di Malaysia, Singapura, hingga London.
            </p>
          </div>

          {/* Map directly integrates with cream background (no white card) */}
          <div className="w-full relative py-4 sm:py-6">
            <WorldMap
              lineColor="#CC0000"
              dotColor="#737373"
              backgroundColor="transparent"
              dots={[
                {
                  start: {
                    lat: 3.139,
                    lng: 101.6869,
                    label: "Malaysia"
                  },
                  end: {
                    lat: 51.5074,
                    lng: -0.1278,
                    label: "London"
                  },
                },
                {
                  start: {
                    lat: 3.139,
                    lng: 101.6869,
                  },
                  end: {
                    lat: 1.3521,
                    lng: 103.8198,
                    label: "Singapore",
                    labelPosition: "bottom"
                  },
                },
              ]}
            />
          </div>
        </div>
      </section>

      <MarqueeAbout />



      {/* ==========================================
          BAGIAN 5: TIMELINE SECTION (21st.dev Component)
      ========================================== */}
      <TimelineBlock01 />

      {/* ==========================================
          BAGIAN 6: LATEST RECIPES (max 6, dari Supabase)
      ========================================== */}
      <RecipePreviewSection />

      {/* ==========================================
          BAGIAN 7: QUOTE / CONTACT FORM SECTION
      ========================================== */}
      <QuoteFormSection />

    </div>
  )
}