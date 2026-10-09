import type { Metadata } from 'next'
import { HalalPromiseClient } from './HalalPromiseClient'

export const metadata: Metadata = {
  title: 'Our Halal Commitment | AWANG Brand',
  description: 'AWANG Brand halal certification, Syariah compliance, JAKIM recognized standards, and quality commitment.',
  openGraph: {
    title: 'Our Halal Commitment | AWANG Brand',
    description: 'Learn about AWANG Brand halal quality standards and certification.',
    url: 'https://awangbrand.com/halal-promise',
  },
  alternates: { canonical: 'https://awangbrand.com/halal-promise' },
}

export default function Page() {
  return <HalalPromiseClient />
}
