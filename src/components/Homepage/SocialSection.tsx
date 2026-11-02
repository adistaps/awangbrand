'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, useInView } from 'framer-motion'
import { cn } from '@/lib/utils'

export interface TikTokVideoItem {
  id: string
  url: string
  title: string
}

// Ikon TikTok (SVG)
function TikTokIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={`fill-current ${className}`} viewBox="0 0 24 24">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.29 0 .58.04.86.12V9.42a6.34 6.34 0 0 0-.86-.06 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.75a8.18 8.18 0 0 0 4.77 1.52V6.82a4.83 4.83 0 0 1-1-.13z" />
    </svg>
  )
}

function TikTokCard({
  item,
  idx,
  shouldRender,
}: {
  item: TikTokVideoItem
  idx: number
  shouldRender: boolean
}) {
  const [isLoaded, setIsLoaded] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.4, delay: idx * 0.08 }}
      className="w-[275px] sm:w-[310px] md:w-[325px] aspect-[9/16] rounded-xl sm:rounded-2xl overflow-hidden relative flex-shrink-0 snap-start snap-always"
    >
      {shouldRender ? (
        <>
          {/* Skeleton placeholder selagi iframe TikTok memuat */}
          {!isLoaded && (
            <div className="absolute inset-0 bg-neutral-900 flex flex-col items-center justify-center p-6 text-center space-y-3 animate-pulse">
              <div className="w-14 h-14 rounded-full bg-neutral-800 flex items-center justify-center">
                <TikTokIcon className="w-7 h-7 text-white/50" />
              </div>
              <span className="text-white/40 text-xs font-semibold uppercase tracking-wider">
                Memuat Video TikTok...
              </span>
            </div>
          )}

          <iframe
            src={`https://www.tiktok.com/player/v1/${item.id}?autoplay=0&music_info=0&description=0`}
            title={item.title}
            className="w-full h-full border-0 rounded-xl sm:rounded-2xl block"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; fullscreen; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            loading="lazy"
            onLoad={() => setIsLoaded(true)}
          />
        </>
      ) : (
        <div className="w-full h-full bg-neutral-900/60 rounded-xl sm:rounded-2xl flex flex-col items-center justify-center p-6 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
            <TikTokIcon className="w-6 h-6 text-white/60" />
          </div>
          <span className="text-white/40 text-xs font-medium uppercase tracking-wider">
            TikTok Video
          </span>
        </div>
      )}

      {/* Tombol shortcut link langsung ke TikTok */}
      <a
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Lihat video di TikTok"
        className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-black/60 hover:bg-black text-white backdrop-blur-md flex items-center justify-center border border-white/20 transition-transform hover:scale-110 shadow-md"
      >
        <TikTokIcon className="w-3.5 h-3.5 text-white" />
      </a>
    </motion.div>
  )
}

interface SocialSectionProps {
  initialVideos?: TikTokVideoItem[]
  title?: string
  subtitle?: string
  accountUrl?: string
}

export function SocialSection({
  initialVideos,
  title = 'IKUTI KAMI DI TIKTOK',
  subtitle = '@awangbrand_official — Inspirasi resep lezat, kreasi masakan & keseruan dapur AWANG',
  accountUrl = 'https://www.tiktok.com/@awangbrand_official',
}: SocialSectionProps) {
  // Tidak ada fallback — jika admin tidak mengisi video, section tidak muncul
  const videos = initialVideos && initialVideos.length > 0 ? initialVideos : []

  const [activeDot, setActiveDot] = useState(0)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const sectionRef = useRef<HTMLElement>(null)

  // Pantau apakah user sudah scroll sampai ke section Social
  const isInView = useInView(sectionRef, { once: true, margin: '250px 0px 250px 0px' })
  const [hasEnteredView, setHasEnteredView] = useState(false)

  useEffect(() => {
    if (isInView) {
      setHasEnteredView(true)
    }
  }, [isInView])

  const handleScroll = useCallback(() => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current
      const maxScroll = container.scrollWidth - container.clientWidth
      if (maxScroll > 0) {
        const progress = container.scrollLeft / maxScroll
        const dotIndex = progress > 0.35 ? 1 : 0
        setActiveDot(dotIndex)
      }
    }
  }, [])

  useEffect(() => {
    const container = scrollContainerRef.current
    if (container) {
      container.addEventListener('scroll', handleScroll)
      handleScroll()
    }
    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll)
      }
    }
  }, [handleScroll])

  const scrollToSlide = (dotIdx: number) => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current
      const maxScroll = container.scrollWidth - container.clientWidth
      container.scrollTo({
        left: dotIdx * maxScroll,
        behavior: 'smooth',
      })
    }
  }

  // Jika tidak ada video dari admin, sembunyikan section sepenuhnya
  if (videos.length === 0) return null

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-[#CC0000] py-16 sm:py-20 md:py-24 overflow-hidden"
    >
      <div className="w-full max-w-[1400px] mx-auto text-center">
        {/* Header Section terhubung dengan CMS */}
        <div className="flex flex-col items-center justify-center mb-10 px-4 sm:px-6 md:px-12">
          <div className="w-12 h-12 rounded-full bg-[#8B0000] flex items-center justify-center mb-4 shadow-inner">
            <TikTokIcon className="w-5 h-5 text-white" />
          </div>

          <h2 className="text-4xl sm:text-5xl lg:text-7xl font-black text-white uppercase tracking-tight leading-none font-heinz">
            {title}
          </h2>
          <p className="text-white/80 text-base sm:text-lg mt-4 font-medium max-w-2xl">
            {subtitle}
          </p>
        </div>

        {/* Carousel Video TikTok */}
        <div className="relative w-full">
          <div
            ref={scrollContainerRef}
            className="flex items-center gap-4 sm:gap-6 py-4 px-4 sm:px-6 md:px-12 overflow-x-auto scrollbar-hide snap-x snap-mandatory scroll-smooth"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {videos.map((item, idx) => (
              <TikTokCard
                key={item.id}
                item={item}
                idx={idx}
                shouldRender={hasEnteredView}
              />
            ))}
          </div>
        </div>

        {/* Dots Navigation */}
        <div className="flex items-center justify-center gap-2.5 mt-6 mb-2">
          {[0, 1].map((idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => scrollToSlide(idx)}
              aria-label={`Halaman video ${idx + 1}`}
              className={cn(
                'rounded-full transition-all duration-300 cursor-pointer',
                activeDot === idx
                  ? 'w-8 h-2.5 bg-white shadow-sm'
                  : 'w-2.5 h-2.5 bg-white/40 hover:bg-white/70'
              )}
            />
          ))}
        </div>

        {/* CTA ke Akun TikTok Resmi AWANG */}
        <div className="mt-8 sm:mt-10 px-4 flex justify-center items-center w-full">
          <a
            href={accountUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2.5 bg-white text-[#CC0000] font-extrabold text-sm sm:text-base px-6 py-3.5 sm:px-8 sm:py-4 rounded-full hover:bg-white/90 transition-all duration-300 hover:scale-[1.03] active:scale-[0.97] shadow-md w-auto"
          >
            <TikTokIcon className="w-5 h-5 text-[#CC0000]" />
            Follow {accountUrl.replace('https://www.tiktok.com/', '')}
          </a>
        </div>
      </div>
    </section>
  )
}