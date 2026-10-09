'use client'

import React from 'react'
import Image from 'next/image'
import { ShieldCheck, Award, CheckCircle2 } from 'lucide-react'

export function HalalPromiseClient() {
  return (
    <main className="bg-white min-h-screen font-sans pt-0 pb-24 text-slate-900">

      {/* ==========================================
          HERO SECTION (GAMBAR BESAR & MENEMPEL DI BAWAH)
      ========================================== */}
      <section className="bg-[#C8102E] text-white pt-28 sm:pt-36 pb-0 px-6 relative overflow-hidden flex items-end justify-center min-h-[480px] sm:min-h-[580px]">
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-end relative z-10">

          {/* Kiri: Gambar People.webp (Lebih Besar & Menempel Bawah) */}
          <div className="md:col-span-4 flex justify-center md:justify-start order-2 md:order-1 -mb-1 sm:-mb-2">
            <div className="relative w-72 sm:w-96 lg:w-[460px] aspect-[4/5] sm:aspect-square">
              <Image
                src="/people.webp"
                alt="AWANG People"
                fill
                className="object-contain object-bottom drop-shadow-xl"
                priority
              />
            </div>
          </div>

          {/* Tengah: Hanya Tulisan OUR HALAL PROMISES */}
          <div className="md:col-span-4 text-center order-1 md:order-2 self-center pb-12 sm:pb-20">
            <h1
              className="text-4xl sm:text-5xl lg:text-6xl font-black text-white uppercase tracking-tight leading-tight drop-shadow-md"
              style={{ fontFamily: 'Impact, "Arial Black", sans-serif' }}
            >
              OUR HALAL PROMISES
            </h1>
          </div>

          {/* Kanan: Gambar Mascot.webp (Lebih Besar & Menempel Bawah) */}
          <div className="md:col-span-4 flex justify-center md:justify-end order-3 -mb-1 sm:-mb-2">
            <div className="relative w-72 sm:w-96 lg:w-[460px] aspect-[4/5] sm:aspect-square">
              <Image
                src="/mascot.webp"
                alt="Halal Mascot AWANG"
                fill
                className="object-contain object-bottom drop-shadow-xl"
                priority
              />
            </div>
          </div>

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
          PILLARS / BADGES SECTION (INTERACTIVE CARDS)
      ========================================== */}
      <section className="max-w-5xl mx-auto px-6 mt-16 pt-12 border-t border-stone-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">

          {/* Card 1 */}
          <div className="p-8 rounded-2xl bg-stone-50 border border-stone-200/80 flex flex-col items-center space-y-3 transition-all duration-300 hover:-translate-y-2 hover:border-[#C8102E] hover:shadow-lg cursor-pointer">
            <ShieldCheck className="w-10 h-10 text-[#C8102E] mb-1" />
            <h3 className="font-extrabold text-lg text-[#111111] uppercase tracking-wide">
              JAKIM Certified
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-medium">
              Officially recognized and certified by JAKIM adhering strictly to global Syariah compliance.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-8 rounded-2xl bg-stone-50 border border-stone-200/80 flex flex-col items-center space-y-3 transition-all duration-300 hover:-translate-y-2 hover:border-[#C8102E] hover:shadow-lg cursor-pointer">
            <Award className="w-10 h-10 text-[#C8102E] mb-1" />
            <h3 className="font-extrabold text-lg text-[#111111] uppercase tracking-wide">
              100% Natural Ingredients
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-medium">
              Crafted from authentic, fresh local spices without artificial preservatives or coloring.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-8 rounded-2xl bg-stone-50 border border-stone-200/80 flex flex-col items-center space-y-3 transition-all duration-300 hover:-translate-y-2 hover:border-[#C8102E] hover:shadow-lg cursor-pointer">
            <CheckCircle2 className="w-10 h-10 text-[#C8102E] mb-1" />
            <h3 className="font-extrabold text-lg text-[#111111] uppercase tracking-wide">
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