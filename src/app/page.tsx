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
  title: 'Awang Brand - Cita Rasa Istimewa Alami',
  description: 'AWANG — Produk saus, bumbu, dan resep hidangan berkualitas terbaik untuk keluarga Indonesia.',
  alternates: { canonical: 'https://awangbrand.com' },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'PT. AWANG Indonesia',
  url: 'https://awangbrand.com',
  logo: 'https://awangbrand.com/icon.webp',
  description: 'Produk saus, bumbu, dan resep hidangan berkualitas terbaik di Indonesia.',
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'ID',
    addressLocality: 'Indonesia',
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

