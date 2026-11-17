import type { Metadata } from 'next'
import { HeroSection } from '@/components/Homepage/HeroSection'
import { AnimatedTaglineSection } from '@/components/Homepage/AnimatedTaglineSection'
import { ProductCarouselSection, type CarouselCardItem } from '@/components/Homepage/ProductCarouselSection'
import { QuoteFormSection } from '@/components/Homepage/QuoteFormSection'
import { VideoSection } from '@/components/Homepage/VideoSection'
import { SocialSection, type TikTokVideoItem } from '@/components/Homepage/SocialSection'
import { MarqueeSection } from '@/components/Homepage/MarqueeSection'
import { FeaturedProductsSection } from '@/components/Homepage/FeaturedProductsSection'
import { RecipesBentoSection } from '@/components/Homepage/RecipesBentoSection'
import { TestimonialsSection } from '@/components/Homepage/TestimonialsSection'
import { BrandsSection } from '@/components/Homepage/BrandsSection'
import { AllInSection } from '@/components/Homepage/AllInSection'
import { supabasePublic } from '@/lib/supabase/public'

export const metadata: Metadata = {
  title: 'Awang Brand - Pes Masakan Autentik & Perencah Warisan Melayu',
  description: 'AWANG Brand — Pengeluar pes masakan autentik warisan Melayu terkemuka di Malaysia. 100% ramuan asli semulajadi, disahkan Halal JAKIM, mudah dan lazat untuk seisi keluarga.',
  alternates: { canonical: 'https://awangbrand.com' },
}

export const revalidate = 3600

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
  const [
    { data: tiktokSettings },
    { data: carouselSettings },
    { data: fallbackCategories },
  ] = await Promise.all([
    supabasePublic
      .from('site_settings')
      .select('key, value')
      .in('key', [
        'homepage_tiktok_videos',
        'homepage_tiktok_title',
        'homepage_tiktok_subtitle',
        'homepage_tiktok_account_url',
      ]),
    supabasePublic
      .from('site_settings')
      .select('key, value')
      .in('key', [
        'homepage_product_carousel_title',
        'homepage_product_carousel_subcategories',
        'homepage_product_carousel_card_colors',
        'product_categories_hierarchy',
      ]),
    supabasePublic
      .from('categories')
      .select('id, name, slug, image_url')
      .order('name', { ascending: true }),
  ])

  const settingsMap: Record<string, string> = {}
  ;(tiktokSettings || []).forEach((row) => {
    if (row.value) settingsMap[row.key] = row.value
  })

  const carouselMap: Record<string, string> = {}
  ;(carouselSettings || []).forEach((row) => {
    if (row.value) carouselMap[row.key] = row.value
  })

  let tiktokVideos: TikTokVideoItem[] | undefined
  if (settingsMap.homepage_tiktok_videos) {
    try {
      tiktokVideos = JSON.parse(settingsMap.homepage_tiktok_videos)
    } catch {
      tiktokVideos = undefined
    }
  }

  // Siapkan data Carousel di Server Component
  let carouselItems: CarouselCardItem[] = []
  let cardColors: Record<string, string> = {}
  if (carouselMap.homepage_product_carousel_card_colors) {
    try {
      cardColors = JSON.parse(carouselMap.homepage_product_carousel_card_colors)
    } catch {
      cardColors = {}
    }
  }

  const allSubs: CarouselCardItem[] = []
  if (carouselMap.product_categories_hierarchy) {
    try {
      const hierarchy = JSON.parse(carouselMap.product_categories_hierarchy)
      if (Array.isArray(hierarchy)) {
        hierarchy.forEach((group: any) => {
          if (Array.isArray(group.subcategories)) {
            group.subcategories.forEach((sub: any) => {
              allSubs.push({
                id: sub.id,
                name: sub.name,
                slug: sub.slug,
                image_url: sub.image_url || null,
              })
            })
          }
        })
      }
    } catch {
      // ignore
    }
  }

  if (carouselMap.homepage_product_carousel_subcategories) {
    try {
      const selectedIds: string[] = JSON.parse(carouselMap.homepage_product_carousel_subcategories)
      if (Array.isArray(selectedIds) && selectedIds.length > 0) {
        const ordered = selectedIds
          .map((id) => allSubs.find((s) => s.id === id))
          .filter(Boolean) as CarouselCardItem[]
        if (ordered.length > 0) {
          carouselItems = ordered
        }
      }
    } catch {
      // ignore
    }
  }

  if (carouselItems.length === 0) {
    if (allSubs.length > 0) {
      carouselItems = allSubs
    } else {
      carouselItems = fallbackCategories || []
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
      <ProductCarouselSection
        initialItems={carouselItems}
        title={carouselMap.homepage_product_carousel_title || 'CATEGORIES TO EXPLORE'}
        cardColors={cardColors}
      />
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
