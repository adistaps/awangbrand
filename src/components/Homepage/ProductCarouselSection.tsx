'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useLanguage } from '@/context/LanguageContext'
import { FlavorPopOutCard } from '@/components/ui/FlavorPopOutCard'

export function ProductCarouselSection() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const { language } = useLanguage()

  useEffect(() => {
    async function fetchProducts() {
      try {
        const supabase = createClient()
        const { data } = await supabase
          .from('products')
          .select('id, name, slug, main_image')
          .eq('status', 'published')
          .eq('is_featured', true)
          .order('created_at', { ascending: false })
          .limit(10)

        setProducts(data || [])
      } catch (err) {
        console.error('Failed to load products', err)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -340 : 340
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
    }
  }

  if (loading) {
    return (
      <section className="w-full bg-[#FAF6ED] py-16 px-4 text-center">
        <div className="animate-pulse font-bold text-neutral-400">Loading products...</div>
      </section>
    )
  }

  if (!products || products.length === 0) return null

  return (
    <section className="w-full bg-[#FAF6ED] py-16 sm:py-20 md:py-24 px-4 sm:px-6 md:px-12 lg:px-16 overflow-hidden">
      <div className="max-w-[1400px] mx-auto">

        {/* Header & Navigasi Panah Kanan Atas */}
        <div className="flex items-center justify-between mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-black text-[#E3000F] uppercase tracking-tight">
            {language === 'en' ? 'SPICE UP YOUR KITCHEN' : 'TEMUKAN PILIHANMU'}
          </h2>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => scroll('left')}
              aria-label="Previous Slide"
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-neutral-300 bg-white/80 hover:bg-white text-neutral-800 flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-sm"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => scroll('right')}
              aria-label="Next Slide"
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-neutral-300 bg-white/80 hover:bg-white text-neutral-800 flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-sm"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Carousel Produk Pop-Out Menggunakan Komponen Terpisah FlavorPopOutCard */}
        <div
          ref={scrollContainerRef}
          className="flex justify-start md:justify-center gap-6 overflow-x-auto scrollbar-hide pt-8 pb-8 px-2 snap-x snap-mandatory scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {products.map((p, idx) => (
            <FlavorPopOutCard
              key={p.id}
              id={p.id}
              name={p.name}
              slug={p.slug}
              main_image={p.main_image}
              category={p.category?.name || p.category || ''}
              index={idx}
            />
          ))}
        </div>

        {/* Tombol "See All Products" di Tengah Bawah */}
        <div className="mt-12 text-center">
          <Link
            href="/products"
            className="inline-block bg-[#C8102E] hover:bg-[#a60c24] text-white !text-white font-black text-sm sm:text-base py-4 px-10 rounded-full transition-all duration-300 hover:scale-105 active:scale-95 shadow-md uppercase tracking-wider"
          >
            {language === 'en' ? 'See All Products' : 'Lihat Semua Produk'}
          </Link>
        </div>

      </div>
    </section>
  )
}