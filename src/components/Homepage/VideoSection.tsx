'use client'

import { motion } from 'framer-motion'

interface VideoSectionProps {
  videoSrc?: string
  posterSrc?: string
}

export function VideoSection({
  videoSrc = '/video.webm', // Ganti dengan file video kamu di folder public
  posterSrc,
}: VideoSectionProps) {
  return (
    <section className="relative w-full h-[50vh] sm:h-[70vh] md:h-[85vh] lg:h-screen bg-black overflow-hidden">
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        poster={posterSrc}
        className="w-full h-full object-cover"
      >
        <source src={videoSrc} type="video/mp4" />
        Browser Anda tidak mendukung pemutaran video.
      </video>

      {/* Teks Kiri */}
      <div className="absolute inset-0 flex items-center">
        <div className="px-6 sm:px-10 md:px-16 lg:px-20 max-w-[600px]">
          {/* Eyebrow / label kecil */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
            className="text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] text-[#E3000F] mb-3 sm:mb-4"
          >
          </motion.p>

          {/* Judul utama */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: 'easeOut', delay: 0.25 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white leading-[1.05] tracking-tight mb-4 sm:mb-6"
          >
            Dibuat dengan<br />
            <span className="text-[#E3000F]">Cinta</span>,<br />
            Disajikan dengan Bangga.
          </motion.h2>



        </div>
      </div>
    </section>
  )
}