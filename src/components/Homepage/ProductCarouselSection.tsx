'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, ChevronRight } from 'lucide-react'
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
    'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=800&auto=format&fit=crop'

  // Gunakan themeKey dari CMS jika ada, fallback ke rotasi otomatis
  const resolvedKey = (themeKey && CARD_THEMES[themeKey]) ? themeKey : THEME_KEYS[index % THEME_KEYS.length]
  const theme = CARD_THEMES[resolvedKey]

  return (
    <motion.div
      data-card
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
        {/* KARTU LATAR (gaya Heinz "FIND YOUR FLAVOR") */}
        <div
          className={`relative w-full aspect-[4/3] sm:aspect-[1.35/1] rounded-[20px] sm:rounded-[26px] ${theme.bg} ${theme.hoverBg} transition-all duration-500 shadow-lg group-hover:shadow-2xl group-hover:scale-[1.02] flex flex-col justify-end p-5 sm:p-7 overflow-visible`}
        >
          {/* Watermark tipografi samar (pengganti ilustrasi latar Heinz) */}
          <div className="absolute inset-0 rounded-[20px] sm:rounded-[26px] overflow-hidden pointer-events-none select-none z-0">
            <span className="absolute left-4 top-3 -rotate-6 whitespace-nowrap font-heinz font-black uppercase leading-none text-white/[0.08] text-5xl sm:text-7xl">
              Awang
            </span>
            <span className="absolute left-6 top-[44%] -rotate-3 whitespace-nowrap font-heinz font-black uppercase leading-none tracking-[0.2em] text-white/[0.07] text-base sm:text-2xl">
              Recipe Base Paste
            </span>
            <span className="absolute -right-2 top-[18%] rotate-6 whitespace-nowrap font-heinz font-black uppercase leading-none text-white/[0.08] text-3xl sm:text-5xl">
              4 ke 6
            </span>
          </div>

          {/* GAMBAR PRODUK POP-OUT: keluar ~28% dari atas kartu, ujung bawahnya
              tenggelam di gradient */}
          <div className="absolute inset-x-0 top-[-28%] bottom-[10%] flex items-center justify-center pointer-events-none z-10 transition-transform duration-500 ease-out group-hover:scale-105 group-hover:-translate-y-3">
            <img
              src={img}
              alt={item.name}
              draggable={false}
              className="h-full w-auto max-w-[85%] object-contain drop-shadow-[0_14px_20px_rgba(0,0,0,0.35)] select-none"
            />
          </div>

          {/* GRADIENT GELAP DI BAWAH KARTU (menutupi ujung bawah produk) */}
          <div className="absolute inset-x-0 bottom-0 h-[40%] rounded-b-[20px] sm:rounded-b-[26px] bg-gradient-to-t from-black/85 via-black/45 to-transparent pointer-events-none z-20" />

          {/* BAR BAWAH: Judul Subkategori & Tombol Panah Bulat */}
          <div className="relative z-30 w-full flex items-center justify-between gap-3">
            <h3 className="text-xl sm:text-3xl font-black text-white uppercase tracking-tight line-clamp-1 font-heinz">
              {item.name}
            </h3>

            <div className="w-10 h-10 sm:w-14 sm:h-14 shrink-0 rounded-full border-2 border-white text-white flex items-center justify-center transition-all duration-300 group-hover:bg-white group-hover:text-black group-hover:scale-110">
              <ChevronRight className="w-5 h-5 sm:w-7 sm:h-7" strokeWidth={2} />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

export function ProductCarouselSection() {
  const [items, setItems] = useState<CarouselCardItem[]>([])
  const [sectionTitle, setSectionTitle] = useState('FIND YOUR FLAVOUR')
  const [cardColors, setCardColors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  // Padding kiri carousel — diukur dari posisi kiri judul supaya SELALU sejajar
  const [padLeft, setPadLeft] = useState(16)
  const titleRef = useRef<HTMLHeadingElement>(null)
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
          ; (settings || []).forEach((row) => {
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
    const left = title.getBoundingClientRect().left - scroller.getBoundingClientRect().left
    if (left >= 0) setPadLeft(Math.round(left))
  }, [])

  useEffect(() => {
    if (loading) return
    measureAlignment()
    updateScrollState()
    const onResize = () => {
      measureAlignment()
      updateScrollState()
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [loading, items, measureAlignment, updateScrollState])

  const scroll = (direction: 'left' | 'right') => {
    const el = scrollContainerRef.current
    if (!el) return
    const firstCard = el.querySelector<HTMLElement>('[data-card]')
    const step = firstCard ? firstCard.offsetWidth + 20 : 420
    el.scrollBy({ left: direction === 'left' ? -step : step, behavior: 'smooth' })
  }

  if (loading) {
    return (
      <section className="w-full bg-[#FFF1DF] py-16 px-4 text-center">
        <div className="animate-pulse font-bold text-neutral-400">Loading categories...</div>
      </section>
    )
  }

  if (!items || items.length === 0) return null

  return (
    <section
      className="w-full bg-[#FFF1DF] py-16 sm:py-20 md:py-24"
      style={{ overflowX: 'clip', overflowY: 'visible' }}
    >
      {/* Header & Navigasi Panah — lebar penuh dengan padding kecil seperti Heinz
          (tanpa max-w / mx-auto supaya judul menempel dekat tepi kiri) */}
      <div className="w-full px-4 sm:px-6 md:px-10 lg:px-14">
        <div className="flex items-center justify-between gap-4 mb-4 sm:mb-6">
          <h2
            ref={titleRef}
            className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl leading-[0.95] font-black text-[#CC0000] uppercase tracking-tight"
          >
            {sectionTitle}
          </h2>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              aria-label="Previous Slide"
              className="w-10 h-10 sm:w-14 sm:h-14 rounded-full border-2 border-[#4A0A22] text-[#4A0A22] bg-transparent flex items-center justify-center transition-all duration-300 cursor-pointer hover:bg-[#4A0A22] hover:text-white active:scale-95 disabled:opacity-30 disabled:cursor-default disabled:hover:bg-transparent disabled:hover:text-[#4A0A22] disabled:active:scale-100"
            >
              <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2} />
            </button>
            <button
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              aria-label="Next Slide"
              className="w-10 h-10 sm:w-14 sm:h-14 rounded-full border-2 border-[#4A0A22] text-[#4A0A22] bg-transparent flex items-center justify-center transition-all duration-300 cursor-pointer hover:bg-[#4A0A22] hover:text-white active:scale-95 disabled:opacity-30 disabled:cursor-default disabled:hover:bg-transparent disabled:hover:text-[#4A0A22] disabled:active:scale-100"
            >
              <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2} />
            </button>
          </div>
        </div>
      </div>

      {/* Carousel — padding kiri mengikuti posisi kiri judul (hasil pengukuran) */}
      <div
        ref={scrollContainerRef}
        onScroll={updateScrollState}
        className="flex justify-start gap-4 sm:gap-5 overflow-x-auto scrollbar-hide pt-20 pb-8 pr-4 sm:pr-6 md:pr-10 lg:pr-14 snap-x snap-mandatory scroll-smooth"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          paddingLeft: padLeft,
          scrollPaddingLeft: padLeft,
        }}
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
      <div className="w-full px-4 sm:px-6 md:px-10 lg:px-14">
        <div className="mt-8 sm:mt-10 text-center">
          <Link
            href="/products"
            className="inline-block bg-[#4A0A22] hover:bg-[#360718] text-white !text-white font-bold text-base sm:text-lg py-4 px-10 rounded-full transition-all duration-300 hover:scale-105 active:scale-95 shadow-md"
          >
            Lihat Semua Produk
          </Link>
        </div>
      </div>
    </section>
  )
}