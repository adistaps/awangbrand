'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, ChevronRight } from 'lucide-react'
import { motion } from 'framer-motion'
import type { Category } from '@/types/database'

export interface CarouselCardItem {
  id: string
  name: string
  slug: string
  image_url?: string | null
}

interface CardTheme {
  label: string
  bg: string
  hoverBg: string
  hex: string // untuk preview swatch di admin
}

// Palet warna kartu — bisa dipilih per subkategori dari admin CMS
export const CARD_THEMES: Record<string, CardTheme> = {
  burgundy: { label: 'Burgundy', bg: 'bg-[#590014]', hoverBg: 'group-hover:bg-[#450010]', hex: '#590014' },
  crimson: { label: 'Crimson', bg: 'bg-[#3D0C15]', hoverBg: 'group-hover:bg-[#2F0910]', hex: '#3D0C15' },
  gravy: { label: 'Coklat Tua', bg: 'bg-[#5C1D06]', hoverBg: 'group-hover:bg-[#4A1604]', hex: '#5C1D06' },
  paprika: { label: 'Paprika', bg: 'bg-[#8F2D14]', hoverBg: 'group-hover:bg-[#78240F]', hex: '#8F2D14' },
  maroon: { label: 'Maroon', bg: 'bg-[#7A0C1E]', hoverBg: 'group-hover:bg-[#630918]', hex: '#7A0C1E' },
  mustard: { label: 'Kuning', bg: 'bg-[#B87A04]', hoverBg: 'group-hover:bg-[#9E6802]', hex: '#B87A04' },
  green: { label: 'Hijau', bg: 'bg-[#1B5E20]', hoverBg: 'group-hover:bg-[#134618]', hex: '#1B5E20' },
  olive: { label: 'Hijau Zaitun', bg: 'bg-[#4E6B1A]', hoverBg: 'group-hover:bg-[#3D5413]', hex: '#4E6B1A' },
  amber: { label: 'Kuning Amber', bg: 'bg-[#C68B00]', hoverBg: 'group-hover:bg-[#A87400]', hex: '#C68B00' },
  brown: { label: 'Coklat', bg: 'bg-[#6D3B1E]', hoverBg: 'group-hover:bg-[#572F17]', hex: '#6D3B1E' },
}

const THEME_KEYS = Object.keys(CARD_THEMES)

function CategoryCarouselCard({
  item,
  index,
  themeKey,
}: {
  item: CarouselCardItem
  index: number
  themeKey?: string
}) {
  const img =
    item.image_url ||
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80'

  const effectiveKey =
    themeKey && CARD_THEMES[themeKey]
      ? themeKey
      : THEME_KEYS[index % THEME_KEYS.length]

  const theme = CARD_THEMES[effectiveKey]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="shrink-0 select-none"
    >
      <Link
        href={`/products?sub=${item.id}`}
        className="group block relative focus:outline-none focus-visible:ring-2 focus-visible:ring-[#CC0000] rounded-2xl"
      >
        <div
          className={`relative w-[240px] sm:w-[270px] md:w-[290px] h-[340px] sm:h-[370px] md:h-[400px] rounded-2xl overflow-hidden p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-2xl ${theme.bg} ${theme.hoverBg}`}
        >
          {/* Efek kilau halus saat hover */}
          <div className="absolute inset-0 bg-radial from-white/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

          {/* Bagian Atas: Nama Kategori */}
          <div className="relative z-10 pr-2">
            <h3 className="font-sans font-black text-2xl sm:text-3xl text-white uppercase tracking-tight leading-[1.08] drop-shadow-xs line-clamp-3">
              {item.name}
            </h3>
          </div>

          {/* Bagian Bawah: Gambar Produk & Arrow Action */}
          <div className="relative z-10 flex items-end justify-between mt-auto pt-4">
            {/* Foto Produk Kategori */}
            <div className="relative w-36 h-36 sm:w-44 sm:h-44 -ml-2 -mb-2 transition-transform duration-300 group-hover:scale-105 group-hover:rotate-[-2deg]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img}
                alt={item.name}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-contain filter drop-shadow-[0_12px_16px_rgba(0,0,0,0.45)]"
              />
            </div>

            {/* Tombol Panah Kanan Bulat */}
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/20 backdrop-blur-xs text-white flex items-center justify-center shrink-0 mb-1 transition-all duration-300 group-hover:bg-white group-hover:text-black group-hover:scale-110 shadow-sm">
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 transition-transform duration-300 group-hover:translate-x-0.5" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

interface ProductCarouselSectionProps {
  initialItems?: CarouselCardItem[]
  title?: string
  cardColors?: Record<string, string>
}

export function ProductCarouselSection({
  initialItems = [],
  title = 'CATEGORIES TO EXPLORE',
  cardColors = {},
}: ProductCarouselSectionProps) {
  const [items] = useState<CarouselCardItem[]>(initialItems)
  const [sectionTitle] = useState(title)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const [padLeft, setPadLeft] = useState(16)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  // Update status aktif/nonaktif tombol panah sesuai posisi scroll
  const updateScrollState = useCallback(() => {
    const el = scrollContainerRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 4)
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4)
  }, [])

  // Ukur posisi kiri judul → jadikan padding kiri carousel
  const measureAlignment = useCallback(() => {
    const title = titleRef.current
    const scroller = scrollContainerRef.current
    if (!title || !scroller) return

    const titleRect = title.getBoundingClientRect()
    const scrollerRect = scroller.getBoundingClientRect()
    const offset = Math.max(16, titleRect.left - scrollerRect.left)
    setPadLeft(offset)
  }, [])

  useEffect(() => {
    measureAlignment()
    window.addEventListener('resize', measureAlignment)
    return () => window.removeEventListener('resize', measureAlignment)
  }, [measureAlignment])

  useEffect(() => {
    const el = scrollContainerRef.current
    if (!el) return
    updateScrollState()
    el.addEventListener('scroll', updateScrollState, { passive: true })
    return () => el.removeEventListener('scroll', updateScrollState)
  }, [items, updateScrollState])

  const scroll = (direction: 'left' | 'right') => {
    const el = scrollContainerRef.current
    if (!el) return
    const amount = direction === 'left' ? -320 : 320
    el.scrollBy({ left: amount, behavior: 'smooth' })
  }

  if (items.length === 0) return null

  return (
    <section className="bg-white py-14 sm:py-20 overflow-hidden font-sans border-b border-neutral-100">
      {/* Header: Judul & Navigasi Panah */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 sm:mb-10 flex items-end justify-between gap-4">
        <div>
          <h2
            ref={titleRef}
            className="font-sans font-black text-2xl sm:text-4xl lg:text-5xl text-[#0A1628] uppercase tracking-tight"
          >
            {sectionTitle}
          </h2>
        </div>

        {/* Tombol Panah Navigasi */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
            aria-label="Scroll left"
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-neutral-300 flex items-center justify-center text-neutral-800 transition-all duration-200 hover:bg-[#CC0000] hover:text-white hover:border-[#CC0000] disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-neutral-800 disabled:hover:border-neutral-300"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <button
            type="button"
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
            aria-label="Scroll right"
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-neutral-300 flex items-center justify-center text-neutral-800 transition-all duration-200 hover:bg-[#CC0000] hover:text-white hover:border-[#CC0000] disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-neutral-800 disabled:hover:border-neutral-300"
          >
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>

      {/* Carousel Track */}
      <div
        ref={scrollContainerRef}
        style={{
          paddingLeft: `${padLeft}px`,
          paddingRight: `${padLeft}px`,
        }}
        className="flex gap-4 sm:gap-6 overflow-x-auto no-scrollbar scroll-smooth py-4"
      >
        {items.map((item, index) => (
          <CategoryCarouselCard
            key={item.id}
            item={item}
            index={index}
            themeKey={cardColors[item.id]}
          />
        ))}
      </div>
    </section>
  )
}
