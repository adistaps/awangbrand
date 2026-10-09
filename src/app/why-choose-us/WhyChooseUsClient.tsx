'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  HeartHandshake,
  ShieldCheck,
  Truck,
  Check,
  ChevronsRight,
  Download,
  Plus,
  Minus,
  Settings
} from 'lucide-react'
import { MarqueeSection } from '@/components/Homepage/MarqueeSection'
import Link from 'next/link'
import { useLanguage } from '@/context/LanguageContext'

export function WhyChooseUsClient() {
  const [activeProcess, setActiveProcess] = useState<number | null>(0)
  const { t, language } = useLanguage()

  const pillars = [
    {
      title: 'Need first',
      icon: <HeartHandshake className="w-8 h-8 md:w-10 md:h-10" strokeWidth={1.5} />,
      desc: language === 'en'
        ? 'Realizing field support requirements with high-performance power tools ready for tough industrial conditions.'
        : 'Menyadari kebutuhan dukungan di lapangan dalam bentuk alat listrik berkinerja tinggi yang siap digunakan dalam berbagai kondisi industri.'
    },
    {
      title: 'Safety led',
      icon: <ShieldCheck className="w-8 h-8 md:w-10 md:h-10" strokeWidth={1.5} />,
      desc: language === 'en'
        ? 'Ensuring power tools are safe for end-user operation by adhering to strict international safety standards.'
        : 'Memastikan alat listrik kami aman digunakan di tangan konsumen akhir dengan memenuhi standar keamanan dan sertifikasi internasional.'
    },
    {
      title: 'Feedback forward',
      icon: <Truck className="w-8 h-8 md:w-10 md:h-10" strokeWidth={1.5} />,
      desc: language === 'en'
        ? 'Proactively gathering valuable customer feedback to continuously elevate precision, power, and efficiency.'
        : 'Mengambil masukan berharga dari pelanggan secara proaktif untuk terus meningkatkan presisi, kekuatan, dan efisiensi produk kami.'
    },
    {
      title: 'Precision Build',
      icon: <Settings className="w-8 h-8 md:w-10 md:h-10" strokeWidth={1.5} />,
      desc: language === 'en'
        ? 'Continuous high-precision engineering to guarantee exceptionally long tool lifespans.'
        : 'Pengembangan berkelanjutan dengan presisi tingkat tinggi untuk menjamin daya tahan alat dalam jangka waktu yang sangat panjang.'
    }
  ]

  const processSteps = [
    {
      title: language === 'en' ? 'Tool Engineering (ODM & OEM)' : 'Perancangan Alat (ODM & OEM)',
      desc: language === 'en'
        ? 'Custom tool design based on customer technical specifications, including ergonomic shaping and high-efficiency circuit modeling.'
        : 'Perancangan alat berdasarkan spesifikasi khusus permintaan pelanggan, mencakup desain ergonomis dan pemodelan sirkuit daya untuk efisiensi tinggi.'
    },
    {
      title: language === 'en' ? 'Sourcing & Sub-Supplier Vetting' : 'Pemilihan Pemasok & Material',
      desc: language === 'en'
        ? 'Auditing and qualifying sub-suppliers that meet our stringent design and quality benchmarks for premium raw materials.'
        : 'Mengumpulkan dan memverifikasi pemasok sub yang memenuhi standar desain dan mutu tinggi kami untuk memastikan bahan baku terbaik.'
    },
    {
      title: language === 'en' ? 'Mass Production & Quality Control' : 'Produksi & Kontrol Kualitas',
      desc: language === 'en'
        ? 'Mass assembly of power tools with multi-tier quality control (QC) in modern assembly facilities before global dispatch.'
        : 'Produksi massal alat listrik dengan kontrol kualitas (QC) berlapis di fasilitas perakitan modern sebelum dikirim ke pelanggan global.'
    }
  ]

  const sidebarMenus = [
    'Power Tools',
    'Industrial Grade',
    'Brushless Motor',
    'Global Distribution'
  ]

  return (
    <>
      {/* MAIN LAYOUT (Sidebar + Main Content) */}
      <section className="py-10 md:py-24 px-4 sm:px-6 md:px-16 max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">

        {/* ================= SIDEBAR (Kiri) ================= */}
        <aside className="lg:col-span-3 space-y-6 md:space-y-10">

          {/* Sidebar Menu */}
          <div>
            <h3 className="text-lg md:text-xl font-extrabold text-[#0A1628] mb-4 md:mb-6">
              Industrial <span className="font-light">Solutions</span>
            </h3>
            <ul className="flex flex-col">
              {sidebarMenus.map((menu, idx) => (
                <li key={idx} className="border-b border-gray-200 last:border-0 py-3 md:py-4">
                  <Link href="#" className="text-sm md:text-base text-gray-600 hover:text-[#F5A200] font-medium transition-colors">
                    {menu}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Brochure Box */}
          <div
            className="text-white p-6 md:p-8 rounded-xs"
            style={{ backgroundColor: '#0A1628' }}
          >
            <h4 className="text-xl md:text-2xl font-bold mb-2">Our Services Brochure</h4>
            <p className="text-white/60 text-xs md:text-sm mb-6 md:mb-12">
              {language === 'en' ? 'Technical specs & details' : 'Detail teknis & spesifikasi'}
            </p>
            <Link href="#" className="inline-flex items-center gap-2 text-xs md:text-sm font-bold text-white hover:text-[#F5A200] transition-colors">
              Download PDF <Download size={16} />
            </Link>
          </div>

          {/* Contact Box */}
          <div className="bg-[#F8F9FA] p-6 md:p-8 border border-gray-100 relative pt-10 md:pt-12">
            <div className="absolute top-0 right-6 md:right-8 -translate-y-1/2 text-[#F5A200] bg-white p-2 rounded-full shadow-sm">
              <ChevronsRight className="w-6 h-6 md:w-8 md:h-8" strokeWidth={3} />
            </div>
            <p className="text-[#0A1628] font-bold text-base md:text-lg leading-snug mb-6 md:mb-8">
              {language === 'en' ? 'For additional questions, contact one of our agents.' : 'Untuk pertanyaan lebih lanjut, hubungi agen kami.'}
            </p>

            <div>
              <span className="text-xs text-gray-500 font-semibold block mb-1">
                {t('contact_us', 'Hubungi Kami')}
              </span>
              <a href="mailto:info@awangbrand.com" className="text-[11px] sm:text-xs xl:text-sm font-medium text-[#0A1628] hover:text-[#C8102E] transition-colors break-words [word-break:break-word] block">
                support@awangbrand.com
              </a>
            </div>
          </div>
        </aside>

        {/* ================= MAIN CONTENT (Kanan) ================= */}
        <div className="lg:col-span-9 space-y-8 md:space-y-12">

          {/* Header & Intro */}
          <div>
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-extrabold text-[#0A1628] tracking-tight mb-4 md:mb-6 leading-tight">
              {language === 'en' ? 'Authentic Asian Culinary Excellence' : 'Keunggulan Kuliner Asli Asia'}
            </h2>
            <p className="text-sm md:text-base text-gray-600 leading-relaxed font-medium mb-4 md:mb-6">
              {language === 'en'
                ? 'AWANG Brand delivers authentic Asian pastes and culinary solutions crafted with 100% natural ingredients, strict HALAL certification, and time-honored traditional recipes.'
                : 'AWANG Brand menghadirkan aneka bumbu instan dan produk kuliner khas Asia dari bahan 100% alami, tersertifikasi HALAL resmi, dan resep warisan otentik.'
              }
            </p>

            <ul className="space-y-2.5 md:space-y-3">
              <li className="flex items-center gap-3 text-xs sm:text-sm md:text-base text-gray-700 font-medium">
                <Check className="text-[#F5A200] shrink-0" size={18} strokeWidth={3} />
                {language === 'en' ? 'Engineering tools for the toughest site conditions.' : 'Merancang alat untuk kondisi lapangan terberat.'}
              </li>
              <li className="flex items-center gap-3 text-xs sm:text-sm md:text-base text-gray-700 font-medium">
                <Check className="text-[#F5A200] shrink-0" size={18} strokeWidth={3} />
                {language === 'en' ? 'Strict testing benchmarks for user safety.' : 'Standar pengujian ketat demi keamanan pengguna.'}
              </li>
            </ul>
          </div>

          {/* Large Feature Image */}
          <div className="w-full h-[220px] sm:h-[300px] md:h-[400px] bg-gray-200 overflow-hidden rounded-xs">
            <img
              src="/10.webp"
              alt="Manufacturing Facility"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Business Process (Accordion Style) */}
          <div className="border-t border-gray-200">
            {processSteps.map((step, idx) => {
              const isActive = activeProcess === idx
              return (
                <div key={idx} className="border-b border-gray-200">
                  <button
                    onClick={() => setActiveProcess(isActive ? null : idx)}
                    className="w-full py-4 md:py-6 flex items-center justify-between text-left group hover:bg-gray-50 transition-colors px-2 md:px-4"
                  >
                    <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-16 w-full pr-2">
                      <span className="text-xs md:text-sm font-bold text-[#F5A200] md:text-[#0A1628] w-auto md:w-48 uppercase tracking-widest">
                        {language === 'en' ? `Phase 0${idx + 1}` : `Tahap 0${idx + 1}`}
                      </span>
                      <span className="text-base sm:text-lg md:text-xl font-bold text-[#0A1628] group-hover:text-[#F5A200] transition-colors flex-1 leading-snug">
                        {step.title}
                      </span>
                    </div>
                    <div className="text-[#0A1628] shrink-0 ml-2">
                      {isActive ? <Minus className="w-5 h-5 md:w-6 md:h-6" /> : <Plus className="w-5 h-5 md:w-6 md:h-6" />}
                    </div>
                  </button>

                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden px-2 md:pl-[244px]"
                      >
                        <p className="pb-4 md:pb-6 text-xs sm:text-sm md:text-base text-gray-600 leading-relaxed max-w-2xl">
                          {step.desc}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )
            })}
          </div>

          {/* Pillars Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-x-12 md:gap-y-12 pt-4 md:pt-8">
            {pillars.map((item, idx) => (
              <div key={idx} className="flex gap-4 md:gap-6 group">
                <div className="text-[#F5A200] shrink-0 transform group-hover:scale-110 transition-transform duration-300">
                  {item.icon}
                </div>
                <div>
                  <h3 className="text-base sm:text-lg md:text-xl font-bold text-[#0A1628] mb-1.5 md:mb-3">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      <MarqueeSection />
    </>
  )
}