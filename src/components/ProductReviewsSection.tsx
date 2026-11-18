'use client'

import { useState, useMemo } from 'react'
import { Star, ChevronDown, ChevronLeft, ChevronRight, X } from 'lucide-react'
import type { ProductReview } from '@/types/database'

interface ProductReviewsSectionProps {
  productName: string
  reviews: ProductReview[]
}

export function ProductReviewsSection({ productName, reviews }: ProductReviewsSectionProps) {
  const [filterRating, setFilterRating] = useState<number | 'all'>('all')
  const [sortBy, setSortBy] = useState<'recent' | 'highest' | 'lowest' | 'photos'>('recent')
  const [activePhoto, setActivePhoto] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 5

  // Hitung Statistik Rating Snapshot
  const stats = useMemo(() => {
    const total = reviews.length
    if (total === 0) {
      return {
        total: 0,
        average: 0.0,
        counts: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } as Record<number, number>,
        percentages: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } as Record<number, number>,
      }
    }

    const counts: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    let sum = 0

    reviews.forEach((r) => {
      const star = Math.max(1, Math.min(5, Math.round(r.rating || 5)))
      counts[star] = (counts[star] || 0) + 1
      sum += r.rating
    })

    const average = Number((sum / total).toFixed(1))
    const percentages: Record<number, number> = {}
    for (let i = 1; i <= 5; i++) {
      percentages[i] = Math.round(((counts[i] || 0) / total) * 100)
    }

    return { total, average, counts, percentages }
  }, [reviews])

  // Filter & Sort
  const processedReviews = useMemo(() => {
    let list = [...reviews]

    if (filterRating !== 'all') {
      list = list.filter((r) => Math.round(r.rating) === filterRating)
    }

    if (sortBy === 'recent') {
      list.sort((a, b) => new Date(b.created_at || b.review_date || 0).getTime() - new Date(a.created_at || a.review_date || 0).getTime())
    } else if (sortBy === 'highest') {
      list.sort((a, b) => b.rating - a.rating)
    } else if (sortBy === 'lowest') {
      list.sort((a, b) => a.rating - b.rating)
    } else if (sortBy === 'photos') {
      list.sort((a, b) => (b.photos?.length || 0) - (a.photos?.length || 0))
    }

    return list
  }, [reviews, filterRating, sortBy])

  // Pagination
  const totalPages = Math.ceil(processedReviews.length / pageSize) || 1
  const paginatedReviews = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return processedReviews.slice(start, start + pageSize)
  }, [processedReviews, currentPage])

  function formatDate(dateStr?: string | null) {
    if (!dateStr) return 'Recently'
    try {
      const date = new Date(dateStr)
      const now = new Date()
      const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 3600 * 24))
      if (diffDays < 1) return 'Today'
      if (diffDays === 1) return '1 day ago'
      if (diffDays < 30) return `${diffDays} days ago`
      const diffMonths = Math.floor(diffDays / 30)
      if (diffMonths === 1) return '1 month ago'
      if (diffMonths < 12) return `${diffMonths} months ago`
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    } catch {
      return dateStr
    }
  }

  return (
    <section className="w-full bg-white font-sans py-20 lg:py-24">
      {/* Container Lebar Mengikuti Layout Website */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        
        {/* ── HEADER ── */}
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#590014] tracking-tight mb-12 uppercase font-heinz">
          Customer Reviews
        </h2>

        {/* ── TOP SECTION: SNAPSHOT & OVERALL RATING ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start pb-12">
          
          {/* Rating Snapshot (Bar progress) */}
          <div className="lg:col-span-7 space-y-3">
            <h3 className="text-base font-extrabold text-stone-900 tracking-tight">Rating Snapshot</h3>
            <p className="text-xs text-stone-500 mb-4">Select a row below to filter reviews.</p>

            <div className="space-y-2 max-w-xl">
              {[5, 4, 3, 2, 1].map((star) => {
                const count = stats.counts[star] || 0
                const percent = stats.percentages[star] || 0
                const isSelected = filterRating === star

                return (
                  <button
                    type="button"
                    key={star}
                    onClick={() => {
                      setFilterRating(isSelected ? 'all' : star)
                      setCurrentPage(1)
                    }}
                    className={`w-full flex items-center gap-4 text-xs font-semibold py-1.5 px-2 rounded-lg transition-colors group cursor-pointer ${
                      isSelected ? 'bg-red-50 text-[#CC0000]' : 'hover:bg-stone-50 text-stone-700'
                    }`}
                  >
                    <span className="w-14 text-left shrink-0 font-medium text-stone-600 group-hover:text-black">
                      {star} stars
                    </span>

                    {/* Progress Bar Container */}
                    <div className="flex-1 h-3.5 bg-stone-200/80 rounded-full overflow-hidden relative">
                      <div
                        className="h-full bg-[#CC0000] rounded-full transition-all duration-300"
                        style={{ width: `${percent}%` }}
                      />
                    </div>

                    <span className="w-8 text-right text-stone-500 text-xs font-mono shrink-0">
                      {count}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Overall Rating Box */}
          <div className="lg:col-span-5 flex flex-col justify-start lg:pt-2">
            <span className="text-sm font-extrabold text-stone-900 mb-2">Overall Rating</span>
            <div className="flex items-baseline gap-4">
              <span className="text-6xl font-black text-stone-950 tracking-tighter font-sans">
                {stats.total > 0 ? stats.average.toFixed(1) : '0'}
              </span>
              <div>
                <div className="flex items-center text-[#CC0000] mb-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={18}
                      className={
                        stats.total > 0 && i < Math.round(stats.average)
                          ? 'fill-[#CC0000] text-[#CC0000]'
                          : 'text-stone-300 fill-stone-300'
                      }
                    />
                  ))}
                </div>
                <span className="text-xs font-semibold text-stone-500">
                  {stats.total} Reviews
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* ── FILTER & SORT CONTROLS ── */}
        <div className="py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          
          {/* Filter Dropdown */}
          <div className="flex items-center gap-2.5">
            <label className="text-xs font-extrabold text-stone-900 uppercase tracking-wider">Filter Reviews:</label>
            <div className="relative">
              <select
                value={filterRating}
                onChange={(e) => {
                  setFilterRating(e.target.value === 'all' ? 'all' : Number(e.target.value))
                  setCurrentPage(1)
                }}
                className="appearance-none bg-white border border-stone-300 rounded-lg px-4 py-2 pr-9 text-xs font-bold text-stone-800 outline-none focus:border-[#CC0000] cursor-pointer shadow-2xs"
              >
                <option value="all">Filter by Ratings (All)</option>
                <option value="5">5 stars only</option>
                <option value="4">4 stars only</option>
                <option value="3">3 stars only</option>
                <option value="2">2 stars only</option>
                <option value="1">1 star only</option>
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500 pointer-events-none" />
            </div>
          </div>

          {/* Counter & Sort */}
          <div className="flex items-center justify-between sm:justify-end gap-5">
            <span className="text-xs text-stone-500 font-medium">
              {processedReviews.length > 0
                ? `${(currentPage - 1) * pageSize + 1} – ${Math.min(currentPage * pageSize, processedReviews.length)} of ${processedReviews.length} Reviews`
                : '0 Reviews'}
            </span>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-stone-600 hidden sm:inline">Sort by</span>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value as any)
                    setCurrentPage(1)
                  }}
                  className="appearance-none bg-white border border-stone-300 rounded-lg px-4 py-2 pr-9 text-xs font-bold text-stone-800 outline-none focus:border-[#CC0000] cursor-pointer shadow-2xs"
                >
                  <option value="recent">Most Recent</option>
                  <option value="highest">Highest Rating</option>
                  <option value="lowest">Lowest Rating</option>
                  <option value="photos">With Photos</option>
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500 pointer-events-none" />
              </div>
            </div>
          </div>

        </div>

        {/* ── REVIEWS LIST ── */}
        {paginatedReviews.length === 0 ? (
          <div className="py-16 text-center bg-stone-50/50 rounded-2xl mt-4">
            <p className="text-stone-500 text-sm font-medium">
              {reviews.length === 0
                ? 'Belum ada ulasan untuk produk ini. Ulasan dapat ditambahkan melalui menu Admin.'
                : 'Tidak ada ulasan yang sesuai dengan filter ini.'}
            </p>
            {filterRating !== 'all' && (
              <button
                onClick={() => setFilterRating('all')}
                className="mt-3 text-xs font-bold text-[#CC0000] underline cursor-pointer"
              >
                Reset filter rating
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-8 mt-6">
            {paginatedReviews.map((review) => (
              <div key={review.id} className="py-6 space-y-3.5">
                
                {/* Rating Bintang */}
                <div className="flex items-center text-[#CC0000]">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={i < review.rating ? 'fill-[#CC0000] text-[#CC0000]' : 'text-stone-200 fill-stone-200'}
                    />
                  ))}
                </div>

                {/* Judul Review */}
                <h3 className="text-base sm:text-lg font-black text-stone-900 leading-snug">
                  {review.title}
                </h3>

                {/* Reviewer Name */}
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-bold text-[#CC0000]">{review.reviewer_name}</span>
                </div>

                {/* Waktu Review */}
                <p className="text-[11px] text-stone-400 font-medium">
                  {formatDate(review.review_date || review.created_at)}
                </p>

                {/* Konten Review */}
                <p className="text-stone-700 text-xs sm:text-sm leading-relaxed font-normal max-w-4xl">
                  {review.content}
                </p>

                {/* Foto Review jika ada */}
                {review.photos && review.photos.length > 0 && (
                  <div className="flex flex-wrap gap-3 pt-2">
                    {review.photos.map((photoUrl, pIdx) => (
                      <button
                        type="button"
                        key={pIdx}
                        onClick={() => setActivePhoto(photoUrl)}
                        className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden border border-stone-200 hover:border-[#CC0000] transition-all group cursor-pointer bg-stone-100 shadow-2xs"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={photoUrl}
                          alt={`Photo by ${review.reviewer_name}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </button>
                    ))}
                  </div>
                )}


              </div>
            ))}
          </div>
        )}

        {/* ── PAGINATION BAR ── */}
        {totalPages > 1 && (
          <div className="pt-10 flex items-center justify-between">
            <span className="text-xs text-stone-500 font-medium">
              Page {currentPage} of {totalPages}
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="w-10 h-10 rounded-lg border border-stone-300 flex items-center justify-center text-stone-600 hover:bg-stone-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                aria-label="Previous page"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="w-10 h-10 rounded-lg border border-[#CC0000] text-[#CC0000] hover:bg-red-50 flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                aria-label="Next page"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}

        {/* ── MODAL LIGHTBOX FOTO ── */}
        {activePhoto && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs"
            onClick={() => setActivePhoto(null)}
          >
            <div className="relative max-w-3xl max-h-[90vh] p-2" onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                onClick={() => setActivePhoto(null)}
                className="absolute -top-3 -right-3 z-10 bg-white text-stone-800 rounded-full p-1.5 shadow-lg hover:bg-stone-100 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={activePhoto}
                alt="Review Full Photo"
                className="w-auto h-auto max-w-full max-h-[85vh] rounded-xl object-contain shadow-2xl"
              />
            </div>
          </div>
        )}

      </div>
    </section>
  )
}
