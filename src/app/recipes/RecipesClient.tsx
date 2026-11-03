'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { Recipe, CategoryGroup } from '@/types/database'
import { Utensils, Check, X, Flame, UtensilsCrossed, ChefHat, Leaf, Sparkles, Star, Apple, Coffee } from 'lucide-react'

export function RecipesClient({
  initialCategoryGroups = [],
}: {
  initialCategoryGroups?: CategoryGroup[]
}) {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(true)

  const categoryGroups = initialCategoryGroups

  // Active category tab
  const [activeCategoryTab, setActiveCategoryTab] = useState<string>(() => {
    return categoryGroups[0]?.id || ''
  })

  // Selected subcategories (multi-select)
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([])
  const [visibleCount, setVisibleCount] = useState<number>(12)

  useEffect(() => {
    if (categoryGroups.length > 0 && !activeCategoryTab) {
      setActiveCategoryTab(categoryGroups[0].id)
    }
  }, [categoryGroups, activeCategoryTab])

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

  // Toggle subkategori
  function toggleSubcategory(subId: string) {
    setSelectedSubcategories((prev) =>
      prev.includes(subId) ? prev.filter((id) => id !== subId) : [...prev, subId]
    )
    setVisibleCount(12)
  }

  function clearAllFilters() {
    setSelectedSubcategories([])
    setVisibleCount(12)
  }

  // Active category group object
  const currentCategoryGroup = useMemo(() => {
    return categoryGroups.find((cg) => cg.id === activeCategoryTab) || categoryGroups[0]
  }, [categoryGroups, activeCategoryTab])

  // Filter resep berdasarkan tab & subkategori terpilih
  const filteredRecipes = useMemo(() => {
    return recipes.filter((r) => {
      // 1. Cek tab category (jika resep punya category_ids)
      if (activeCategoryTab && r.category_ids && r.category_ids.length > 0) {
        if (!r.category_ids.includes(activeCategoryTab)) {
          return false
        }
      }

      // 2. Cek subcategories (multi-select)
      if (selectedSubcategories.length > 0) {
        if (!r.subcategory_ids || r.subcategory_ids.length === 0) {
          return false
        }
        const hasMatch = selectedSubcategories.some((subId) =>
          r.subcategory_ids?.includes(subId)
        )
        if (!hasMatch) return false
      }

      return true
    })
  }, [recipes, activeCategoryTab, selectedSubcategories])

  const displayedRecipes = useMemo(() => {
    return filteredRecipes.slice(0, visibleCount)
  }, [filteredRecipes, visibleCount])

  const subcategoriesToDisplay = currentCategoryGroup?.subcategories || []

  return (
    <div className="pt-0 pb-20 bg-white font-sans">

      {/* TOP BANNER HERO */}
      <section className="bg-[#CC0000] text-white pt-28 sm:pt-36 pb-16 sm:pb-24 px-6 sm:px-12 md:px-16 relative overflow-hidden flex items-center">
        <div className="max-w-7xl mx-auto w-full min-h-[580px] sm:min-h-[700px] flex flex-col md:flex-row items-center justify-center md:justify-between gap-8 sm:gap-12 lg:gap-16 relative z-10">

          {/* Sisi Kiri: Judul, Deskripsi, dan Tombol CTA */}
          <div className="w-full md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left space-y-5 sm:space-y-6">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.05] text-white font-heinz">
              Zesty, Garlicky, and Grill-Ready
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-white/95 max-w-xl font-medium leading-relaxed">
              Elevate your dishes with authentic homemade recipes that pack a delicious, flavorful punch.
            </p>
            <div className="pt-2">
              <a
                href="#recipes-grid"
                className="inline-flex items-center justify-center bg-[#4A0D18] hover:bg-[#380912] active:scale-95 text-white font-extrabold text-base sm:text-lg px-8 sm:px-10 py-3 sm:py-3.5 rounded-full shadow-lg transition-all duration-300"
              >
                Get Recipe
              </a>
            </div>
          </div>

          {/* Sisi Kanan: Gambar Masakan */}
          <div className="w-full md:w-1/2 flex justify-center md:justify-end items-center relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/recipe.webp"
              alt="Featured Recipe"
              className="w-full max-w-[460px] sm:max-w-[540px] md:max-w-none md:w-full h-auto object-contain drop-shadow-2xl transition-transform duration-500 hover:scale-105"
            />
          </div>

        </div>
      </section>

      {/* MAIN RECIPES SECTION */}
      <section id="recipes-grid" className="pt-12 sm:pt-16 pb-16 px-4 sm:px-7 max-w-[1800px] mx-auto w-full relative z-20 scroll-mt-12">

        {/* =========================================================
            FILTER KATEGORI & SUBKATEGORI (HEINZ STYLE SCREENSHOT)
        ========================================================= */}
        {categoryGroups.length > 0 && (
          <div className="w-full mb-10 sm:mb-14">

            {/* BARIS ATAS: "Filter by" di kiri & TAB KATEGORI sejajar di tengah */}
            <div className="relative flex flex-col md:flex-row md:items-center pb-3 mb-8 sm:mb-12">
              <h2 className="text-xl sm:text-2xl font-black text-[#590014] tracking-tight font-heinz shrink-0 md:absolute md:left-0 mb-4 md:mb-0">
                Filter by
              </h2>

              {/* Tab Kategori Resep sejajar di tengah */}
              <div className="flex items-center justify-start md:justify-center gap-6 sm:gap-10 overflow-x-auto scrollbar-none py-1 w-full">
                {categoryGroups.map((group, tabIdx) => {
                  const isActive = activeCategoryTab === group.id
                  const TAB_ICONS = [UtensilsCrossed, Flame, ChefHat, Leaf, Sparkles, Star, Apple, Coffee]
                  const TabIcon = TAB_ICONS[tabIdx % TAB_ICONS.length]

                  return (
                    <button
                      key={group.id}
                      type="button"
                      onClick={() => setActiveCategoryTab(group.id)}
                      className={`relative pb-3 flex items-center gap-2 text-sm sm:text-base font-bold whitespace-nowrap transition-colors cursor-pointer ${isActive ? 'text-[#590014]' : 'text-neutral-500 hover:text-[#590014]'
                        }`}
                    >
                      <TabIcon size={16} className="shrink-0" />
                      <span>{group.name}</span>
                      {isActive && (
                        <motion.div
                          layoutId="activeRecipeTabUnderline"
                          className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#590014] rounded-full"
                        />
                      )}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* BARIS TENGAH: LINGKARAN MAROON SUBKATEGORI (BESAR SEPERTI HALAMAN PRODUK) */}
            {subcategoriesToDisplay.length > 0 && (
              <div className="w-full mb-8">
                <div className="flex items-start justify-center gap-6 sm:gap-10 md:gap-14 overflow-x-auto pb-4 pt-2 px-2 scrollbar-none">
                  {subcategoriesToDisplay.map((sub) => {
                    const isSelected = selectedSubcategories.includes(sub.id)
                    const img =
                      sub.image_url ||
                      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=800&auto=format&fit=crop'

                    return (
                      <button
                        key={sub.id}
                        type="button"
                        onClick={() => toggleSubcategory(sub.id)}
                        className="group flex flex-col items-center cursor-pointer shrink-0 w-[150px] sm:w-[170px] md:w-[185px] focus:outline-none"
                      >
                        {/* Lingkaran Luar Maroon Besar */}
                        <div
                          className={`relative w-36 h-36 sm:w-40 sm:h-40 md:w-44 md:h-44 rounded-full p-1 sm:p-1.5 transition-all duration-300 flex items-center justify-center ${isSelected
                            ? 'ring-4 ring-[#CC0000] ring-offset-2 ring-offset-white scale-105'
                            : 'group-hover:scale-105'
                            }`}
                        >
                          <div className="w-full h-full rounded-full bg-[#CC0000] flex items-center justify-center overflow-hidden relative shadow-md p-2">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={img}
                              alt={sub.name}
                              className="w-full h-full object-cover rounded-full drop-shadow-md transition-transform duration-300 group-hover:scale-110"
                            />
                          </div>

                          {/* Checkmark jika terpilih */}
                          {isSelected && (
                            <div className="absolute top-0 right-0 w-6 h-6 rounded-full bg-[#CC0000] border-2 border-white text-white flex items-center justify-center shadow-md animate-in zoom-in-50 duration-200">
                              <Check size={13} strokeWidth={3} />
                            </div>
                          )}
                        </div>

                        {/* Label Subkategori */}
                        <span
                          className={`mt-3 text-sm sm:text-base font-bold tracking-tight text-center leading-tight line-clamp-2 transition-colors ${isSelected ? 'text-[#590014] font-black' : 'text-[#4A0A1A] group-hover:text-[#CC0000]'
                            }`}
                        >
                          {sub.name}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* BARIS BAWAH: Showing count & filter pills */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-stone-200/60 mt-2 px-2">
              <p className="text-xs sm:text-sm text-stone-500 font-medium">
                Showing <span className="font-bold text-stone-900">{Math.min(visibleCount, filteredRecipes.length)}</span> of{' '}
                <span className="font-bold text-stone-900">{recipes.length}</span> recipes
              </p>

              {selectedSubcategories.length > 0 && (
                <div className="flex flex-wrap items-center gap-2">
                  {selectedSubcategories.map((subId) => {
                    let subName = subId
                    for (const g of categoryGroups) {
                      const found = g.subcategories.find((s) => s.id === subId)
                      if (found) {
                        subName = found.name
                        break
                      }
                    }

                    return (
                      <button
                        key={subId}
                        type="button"
                        onClick={() => toggleSubcategory(subId)}
                        className="inline-flex items-center gap-1.5 bg-red-50 hover:bg-red-100 text-[#CC0000] border border-red-200 text-xs font-bold px-3 py-1.5 rounded-full transition-colors cursor-pointer"
                      >
                        <X size={12} />
                        <span>{subName}</span>
                      </button>
                    )
                  })}

                  <button
                    type="button"
                    onClick={clearAllFilters}
                    className="text-xs font-extrabold text-[#CC0000] hover:text-[#9e0b23] underline underline-offset-4 ml-1 cursor-pointer transition-colors"
                  >
                    Clear all filters
                  </button>
                </div>
              )}
            </div>

          </div>
        )}

        {/* Grid Card Resep (gaya Heinz: foto di atas, teks di bawah) */}
        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-3 sm:gap-x-[30px] gap-y-8 sm:gap-y-12">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n}>
                <div className="w-full aspect-[4/5] bg-stone-100 animate-pulse" />
                <div className="mt-3 mx-auto h-4 w-2/3 rounded bg-stone-100 animate-pulse" />
              </div>
            ))}
          </div>
        ) : displayedRecipes.length === 0 ? (
          <div className="text-center py-20 bg-stone-50/50 rounded-2xl border border-stone-200">
            <Utensils size={48} className="mx-auto text-stone-300 mb-4" />
            <h3 className="text-xl font-bold text-[#111111] mb-2">No recipes found</h3>
            <p className="text-sm text-stone-500 mb-4">
              {selectedSubcategories.length > 0
                ? 'Tidak ada resep yang cocok dengan filter yang dipilih.'
                : 'Belum ada resep yang dipublikasikan.'}
            </p>
            {selectedSubcategories.length > 0 && (
              <button
                type="button"
                onClick={clearAllFilters}
                className="inline-flex items-center gap-2 bg-[#CC0000] text-white px-5 py-2 rounded-full text-xs font-bold hover:bg-[#a00b22] transition-colors"
              >
                Reset Filter
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-3 sm:gap-x-[30px] gap-y-8 sm:gap-y-12">
            {displayedRecipes.map((recipe) => (
              <Link
                key={recipe.id}
                href={`/recipes/${recipe.slug}`}
                className="group block text-center cursor-pointer"
              >
                {/* Foto resep: sudut tajam, tanpa overlay */}
                <div className="relative w-full aspect-[4/5] overflow-hidden bg-stone-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={recipe.main_image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80'}
                    alt={recipe.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                </div>

                {/* Teks di bawah foto */}
                <div className="pt-3 sm:pt-4 px-1">
                  <h3 className="text-sm sm:text-lg font-extrabold leading-snug tracking-tight text-[#CC0000] line-clamp-2">
                    {recipe.title}
                  </h3>

                  <p className="mt-1 sm:mt-1.5 text-[10px] sm:text-xs font-bold text-stone-900">
                    Recipe
                  </p>

                  <p className="mt-0.5 text-[10px] sm:text-xs text-stone-600 font-medium">
                    {[recipe.prep_time, recipe.servings, recipe.difficulty]
                      .filter(Boolean)
                      .join(' • ')}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Load more button if applicable */}
        {filteredRecipes.length > visibleCount && (
          <div className="text-center mt-12">
            <button
              type="button"
              onClick={() => setVisibleCount((c) => c + 12)}
              className="inline-flex items-center justify-center bg-[#4A0D18] hover:bg-[#CC0000] text-white font-bold px-8 py-3 rounded-full text-sm uppercase tracking-wider transition-all duration-300 shadow-md hover:scale-105 cursor-pointer"
            >
              Load More Recipes
            </button>
          </div>
        )}

      </section>

    </div>
  )
}