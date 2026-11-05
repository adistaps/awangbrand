import type { Metadata } from 'next'
import { AboutUsClient } from './AboutUsClient'

export const metadata: Metadata = {
  title: 'Who We Are - AwangBrand',
  description:
    'Mengenali AWANG Brand Malaysia — pengeluar pes masakan warisan Melayu terkemuka sejak 2015. Menggunakan 100% rempah asli semulajadi, disahkan Halal JAKIM untuk kemudahan masakan harian.',
  keywords: ['tentang AWANG Brand', 'AWANG Brand Malaysia', 'pengeluar pes masakan Malaysia', 'sejarah Awang Brand', 'pes warisan Melayu'],
  openGraph: {
    title: 'Who We Are - AwangBrand',
    description: 'AWANG Brand Malaysia — Menghidupkan kembali keaslian rasa warisan Melayu dengan pes sedia dimasak.',
    url: 'https://awangbrand.com/about-us',
  },
  alternates: { canonical: 'https://awangbrand.com/about-us' },
}

export const dynamic = 'force-dynamic'

export default function Page() {
  return (
    <main className="bg-white font-sans overflow-hidden">
      {/* Konten Utama About Us */}
      <AboutUsClient />
      {/* Quote Form Section diletakkan diatas CTA / Footer */}
    </main>
  )
}