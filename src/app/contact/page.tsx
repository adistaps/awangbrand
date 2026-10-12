import type { Metadata } from 'next'
import { ContactClient } from './ContactClient'

export const metadata: Metadata = {
  title: 'Hubungi Kami | AWANG Brand Malaysia',
  description:
    'Hubungi AWANG Brand Malaysia untuk pertanyaan pes masakan, tempahan borong, atau peluang pengedaran di Malaysia dan pasaran serantau.',
  keywords: [
    'kontak AWANG Brand',
    'AWANG Brand Malaysia contact',
    'pengedar pes masakan Malaysia',
    'pembekal pes masakan Halal',
    'pes masakan borong Malaysia',
  ],
  openGraph: {
    title: 'Hubungi Kami | AWANG Brand Malaysia',
    description: 'Hubungi AWANG Brand Malaysia untuk pertanyaan produk, resipi, dan kerjasama pengedaran.',
    url: 'https://awangbrand.com/contact',
    images: [{ url: '/og-image.webp', width: 1200, height: 630, alt: 'Hubungi AWANG Brand Malaysia' }],
  },
  alternates: { canonical: 'https://awangbrand.com/contact' },
}

export default function Page() {
  return <ContactClient />
}
