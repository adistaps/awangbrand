'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ShoppingBag, ChevronRight } from 'lucide-react'
import type { FeaturedItem } from '@/lib/queries/featured'

export interface FeaturedCardTheme {
  label: string
  hex: string
}

// Palet warna kartu Featured ("TASTE THE HEAT")
export const FEATURED_CARD_THEMES: Record<string, FeaturedCardTheme> = {
  mustard: {
    label: 'Kuning Mustard Emas',
    hex: '#B87A04',
  },
  maroon: {
    label: 'Maroon Gelap (Awang Maroon)',
    hex: '#540B26',
  },
  burgundy: {
    label: 'Burgundy Mewah',
    hex: '#3D0C15',
  },
  cocoa: {
    label: 'Coklat Gravy / Rendang',
    hex: '#5C1D06',
  },
  paprika: {
    label: 'Paprika Pedas Hangat',
    hex: '#8F2D14',
  },
  green: {
    label: 'Hijau Herba (Forest Green)',
    hex: '#1B5E20',
  },
  charcoal: {
    label: 'Hitam Arang (Midnight)',
    hex: '#1A1A1E',
  },
  crimson: {
    label: 'Merah Cabai (Chili Crimson)',
    hex: '#7A0C1E',
  },
  terracotta: {
    label: 'Terakota Klasik',
    hex: '#A03B1E',
  },
  plum: {
    label: 'Ungu Terong (Deep Plum)',
    hex: '#4A1238',
  },
  cream: {
    label: 'Krem Warisan (Cream)',
    hex: '#D8C3A5',
  },
  classic_red: {
    label: 'Merah Klasik AWANG',
    hex: '#990014',
  },
}

interface FeaturedItemCardProps {
  item: FeaturedItem
  index?: number
  themeKey?: string
}

// Titik-titik bintang 12 sudut
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

// Badge "Fan Favorite"
function FanFavoriteBadge() {
  return (
    <div className="absolute top-2.5 left-2.5 sm:top-4 sm:left-4 z-20 animate-in zoom-in-50 duration-300 pointer-events-none">
      <div className="relative flex h-[58px] w-[58px] sm:h-[76px] sm:w-[76px] -rotate-[8deg] items-center justify-center drop-shadow-xl">
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
        <span className="relative z-10 rotate-[8deg] text-center text-[10px] sm:text-[13px] font-extrabold leading-[1.1] tracking-tight text-white">
          Fan<br />Favorite
        </span>
      </div>
    </div>
  )
}

// Badge "Trending Now"
function TrendingBadge() {
  return (
    <div className="absolute top-4 left-0 sm:top-5 z-20 animate-in slide-in-from-left-2 duration-300 pointer-events-none">
      <div
        className="flex h-6 sm:h-8 items-center bg-[#FDF0DD] pl-3 pr-4 sm:pl-4 sm:pr-6 shadow-lg rounded-tr-sm"
        style={{
          clipPath: 'polygon(0 0, 100% 0, calc(100% - 8px) 100%, 0 100%)',
        }}
      >
        <span className="whitespace-nowrap text-[10px] sm:text-xs font-black leading-none tracking-tight text-[#4A0E12]">
          Trending Now
        </span>
      </div>
    </div>
  )
}

export function FeaturedItemCard({ item, index = 0, themeKey }: FeaturedItemCardProps) {
  const isRecipe = item.type === 'recipe'
  const href = isRecipe ? `/recipes/${item.slug}` : `/products/${item.slug}`
  const img =
    item.img ||
    'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=800&auto=format&fit=crop'

  // Resolusi warna background kartu dari CMS
  const resolvedTheme =
    themeKey && FEATURED_CARD_THEMES[themeKey]
      ? FEATURED_CARD_THEMES[themeKey]
      : null

  // Fallback jika belum di-set di admin
  const cardBgColor = resolvedTheme
    ? resolvedTheme.hex
    : isRecipe
    ? '#1A1A1E'
    : '#540B26'

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="relative w-full"
    >
      <Link
        href={href}
        style={{ backgroundColor: cardBgColor }}
        className="group relative block w-full aspect-[3/4] overflow-hidden rounded-2xl sm:rounded-3xl transition-all duration-500 ease-out hover:scale-[1.03] active:scale-[0.98] cursor-pointer shadow-md hover:shadow-xl"
      >
        {/* POLA DOODLE SAMAR DI BACKGROUND KARTU (Gaya Heinz) */}
        {!isRecipe && (
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-cover bg-center pointer-events-none opacity-[0.08] mix-blend-overlay"
            style={{
              backgroundImage: "url('/bgabout.webp')",
              filter: 'brightness(0) invert(1)',
            }}
          />
        )}

        {/* BADGE HEINZ: TRENDING / FAN FAVORITE */}
        {item.featured_badge === 'trending' && <TrendingBadge />}
        {item.featured_badge === 'favorite' && <FanFavoriteBadge />}

        {/* GAMBAR PRODUK / RESEP (UKURAN ASLI PENUH & BESAR PERSIS SEPERTI SEMULA) */}
        <div
          className={`absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-105 ${
            isRecipe
              ? 'bg-cover bg-center'
              : 'bg-contain bg-center bg-no-repeat p-2.5 sm:p-4'
          }`}
          style={{ backgroundImage: `url(${img})` }}
        />

        {/* GRADIENT GELAP DI BAGIAN BAWAH UNTUK KETERBACAAN TEKS */}
        <div className="absolute inset-x-0 bottom-0 h-[45%] bg-gradient-to-t from-black/85 via-black/40 to-transparent pointer-events-none" />

        {/* OVERLAY KONTEN DI BAWAH KARTU */}
        <div className="absolute inset-x-0 bottom-0 p-3.5 sm:p-6 z-10 flex items-end justify-between gap-2 sm:gap-3">
          <div className="flex-1 pr-1 min-w-0">
            {/* Nama Produk / Judul Resep */}
            <h3 className="text-sm sm:text-xl font-extrabold text-white leading-snug tracking-tight line-clamp-2 drop-shadow-sm">
              {item.name}
            </h3>

            {/* Subteks deskriptif / kategori */}
            <p className="text-[11px] sm:text-xs text-white/90 font-medium line-clamp-1 mt-0.5">
              {item.meta || item.badge || 'Warisan Ramuan Asli AWANG'}
            </p>
          </div>

          {/* Action button bulat: outline putih transparan seperti Heinz */}
          <div className="flex h-9 w-9 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-full border border-white bg-transparent text-white transition-all duration-300 group-hover:bg-white group-hover:text-black group-hover:scale-110">
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
