import type { Metadata } from 'next'
import { HeroSection } from '@/components/Homepage/HeroSection'
import { AnimatedTaglineSection } from '@/components/Homepage/AnimatedTaglineSection'
import { ProductCarouselSection } from '@/components/Homepage/ProductCarouselSection'
import { QuoteFormSection } from '@/components/Homepage/QuoteFormSection'
import { VideoSection } from '@/components/Homepage/VideoSection'
import { SocialSection, type TikTokVideoItem } from '@/components/Homepage/SocialSection'
import { MarqueeSection } from '@/components/Homepage/MarqueeSection'
import { FeaturedProductsSection } from '@/components/Homepage/FeaturedProductsSection'
import { RecipesBentoSection } from '@/components/Homepage/RecipesBentoSection'
import { TestimonialsSection } from '@/components/Homepage/TestimonialsSection'
import { BrandsSection } from '@/components/Homepage/BrandsSection'
import { AllInSection } from '@/components/Homepage/AllInSection'
import { createClient } from '@/lib/supabase/server'

export const metadata: Metadata = {
  title: 'Awang Brand - Pes Masakan Autentik & Perencah Warisan Melayu',
  description: 'AWANG Brand — Pengeluar pes masakan autentik warisan Melayu terkemuka di Malaysia. 100% ramuan asli semulajadi, disahkan Halal JAKIM, mudah dan lazat untuk seisi keluarga.',
  alternates: { canonical: 'https://awangbrand.com' },
}

export const dynamic = 'force-dynamic'

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

export default async function Page() {
  const supabase = await createClient()

  // Ambil konfigurasi TikTok dari site_settings
  const { data: tiktokSettings } = await supabase
    .from('site_settings')
    .select('key, value')
    .in('key', [
      'homepage_tiktok_videos',
      'homepage_tiktok_title',
      'homepage_tiktok_subtitle',
      'homepage_tiktok_account_url',
    ])

  const settingsMap: Record<string, string> = {}
    ; (tiktokSettings || []).forEach((row) => {
      if (row.value) settingsMap[row.key] = row.value
    })

  let tiktokVideos: TikTokVideoItem[] | undefined
  if (settingsMap.homepage_tiktok_videos) {
    try {
      tiktokVideos = JSON.parse(settingsMap.homepage_tiktok_videos)
    } catch {
      tiktokVideos = undefined
    }
  }

  return (
    <main className="bg-[#FDFBF7]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />
      <HeroSection />
      <FeaturedProductsSection />
      <QuoteFormSection />
      <AnimatedTaglineSection />
      <ProductCarouselSection />
      <VideoSection />
      <RecipesBentoSection />
      <SocialSection
        initialVideos={tiktokVideos}
        title={settingsMap.homepage_tiktok_title}
        subtitle={settingsMap.homepage_tiktok_subtitle}
        accountUrl={settingsMap.homepage_tiktok_account_url}
      />
      <MarqueeSection />
      <AllInSection />
      <TestimonialsSection />
      <BrandsSection />
    </main>
  )
}
