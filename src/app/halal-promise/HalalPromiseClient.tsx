'use client'

import React from 'react'
import Image from 'next/image'
import { ShieldCheck, Award, CheckCircle2 } from 'lucide-react'

export function HalalPromiseClient() {
  return (
    <main className="bg-white min-h-screen font-sans pt-0 pb-24 text-slate-900">

      {/* ==========================================
          HERO SECTION (IKON KIRI & KANAN MENEMPEL DI TEPI)
      ========================================== */}
      <section className="bg-[#C8102E] text-white pt-28 sm:pt-36 pb-12 sm:pb-16 px-6 relative overflow-hidden flex items-center justify-center min-h-[420px] sm:min-h-[520px]">

        {/* Gambar Kiri (People) - Menempel di kiri, boleh terpotong/separuh */}
        <div className="absolute left-[-60px] sm:left-0 bottom-0 w-48 sm:w-72 lg:w-96 aspect-[4/5] z-0 pointer-events-none opacity-100 sm:opacity-100">
          <Image
            src="/people.webp"
            alt="AWANG People"
            fill
            className="object-contain object-bottom drop-shadow-xl"
            priority
          />
        </div>

        {/* Gambar Kanan (Mascot) - Menempel di kanan, boleh terpotong/separuh */}
        <div className="absolute right-[-60px] sm:right-0 bottom-0 w-48 sm:w-72 lg:w-96 aspect-[4/5] z-0 pointer-events-none opacity-100 sm:opacity-100">
          <Image
            src="/mascot.webp"
            alt="Halal Mascot AWANG"
            fill
            className="object-contain object-bottom drop-shadow-xl"
            priority
          />
        </div>

        {/* Tengah: Judul Utama */}
        <div className="max-w-3xl mx-auto text-center relative z-10 px-4">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white uppercase tracking-tight leading-tight drop-shadow-md">
            OUR HALAL PROMISES
          </h1>
        </div>

      </section>

      {/* ==========================================
          SECTION DESKRIPSI UTAMA
      ========================================== */}
      <section className="max-w-4xl mx-auto px-6 pt-16 sm:pt-20 text-center space-y-6">

        {/* Judul Section Deskripsi */}
        <h2 className="text-2xl sm:text-4xl font-extrabold text-[#111111] uppercase tracking-tight">
          GUARANTEED HYGIENE & TRUSTED QUALITY
        </h2>

        {/* Paragraf 1 */}
        <div className="pt-4 space-y-6 text-stone-700 text-sm sm:text-base md:text-lg leading-relaxed font-normal max-w-3xl mx-auto text-center">
          <p>
            We maintain our operations with the same commitment quality as we did when we were first established. We maintain the same stringent quality controls we did when we first started out.
          </p>
          <p>
            Our products are compliant with Syariah requirements and manufactured according to the highest quality and hygiene standards. Certified as permissible for Muslims by JAKIM and other recognized Muslim bodies.
          </p>
        </div>

        {/* Paragraf 2 */}
        <div className="pt-2 space-y-6 text-stone-700 text-sm sm:text-base md:text-lg leading-relaxed font-normal max-w-3xl mx-auto text-center">
          <p>
            If you&apos;re looking for a reputable company, look no further than Awang Brand, as our local products have adhered to Halal standards. Our products are a testimony to a reliable production facility. Our responsibility in line with the Malaysian Government&apos;s vision to transform Malaysia into a Halal hub. Catering to the needs of Muslim consumers in Malaysia, we don&apos;t compromise with quality, safety, and hygiene standards.
          </p>
        </div>

      </section>

      {/* ==========================================
          PILLARS / BADGES SECTION (3 CARDS)
      ========================================== */}
      <section className="max-w-5xl mx-auto px-6 mt-16 pt-12 border-t border-stone-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 text-center">

          {/* Card 1 */}
          <div className="p-6 sm:p-8 rounded-2xl bg-stone-50 border border-stone-200/80 flex flex-col items-center space-y-3 transition-all duration-300 hover:-translate-y-1 hover:border-[#C8102E] hover:shadow-md cursor-pointer">
            <ShieldCheck className="w-10 h-10 text-[#C8102E] mb-1" />
            <h3 className="font-bold text-lg text-[#111111] uppercase tracking-wide">
              JAKIM Certified
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-medium">
              Officially recognized and certified by JAKIM adhering strictly to global Syariah compliance.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-6 sm:p-8 rounded-2xl bg-stone-50 border border-stone-200/80 flex flex-col items-center space-y-3 transition-all duration-300 hover:-translate-y-1 hover:border-[#C8102E] hover:shadow-md cursor-pointer">
            <Award className="w-10 h-10 text-[#C8102E] mb-1" />
            <h3 className="font-bold text-lg text-[#111111] uppercase tracking-wide flex flex-col items-center">
              <span>100%</span>
              <span>Natural Ingredients</span>
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-medium">
              Crafted from authentic, fresh local spices without artificial preservatives or coloring.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-6 sm:p-8 rounded-2xl bg-stone-50 border border-stone-200/80 flex flex-col items-center space-y-3 transition-all duration-300 hover:-translate-y-1 hover:border-[#C8102E] hover:shadow-md cursor-pointer">
            <CheckCircle2 className="w-10 h-10 text-[#C8102E] mb-1" />
            <h3 className="font-bold text-lg text-[#111111] uppercase tracking-wide">
              Hygienic Standards
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-medium">
              Produced in state-of-the-art facilities following strict food safety and hygiene controls.
            </p>
          </div>

        </div>
      </section>

    </main>
  )
}

export default HalalPromiseClient