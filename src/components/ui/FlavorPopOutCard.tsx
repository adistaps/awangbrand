'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ChevronRight } from 'lucide-react'

interface FlavorPopOutCardProps {
  id: string
  name: string
  slug: string
  main_image: string | null
  category?: string
  index: number
}

export function FlavorPopOutCard({
  name,
  slug,
  main_image,
  category,
  index,
}: FlavorPopOutCardProps) {
  const categoryName = category || ''

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="shrink-0 w-[240px] sm:w-[280px] snap-start"
    >
      <Link href={`/products/${slug}`} className="group block w-full">
        {/* Wadah Transparan Sepenuhnya Tanpa Border / Tanpa Background */}
        <div className="flex flex-col items-center justify-between p-2 cursor-pointer transition-transform duration-500 group-hover:scale-[1.03]">

          {/* Gambar Produk Murni (PNG) */}
          <div className="w-full h-[240px] sm:h-[280px] flex items-center justify-center mb-4 transition-transform duration-500 group-hover:scale-105">
            <img
              src={
                main_image ||
                'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=800&auto=format&fit=crop'
              }
              alt={name}
              className="max-h-full max-w-full object-contain drop-shadow-md"
            />
          </div>

          {/* Judul Produk & Tombol Panah Ke Produk */}
          <div className="w-full flex items-center justify-between gap-3 pt-2">
            <h3 className="text-base sm:text-lg font-black text-[#1A1A1A] uppercase tracking-tight line-clamp-1">
              {categoryName || name}
            </h3>

            {/* Tombol Ke Halaman Produk */}
            <div className="w-9 h-9 shrink-0 rounded-full border border-neutral-300 bg-white/90 text-black flex items-center justify-center shadow-sm transition-all duration-300 group-hover:bg-[#C8102E] group-hover:text-white group-hover:border-[#C8102E] group-hover:scale-110">
              <ChevronRight size={18} />
            </div>
          </div>

        </div>
      </Link>
    </motion.div>
  )
}