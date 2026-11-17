'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import type { Testimonial } from '@/types/database'

export function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const fetchTestimonials = async () => {
      const supabase = createClient()
      const { data } = await supabase
        .from('testimonials')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true })

      if (data && data.length > 0) {
        setTestimonials(data)
      }
    }
    fetchTestimonials()
  }, [])

  // Auto-scroll logic: Berganti setiap 5 detik
  useEffect(() => {
    if (testimonials.length === 0) return
    const timer = setInterval(() => {
      setActiveIndex((current) => (current + 1) % testimonials.length)
    }, 5000)

    return () => clearInterval(timer)
  }, [testimonials.length])

  if (testimonials.length === 0) return null

  return (
    <section className="relative w-full bg-white py-12 md:py-24 px-6 md:px-16 font-sans overflow-hidden flex items-center min-h-[400px] md:min-h-[600px]">
      <div className="max-w-[1200px] w-full mx-auto flex flex-col md:flex-row items-center gap-12 md:gap-24 relative pr-8 md:pr-16">

        {/* KOLOM KIRI: Image Grid */}
        <div className="hidden md:grid w-full md:w-1/3 max-w-[320px] grid-cols-2 gap-4 shrink-0">
          {testimonials.map((item, idx) => (
            <div
              key={item.id}
              onClick={() => setActiveIndex(idx)}
              className="relative cursor-pointer group"
            >
              <div className={`absolute inset-0 z-10 transition-colors duration-300 rounded-none ${activeIndex === idx ? 'bg-transparent' : 'bg-white/40 group-hover:bg-transparent'}`} />

              <img
                src={item.avatar_url || '/placeholder-avatar.webp'}
                alt={item.name || `Client ${idx + 1}`}
                loading="lazy"
                decoding="async"
                className={`w-full aspect-square object-cover transition-transform duration-500 shadow-sm rounded-none ${activeIndex === idx ? 'scale-105' : 'scale-100'}`}
              />
            </div>
          ))}
        </div>

        {/* KOLOM KANAN: Text Testimoni */}
        <div className="w-full md:w-2/3 flex flex-col min-h-[200px] md:min-h-[250px]">
          <div className="flex gap-2 mb-4 md:mb-6">
            <div className="w-3 h-8 md:w-4 md:h-10 bg-[#F5A200]"></div>
            <div className="w-3 h-8 md:w-4 md:h-10 bg-[#F5A200]"></div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <h3 className="text-sm sm:text-xl md:text-3xl lg:text-[42px] font-bold text-gray-900 leading-snug md:leading-tight mb-4 md:mb-8 tracking-tight">
                {testimonials[activeIndex]?.content || testimonials[activeIndex]?.quote}
              </h3>

              <div className="flex flex-col">
                <strong className="text-gray-900 text-xs sm:text-base md:text-lg font-bold">
                  {testimonials[activeIndex]?.name || testimonials[activeIndex]?.author}
                </strong>
                <span className="text-gray-500 text-[11px] sm:text-xs md:text-sm mt-1">
                  {testimonials[activeIndex]?.role}
                </span>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* PAGINATION DOTS */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 flex flex-col gap-2 md:gap-3">
          {testimonials.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={`w-2 h-2 md:w-2.5 md:h-2.5 rounded-full border transition-all duration-300 ${activeIndex === idx
                ? 'bg-gray-900 border-gray-900'
                : 'bg-transparent border-gray-400 hover:border-gray-900'
                }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

      </div>
    </section>
  )
}
