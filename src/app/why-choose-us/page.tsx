import type { Metadata } from 'next'
import { PageHero } from '@/components/PageHero'
import { CTA } from '@/components/CTA'
import { BrandsSection } from '@/components/Homepage/BrandsSection'
import { WhyChooseUsClient } from './WhyChooseUsClient'

export const metadata: Metadata = {
  title: 'Why Choose AWANG | AWANG Brand',
  description:
    'Discover why AWANG Brand is the trusted choice for authentic Asian pastes, sauces, and culinary products — 100% natural, certified HALAL, and rich heritage flavors.',
  keywords: ['AWANG Brand', 'authentic Asian paste', 'HALAL cooking paste', 'natural ingredients'],
  openGraph: {
    title: 'Why Choose AWANG | AWANG Brand',
    description: 'The trusted choice for authentic Asian pastes and sauces.',
    url: 'https://awangbrand.com/why-choose-us',
  },
  alternates: { canonical: 'https://awangbrand.com/why-choose-us' },
}

export const dynamic = 'force-dynamic'


export default function Page() {
  return (
    <main className="bg-white font-sans text-gray-900">
      <PageHero title="What We Do" crumb="Our Services" />

      <WhyChooseUsClient />

      <BrandsSection />
      <CTA />
    </main>
  )
}
