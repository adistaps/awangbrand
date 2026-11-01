'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import type { Category } from '@/types/database'

interface CategoryCardProps {
  category: Category
  index: number
}

function CategoryCarouselCard({ category, index }: CategoryCardProps) {
  const img =
    category.image_url ||
    'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=800&auto=format&fit=crop'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="shrink-0 w-[200px] sm:w-[280px] snap-start"
    >
      <Link
        href={`/products?category=${encodeURIComponent(category.name)}`}
        className="group block w-full"
      >
        {/* Wadah Kartu */}
        <div className="flex flex-col items-center justify-between p-2 cursor-pointer transition-transform duration-500 group-hover:scale-[1.03]">
          {/* Gambar Kategori (PNG / Foto Produk Kategori) */}
          <div className="w-full h-[190px] sm:h-[280px] flex items-center justify-center mb-3 transition-transform duration-500 group-hover:scale-105">
            <img
              src={img}
              alt={category.name}
              className="max-h-full max-w-full object-contain drop-shadow-md"
            />
          </div>

          {/* Judul Kategori & Tombol Panah Ke Produk */}
          <div className="w-full flex items-center justify-between gap-2 pt-1">
            <h3 className="text-xs sm:text-lg font-black text-[#1A1A1A] uppercase tracking-tight line-clamp-1">
              {category.name}
            </h3>

            {/* Tombol Bundar Panah */}
            <div className="w-7 h-7 sm:w-9 sm:h-9 shrink-0 rounded-full border border-neutral-300 bg-white/90 text-black flex items-center justify-center shadow-sm transition-all duration-300 group-hover:bg-[#C8102E] group-hover:text-white group-hover:border-[#C8102E] group-hover:scale-110">
              <ChevronRight size={16} />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

export function ProductCarouselSection() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    async function fetchCategories() {
      try {
        const supabase = createClient()
        // Ambil kategori dari database. Prioritaskan kategori yang memiliki image_url
        const { data } = await supabase
          .from('categories')
          .select('*')
          .order('name', { ascending: true })

        setCategories(data || [])
      } catch (err) {
        console.error('Failed to load categories', err)
      } finally {
        setLoading(false)
      }
    }
    fetchCategories()
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

  if (!categories || categories.length === 0) return null

  return (
    <section className="w-full bg-[#FAF6ED] py-16 sm:py-20 md:py-24 px-4 sm:px-6 md:px-12 lg:px-16 overflow-hidden">
      <div className="max-w-[1400px] mx-auto">
        {/* Header & Navigasi Panah Kanan Atas */}
        <div className="flex items-center justify-between mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-black text-[#E3000F] uppercase tracking-tight">
            TEMUKAN PILIHANMU
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

        {/* Carousel Kategori Pop-Out */}
        <div
          ref={scrollContainerRef}
          className="flex justify-start md:justify-center gap-4 sm:gap-6 overflow-x-auto scrollbar-hide pt-4 pb-8 px-1 sm:px-2 snap-x snap-mandatory scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {categories.map((cat, idx) => (
            <CategoryCarouselCard
              key={cat.id}
              category={cat}
              index={idx}
            />
          ))}
        </div>

        {/* Tombol "Lihat Semua Produk" di Tengah Bawah */}
        <div className="mt-12 text-center">
          <Link
            href="/products"
            className="inline-block bg-[#C8102E] hover:bg-[#a60c24] text-white !text-white font-black text-sm sm:text-base py-4 px-10 rounded-full transition-all duration-300 hover:scale-105 active:scale-95 shadow-md uppercase tracking-wider"
          >
            Lihat Semua Produk
          </Link>
        </div>
      </div>
    </section>
  )
}