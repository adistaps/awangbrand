import type { Metadata } from 'next'
import { CTA } from '@/components/CTA'
import { QuoteFormSection } from '@/components/Homepage/QuoteFormSection'
import { AboutUsClient } from './AboutUsClient'

export const metadata: Metadata = {
  title: 'Tentang Kami - AWANG',
  description:
    'AWANG adalah brand terpercaya yang berkomitmen menyediakan produk berkualitas tinggi dengan cita rasa otentik.',
  keywords: ['tentang AWANG', 'AWANG Brand', 'profil perusahaan AWANG', 'tentang kami'],
  openGraph: {
    title: 'Tentang Kami | AWANG',
    description: 'AWANG - Menghadirkan kualitas otentik dan terbaik untuk Anda.',
    url: 'https://keywellarshakainnovation.com/about-us',
  },
  alternates: { canonical: 'https://keywellarshakainnovation.com/about-us' },
}

export const dynamic = 'force-dynamic'

export default function Page() {
  return (
    <main className="bg-white font-sans overflow-hidden">
      {/* Konten Utama About Us */}
      <AboutUsClient />
      {/* Quote Form Section diletakkan diatas CTA / Footer */}
      <QuoteFormSection />
    </main>
  )
}