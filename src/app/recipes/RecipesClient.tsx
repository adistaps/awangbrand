'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Recipe } from '@/types/database'
import { ChevronRight, Utensils } from 'lucide-react'

export function RecipesClient() {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadRecipes() {
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from('recipes')
          .select('*, featured_product:products(*)')
          .eq('status', 'published')
          .order('created_at', { ascending: false })

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

  const fallbackRecipes: Partial<Recipe>[] = [
    {
      id: 'r1',
      title: 'Air Fryer Hawaiian Chicken Tacos',
      slug: 'air-fryer-hawaiian-chicken-tacos',
      category: 'Main Course',
      main_image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'r2',
      title: 'Bang Bang Coconut Shrimp',
      slug: 'bang-bang-coconut-shrimp',
      category: 'Appetizer',
      main_image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'r3',
      title: 'Black-eyed Pea Jambalaya',
      slug: 'black-eyed-pea-jambalaya',
      category: 'Main Course',
      main_image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'r4',
      title: 'Bourbon Glazed Chicken Skillet',
      slug: 'bourbon-chicken-skillet',
      category: 'Main Course',
      main_image: 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?auto=format&fit=crop&w=800&q=80',
    }
  ]

  const displayList = recipes.length > 0 ? recipes : (fallbackRecipes as Recipe[])

  return (
    <div className="pt-0 pb-20 bg-white font-sans">

      {/* TOP BANNER HERO */}
      <section className="bg-[#C8102E] text-white pt-24 sm:pt-28 pb-8 sm:pb-12 px-6 relative flex flex-col items-center">
        <div className="max-w-4xl mx-auto text-center space-y-3 sm:space-y-4 relative z-20">
          <h1
            className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight uppercase text-white"
            style={{ fontFamily: 'Impact, "Arial Black", sans-serif' }}
          >
            DISCOVER AUTHENTIC FLAVOURS & EASY HOME RECIPES
          </h1>
          <p className="text-white/90 text-sm sm:text-base md:text-lg font-medium leading-relaxed max-w-2xl mx-auto">
            Elevate your BBQ and daily meals with delicious recipes that pack a zesty punch for the whole family.
          </p>
          <div className="pt-1 sm:pt-2">
            <Link
              href={`/recipes/${displayList[0]?.slug || 'garlic-lemon-shrimp'}`}
              className="inline-flex items-center gap-2 bg-[#4A1521] text-white font-bold px-8 py-3 rounded-full hover:bg-[#2b0c13] transition-all text-xs sm:text-sm uppercase tracking-wide"
            >
              Get Recipe <ChevronRight size={16} />
            </Link>
          </div>
        </div>

        <div className="relative w-full max-w-5xl flex justify-center z-10 px-2 -mt-16 sm:-mt-24 pointer-events-none">
          <img
            src="/recipe.webp"
            alt="Featured Recipe"
            className="w-full h-auto object-contain max-h-[380px] sm:max-h-[500px] drop-shadow-2xl"
          />
        </div>
      </section>

      {/* MAIN RECIPES GRID SECTION (STYLE REFERENSI) */}
      <section className="pt-12 sm:pt-16 pb-16 px-6 max-w-[1280px] mx-auto w-full relative z-20">

        {/* Header Section: Judul Kiri & Deskripsi Kanan */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 sm:mb-14">
          <div className="max-w-xl">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#111111] tracking-tight leading-tight">
              Explore recipes crafted for every meal
            </h2>
          </div>
          <div className="max-w-md">
            <p className="text-stone-600 text-sm sm:text-base leading-relaxed font-normal">
              Easy-to-follow, flavorful dishes created by passionate home cooks and chefs to fit your daily cooking schedule.
            </p>
          </div>
        </div>

        {/* Grid Card Resep Overlay */}
        {displayList.length === 0 ? (
          <div className="text-center py-20 bg-white">
            <Utensils size={48} className="mx-auto text-stone-300 mb-4" />
            <h3 className="text-xl font-bold text-[#111111] mb-2">No recipes found</h3>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {displayList.map((recipe) => (
              <Link
                key={recipe.id}
                href={`/recipes/${recipe.slug}`}
                className="group relative w-full aspect-[16/10] sm:aspect-[16/9] rounded-2xl overflow-hidden cursor-pointer block"
              >
                {/* Background Image */}
                <img
                  src={recipe.main_image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80'}
                  alt={recipe.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />

                {/* Dark Overlay untuk Legibilitas Teks */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/20 group-hover:from-black/85 transition-colors duration-300" />

                {/* Konten Teks & Tombol di Dalam Card */}
                <div className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-between text-white z-10">
                  <div className="space-y-1 sm:space-y-2">
                    <h3 className="text-2xl sm:text-3xl font-extrabold leading-snug tracking-tight text-white drop-shadow-md">
                      {recipe.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-white/80 font-medium">
                      Easy Home Cooking • AWANG Heritage Paste
                    </p>
                  </div>

                  <div>
                    <span className="inline-flex items-center justify-center bg-white text-[#111111] font-bold px-5 py-2.5 rounded-full text-xs sm:text-sm group-hover:bg-[#C8102E] group-hover:text-white transition-colors duration-300">
                      Get Recipe
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

    </div>
  )
}