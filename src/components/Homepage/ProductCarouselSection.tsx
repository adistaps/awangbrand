'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
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
  burgundy:  { label: 'Burgundy',    bg: 'bg-[#590014]', hoverBg: 'group-hover:bg-[#450010]', hex: '#590014' },
  crimson:   { label: 'Crimson',     bg: 'bg-[#3D0C15]', hoverBg: 'group-hover:bg-[#2F0910]', hex: '#3D0C15' },
  gravy:     { label: 'Coklat Tua',  bg: 'bg-[#5C1D06]', hoverBg: 'group-hover:bg-[#4A1604]', hex: '#5C1D06' },
  paprika:   { label: 'Paprika',     bg: 'bg-[#8F2D14]', hoverBg: 'group-hover:bg-[#78240F]', hex: '#8F2D14' },
  maroon:    { label: 'Maroon',      bg: 'bg-[#7A0C1E]', hoverBg: 'group-hover:bg-[#630918]', hex: '#7A0C1E' },
  mustard:   { label: 'Kuning',      bg: 'bg-[#B87A04]', hoverBg: 'group-hover:bg-[#9E6802]', hex: '#B87A04' },
  green:     { label: 'Hijau',       bg: 'bg-[#1B5E20]', hoverBg: 'group-hover:bg-[#134618]', hex: '#1B5E20' },
  olive:     { label: 'Hijau Zaitun',bg: 'bg-[#4E6B1A]', hoverBg: 'group-hover:bg-[#3D5413]', hex: '#4E6B1A' },
  amber:     { label: 'Kuning Amber',bg: 'bg-[#C68B00]', hoverBg: 'group-hover:bg-[#A87400]', hex: '#C68B00' },
  brown:     { label: 'Coklat',      bg: 'bg-[#6D3B1E]', hoverBg: 'group-hover:bg-[#572F17]', hex: '#6D3B1E' },
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
    'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=800&auto=format&fit=crop'

  // Gunakan themeKey dari CMS jika ada, fallback ke rotasi otomatis
  const resolvedKey = (themeKey && CARD_THEMES[themeKey]) ? themeKey : THEME_KEYS[index % THEME_KEYS.length]
  const theme = CARD_THEMES[resolvedKey]

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay: index * 0.06 }}
      className="shrink-0 w-[320px] sm:w-[420px] md:w-[460px] lg:w-[500px] snap-start pt-14 pb-4"
    >
      <Link
        href={`/products?category=${encodeURIComponent(item.name)}`}
        className="group relative block w-full cursor-pointer focus:outline-none"
      >
        {/* KARTU LATAR BULAT (Rounded Pill Box ala Heinz "FIND YOUR FLAVOR") */}
        <div
          className={`relative w-full aspect-[16/10] sm:aspect-[1.5/1] rounded-[28px] sm:rounded-[36px] ${theme.bg} ${theme.hoverBg} transition-all duration-500 shadow-xl group-hover:shadow-2xl group-hover:scale-[1.02] flex flex-col justify-end p-5 sm:p-7 overflow-visible`}
        >
          {/* Subtle Heinz texture / watermark pattern */}
          <div className="absolute inset-0 rounded-[28px] sm:rounded-[36px] overflow-hidden pointer-events-none opacity-10">
            <div className="absolute -right-8 -bottom-8 w-48 h-48 border-[12px] border-white rounded-full" />
            <div className="absolute -left-6 -top-6 w-36 h-36 border-[8px] border-white rounded-full" />
          </div>

          {/* GAMBAR PRODUK POP-OUT BESAR (Meluap ke atas dari kartu) */}
          <div className="absolute inset-x-0 -top-16 sm:-top-24 md:-top-32 bottom-12 sm:bottom-14 flex items-center justify-center pointer-events-none z-10 transition-transform duration-500 ease-out group-hover:scale-108 group-hover:-translate-y-3">
            <img
              src={img}
              alt={item.name}
              className="h-full w-auto max-w-[85%] object-contain drop-shadow-[0_16px_24px_rgba(0,0,0,0.45)] select-none"
            />
          </div>

          {/* BAR BAWAH: Judul Subkategori & Tombol Panah Bulat */}
          <div className="relative z-20 w-full flex items-center justify-between gap-3 pt-2">
            <h3
              className="text-base sm:text-2xl font-black text-white uppercase tracking-tight line-clamp-1 drop-shadow-sm font-heinz"
            >
              {item.name}
            </h3>

            {/* Tombol Bulat Panah Khas Heinz (Hitam/Transparan dengan Border Lingkaran) */}
            <div className="w-9 h-9 sm:w-12 sm:h-12 shrink-0 rounded-full border border-white/40 bg-black/25 backdrop-blur-xs text-white flex items-center justify-center shadow-md transition-all duration-300 group-hover:bg-white group-hover:text-black group-hover:border-white group-hover:scale-110">
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2.5} />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

export function ProductCarouselSection() {
  const [items, setItems] = useState<CarouselCardItem[]>([])
  const [sectionTitle, setSectionTitle] = useState('TEMUKAN PILIHANMU')
  const [cardColors, setCardColors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    async function fetchCarouselData() {
      try {
        const supabase = createClient()

        // Ambil konfigurasi dari site_settings
        const { data: settings } = await supabase
          .from('site_settings')
          .select('key, value')
          .in('key', [
            'homepage_product_carousel_title',
            'homepage_product_carousel_subcategories',
            'homepage_product_carousel_card_colors',
            'product_categories_hierarchy',
          ])

        const map: Record<string, string> = {}
        ;(settings || []).forEach((row) => {
          if (row.value) map[row.key] = row.value
        })

        if (map.homepage_product_carousel_title) {
          setSectionTitle(map.homepage_product_carousel_title)
        }

        if (map.homepage_product_carousel_card_colors) {
          try {
            setCardColors(JSON.parse(map.homepage_product_carousel_card_colors))
          } catch (e) { /* ignore */ }
        }

        // Kumpulkan semua subkategori dari hierarchy
        let allSubs: CarouselCardItem[] = []
        if (map.product_categories_hierarchy) {
          try {
            const hierarchy = JSON.parse(map.product_categories_hierarchy)
            if (Array.isArray(hierarchy)) {
              hierarchy.forEach((group: any) => {
                if (Array.isArray(group.subcategories)) {
                  group.subcategories.forEach((sub: any) => {
                    allSubs.push({
                      id: sub.id,
                      name: sub.name,
                      slug: sub.slug,
                      image_url: sub.image_url || null,
                    })
                  })
                }
              })
            }
          } catch (e) {
            console.error('Failed parsing hierarchy', e)
          }
        }

        // Cek apakah ada pilihan subkategori spesifik dari CMS
        if (map.homepage_product_carousel_subcategories) {
          try {
            const selectedIds: string[] = JSON.parse(map.homepage_product_carousel_subcategories)
            if (Array.isArray(selectedIds) && selectedIds.length > 0) {
              const ordered = selectedIds
                .map((id) => allSubs.find((s) => s.id === id))
                .filter(Boolean) as CarouselCardItem[]

              if (ordered.length > 0) {
                setItems(ordered)
                return
              }
            }
          } catch (e) {
            console.error('Failed parsing selected subcategories', e)
          }
        }

        // Fallback: Jika belum ada setting CMS spesifik, gunakan semua subkategori yang memiliki gambar
        if (allSubs.length > 0) {
          setItems(allSubs)
        } else {
          // Fallback ke tabel categories lama jika hierarchy belum ada
          const { data: fallbackCats } = await supabase
            .from('categories')
            .select('id, name, slug, image_url')
            .order('name', { ascending: true })

          setItems(fallbackCats || [])
        }
      } catch (err) {
        console.error('Failed to load carousel subcategories', err)
      } finally {
        setLoading(false)
      }
    }
    fetchCarouselData()
  }, [])

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -240 : 240
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
    }
  }

  if (loading) {
    return (
      <section className="w-full bg-[#FAF6ED] py-16 px-4 text-center">
        <div className="animate-pulse font-bold text-neutral-400">Loading categories...</div>
      </section>
    )
  }

  if (!items || items.length === 0) return null

  return (
    <section
      className="w-full bg-[#FAF6ED] py-16 sm:py-20 md:py-24"
      style={{ overflowX: 'clip', overflowY: 'visible' }}
    >
      {/* Header & Navigasi Panah */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-12 lg:px-16">
        <div className="flex items-center justify-between mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-black text-[#CC0000] uppercase tracking-tight">
            {sectionTitle}
          </h2>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => scroll('left')}
              aria-label="Previous Slide"
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-neutral-300 bg-white/80 hover:bg-white text-neutral-800 flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-sm cursor-pointer"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => scroll('right')}
              aria-label="Next Slide"
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-neutral-300 bg-white/80 hover:bg-white text-neutral-800 flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-sm cursor-pointer"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Carousel Kategori Pop-Out — full width tanpa clipping */}
      <div
        ref={scrollContainerRef}
        className="flex justify-start gap-4 sm:gap-5 overflow-x-auto scrollbar-hide pt-20 pb-8 pl-4 sm:pl-6 md:pl-12 lg:pl-16 snap-x snap-mandatory scroll-smooth"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {items.map((it, idx) => (
            <CategoryCarouselCard
              key={it.id}
              item={it}
              index={idx}
              themeKey={cardColors[it.id]}
            />
          ))}
      </div>

      {/* Tombol "Lihat Semua Produk" di Tengah Bawah */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-12 lg:px-16">
        <div className="mt-12 text-center">
          <Link
            href="/products"
            className="inline-block bg-[#CC0000] hover:bg-[#a60c24] text-white !text-white font-black text-sm sm:text-base py-4 px-10 rounded-full transition-all duration-300 hover:scale-105 active:scale-95 shadow-md uppercase tracking-wider"
          >
            Lihat Semua Produk
          </Link>
        </div>
      </div>
    </section>
  )
}