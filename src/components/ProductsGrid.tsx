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

export function ProductsGrid({
  products,
  categories = [],
  showFilters = true,
}: {
  products: { slug: string; name: string; img: string; cat: string }[]
  categories?: CategoryItem[]
  showFilters?: boolean
}) {
  const searchParams = useSearchParams()
  const initialCategoryParam = searchParams.get('category')

  // Set multiple selected categories (array of names in uppercase)
  // Default kosong [] -> Berarti semua produk ditampilkan
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [visibleCount, setVisibleCount] = useState<number>(8)

  // Tangkap query param dari URL jika datang dari klik Carousel Beranda
  useEffect(() => {
    if (initialCategoryParam) {
      setSelectedCategories([initialCategoryParam.toUpperCase()])
    }
  }, [initialCategoryParam])

  // Toggle kategori: bisa pilih lebih dari 1 kategori
  function toggleCategory(catName: string) {
    const upper = catName.toUpperCase()
    setSelectedCategories((prev) => {
      if (prev.includes(upper)) {
        return prev.filter((c) => c !== upper)
      } else {
        return [...prev, upper]
      }
    })
    setVisibleCount(8)
  }

  // Clear all filters
  function clearAllFilters() {
    setSelectedCategories([])
    setVisibleCount(8)
  }

  // Filter produk berdasarkan kategori yang terpilih
  const filteredProducts = useMemo(() => {
    if (selectedCategories.length === 0) return products
    return products.filter((p) =>
      selectedCategories.includes(p.cat.toUpperCase())
    )
  }, [products, selectedCategories])

  const displayedProducts = useMemo(() => {
    return filteredProducts.slice(0, visibleCount)
  }, [filteredProducts, visibleCount])

  if (products.length === 0) {
    return <p className="text-gray-400 text-center py-20">Belum ada produk yang dipublikasikan.</p>
  }

  // Filter categories to only display categories that have an image or have products
  const displayCategories = categories.length > 0 ? categories : []

  return (
    <div className="w-full">
      {/* =========================================================
          FILTER KATEGORI CIRCULAR HEINZ STYLE
      ========================================================= */}
      {showFilters && displayCategories.length > 0 && (
        <div className="w-full mb-10 sm:mb-14">
          {/* Container bulatan kategori: rapi & sejajar di mobile maupun desktop */}
          <div className="flex items-start justify-center gap-3 sm:gap-8 md:gap-10 overflow-x-auto pb-4 pt-3 px-2 sm:px-4 scrollbar-none">
            {displayCategories.map((cat) => {
              const isSelected = selectedCategories.includes(cat.name.toUpperCase())
              const img =
                cat.image_url ||
                'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=800&auto=format&fit=crop'

              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => toggleCategory(cat.name)}
                  className="group flex flex-col items-center cursor-pointer shrink-0 w-[96px] sm:w-[130px] md:w-[150px] focus:outline-none"
                >
                  {/* Lingkaran Luar (Ring Merah Terang Awang bila terpilih) */}
                  <div
                    className={`relative w-20 h-20 sm:w-28 sm:h-28 md:w-34 md:h-34 rounded-full p-1 sm:p-2 transition-all duration-300 flex items-center justify-center ${
                      isSelected
                        ? 'ring-2 ring-[#C8102E] ring-offset-2 ring-offset-white scale-105'
                        : 'group-hover:scale-105'
                    }`}
                  >
                    {/* Lingkaran Dalam Warna Merah Brand Awang (#C8102E) */}
                    <div className="w-full h-full rounded-full bg-[#C8102E] flex items-center justify-center overflow-hidden relative shadow-inner p-1.5 sm:p-2.5">
                      {/* Foto Kategori / Produk Kategori PNG */}
                      <img
                        src={img}
                        alt={cat.name}
                        className="w-full h-full object-contain drop-shadow-md transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>

                    {/* Checkmark Badge Merah di Pojok Kanan Atas saat terpilih */}
                    {isSelected && (
                      <div className="absolute top-0 right-0 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#C8102E] border-2 border-white text-white flex items-center justify-center shadow-md animate-in zoom-in-50 duration-200">
                        <Check size={11} strokeWidth={3} />
                      </div>
                    )}
                  </div>

                  {/* Label Nama Kategori di Bawah Lingkaran (rapi tidak kepotong) */}
                  <span
                    className={`mt-2 sm:mt-3 text-[11px] sm:text-xs md:text-sm font-extrabold tracking-tight transition-colors text-center leading-tight line-clamp-2 px-0.5 ${
                      isSelected
                        ? 'text-[#C8102E] font-black'
                        : 'text-[#1A1A1A] group-hover:text-[#C8102E]'
                    }`}
                  >
                    {cat.name}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Baris Informasi Showing Product & Filter Active Badges */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 border-t border-gray-100 mt-2 px-2">
            {/* Teks Showing Products */}
            <p className="text-xs sm:text-sm text-gray-500 font-medium">
              Showing{' '}
              <span className="font-bold text-[#1A1A1A]">
                {Math.min(visibleCount, filteredProducts.length)}
              </span>{' '}
              of <span className="font-bold text-[#1A1A1A]">{products.length}</span> products
            </p>

            {/* Badges Filter Aktif & Tombol Clear All */}
            {selectedCategories.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                {selectedCategories.map((catName) => {
                  // Cari nama asli dengan capitalization
                  const matchedCat = categories.find(
                    (c) => c.name.toUpperCase() === catName
                  )
                  const displayName = matchedCat ? matchedCat.name : catName

                  return (
                    <button
                      key={catName}
                      type="button"
                      onClick={() => toggleCategory(catName)}
                      className="inline-flex items-center gap-1.5 bg-red-50 hover:bg-red-100 text-[#C8102E] border border-red-200/60 text-xs font-bold px-3 py-1.5 rounded-md transition-colors"
                    >
                      <X size={12} />
                      <span>{displayName}</span>
                    </button>
                  )
                })}

                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="text-xs font-extrabold text-[#C8102E] hover:text-[#9e0b23] underline underline-offset-4 ml-1 cursor-pointer transition-colors"
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
                    {/* SVG Splash Abstrak Merah */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none scale-75 group-hover:scale-110 transition-transform duration-500">
                      <svg
                        viewBox="0 0 200 200"
                        className="w-full h-full text-[#C8102E]"
                        fill="currentColor"
                      >
                        <path d="M135 25c18-8 38 2 48 18 10 16 4 38 15 52 11 14 30 22 25 40-5 18-26 22-38 32-12 10-22 26-40 24-18-2-28-20-44-24-16-4-36 2-46-10-10-12-6-32-12-46-6-14-24-20-22-36 2-16 18-22 28-34 10-12 16-28 32-30 16-2 28 12 42 10 14-2 12-22 22-26z" />
                        <circle cx="178" cy="30" r="6" />
                        <circle cx="28" cy="160" r="8" />
                        <circle cx="180" cy="170" r="5" />
                        <circle cx="20" cy="50" r="4" />
                      </svg>
                    </div>

                    {/* Gambar Produk Utama */}
                    <div className="relative w-full h-full z-10 flex items-center justify-center">
                      <Image
                        src={img}
                        alt={name}
                        fill
                        unoptimized
                        sizes="(max-width: 768px) 50vw, 25vw"
                        className="object-contain drop-shadow-md group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  </div>

                  {/* Informasi Produk */}
                  <div className="mt-3 w-full flex items-center justify-center gap-2 sm:gap-3 px-2">
                    <h3 className="text-xs sm:text-sm md:text-base font-extrabold text-[#111111] text-center uppercase tracking-tight leading-snug">
                      {name}
                    </h3>

                    {/* Tombol Bundar Ikon Keranjang */}
                    <div className="shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gray-100 group-hover:bg-[#C8102E] text-gray-700 group-hover:text-white flex items-center justify-center transition-all duration-300 shadow-sm">
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
              className="px-8 py-3.5 rounded-full bg-[#C8102E] hover:bg-[#a60c24] text-white font-black text-xs sm:text-sm tracking-wider uppercase transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105 active:scale-95 cursor-pointer"
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
              className="mt-3 inline-block px-5 py-2 bg-[#C8102E] text-white text-xs sm:text-sm font-bold rounded-full hover:bg-[#a60c24] transition-colors cursor-pointer"
            >
              Reset Semua Filter
            </button>
          </div>
        )}
      </div>
    </div>
  )
}