'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ShoppingBag, ChevronRight } from 'lucide-react'
import type { FeaturedItem } from '@/lib/queries/featured'

interface FeaturedItemCardProps {
  item: FeaturedItem
  index?: number
}

// Titik-titik bintang 12 sudut (ujung dibulatkan lewat stroke round-join)
const STAR_POINTS = (() => {
  const spikes = 12
  const outer = 45
  const inner = 38
  const pts: string[] = []
  for (let i = 0; i < spikes * 2; i++) {
    const r = i % 2 === 0 ? outer : inner
    const angle = (Math.PI * i) / spikes - Math.PI / 2
    const x = 50 + r * Math.cos(angle)
    const y = 50 + r * Math.sin(angle)
    pts.push(`${x.toFixed(2)},${y.toFixed(2)}`)
  }
  return pts.join(' ')
})()

// Badge "Fan Favorite": bintang hitam bergerigi ujung membulat, teks putih 2 baris
function FanFavoriteBadge() {
  return (
    <div className="absolute top-2 left-2 sm:top-4 sm:left-8 z-20 animate-in zoom-in-50 duration-300">
      <div className="relative flex h-[68px] w-[68px] sm:h-[104px] sm:w-[104px] -rotate-[8deg] items-center justify-center drop-shadow-lg">
        <svg
          viewBox="0 0 100 100"
          className="absolute inset-0 h-full w-full"
          aria-hidden="true"
        >
          <polygon
            points={STAR_POINTS}
            fill="#000"
            stroke="#000"
            strokeWidth="5"
            strokeLinejoin="round"
          />
        </svg>
        <span className="relative z-10 rotate-[8deg] text-center text-[11px] sm:text-[19px] font-semibold leading-[1.1] tracking-tight text-white">
          Favorite
        </span>
      </div>
    </div>
  )
}

// Badge "Trending Now": pita krem menempel di sisi kiri, sisi kanan miring
function TrendingBadge() {
  return (
    <div className="absolute top-5 left-0 sm:top-8 z-20 animate-in slide-in-from-left-2 duration-300">
      <div
        className="flex h-7 sm:h-11 items-center bg-[#FBF0DC] pl-3 pr-5 sm:pl-7 sm:pr-9 shadow-md rounded-tr-md"
        style={{
          clipPath: 'polygon(0 0, 100% 0, calc(100% - 10px) 100%, 0 100%)',
        }}
      >
        <span className="whitespace-nowrap text-[11px] sm:text-xl font-bold leading-none tracking-tight text-[#4A0E12]">
          Trending Now
        </span>
      </div>
    </div>
  )
}

export function FeaturedItemCard({ item, index = 0 }: FeaturedItemCardProps) {
  const isRecipe = item.type === 'recipe'
  const href = isRecipe ? `/recipes/${item.slug}` : `/products/${item.slug}`
  const img =
    item.img ||
    'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=800&auto=format&fit=crop'

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="relative"
    >
      <Link
        href={href}
        className="group relative block w-full aspect-[3/4] bg-black/20 border border-white/10 hover:border-white/30 overflow-hidden rounded-2xl sm:rounded-3xl shadow-xl transition-all duration-500 ease-out hover:scale-[1.03] active:scale-[0.98] cursor-pointer"
      >
        {/* Badge Heinz Style: Trending Now vs Fan Favorite */}
        {item.featured_badge === 'trending' && <TrendingBadge />}
        {item.featured_badge === 'favorite' && <FanFavoriteBadge />}

        {/* Gambar */}
        <div
          className={`absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-105 ${isRecipe
            ? 'bg-cover bg-center'
            : 'bg-contain bg-center bg-no-repeat p-2.5 sm:p-4'
            }`}
          style={{ backgroundImage: `url(${img})` }}
        />

        {/* Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent opacity-85 transition-opacity duration-300 group-hover:opacity-100" />

        {/* Overlay Content di Bawah */}
        <div className="absolute inset-x-0 bottom-0 p-3.5 sm:p-6 z-10 flex items-end justify-between gap-2 sm:gap-3">
          <div className="flex-1 pr-1 min-w-0">
            {/* Nama Produk / Judul Resep */}
            <h3 className="text-sm sm:text-xl font-extrabold text-white leading-snug tracking-tight line-clamp-2 drop-shadow-md">
              {item.name}
            </h3>

            {/* Subteks deskriptif / kategori */}
            <p className="text-[11px] sm:text-xs text-white/75 font-medium line-clamp-1 mt-0.5">
              {item.meta || item.badge || 'Warisan Ramuan Asli AWANG'}
            </p>
          </div>

          {/* Action button bulat (Keranjang untuk produk, panah/circle untuk resep) */}
          <div className="flex h-9 w-9 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-full border border-white/30 bg-black/40 text-white backdrop-blur-md transition-all duration-300 group-hover:bg-white group-hover:text-black group-hover:scale-110 shadow-md">
            {isRecipe ? (
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            ) : (
              <ShoppingBag className="w-4 h-4 sm:w-4 sm:h-4" />
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  )
}