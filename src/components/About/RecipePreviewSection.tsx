'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { Recipe } from '@/types/database'
import { ArrowLeft, ArrowRight, ChefHat, ChevronRight } from 'lucide-react'

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1000&q=80'

// Lebar kartu: 1 kartu + sedikit kartu berikutnya mengintip di mobile,
// 2 kartu di tablet, 3 kartu + kartu ke-4 mengintip di desktop (sama seperti referensi)
const CARD_WIDTH = 'w-[78%] sm:w-[46%] lg:w-[30.6%]'

export function RecipePreviewSection() {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(true)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const scrollerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    async function loadRecipes() {
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from('recipes')
          .select('id, title, slug, main_image, prep_time, cook_time, difficulty, servings, created_at')
          .eq('status', 'published')
          .order('created_at', { ascending: false })
          .limit(8)

        if (data && !error) {
          setRecipes(data as Recipe[])
        }
      } catch (err) {
        console.error('Failed to load recipes:', err)
      } finally {
        setLoading(false)
      }
    }
    loadRecipes()
  }, [])

  const updateArrows = useCallback(() => {
    const el = scrollerRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 4)
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4)
  }, [])

  useEffect(() => {
    updateArrows()
    window.addEventListener('resize', updateArrows)
    return () => window.removeEventListener('resize', updateArrows)
  }, [recipes, loading, updateArrows])

  function scrollByCard(direction: 1 | -1) {
    const el = scrollerRef.current
    if (!el) return
    const firstCard = el.querySelector<HTMLElement>('[data-card]')
    const step = firstCard ? firstCard.offsetWidth + 20 : el.clientWidth * 0.8
    el.scrollBy({ left: step * direction, behavior: 'smooth' })
  }

  return (
    <section className="w-full overflow-hidden bg-[#FFF0DB] py-10 sm:py-14">
      {/* Header */}
      <div className="flex items-start justify-between gap-6 px-5 sm:px-8 lg:px-10">
        <div className="min-w-0">
          <h2 className="font-heinz text-[44px] font-black uppercase leading-[0.95] tracking-[-0.04em] text-[#D6001C] sm:text-6xl lg:text-[84px]">
            Everyone is welcome at our table
          </h2>
          <p className="mt-6 max-w-2xl text-base leading-snug text-[#4A0A1A] sm:text-lg lg:text-xl">
            We believe in making our communities and our planet an inclusive, healthier, more flavorful place.
          </p>
        </div>

        {/* Arrow buttons */}
        <div className="mt-24 hidden shrink-0 items-center gap-5 sm:flex lg:mt-28">
          <button
            type="button"
            aria-label="Previous"
            onClick={() => scrollByCard(-1)}
            disabled={!canScrollLeft}
            className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-[#4A0A1A] text-[#4A0A1A] transition-all hover:bg-[#4A0A1A] hover:text-white disabled:cursor-default disabled:border-[#4A0A1A]/40 disabled:text-[#4A0A1A]/50 disabled:hover:bg-transparent disabled:hover:text-[#4A0A1A]/50 lg:h-16 lg:w-16"
          >
            <ArrowLeft size={22} />
          </button>
          <button
            type="button"
            aria-label="Next"
            onClick={() => scrollByCard(1)}
            disabled={!canScrollRight}
            className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-[#4A0A1A] text-[#4A0A1A] transition-all hover:bg-[#4A0A1A] hover:text-white disabled:cursor-default disabled:border-[#4A0A1A]/40 disabled:text-[#4A0A1A]/50 disabled:hover:bg-transparent disabled:hover:text-[#4A0A1A]/50 lg:h-16 lg:w-16"
          >
            <ArrowRight size={22} />
          </button>
        </div>
      </div>

      {/* Carousel */}
      <div className="mt-8 sm:mt-10">
        {loading ? (
          <div className="flex gap-5 overflow-hidden px-5 sm:px-8 lg:px-10">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className={`${CARD_WIDTH} aspect-square flex-none animate-pulse rounded-3xl bg-[#EBDCC3]`}
              />
            ))}
          </div>
        ) : recipes.length === 0 ? (
          <div className="px-5 py-20 text-center text-stone-400 sm:px-8 lg:px-10">
            <ChefHat size={48} className="mx-auto mb-4 opacity-40" />
            <p className="text-base font-semibold">Belum ada resep yang dipublikasikan.</p>
          </div>
        ) : (
          <div
            ref={scrollerRef}
            onScroll={updateArrows}
            className="flex snap-x snap-mandatory scroll-pl-5 gap-5 overflow-x-auto scroll-smooth px-5 pb-2 sm:scroll-pl-8 sm:px-8 lg:scroll-pl-10 lg:px-10[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {recipes.map((recipe, i) => (
              <motion.div
                key={recipe.id}
                data-card
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: i * 0.07 }}
                className={`${CARD_WIDTH} flex-none snap-start`}
              >
                <Link
                  href={`/recipes/${recipe.slug}`}
                  className="group relative block aspect-square w-full overflow-hidden rounded-3xl bg-stone-200"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={recipe.main_image || FALLBACK_IMAGE}
                    alt={recipe.title}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />

                  {/* Gradient gelap di bagian bawah */}
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[42%] bg-gradient-to-t from-black via-black/75 to-transparent" />

                  {/* Judul + tombol */}
                  <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 sm:p-6 lg:px-5 lg:pb-6">
                    <h3 className="font-heinz line-clamp-2 text-lg font-bold leading-[1.15] tracking-[-0.02em] text-white sm:text-xl lg:text-2xl">
                      {recipe.title}
                    </h3>
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-white text-white transition-colors group-hover:bg-white group-hover:text-black lg:h-16 lg:w-16">
                      <ChevronRight size={22} />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}