'use client'

import { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import { ShoppingCart, Check, X, UtensilsCrossed, Flame, ChefHat, Leaf, Sparkles, Star, Apple, Coffee } from 'lucide-react'

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
  sizes?: string[]
  category_ids?: string[]
  subcategory_ids?: string[]
}

// Warna lingkaran subkategori (sesuai referensi)
const SUB_COLOR = '#540B26'

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
  const searchQuery = searchParams.get('search')?.toLowerCase().trim() || ''

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
      // 0. Cek search query dari URL jika ada
      if (searchQuery) {
        const matchName = p.name.toLowerCase().includes(searchQuery)
        const matchCat = p.cat.toLowerCase().includes(searchQuery)
        if (!matchName && !matchCat) return false
      }

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
  }, [products, activeCategoryTab, selectedSubcategories, searchQuery])

  const displayedProducts = useMemo(() => {
    return filteredProducts.slice(0, visibleCount)
  }, [filteredProducts, visibleCount])

  if (products.length === 0) {
    return <p className="text-gray-400 text-center py-20">Belum ada produk yang dipublikasikan.</p>
  }

  // Active subcategories list to display
  const subcategoriesToDisplay = currentCategoryGroup?.subcategories || []

  // Ikon berotasi untuk tab kategori
  const TAB_ICONS = [UtensilsCrossed, Flame, ChefHat, Leaf, Sparkles, Star, Apple, Coffee]

  return (
    <div className="w-full">
      {/* =========================================================
          FILTER KATEGORI & SUBKATEGORI (HEINZ STYLE SCREENSHOT)
      ========================================================= */}
      {showFilters && categoryGroups.length > 0 && (
        <div className="w-full mb-10 sm:mb-14">

          {/* BARIS ATAS: "Filter by" di kiri & TAB KATEGORI sejajar di tengah */}
          <div className="relative flex flex-col md:flex-row md:items-center pb-3 mb-8 sm:mb-12">
            <h2 className="text-xl sm:text-2xl font-black text-[#590014] tracking-tight font-heinz shrink-0 md:absolute md:left-0 mb-4 md:mb-0">
              Filter by
            </h2>

            {/* Tab Kategori Utama sejajar di tengah */}
            <div className="flex items-center justify-start md:justify-center gap-6 sm:gap-10 overflow-x-auto scrollbar-none py-1 w-full">
              {categoryGroups.map((group, tabIdx) => {
                const isActive = activeCategoryTab === group.id
                const TabIcon = TAB_ICONS[tabIdx % TAB_ICONS.length]

                return (
                  <button
                    key={group.id}
                    type="button"
                    onClick={() => {
                      setActiveCategoryTab(group.id)
                      // Pertahankan subkategori atau reset jika ingin filter per tab
                    }}
                    className={`relative pb-3 flex items-center gap-2 text-sm sm:text-base font-extrabold whitespace-nowrap transition-colors cursor-pointer ${isActive ? 'text-[#590014]' : 'text-neutral-600 hover:text-[#590014]'
                      }`}
                  >
                    <TabIcon size={18} strokeWidth={2.4} className="shrink-0" />
                    <span className="font-extrabold">{group.name}</span>
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

          {/* BARIS TENGAH: LINGKARAN SUBKATEGORI */}
          {subcategoriesToDisplay.length > 0 && (
            <div className="w-full mb-8">
              {/* Padding atas/bawah/samping ditambah agar ring, centang, dan efek scale tidak terpotong oleh overflow */}
              <div className="flex items-start justify-center gap-6 sm:gap-10 md:gap-14 overflow-x-auto pb-6 pt-6 px-6 scrollbar-none">
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
                      {/* Wrapper luar: tempat ring & centang (TIDAK overflow-hidden) */}
                      <div
                        className={`relative w-36 h-36 sm:w-40 sm:h-40 md:w-44 md:h-44 rounded-full transition-all duration-300 ${isSelected
                          ? 'ring-[3px] ring-[#540B26] ring-offset-4 ring-offset-white scale-105'
                          : 'group-hover:scale-105'
                          }`}
                      >
                        {/* Lingkaran dalam: overflow-hidden agar foto terpotong di bawah */}
                        <div
                          className="absolute inset-0 rounded-full overflow-hidden shadow-md"
                          style={{ backgroundColor: SUB_COLOR }}
                        >
                          {/* Foto dibesarkan, menempel di atas, bagian bawah terpotong lingkaran */}
                          <img
                            src={img}
                            alt={sub.name}
                            loading="lazy"
                            decoding="async"
                            className="absolute left-1/2 top-[12%] -translate-x-1/2 w-[88%] h-[130%] max-w-none object-contain object-top drop-shadow-md transition-transform duration-300 origin-top group-hover:scale-105"
                          />
                        </div>

                        {/* Checkmark jika terpilih (di luar lingkaran dalam, jadi tidak terpotong) */}
                        {isSelected && (
                          <div
                            className="absolute -top-1 -right-1 z-10 w-6 h-6 sm:w-7 sm:h-7 rounded-full border-2 border-white text-white flex items-center justify-center shadow-md animate-in zoom-in-50 duration-200"
                            style={{ backgroundColor: SUB_COLOR }}
                          >
                            <Check size={13} strokeWidth={3} />
                          </div>
                        )}
                      </div>

                      {/* Label Subkategori */}
                      <span
                        className={`mt-5 text-xs sm:text-sm font-semibold tracking-tight text-center leading-tight line-clamp-2 transition-colors ${isSelected ? 'text-[#540B26] font-bold' : 'text-[#4A0A1A] group-hover:text-[#540B26]'
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
              <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
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
                      className="inline-flex items-center gap-2.5 bg-[#F5F5F5] hover:bg-[#EBEBEB] text-[#590014] text-sm sm:text-base font-bold px-4 py-2.5 rounded-md transition-colors cursor-pointer"
                    >
                      <X size={16} strokeWidth={2} />
                      <span>{subName}</span>
                    </button>
                  )
                })}

                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="text-base sm:text-lg font-extrabold text-[#590014] hover:text-[#CC0000] tracking-tight cursor-pointer transition-colors"
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
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-6 sm:gap-8 md:gap-10 lg:gap-12"
        >
          <AnimatePresence mode="popLayout">
            {displayedProducts.map(({ name, img, slug, sizes }) => (
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
                  className="group relative flex flex-col items-center w-full cursor-pointer focus:outline-none"
                >
                  {/* Container Gambar Produk: putih solid, tanpa rounded.
                      Saat hover berubah merah (#9B1527) kotak penuh */}
                  <div className="relative w-full aspect-[4/5] flex items-center justify-center p-2 sm:p-3 overflow-hidden bg-white group-hover:bg-[#9B1527] transition-colors duration-500 ease-out">
                    {/* Gambar Produk Utama (dikecilkan & naik sedikit agar ada jarak dengan shadow) */}
                    <div className="relative w-full h-[76%] -translate-y-3 sm:-translate-y-4 lg:-translate-y-5 z-10 flex items-center justify-center">
                      <Image
                        src={img}
                        alt={name}
                        fill
                        unoptimized
                        sizes="(max-width: 768px) 50vw, 33vw"
                        className="object-contain filter drop-shadow-[0_8px_10px_rgba(0,0,0,0.22)] group-hover:translate-x-1.5 group-hover:rotate-3 transition-transform duration-500 ease-out origin-center"
                      />
                    </div>

                    {/* Ground Shadow lebih kecil & tipis */}
                    <div className="absolute bottom-8 sm:bottom-9 lg:bottom-11 left-1/2 -translate-x-1/2 w-2/5 h-2 bg-black/20 group-hover:bg-black/30 rounded-full blur-[4px] transition-all duration-500 pointer-events-none" />

                    {/* Tombol Bundar Ikon Keranjang di Pojok Kanan Bawah */}
                    <div className="absolute bottom-3.5 right-3.5 sm:bottom-4 sm:right-4 lg:bottom-5 lg:right-5 z-20 w-8 h-8 sm:w-10 sm:h-10 lg:w-11 lg:h-11 rounded-full bg-[#540B26] text-white flex items-center justify-center transition-transform duration-300 shadow-md group-hover:scale-110">
                      <ShoppingCart className="w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-[18px] lg:h-[18px]" strokeWidth={2.2} />
                    </div>
                  </div>

                  {/* Informasi Produk di Bawah Kartu (Gaya Heinz) */}
                  <div className="mt-3.5 lg:mt-4 w-full flex flex-col items-center text-center px-1">
                    <span className="text-[11px] sm:text-xs lg:text-sm font-semibold text-[#540B26] tracking-tight">
                      Awang
                    </span>

                    <h3 className="mt-1 text-sm sm:text-base md:text-lg lg:text-xl font-black text-[#9B1527] tracking-tight leading-tight line-clamp-2">
                      {name}
                    </h3>

                    <p className="mt-1 text-[11px] sm:text-xs lg:text-sm font-semibold text-stone-600">
                      {sizes && sizes.length > 0
                        ? `Available In ${sizes.length} ${sizes.length > 1 ? 'Sizes' : 'Size'}`
                        : 'Authentic Heritage Paste'}
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Tombol Load More */}
        {visibleCount < filteredProducts.length && (
          <div className="mt-12 sm:mt-16 flex items-center justify-center">
            <button
              type="button"
              onClick={() => setVisibleCount((prev) => prev + 8)}
              className="px-10 sm:px-12 py-4 sm:py-5 rounded-full bg-[#540B26] hover:bg-[#3F081C] text-white font-black text-base sm:text-lg tracking-tight transition-colors duration-300 cursor-pointer"
            >
              Load More
            </button>
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