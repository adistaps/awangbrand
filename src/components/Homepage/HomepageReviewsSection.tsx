'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Star, ChevronLeft, ChevronRight, X } from 'lucide-react'
import type { ProductReview } from '@/types/database'

interface HomepageReviewsSectionProps {
  initialReviews: ProductReview[]
}

export function HomepageReviewsSection({ initialReviews }: HomepageReviewsSectionProps) {
  const [activePhoto, setActivePhoto] = useState<string | null>(null)
  const scrollerRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const updateArrows = useCallback(() => {
    const el = scrollerRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 6)
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 6)
  }, [])

  useEffect(() => {
    updateArrows()
    window.addEventListener('resize', updateArrows)
    return () => window.removeEventListener('resize', updateArrows)
  }, [initialReviews.length, updateArrows])

  function scroll(dir: 1 | -1) {
    const el = scrollerRef.current
    if (!el) return
    const card = el.querySelector<HTMLElement>('[data-review-card]')
    const step = card ? card.offsetWidth + 20 : el.clientWidth * 0.75
    el.scrollBy({ left: step * dir, behavior: 'smooth' })
  }

  if (!initialReviews || initialReviews.length === 0) return null

  return (
    <section className="w-full bg-[#FAF6ED] py-16 sm:py-24 border-t border-[#590014]/10 font-sans overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10 sm:mb-12">
          <div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#590014] tracking-tight leading-tight">
              What Our Customers Say
            </h2>
          </div>

          {/* Navigation Arrows */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => scroll(-1)}
              disabled={!canScrollLeft}
              className="w-11 h-11 rounded-full border border-stone-300 flex items-center justify-center text-stone-700 hover:bg-[#590014] hover:text-white hover:border-[#590014] disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer bg-white"
              aria-label="Previous review"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              type="button"
              onClick={() => scroll(1)}
              disabled={!canScrollRight}
              className="w-11 h-11 rounded-full border border-stone-300 flex items-center justify-center text-stone-700 hover:bg-[#590014] hover:text-white hover:border-[#590014] disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer bg-white"
              aria-label="Next review"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Reviews Carousel Scroller */}
        <div
          ref={scrollerRef}
          onScroll={updateArrows}
          className="flex gap-5 sm:gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {initialReviews.map((review) => (
            <div
              key={review.id}
              data-review-card
              className="w-[85%] sm:w-[48%] lg:w-[32%] shrink-0 snap-start bg-white rounded-2xl p-6 sm:p-7 border border-[#590014]/10 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow duration-200"
            >
              <div className="space-y-3.5">
                {/* Bintang + Verified */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center text-[#CC0000]">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={15}
                        className={i < review.rating ? 'fill-[#CC0000] text-[#CC0000]' : 'text-stone-200 fill-stone-200'}
                      />
                    ))}
                  </div>


                </div>

                {/* Judul & Isi Review */}
                <h3 className="text-base font-extrabold text-[#590014] line-clamp-2 leading-snug">
                  {review.title}
                </h3>
                <p className="text-stone-700 text-xs sm:text-[13px] leading-relaxed line-clamp-4 font-normal">
                  "{review.content}"
                </p>

                {/* Foto Review jika ada */}
                {review.photos && review.photos.length > 0 && (
                  <div className="flex gap-2 pt-1">
                    {review.photos.slice(0, 3).map((photoUrl, pIdx) => (
                      <button
                        type="button"
                        key={pIdx}
                        onClick={() => setActivePhoto(photoUrl)}
                        className="relative w-14 h-14 rounded-lg overflow-hidden border border-stone-200 hover:border-[#CC0000] transition-colors cursor-pointer shrink-0 bg-stone-50"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={photoUrl} alt="Review attachment" className="w-full h-full object-cover" />
                      </button>
                    ))}
                    {review.photos.length > 3 && (
                      <button
                        type="button"
                        onClick={() => setActivePhoto(review.photos[3])}
                        className="w-14 h-14 rounded-lg bg-stone-100 border border-stone-200 flex items-center justify-center text-xs font-bold text-stone-600 hover:text-[#CC0000]"
                      >
                        +{review.photos.length - 3}
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Footer Review: Nama & Produk Terkait */}
              <div className="pt-5 mt-5 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <span className="block text-xs font-bold text-stone-900 truncate">
                    {review.reviewer_name}
                  </span>
                  <span className="block text-[10px] text-stone-400">
                    {review.review_date || 'Happy Customer'}
                  </span>
                </div>

                {review.product && (
                  <Link
                    href={`/products/${review.product.slug}`}
                    className="text-[11px] font-bold text-[#CC0000] hover:underline shrink-0 max-w-[130px] truncate text-right block"
                    title={review.product.name}
                  >
                    {review.product.name} →
                  </Link>
                )}
              </div>

            </div>
          ))}
        </div>

      </div>

      {/* Lightbox Modal Foto */}
      {activePhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs"
          onClick={() => setActivePhoto(null)}
        >
          <div className="relative max-w-2xl max-h-[85vh] p-2" onClick={(e) => e.stopPropagation()}>
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
              alt="Review Attachment Full"
              className="w-auto h-auto max-w-full max-h-[80vh] rounded-xl object-contain shadow-2xl"
            />
          </div>
        </div>
      )}
    </section>
  )
}
