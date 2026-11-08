'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { Check } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { buildWhatsAppLink, buildQuoteWhatsAppMessage } from '@/lib/whatsapp'

// Foto slider (folder: public/quote)
const SLIDES = ['/quote/1.webp', '/quote/3.webp', '/quote/2.webp']
const SLIDE_INTERVAL = 4000

export function QuoteFormSection() {
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [current, setCurrent] = useState(0)

  // Auto slide
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((c) => (c + 1) % SLIDES.length)
    }, SLIDE_INTERVAL)
    return () => clearInterval(timer)
  }, [])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitting(true)

    const supabase = createClient()
    await supabase.from('quote_submissions').insert({
      name: formData.name,
      email: formData.email,
      message: formData.message,
    })

    setSubmitting(false)
    setSubmitted(true)

    // Kirim data quotation ke WhatsApp
    const waLink = buildWhatsAppLink(buildQuoteWhatsAppMessage(formData))
    window.open(waLink, '_blank')
  }

  return (
    <section className="relative w-full bg-[#CC0000] font-sans overflow-hidden flex flex-col lg:block lg:aspect-video lg:min-h-[640px]">
      {/* SLIDER FOTO: berganti langsung (tanpa animasi).
          Tidak bisa disentuh / di-drag / dipilih */}
      <div className="relative order-2 w-full aspect-video lg:order-none lg:absolute lg:inset-0 lg:aspect-auto lg:h-full z-0 overflow-hidden pointer-events-none select-none">
        {SLIDES.map((src, i) => (
          <Image
            key={src}
            src={src}
            alt={`Awang slide ${i + 1}`}
            fill
            priority={i === 0}
            draggable={false}
            className={`object-cover object-left pointer-events-none select-none ${i === current ? 'opacity-100' : 'opacity-0'
              }`}
            sizes="100vw"
          />
        ))}
      </div>

      {/* FORM PENAWARAN: kanan (desktop) / atas (mobile) */}
      <div className="relative order-1 z-20 w-full px-4 sm:px-8 pt-10 pb-6 sm:pt-16 lg:order-none lg:absolute lg:inset-0 lg:p-0 lg:flex lg:items-center lg:justify-end lg:pr-12 xl:pr-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-lg mx-auto lg:mx-0 lg:w-[40%] lg:max-w-xl"
        >
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white uppercase tracking-tight mb-2 text-center lg:text-left drop-shadow-md">
            MINTA PENAWARAN
          </h2>
          <p className="text-xs sm:text-sm lg:text-base text-white/90 mb-6 font-medium text-center lg:text-left">
            Konsultasikan kebutuhan pasokan produk, kerjasama distributor, dan pemesanan grosir bersama kami.
          </p>

          {submitted ? (
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 sm:p-8 text-center border border-white/20 text-white">
              <div className="w-14 h-14 bg-white text-[#E3000F] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Check size={30} strokeWidth={3} />
              </div>
              <h3 className="text-xl sm:text-2xl font-black uppercase mb-2">
                PERMINTAAN TERKIRIM!
              </h3>
              <p className="text-xs sm:text-sm text-white/90 mb-6 font-medium">
                Tim AWANG akan segera menghubungi Anda dengan penawaran terbaik.
              </p>
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="inline-block bg-black hover:bg-neutral-900 text-white font-bold py-3 px-8 rounded-full transition-transform hover:scale-105 text-xs sm:text-sm uppercase tracking-wider"
              >
                Kirim Permintaan Lain
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-3.5 sm:gap-4">
              {/* Input Nama */}
              <div className="flex flex-col gap-1">
                <label className="text-white text-[11px] sm:text-sm font-bold uppercase tracking-wider ml-1">
                  Nama Lengkap
                </label>
                <input
                  required
                  type="text"
                  placeholder="Masukkan nama lengkap Anda"
                  value={formData.name}
                  onChange={(e) => setFormData((f) => ({ ...f, name: e.target.value }))}
                  className="w-full bg-white text-black placeholder-neutral-400 font-medium px-4 py-3 sm:py-4 rounded-xl focus:outline-none focus:ring-4 focus:ring-black/30 transition-all text-sm sm:text-base shadow-sm"
                />
              </div>

              {/* Input Email */}
              <div className="flex flex-col gap-1">
                <label className="text-white text-[11px] sm:text-sm font-bold uppercase tracking-wider ml-1">
                  Alamat Email
                </label>
                <input
                  required
                  type="email"
                  placeholder="nama@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData((f) => ({ ...f, email: e.target.value }))}
                  className="w-full bg-white text-black placeholder-neutral-400 font-medium px-4 py-3 sm:py-4 rounded-xl focus:outline-none focus:ring-4 focus:ring-black/30 transition-all text-sm sm:text-base shadow-sm"
                />
              </div>

              {/* Input Pesan / Detail Quotation */}
              <div className="flex flex-col gap-1">
                <label className="text-white text-[11px] sm:text-sm font-bold uppercase tracking-wider ml-1">
                  Detail Kebutuhan Penawaran
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Tuliskan spesifikasi produk, kuantitas, atau detail proyek..."
                  value={formData.message}
                  onChange={(e) => setFormData((f) => ({ ...f, message: e.target.value }))}
                  className="w-full bg-white text-black placeholder-neutral-400 font-medium px-4 py-3 sm:py-4 rounded-xl focus:outline-none focus:ring-4 focus:ring-black/30 transition-all text-sm sm:text-base shadow-sm resize-none"
                />
              </div>

              {/* Tombol Submit */}
              <div className="pt-1 flex justify-center lg:justify-start">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full sm:w-auto bg-[#111111] hover:bg-black text-white font-extrabold text-sm sm:text-base py-3.5 sm:py-4 px-8 sm:px-10 rounded-full transition-all duration-300 hover:scale-105 active:scale-95 shadow-xl disabled:opacity-60 uppercase tracking-wider"
                >
                  {submitting ? 'Mengirim...' : 'Kirim Permintaan Penawaran'}
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  )
}