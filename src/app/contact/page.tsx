import type { Metadata } from 'next'
import { ContactClient } from './ContactClient'

export const metadata: Metadata = {
  title: 'Hubungi Kami',
  description:
    'Hubungi PT. Keywell Arshaka Innovation untuk konsultasi, penawaran harga, atau informasi produk power tools profesional. Tim kami siap membantu kebutuhan industri Anda.',
  keywords: ['kontak Keywell', 'hubungi distributor power tools', 'penawaran harga power tools', 'konsultasi alat industri'],
  openGraph: {
    title: 'Hubungi Kami | Keywell Arshaka Innovation',
    description: 'Konsultasikan kebutuhan power tools Anda dengan tim profesional Keywell.',
    url: 'https://keywellarshakainnovation.com/contact',
  },
  alternates: { canonical: 'https://keywellarshakainnovation.com/contact' },
}

export default function Page() {
  return <ContactClient />
}
