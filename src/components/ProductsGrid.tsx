'use client'

import { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import { ShoppingCart, Check, X } from 'lucide-react'

export interface CategoryItem {
  id: string
  name: string
  slug: string
  image_url?: string | null
}

export interface SubcategoryItem {
  id: string
  name: string
  slug: string
  image_url?: string | null
}

export interface CategoryGroupItem {
  id: string
  name: string
  slug: string
  subcategories: SubcategoryItem[]
}

export interface ProductItem {
  slug: string
  name: string
  img: string
  cat: string
  category_ids?: string[]
  subcategory_ids?: string[]
}

export function ProductsGrid({
  products,
  categoryGroups = [],
  categories = [],
  showFilters = true,
}: {
  products: ProductItem[]
  categoryGroups?: CategoryGroupItem[]
  categories?: CategoryItem[]
  showFilters?: boolean
}) {
  const searchParams = useSearchParams()
  const initialCategoryParam = searchParams.get('category')

  // Selected parent category tab
  const [activeCategoryTab, setActiveCategoryTab] = useState<string>(() => {
    if (categoryGroups.length > 0) return categoryGroups[0].id
    return ''
  })

  // Selected subcategories (array of subcategory ids)
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([])
  const [visibleCount, setVisibleCount] = useState<number>(12)

  // Sync activeCategoryTab if categoryGroups loads
  useEffect(() => {
    if (categoryGroups.length > 0 && !activeCategoryTab) {
      setActiveCategoryTab(categoryGroups[0].id)
    }
  }, [categoryGroups, activeCategoryTab])

  // Tangkap query param dari URL jika ada
  useEffect(() => {
    if (initialCategoryParam && categoryGroups.length > 0) {
      const matched = categoryGroups.find(
        (cg) => cg.slug.toLowerCase() === initialCategoryParam.toLowerCase() ||
                cg.name.toLowerCase() === initialCategoryParam.toLowerCase()
      )
      if (matched) {
        setActiveCategoryTab(matched.id)
      }
    }
  }, [initialCategoryParam, categoryGroups])

  // Toggle subkategori: bisa pilih lebih dari 1 subkategori
  function toggleSubcategory(subId: string) {
    setSelectedSubcategories((prev) => {
      if (prev.includes(subId)) {
        return prev.filter((id) => id !== subId)
      } else {
        return [...prev, subId]
      }
    })
    setVisibleCount(12)
  }

  // Clear all filters
  function clearAllFilters() {
    setSelectedSubcategories([])
    setVisibleCount(12)
  }

  // Active category group object
  const currentCategoryGroup = useMemo(() => {
    return categoryGroups.find((cg) => cg.id === activeCategoryTab) || categoryGroups[0]
  }, [categoryGroups, activeCategoryTab])

  // Filter produk berdasarkan tab kategori dan subkategori yang aktif
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // 1. Cek apakah produk masuk ke tab kategori aktif (jika produk punya category_ids)
      if (activeCategoryTab && p.category_ids && p.category_ids.length > 0) {
        if (!p.category_ids.includes(activeCategoryTab)) {
          return false
        }
      }

      // 2. Cek apakah ada filter subkategori yang dipilih
      if (selectedSubcategories.length > 0) {
        if (!p.subcategory_ids || p.subcategory_ids.length === 0) {
          return false
        }
        // Harus cocok dengan salah satu subkategori yang dipilih
        const hasMatch = selectedSubcategories.some((subId) =>
          p.subcategory_ids?.includes(subId)
        )
        if (!hasMatch) return false
      }

      return true
    })
  }, [products, activeCategoryTab, selectedSubcategories])

  const displayedProducts = useMemo(() => {
    return filteredProducts.slice(0, visibleCount)
  }, [filteredProducts, visibleCount])

  if (products.length === 0) {
    return <p className="text-gray-400 text-center py-20">Belum ada produk yang dipublikasikan.</p>
  }

  // Active subcategories list to display
  const subcategoriesToDisplay = currentCategoryGroup?.subcategories || []

  return (
    <div className="w-full">
      {/* =========================================================
          FILTER KATEGORI & SUBKATEGORI (HEINZ STYLE SCREENSHOT)
      ========================================================= */}
      {showFilters && categoryGroups.length > 0 && (
        <div className="w-full mb-10 sm:mb-14">
          
          {/* BARIS ATAS: "Filter by" di kiri & TAB KATEGORI di kanan */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-200/80 pb-3 mb-8 sm:mb-12">
            <h2 className="text-xl sm:text-2xl font-black text-[#590014] tracking-tight font-heinz">
              Filter by
            </h2>

            {/* Tab Kategori Utama */}
            <div className="flex items-center gap-6 sm:gap-10 overflow-x-auto scrollbar-none py-1">
              {categoryGroups.map((group) => {
                const isActive = activeCategoryTab === group.id

                return (
                  <button
                    key={group.id}
                    type="button"
                    onClick={() => {
                      setActiveCategoryTab(group.id)
                      // Pertahankan subkategori atau reset jika ingin filter per tab
                    }}
                    className={`relative pb-3 flex items-center gap-2 text-sm sm:text-base font-bold whitespace-nowrap transition-colors cursor-pointer ${
                      isActive ? 'text-[#590014]' : 'text-neutral-500 hover:text-[#590014]'
                    }`}
                  >
                    <span>{group.name}</span>
                    {isActive && (
                      <motion.div
                        layoutId="activeTabUnderline"
                        className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#590014] rounded-full"
                      />
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          {/* BARIS TENGAH: LINGKARAN MAROON SUBKATEGORI */}
          {subcategoriesToDisplay.length > 0 && (
            <div className="w-full mb-8">
              <div className="flex items-start justify-center gap-4 sm:gap-8 md:gap-10 overflow-x-auto pb-4 pt-2 px-2 scrollbar-none">
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
                      className="group flex flex-col items-center cursor-pointer shrink-0 w-[85px] sm:w-[110px] md:w-[130px] focus:outline-none"
                    >
                      {/* Lingkaran Luar Maroon (#590014 / Dark Burgundy khas Heinz) */}
                      <div
                        className={`relative w-20 h-20 sm:w-26 sm:h-26 md:w-30 md:h-30 rounded-full p-1 sm:p-1.5 transition-all duration-300 flex items-center justify-center ${
                          isSelected
                            ? 'ring-3 ring-[#CC0000] ring-offset-2 ring-offset-[#FAF6ED] scale-105'
                            : 'group-hover:scale-105'
                        }`}
                      >
                        <div className="w-full h-full rounded-full bg-[#590014] flex items-center justify-center overflow-hidden relative shadow-md p-2">
                          <img
                            src={img}
                            alt={sub.name}
                            className="w-full h-full object-contain drop-shadow-md transition-transform duration-300 group-hover:scale-110"
                          />
                        </div>

                        {/* Checkmark jika terpilih */}
                        {isSelected && (
                          <div className="absolute top-0 right-0 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#CC0000] border-2 border-white text-white flex items-center justify-center shadow-md animate-in zoom-in-50 duration-200">
                            <Check size={11} strokeWidth={3} />
                          </div>
                        )}
                      </div>

                      {/* Label Subkategori */}
                      <span
                        className={`mt-2.5 text-xs sm:text-sm font-bold tracking-tight text-center leading-tight line-clamp-2 transition-colors ${
                          isSelected ? 'text-[#590014] font-black' : 'text-[#4A0A1A] group-hover:text-[#CC0000]'
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
              Showing <span className="font-bold text-stone-900">{Math.min(visibleCount, filteredProducts.length)}</span> of{' '}
              <span className="font-bold text-stone-900">{products.length}</span> products
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

      {/* =========================================================
          AREA UTAMA GRID PRODUK
      ========================================================= */}
      <div className="w-full min-w-0">
        <motion.div
          layout
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8 md:gap-10"
        >
          <AnimatePresence mode="popLayout">
            {displayedProducts.map(({ name, img, slug }) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                key={slug}
              >
                <Link
                  href={`/products/${slug}`}
                  className="group relative flex flex-col items-center w-full cursor-pointer"
                >
                  {/* Container Gambar Produk dengan Efek Splash Abstrak Merah saat Hover */}
                  <div className="relative w-full aspect-[4/5] flex items-center justify-center p-4 overflow-hidden rounded-2xl bg-transparent transition-transform duration-500 group-hover:-translate-y-2">
                    {/* SVG Splash Saus Organik Halus (Refined Liquid Splash) */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none scale-75 group-hover:scale-100 ease-out">
                      <svg
                        viewBox="0 0 200 200"
                        className="w-[85%] h-[85%] text-[#CC0000]"
                        fill="none"
                      >
                        {/* Lingkaran halo cahaya lembut */}
                        <circle cx="100" cy="100" r="72" fill="currentColor" fillOpacity="0.08" />

                        {/* Bentuk saus organik utama yang mulus dan proporsional */}
                        <path
                          d="M100 28C132 28 162 48 168 76C174 104 158 132 144 152C128 172 108 176 86 172C64 168 40 152 32 126C24 100 36 74 54 52C70 34 82 28 100 28Z"
                          fill="currentColor"
                          fillOpacity="0.18"
                        />

                        {/* Tetesan saus aksen halus di sekeliling */}
                        <circle cx="166" cy="48" r="5" fill="currentColor" fillOpacity="0.25" />
                        <circle cx="178" cy="68" r="3.5" fill="currentColor" fillOpacity="0.2" />
                        <circle cx="158" cy="164" r="4.5" fill="currentColor" fillOpacity="0.22" />
                        <circle cx="38" cy="146" r="4" fill="currentColor" fillOpacity="0.22" />
                        <circle cx="28" cy="88" r="3.5" fill="currentColor" fillOpacity="0.2" />
                        <circle cx="48" cy="40" r="4" fill="currentColor" fillOpacity="0.22" />
                      </svg>
                    </div>

                    {/* Gambar Produk Utama (Miring ke kanan saat disentuh/hover) */}
                    <div className="relative w-full h-full z-10 flex items-center justify-center">
                      <Image
                        src={img}
                        alt={name}
                        fill
                        unoptimized
                        sizes="(max-width: 768px) 50vw, 25vw"
                        className="object-contain drop-shadow-md group-hover:scale-105 group-hover:rotate-6 transition-transform duration-500 ease-out origin-center"
                      />
                    </div>
                  </div>

                  {/* Informasi Produk */}
                  <div className="mt-3 w-full flex items-center justify-center gap-2 sm:gap-3 px-2">
                    <h3 className="text-xs sm:text-sm md:text-base font-extrabold text-[#111111] text-center uppercase tracking-tight leading-snug">
                      {name}
                    </h3>

                    {/* Tombol Bundar Ikon Keranjang */}
                    <div className="shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gray-100 group-hover:bg-[#CC0000] text-gray-700 group-hover:text-white flex items-center justify-center transition-all duration-300 shadow-sm">
                      <ShoppingCart className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Tombol Load More */}
        {visibleCount < filteredProducts.length && (
          <div className="mt-12 sm:mt-16 flex flex-col items-center justify-center gap-2">
            <button
              onClick={() => setVisibleCount((prev) => prev + 8)}
              className="px-8 py-3.5 rounded-full bg-[#CC0000] hover:bg-[#a60c24] text-white font-black text-xs sm:text-sm tracking-wider uppercase transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105 active:scale-95 cursor-pointer"
            >
              Muat Lebih Banyak ({filteredProducts.length - visibleCount} lagi)
            </button>
            <span className="text-xs text-gray-400 mt-1">
              Menampilkan {displayedProducts.length} dari {filteredProducts.length} produk
            </span>
          </div>
        )}

        {filteredProducts.length === 0 && (
          <div className="text-center py-20 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200 mt-6">
            <p className="text-gray-500 font-semibold text-sm sm:text-base">
              Tidak ada produk yang cocok dengan kategori yang dipilih.
            </p>
            <button
              onClick={clearAllFilters}
              className="mt-3 inline-block px-5 py-2 bg-[#CC0000] text-white text-xs sm:text-sm font-bold rounded-full hover:bg-[#a60c24] transition-colors cursor-pointer"
            >
              Reset Semua Filter
            </button>
          </div>
        )}
      </div>
    </div>
  )
}