'use client'

import { motion } from 'framer-motion'
import { ArrowDown } from 'lucide-react'

export function HeroSection() {
  const scrollToNext = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth',
    })
  }

  return (
    // KHUSUS MOBILE: Mengurangi min-height agar tidak terlalu panjang/kosong di ponsel (misal h-[85vh] atau min-h-[500px])
    <section className="relative w-full h-screen min-h-[500px] max-md:min-h-[500px] flex flex-col bg-[#C8102E] overflow-hidden">

      {/* 1. LAYER BACKGROUND VIDEO */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        >
          <source src="/hero.mp4" type="video/mp4" />
          <source src="/hero.webm" type="video/webm" />
        </video>
      </div>


      {/* 3. LAYER KONTEN UTAMA */}
      <div className="relative z-20 flex-1 flex flex-col items-center justify-center text-white px-4 text-center pointer-events-none mb-12 max-md:mb-6 max-md:px-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center w-full max-w-5xl"
        >
          {/* KHUSUS MOBILE: Menyesuaikan tinggi kontainer SVG agar teks/kurva pas dan tidak meluber di HP */}
          <div className="w-full max-w-[850px] h-[120px] sm:h-[230px] md:h-[300px] max-md:h-[100px] my-1 sm:my-2">
            <svg viewBox="0 0 500 200" className="w-full h-full overflow-visible">
              <path id="textCurve" d="M 10 180 Q 250 60 490 180" fill="none" />
              <text
                className="fill-white font-black uppercase text-[108px] sm:text-[116px] max-md:text-[64px]"
                style={{ fontFamily: 'Impact, "Arial Black", sans-serif', letterSpacing: '2px' }}
              >
              </text>
            </svg>
          </div>
        </motion.div>
      </div>


      {/* 5. LENGKUNGAN KHAS HERO BERWARNA MERAH DENGAN DROP-SHADOW */}
      <div className="absolute bottom-0 left-0 right-0 z-30 flex items-end pointer-events-none filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.3)]">
        {/* KHUSUS MOBILE: Mengecilkan tinggi lengkungan bawah agar proporsional di layar kecil */}
        <div className="w-full h-[70px] sm:h-[90px] max-md:h-[45px] relative -mb-[1px]">
          <svg
            viewBox="0 0 320 120"
            preserveAspectRatio="none"
            className="w-full h-full text-[#C8102E] fill-current overflow-visible"
          >
            {/* Path lengkungan meliuk merah ke bawah di bagian tengah */}
            <path
              d="M 0,0 L 0,0 C 40,0 90,110 160,110 C 230,110 280,0 320,0 L 320,120 L 0,120 Z"
            />
          </svg>

        </div>
      </div>

    </section>
  )
}