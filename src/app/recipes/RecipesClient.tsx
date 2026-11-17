'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Recipe, CategoryGroup } from '@/types/database'
import { Utensils, Check, X, Flame, UtensilsCrossed, ChefHat, Leaf, Sparkles, Star, Apple, Coffee } from 'lucide-react'

export function RecipesClient({
  initialCategoryGroups = [],
  initialRecipes = [],
}: {
  initialCategoryGroups?: CategoryGroup[]
  initialRecipes?: Recipe[]
}) {
  const searchParams = useSearchParams()
  const searchQuery = searchParams.get('search')?.toLowerCase().trim() || ''

  const [recipes] = useState<Recipe[]>(initialRecipes)
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
    return recipes.filter((recipe) => {
      // 1. Search Query
      if (searchQuery) {
        const titleMatch = recipe.title.toLowerCase().includes(searchQuery)
        const descMatch = (recipe.description || '').toLowerCase().includes(searchQuery)
        const categoryMatch = (recipe.category || '').toLowerCase().includes(searchQuery)
        if (!titleMatch && !descMatch && !categoryMatch) return false
      }

      // 2. Tab Kategori
      if (activeCategoryTab && currentCategoryGroup) {
        const recipeCategories = (recipe.category || '').split(',').map((s) => s.trim().toLowerCase())
        const groupSubSlugs = currentCategoryGroup.subcategories.map((s) => s.slug.toLowerCase())
        const groupSubNames = currentCategoryGroup.subcategories.map((s) => s.name.toLowerCase())
        const groupName = currentCategoryGroup.name.toLowerCase()

        const matchesGroup = recipeCategories.some(
          (cat) =>
            cat === groupName ||
            groupSubSlugs.includes(cat) ||
            groupSubNames.includes(cat)
        )

        // Jika subkategori di dalam grup dipilih (multi-select)
        if (selectedSubcategories.length > 0) {
          const selectedSubs = currentCategoryGroup.subcategories.filter((s) =>
            selectedSubcategories.includes(s.id)
          )
          const selectedSlugs = selectedSubs.map((s) => s.slug.toLowerCase())
          const selectedNames = selectedSubs.map((s) => s.name.toLowerCase())

          const matchesSub = recipeCategories.some(
            (cat) => selectedSlugs.includes(cat) || selectedNames.includes(cat)
          )
          return matchesSub
        }

        return matchesGroup
      }

      return true
    })
  }, [recipes, searchQuery, activeCategoryTab, currentCategoryGroup, selectedSubcategories])

  const displayedRecipes = useMemo(() => {
    return filteredRecipes.slice(0, visibleCount)
  }, [filteredRecipes, visibleCount])

  const hasMore = visibleCount < filteredRecipes.length

  return (
    <div className="w-full">
      {/* 1. Header Banner & Title */}
      <section className="bg-[#590014] text-white py-16 sm:py-20 px-4 sm:px-6 lg:px-8 border-b border-[#3D000E]">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-block text-[#CC0000] bg-white text-xs sm:text-sm font-black px-4 py-1.5 rounded-full uppercase tracking-widest mb-4 shadow-sm">
              Authentic Kitchen
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white mb-4">
              Explore All Recipes
            </h1>
            <p className="text-white/80 max-w-2xl mx-auto text-sm sm:text-base font-medium">
              Temukan aneka kreasi masakan autentik warisan Nusantara yang mudah disajikan di rumah dengan bumbu & saus berkualitas dari AWANG.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        {/* 2. Category Tab Navigation (Bila kategori dinamis tersedia) */}
        {categoryGroups.length > 0 && (
          <div className="flex items-center justify-start sm:justify-center overflow-x-auto no-scrollbar gap-2 sm:gap-3 pb-4 mb-6 border-b border-gray-100">
            {categoryGroups.map((group) => {
              const isActive = activeCategoryTab === group.id
              return (
                <button
                  key={group.id}
                  onClick={() => {
                    setActiveCategoryTab(group.id)
                    setSelectedSubcategories([])
                    setVisibleCount(12)
                  }}
                  className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-200 shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-[#CC0000] text-white shadow-md scale-105'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900'
                  }`}
                >
                  {group.name}
                </button>
              )
            })}
          </div>
        )}

        {/* 3. Subcategory Filter Pills (Multi-select) */}
        {currentCategoryGroup && currentCategoryGroup.subcategories.length > 0 && (
          <div className="bg-stone-50 border border-stone-200/80 rounded-2xl p-4 sm:p-5 mb-8">
            <div className="flex items-center justify-between gap-4 mb-3">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Filter Berdasarkan Subkategori:
              </span>
              {selectedSubcategories.length > 0 && (
                <button
                  onClick={clearAllFilters}
                  className="text-xs font-bold text-[#CC0000] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <X size={13} /> Reset Filter
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {currentCategoryGroup.subcategories.map((sub) => {
                const isSelected = selectedSubcategories.includes(sub.id)
                return (
                  <button
                    key={sub.id}
                    onClick={() => toggleSubcategory(sub.id)}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-150 cursor-pointer ${
                      isSelected
                        ? 'bg-[#0A1628] text-white shadow-xs'
                        : 'bg-white text-gray-700 border border-gray-200 hover:border-gray-400'
                    }`}
                  >
                    {isSelected && <Check size={12} strokeWidth={3} />}
                    {sub.name}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* 4. Total Search / Filter Result Indicator */}
        <div className="flex items-center justify-between text-xs sm:text-sm text-gray-500 font-medium mb-6">
          <p>
            Menampilkan <span className="font-bold text-[#0A1628]">{displayedRecipes.length}</span> dari{' '}
            <span className="font-bold text-[#0A1628]">{filteredRecipes.length}</span> resep
            {searchQuery && (
              <span>
                {' '}untuk pencarian &quot;<span className="font-bold text-[#CC0000]">{searchQuery}</span>&quot;
              </span>
            )}
          </p>
        </div>

        {/* 5. Recipes Grid */}
        {displayedRecipes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
            {displayedRecipes.map((recipe, idx) => {
              const img =
                recipe.main_image ||
                'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80'

              return (
                <motion.div
                  key={recipe.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: (idx % 4) * 0.08 }}
                  className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col group"
                >
                  <Link href={`/recipes/${recipe.slug}`} className="block relative aspect-4/3 w-full overflow-hidden bg-gray-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img}
                      alt={recipe.title}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                      {recipe.category && (
                        <span className="bg-black/70 backdrop-blur-xs text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                          {recipe.category.split(',')[0]}
                        </span>
                      )}
                    </div>
                  </Link>

                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex items-center gap-3 text-xs text-gray-500 font-medium mb-2.5">
                      {recipe.prep_time && (
                        <span>Prep: {recipe.prep_time}</span>
                      )}
                      {recipe.cook_time && (
                        <>
                          <span>•</span>
                          <span>Cook: {recipe.cook_time}</span>
                        </>
                      )}
                    </div>

                    <Link href={`/recipes/${recipe.slug}`}>
                      <h3 className="font-extrabold text-base sm:text-lg text-[#0A1628] group-hover:text-[#CC0000] transition-colors line-clamp-2 mb-2 leading-snug">
                        {recipe.title}
                      </h3>
                    </Link>

                    {recipe.description && (
                      <p className="text-gray-500 text-xs sm:text-sm line-clamp-2 mb-4 leading-relaxed font-normal">
                        {recipe.description}
                      </p>
                    )}

                    <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                      <span className="text-xs font-semibold text-gray-400">
                        {recipe.servings ? `${recipe.servings}` : 'Porsi Keluarga'}
                      </span>
                      <Link
                        href={`/recipes/${recipe.slug}`}
                        className="text-xs font-bold text-[#CC0000] hover:text-black flex items-center gap-1 transition-colors uppercase tracking-wider"
                      >
                        Lihat Resep →
                      </Link>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        ) : (
          <div className="py-20 text-center bg-gray-50 rounded-3xl border border-dashed border-gray-200">
            <Utensils className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-gray-700">Resep Tidak Ditemukan</h3>
            <p className="text-xs sm:text-sm text-gray-500 mt-1 max-w-md mx-auto">
              Tidak ada resep yang sesuai dengan kriteria filter atau pencarian Anda. Coba kata kunci lain atau reset filter.
            </p>
            <button
              onClick={clearAllFilters}
              className="mt-4 px-5 py-2 bg-[#CC0000] text-white text-xs font-bold rounded-full hover:bg-black transition-colors uppercase tracking-wider cursor-pointer"
            >
              Reset Filter Resep
            </button>
          </div>
        )}

        {/* 6. Load More Button */}
        {hasMore && (
          <div className="mt-12 text-center">
            <button
              onClick={() => setVisibleCount((prev) => prev + 12)}
              className="inline-flex items-center gap-2 bg-[#0A1628] hover:bg-[#CC0000] text-white text-xs sm:text-sm font-extrabold uppercase tracking-widest px-8 py-4 rounded-full transition-all duration-200 shadow-md hover:shadow-xl active:scale-95 cursor-pointer"
            >
              Muat Lebih Banyak Resep
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
