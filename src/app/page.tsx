import type { Metadata } from 'next'
import { HeroSection } from '@/components/Homepage/HeroSection'
import { AnimatedTaglineSection } from '@/components/Homepage/AnimatedTaglineSection'
import { ProductCarouselSection } from '@/components/Homepage/ProductCarouselSection'
import { QuoteFormSection } from '@/components/Homepage/QuoteFormSection'
import { VideoSection } from '@/components/Homepage/VideoSection'
import { SocialSection } from '@/components/Homepage/SocialSection'
import { MarqueeSection } from '@/components/Homepage/MarqueeSection'
import { FeaturedProductsSection } from '@/components/Homepage/FeaturedProductsSection'
import { RecipesBentoSection } from '@/components/Homepage/RecipesBentoSection'
import { TestimonialsSection } from '@/components/Homepage/TestimonialsSection'
import { BrandsSection } from '@/components/Homepage/BrandsSection'

export const metadata: Metadata = {
  title: 'AWANG Brand  — Pes Masakan Autentik & Perencah Warisan Melayu',
  description: 'AWANG Brand — Pengeluar pes masakan autentik warisan Melayu terkemuka di Malaysia. 100% ramuan asli semulajadi, disahkan Halal JAKIM, mudah dan lazat untuk seisi keluarga.',
  alternates: { canonical: 'https://awangbrand.com' },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'AWANG Brand Malaysia',
  url: 'https://awangbrand.com',
  logo: 'https://awangbrand.com/icon.webp',
  description: 'Pengeluar pes masakan autentik warisan Melayu dan perencah masakan berkualiti tinggi di Malaysia.',
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'MY',
    addressLocality: 'Malaysia',
  },
}

export default function Page() {
  return (
    <main className="bg-[#FDFBF7]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HeroSection />
      <FeaturedProductsSection />
      <AnimatedTaglineSection />
      <ProductCarouselSection />
      <VideoSection />
      <RecipesBentoSection />
      <SocialSection />
      <MarqueeSection />
      <QuoteFormSection />
      <TestimonialsSection />
      <BrandsSection />
    </main>
  )
}

