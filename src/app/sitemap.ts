import type { MetadataRoute } from 'next'
import { supabasePublic } from '@/lib/supabase/public'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Ambil semua slug produk & resep yang dipublish
  const [{ data: products }, { data: recipes }] = await Promise.all([
    supabasePublic
      .from('products')
      .select('slug, updated_at')
      .eq('status', 'published'),
    supabasePublic
      .from('recipes')
      .select('slug, updated_at')
      .eq('status', 'published'),
  ])

  const productUrls: MetadataRoute.Sitemap = (products ?? []).map((p) => ({
    url: `https://awangbrand.com/products/${p.slug}`,
    lastModified: new Date(p.updated_at),
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  const recipeUrls: MetadataRoute.Sitemap = (recipes ?? []).map((r) => ({
    url: `https://awangbrand.com/recipes/${r.slug}`,
    lastModified: new Date(r.updated_at),
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: 'https://awangbrand.com',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: 'https://awangbrand.com/products',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: 'https://awangbrand.com/recipes',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: 'https://awangbrand.com/about-us',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: 'https://awangbrand.com/contact',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ]

  return [...staticPages, ...productUrls, ...recipeUrls]
}
