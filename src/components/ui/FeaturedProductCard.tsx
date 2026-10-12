'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ShoppingBag } from 'lucide-react'

interface FeaturedProductCardProps {
  slug: string
  name: string
  img: string
  category?: string
}

export function FeaturedProductCard({ slug, name, img, category }: FeaturedProductCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
    >
      <Link
        href={`/products/${slug}`}
        className="group relative block w-full aspect-[3/4] bg-black/20 border border-white/10 hover:border-white/30 overflow-hidden rounded-2xl sm:rounded-3xl shadow-xl transition-all duration-500 ease-out hover:scale-[1.03] active:scale-[0.98] cursor-pointer"
      >
        {/* Gambar Produk PNG Transparan */}
        <div
          className="absolute inset-0 bg-contain bg-center bg-no-repeat p-2.5 sm:p-4 transition-transform duration-700 ease-out group-hover:scale-105"
          style={{ backgroundImage: `url(${img})` }}
        />

        {/* Subtle Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-100" />

        {/* Overlay Content */}
        <div className="absolute inset-x-0 bottom-0 p-3 sm:p-6 z-10 flex items-end justify-between gap-2 sm:gap-3">
          <div className="flex-1 pr-1 min-w-0">
            {/* Kategori sudah dihapus dari sini sesuai permintaan */}

            {/* Judul Teks */}
            <h3 className="text-sm sm:text-xl font-extrabold text-white leading-snug tracking-tight line-clamp-2 drop-shadow-md">
              {name}
            </h3>
          </div>

          {/* Tombol Melayang Lingkaran Heinz Style */}
          <div className="flex h-9 w-9 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-full border border-white/30 bg-black/40 text-white backdrop-blur-md transition-all duration-300 group-hover:bg-white group-hover:text-black group-hover:scale-110">
            <ShoppingBag className="w-4 h-4 sm:w-4 sm:h-4" />
          </div>
        </div>
      </Link>
    </motion.div>
  )
}