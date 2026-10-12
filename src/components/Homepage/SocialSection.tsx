'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

// Data video dari folder public
const socialVideos = [
  {
    id: 1,
    videoSrc: '/video/video1.mp4',
    instagramUrl: 'https://www.instagram.com/reel/DeG1EhHO2zl/',
  },
  {
    id: 2,
    videoSrc: '/video/video2.mp4',
    instagramUrl: 'https://www.instagram.com/reel/Dd0094BOu7l/',
  },
  {
    id: 3,
    videoSrc: '/video/video3.mp4',
    instagramUrl: 'https://www.instagram.com/reel/DdviTv7Or-6/',
  },
  {
    id: 4,
    videoSrc: '/video/video4.mp4',
    instagramUrl: 'https://www.instagram.com/reel/DdYdCPOOa5u/',
  },
]

// Ikon Instagram (SVG)
function InstagramIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={`fill-current ${className}`} viewBox="0 0 24 24">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  )
}

// Ikon Play
function PlayIcon() {
  return (
    <svg className="w-14 h-14 fill-current text-white drop-shadow-lg" viewBox="0 0 24 24">
      <path d="M8 5v14l11-7z" />
    </svg>
  )
}

// Komponen VideoCard
function VideoCard({ item, idx }: { item: typeof socialVideos[0]; idx: number }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  const handlePlay = () => {
    setIsPlaying(true)
    if (videoRef.current) {
      videoRef.current.play()
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.4, delay: idx * 0.1 }}
      className="w-[260px] sm:w-[320px] lg:w-[270px] h-[460px] sm:h-[560px] lg:h-[445px] rounded-3xl lg:rounded-2xl overflow-hidden relative bg-black group/card flex-shrink-0 snap-start snap-always"
    >
      <video
        ref={videoRef}
        preload="metadata"
        loop
        playsInline
        controls={isPlaying}
        className="w-full h-full object-cover"
      >
        <source src={item.videoSrc} type="video/mp4" />
      </video>

      {!isPlaying && (
        <div
          className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/30 to-black/80 flex items-center justify-center cursor-pointer transition-opacity duration-300 group-hover/card:bg-black/40 z-10"
          onClick={handlePlay}
        >
          <button
            type="button"
            aria-label="Play video"
            className="relative z-10 w-20 h-20 lg:w-20 lg:h-20 rounded-full bg-white/25 backdrop-blur-md border-2 border-white/60 flex items-center justify-center transition-all duration-300 group-hover/card:scale-110 group-hover/card:bg-white/35 active:scale-95 shadow-xl"
          >
            <PlayIcon />
          </button>

          <span className="absolute bottom-14 left-0 right-0 text-center text-white/80 text-[11px] font-semibold tracking-widest uppercase z-10">
            Tap to Play
          </span>
        </div>
      )}

      <a
        href={item.instagramUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Lihat di Instagram"
        className="absolute top-4 right-4 lg:top-3 lg:right-3 z-20 w-10 h-10 lg:w-8 lg:h-8 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center border border-white/20 hover:bg-gradient-to-br hover:from-purple-600 hover:to-orange-400 transition-all duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <InstagramIcon className="w-5 h-5 lg:w-4 lg:h-4 text-white" />
      </a>
    </motion.div>
  )
}

export function SocialSection() {
  const [activeDot, setActiveDot] = useState(0)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const handleScroll = useCallback(() => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current
      const scrollLeft = container.scrollLeft
      const itemWidth = container.querySelector('.snap-start')?.clientWidth || 0
      const gap = 16

      if (itemWidth > 0) {
        const index = Math.round(scrollLeft / (itemWidth + gap))
        setActiveDot(index)
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

  const scrollToItem = (index: number) => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current
      const itemWidth = container.querySelector('.snap-start')?.clientWidth || 0
      const gap = 16
      container.scrollTo({
        left: index * (itemWidth + gap),
        behavior: 'smooth',
      })
    }
  }

  return (
    <section className="relative w-full bg-[#C8102E] py-16 sm:py-20 md:py-24 overflow-hidden">
      <div className="w-full max-w-[1400px] mx-auto text-center">

        {/* Header Section */}
        <div className="flex flex-col items-center justify-center mb-10 px-4 sm:px-6 md:px-12">
          <div className="w-12 h-12 rounded-full bg-[#8B0000] flex items-center justify-center mb-4 shadow-inner">
            <InstagramIcon className="w-5 h-5 text-white" />
          </div>

          <h2 className="text-4xl sm:text-5xl lg:text-7xl font-black text-white uppercase tracking-tight leading-none">
            IKUTI KAMI DI INSTAGRAM
          </h2>
          <p className="text-white/70 text-base sm:text-lg lg:text-base mt-4 font-medium max-w-2xl">
            @awangbrand — Resep, tips & di balik dapur AWANG
          </p>
        </div>

        {/* Carousel Produk */}
        <div className="relative w-full">
          <div
            ref={scrollContainerRef}
            className="flex flex-nowrap lg:flex-wrap items-center lg:justify-center gap-4 sm:gap-6 py-4 px-4 sm:px-6 md:px-12 overflow-x-auto lg:overflow-x-visible scrollbar-hide snap-x snap-mandatory scroll-smooth"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {socialVideos.map((item, idx) => (
              <VideoCard key={item.id} item={item} idx={idx} />
            ))}
          </div>
        </div>

        {/* Dots Navigation */}
        <div className="flex lg:hidden items-center justify-center gap-2.5 mt-6 mb-2">
          {socialVideos.map((_, idx) => (
            <button
              key={idx}
              onClick={() => scrollToItem(idx)}
              aria-label={`Scroll to video ${idx + 1}`}
              className={cn(
                "w-2.5 h-2.5 rounded-full transition-all duration-300",
                activeDot === idx
                  ? "bg-white scale-125 shadow-md"
                  : "bg-white/30 hover:bg-white/50"
              )}
            />
          ))}
        </div>

        {/* CTA ke Instagram - Diperkecil ukurannya (w-auto) dan diposisikan pas di tengah */}
        <div className="mt-10 px-4 flex justify-center items-center w-full">
          <a
            href="https://www.instagram.com/awangbrand/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2.5 bg-white text-[#C8102E] font-extrabold text-sm sm:text-base px-6 py-3.5 sm:px-8 sm:py-4 rounded-full hover:bg-white/90 transition-all duration-300 hover:scale-[1.03] active:scale-[0.97] shadow-md w-auto"
          >
            <InstagramIcon className="w-5 h-5 text-[#C8102E]" />
            Ikuti @awangbrand
          </a>
        </div>

      </div>
    </section>
  )
}