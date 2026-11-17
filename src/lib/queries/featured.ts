import { supabasePublic } from '@/lib/supabase/public'

export type FeaturedItemType = 'product' | 'recipe'
export type FeaturedBadge = 'trending' | 'favorite' | null

export interface FeaturedItem {
  id: string
  type: FeaturedItemType
  slug: string
  name: string
  img: string | null
  badge?: string // kategori produk atau kategori resep
  meta?: string  // e.g. "15 min · 4 porsi" untuk resep
  featured_badge?: FeaturedBadge
  featured_sort?: number
}

/**
 * Mengambil item unggulan gabungan (produk + resep) untuk section "TASTE THE HEAT"
 * Diurutkan berdasarkan `featured_sort` ASC (posisi 1, 2, 3, 4) lalu `created_at` DESC.
 * Total maksimum = limit (default 4)
 */
export async function getFeaturedItems(limit = 4): Promise<FeaturedItem[]> {
  const [{ data: products }, { data: recipes }] = await Promise.all([
    supabasePublic
      .from('products')
      .select('id, name, slug, main_image, featured_badge, featured_sort, created_at, category:categories(name)')
      .eq('status', 'published')
      .eq('is_featured', true)
      .order('featured_sort', { ascending: true })
      .order('created_at', { ascending: false }),

    supabasePublic
      .from('recipes')
      .select('id, title, slug, main_image, category, prep_time, servings, featured_badge, featured_sort, created_at')
      .eq('status', 'published')
      .eq('is_featured', true)
      .order('featured_sort', { ascending: true })
      .order('created_at', { ascending: false }),
  ])

  const productItems: FeaturedItem[] = (products || []).map((p: any) => ({
    id: p.id,
    type: 'product' as FeaturedItemType,
    slug: p.slug,
    name: p.name,
    img: p.main_image,
    badge: p.category?.name || '',
    featured_badge: (p.featured_badge as FeaturedBadge) || null,
    featured_sort: p.featured_sort ?? 99,
  }))

  const recipeItems: FeaturedItem[] = (recipes || []).map((r: any) => ({
    id: r.id,
    type: 'recipe' as FeaturedItemType,
    slug: r.slug,
    name: r.title,
    img: r.main_image,
    badge: r.category || 'Recipe',
    meta: [r.prep_time, r.servings].filter(Boolean).join(' · '),
    featured_badge: (r.featured_badge as FeaturedBadge) || null,
    featured_sort: r.featured_sort ?? 99,
  }))

  // Gabungkan semua item yang ditandai is_featured
  const merged = [...productItems, ...recipeItems]

  // Urutkan berdasarkan featured_sort (1, 2, 3, 4, dst)
  // Penting: 0 dianggap sama dengan null (belum diurutkan), gunakan 99 sebagai fallback
  // sehingga item dengan sort yang sudah benar (1-4) selalu diutamakan
  merged.sort((a, b) => {
    const sortA = (!a.featured_sort || a.featured_sort === 0) ? 99 : a.featured_sort
    const sortB = (!b.featured_sort || b.featured_sort === 0) ? 99 : b.featured_sort
    return sortA - sortB
  })

  return merged.slice(0, limit)
}
