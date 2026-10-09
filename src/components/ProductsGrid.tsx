'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { ShoppingCart } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'

export function ProductsGrid({
  products,
  showFilters = true,
}: {
  products: { slug: string; name: string; img: string; cat: string }[]
  showFilters?: boolean
}) {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL')
  const { t } = useLanguage()

  // Mendapatkan daftar kategori unik dari data produk
  const categoriesList = useMemo(() => {
    const cats = new Set<string>()
    products.forEach((p) => {
      if (p.cat && p.cat.trim() !== '') cats.add(p.cat)
    })
    return ['ALL', ...Array.from(cats)]
  }, [products])

  // Memfilter produk berdasarkan kategori terpilih
  const filteredProducts = useMemo(() => {
    if (selectedCategory === 'ALL') return products
    return products.filter((p) => p.cat === selectedCategory)
  }, [products, selectedCategory])

  if (products.length === 0) {
    return <p className="text-gray-400 text-center py-20">{t('no_products', 'Belum ada produk yang dipublikasikan.')}</p>
  }

  const hasCategories = showFilters && categoriesList.length > 1

  return (
    <div className="w-full">
      {/* Filter Kategori Minimalis (Tanpa Garis Bawah) */}
      {hasCategories && (
        <div className="w-full flex justify-center mb-8 sm:mb-12">
          <div className="flex items-center gap-3 sm:gap-4 overflow-x-auto pb-2 scrollbar-none px-4 max-w-full">
            {categoriesList.map((category) => {
              const isActive = selectedCategory === category

              return (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-5 py-2 rounded-full font-bold text-xs sm:text-sm tracking-wide transition-all duration-300 cursor-pointer whitespace-nowrap ${isActive
                      ? 'bg-[#C8102E] text-white shadow-sm'
                      : 'bg-gray-100 text-[#4A1521]/70 hover:bg-gray-200 hover:text-[#4A1521]'
                    }`}
                >
                  {category === 'ALL' ? t('all_categories', 'Semua Produk') : category}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Area Utama Grid Produk */}
      <div className="w-full min-w-0">
        <motion.div
          layout
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8 md:gap-10"
        >
          <AnimatePresence mode="popLayout">
            {filteredProducts.map(({ name, img, slug }) => (
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
                  {/* Container Gambar Produk dengan Efek Splash Abstrak Merah saat Hover/Touch */}
                  <div className="relative w-full aspect-[4/5] flex items-center justify-center p-4 overflow-hidden rounded-2xl bg-transparent transition-transform duration-500 group-hover:-translate-y-2">

                    {/* SVG Splash Abstrak Merah (Muncul Pas Hover/Touch) */}
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

                  {/* Informasi Produk (Rata Tengah + Ikon Keranjang Belanja) */}
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

        {filteredProducts.length === 0 && (
          <p className="text-gray-400 text-center py-20">{t('no_products', 'Tidak ada produk dalam kategori ini.')}</p>
        )}
      </div>
    </div>
  )
}