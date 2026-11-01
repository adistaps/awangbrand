import { createClient } from '@/lib/supabase/server'

export type FeaturedItemType = 'product' | 'recipe'

export interface FeaturedItem {
  id: string
  type: FeaturedItemType
  slug: string
  name: string
  img: string | null
  badge?: string // kategori produk atau kategori resep
  meta?: string  // e.g. "15 min · 4 porsi" untuk resep
}

/**
 * Mengambil item unggulan gabungan (produk + resep) untuk section "TASTE THE HEAT"
 * Total maksimum = limit (default 4)
 */
export async function getFeaturedItems(limit = 4): Promise<FeaturedItem[]> {
  const supabase = await createClient()

  const [{ data: products }, { data: recipes }] = await Promise.all([
    supabase
      .from('products')
      .select('id, name, slug, main_image, category:categories(name)')
      .eq('status', 'published')
      .eq('is_featured', true)
      .order('created_at', { ascending: false })
      .limit(limit),

    supabase
      .from('recipes')
      .select('id, title, slug, main_image, category, prep_time, servings')
      .eq('status', 'published')
      .eq('is_featured', true)
      .order('created_at', { ascending: false })
      .limit(limit),
  ])

  const productItems: FeaturedItem[] = (products || []).map((p: any) => ({
    id: p.id,
    type: 'product' as FeaturedItemType,
    slug: p.slug,
    name: p.name,
    img: p.main_image,
    badge: p.category?.name || '',
  }))

  const recipeItems: FeaturedItem[] = (recipes || []).map((r: any) => ({
    id: r.id,
    type: 'recipe' as FeaturedItemType,
    slug: r.slug,
    name: r.title,
    img: r.main_image,
    badge: r.category || 'Recipe',
    meta: [r.prep_time, r.servings].filter(Boolean).join(' · '),
  }))

  // Gabung dan shuffle supaya mix produk & resep, lalu slice sesuai limit
  const merged = [...productItems, ...recipeItems]
  // Sort: interleave produk & resep agar tidak monoton
  const interleaved: FeaturedItem[] = []
  let pi = 0, ri = 0
  while (interleaved.length < limit && (pi < productItems.length || ri < recipeItems.length)) {
    if (pi < productItems.length) interleaved.push(productItems[pi++])
    if (interleaved.length < limit && ri < recipeItems.length) interleaved.push(recipeItems[ri++])
  }

  // Fallback: jika salah satu kosong, isi dari yang lain
  if (interleaved.length === 0) return merged.slice(0, limit)
  if (interleaved.length < limit) {
    const remaining = merged.filter((x) => !interleaved.find((y) => y.id === x.id))
    return [...interleaved, ...remaining].slice(0, limit)
  }

  return interleaved.slice(0, limit)
}
