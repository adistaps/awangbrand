'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { MessageSquare, Phone, ChevronDown } from 'lucide-react'

type InquiryType = 'sales' | 'support'

const INQUIRY_LABEL: Record<InquiryType, string> = {
  sales: 'Sales Inquiry (bulk order, partnership, distribution)',
  support: 'Customer Support (product, recipe, feedback)',
}

const INPUT_CLASS =
  'w-full rounded-lg border border-stone-200 bg-stone-50 px-3.5 py-3 text-base sm:text-sm text-[#111111] placeholder:text-stone-400 outline-none transition focus:border-[#CC0000] focus:bg-white focus:ring-2 focus:ring-[#CC0000]/15'

const LABEL_CLASS = 'block text-xs font-semibold text-stone-700 mb-1.5'

// Media sosial (ganti href dengan akun asli AWANG)
const SOCIALS = [
  {
    label: 'Facebook',
    href: 'https://facebook.com',
    path: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z',
  },
  {
    label: 'Instagram',
    href: 'https://instagram.com',
    path: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z',
  },
  {
    label: 'YouTube',
    href: 'https://youtube.com',
    path: 'M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z',
  },
  {
    label: 'TikTok',
    href: 'https://tiktok.com',
    path: 'M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 1 1-5.2-1.74 2.89 2.89 0 0 1 2.31-1.42V8.9a6.34 6.34 0 0 0-5.4 6.34 6.34 6.34 0 1 0 10.86-4.43v-3a8.16 8.16 0 0 0 4.65 1.48V6.69z',
  },
]

export function ContactClient() {
  // Nomor WhatsApp Sales & CS
  const salesPhone = '+60123456789'
  const csPhone = '+60198765432'

  // State form
  const [form, setForm] = useState({
    name: '',
    email: '',
    business: '',
    inquiry: 'sales' as InquiryType,
    message: '',
    source: '',
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  // Kirim ke WhatsApp (Sales / CS sesuai jenis pertanyaan)
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const targetPhone = form.inquiry === 'sales' ? salesPhone : csPhone

    const details = [
      `*Name:* ${form.name.trim()}`,
      form.email.trim() && `*Email:* ${form.email.trim()}`,
      form.business.trim() && `*Business:* ${form.business.trim()}`,
      `*Inquiry type:* ${INQUIRY_LABEL[form.inquiry]}`,
      form.source.trim() && `*Heard about us from:* ${form.source.trim()}`,
    ].filter(Boolean)

    const text = [
      'Hello AWANG, I would like to get in touch.',
      '',
      ...details,
      '',
      '*Message:*',
      form.message.trim(),
    ].join('\n')

    const url = `https://wa.me/${targetPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(text)}`

    window.open(url, '_blank', 'noopener,noreferrer')

    setForm({ name: '', email: '', business: '', inquiry: form.inquiry, message: '', source: '' })
  }

  return (
    <main className="bg-white min-h-screen font-sans pt-0 pb-0 text-slate-900">

      {/* ==========================================
          HERO SECTION (SPLIT LAYOUT MERAH & CONTACTUS.webp)
      ========================================== */}
      <section className="bg-[#CC0000] text-white w-full min-h-[560px] sm:min-h-[640px] lg:min-h-[680px] grid grid-cols-1 lg:grid-cols-12 items-end overflow-visible">

        {/* Kolom Kiri: Copywriting Header */}
        <div className="lg:col-span-6 p-8 sm:p-14 md:p-20 xl:p-24 flex flex-col justify-center space-y-3 sm:space-y-4 pt-28 sm:pt-36 lg:pt-20 self-center">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-white uppercase tracking-tight leading-none">
            Get in touch<br />with us
          </h1>
          <p className="text-white/90 text-sm sm:text-base md:text-lg font-medium leading-relaxed max-w-lg pt-2">
            Have questions about AWANG products, recipes, or distribution? We’re here to help you anytime.
          </p>
        </div>

        {/* Kolom Kanan: Mascot (full visible, tidak terpotong) */}
        <div className="lg:col-span-6 relative w-full flex items-end justify-center pt-10 lg:pt-0" style={{ height: '540px' }}>
          <div className="relative h-full mx-auto" style={{ width: '72%', maxHeight: '540px' }}>
            <Image
              src="/people.webp"
              alt="Contact AWANG Team"
              fill
              className="object-contain object-bottom drop-shadow-2xl"
              style={{ objectPosition: 'center bottom' }}
              priority
            />
          </div>
        </div>

      </section>

      {/* ==========================================
          CONTACT SECTION: INFO KONTAK (KIRI) + FORM WHATSAPP (KANAN)
      ========================================== */}
      <section className="max-w-7xl mx-auto px-6 sm:px-12 md:px-16 pt-20 sm:pt-28 pb-20 sm:pb-28 relative z-0">

        {/* Judul Section Utama */}
        <h2 className="text-3xl sm:text-5xl font-bold text-[#111111] uppercase tracking-tight">
          Contact us
        </h2>

        <div className="mt-10 sm:mt-14 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">

          {/* Kiri: Sales & Customer Support */}
          <div className="lg:col-span-5 space-y-10">

            {/* Customer Support */}
            <div className="space-y-3">
              <h3 className="text-xl sm:text-2xl font-extrabold text-[#111111] uppercase tracking-tight">
                Customer Support
              </h3>
              <p className="text-stone-600 text-sm sm:text-base font-medium leading-relaxed">
                Need assistance with product details, recipe tips, or general feedback?
              </p>
              <div className="pt-1">
                <a
                  href={`https://wa.me/${csPhone.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-[#CC0000] font-bold text-sm hover:underline"
                >
                  <Phone className="w-4 h-4 shrink-0" />
                  Contact CS WhatsApp ({csPhone})
                </a>
              </div>
            </div>

          </div>

          {/* Kanan: Form → WhatsApp */}
          <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-5">

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label htmlFor="name" className={LABEL_CLASS}>Full Name</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  autoComplete="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  className={INPUT_CLASS}
                />
              </div>

              <div>
                <label htmlFor="email" className={LABEL_CLASS}>Email (Optional)</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  inputMode="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className={INPUT_CLASS}
                />
              </div>

              <div>
                <label htmlFor="business" className={LABEL_CLASS}>Business Name (Optional)</label>
                <input
                  id="business"
                  name="business"
                  type="text"
                  autoComplete="organization"
                  value={form.business}
                  onChange={handleChange}
                  placeholder="Your business or store"
                  className={INPUT_CLASS}
                />
              </div>

              <div>
                <label htmlFor="inquiry" className={LABEL_CLASS}>Inquiry Type</label>
                <div className="relative">
                  <select
                    id="inquiry"
                    name="inquiry"
                    value={form.inquiry}
                    onChange={handleChange}
                    className={`${INPUT_CLASS} appearance-none pr-10 cursor-pointer`}
                  >
                    <option value="sales">Sales Inquiry</option>
                    <option value="support">Customer Support</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-500" />
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="message" className={LABEL_CLASS}>Message</label>
              <textarea
                id="message"
                name="message"
                required
                rows={5}
                value={form.message}
                onChange={handleChange}
                placeholder="Tell us how we can help you..."
                className={`${INPUT_CLASS} resize-y min-h-[120px]`}
              />
            </div>

            <div>
              <label htmlFor="source" className={LABEL_CLASS}>How Did You Hear About Us? (Optional)</label>
              <input
                id="source"
                name="source"
                type="text"
                value={form.source}
                onChange={handleChange}
                placeholder="Instagram, a friend, supermarket..."
                className={INPUT_CLASS}
              />
            </div>

            <div className="pt-1 space-y-3">
              <button
                type="submit"
                className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-lg bg-[#CC0000] px-7 py-3.5 text-sm font-bold text-white transition hover:bg-[#a60d26] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#CC0000] focus-visible:ring-offset-2 active:scale-[0.99]"
              >
                <MessageSquare className="h-4 w-4 shrink-0" />
                Send via WhatsApp
              </button>

              <p className="text-xs leading-relaxed text-stone-500">
                WhatsApp will open with your message filled in. Nothing is sent until you press send there.
              </p>
            </div>

          </form>

        </div>
      </section>

      {/* ==========================================
          FOLLOW SECTION (GAYA HEINZ, DI ATAS FOOTER)
      ========================================== */}
      <section className="w-full bg-[#CC0000] text-white px-6 py-16 sm:py-24">
        <div className="max-w-3xl mx-auto flex flex-col items-center text-center">
          <h2 className="text-4xl sm:text-6xl lg:text-7xl font-bold uppercase tracking-tight leading-none">
            Follow AWANG
          </h2>

          <p className="mt-5 sm:mt-6 max-w-md text-sm sm:text-base font-medium leading-relaxed text-white/90">
            Stay connected for fresh recipe inspiration, new product drops, and cooking tutorials.
          </p>

          <div className="mt-8 sm:mt-10 flex items-center justify-center gap-3 sm:gap-5">
            {SOCIALS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-[#5A0F22] text-white transition-all duration-300 hover:scale-110 hover:bg-[#3D0A17] focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#CC0000]"
              >
                <svg className="h-6 w-6 sm:h-7 sm:w-7 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path d={s.path} />
                </svg>
              </a>
            ))}
          </div>
        </div>
      </section>

    </main>
  )
}