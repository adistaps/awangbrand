import { createClient } from '@/lib/supabase/server'
import type { Recipe } from '@/types/database'

/**
 * Mengambil resep pilihan untuk tampilan Beranda "COOK SOMETHING GOOD"
 * Mengutamakan resep yang bertanda is_featured = true, dan diurutkan
 * sesuai home_carousel_sort ASC lalu created_at DESC.
 */
export async function getHomeRecipes(limit = 6): Promise<Recipe[]> {
  const supabase = await createClient()

  // Ambil resep pilihan (is_featured = true) terlebih dahulu
  const { data: featuredRecipes } = await supabase
    .from('recipes')
    .select('*, featured_product:products(*)')
    .eq('status', 'published')
    .eq('is_featured', true)
    .order('home_carousel_sort', { ascending: true })
    .order('created_at', { ascending: false })
    .limit(limit)

  let list = (featuredRecipes as Recipe[]) || []

  // Jika resep berstatus is_featured kurang dari limit (misal baru ada 1 atau 0),
  // ambil resep berstatus published lainnya sebagai pelengkap agar carousel tali gantungan polaroid tampil penuh
  if (list.length < limit) {
    const existingIds = list.map((r) => r.id)
    let query = supabase
      .from('recipes')
      .select('*, featured_product:products(*)')
      .eq('status', 'published')
      .order('created_at', { ascending: false })
      .limit(limit - list.length)

    if (existingIds.length > 0) {
      query = query.not('id', 'in', `(${existingIds.join(',')})`)
    }

    const { data: moreRecipes } = await query
    if (moreRecipes && moreRecipes.length > 0) {
      list = [...list, ...(moreRecipes as Recipe[])]
    }
  }

  return list
}

/**
 * Mengambil semua resep yang berstatus 'published'
 */
export async function getAllRecipes(): Promise<Recipe[]> {
  const supabase = await createClient()
  const { data: recipes } = await supabase
    .from('recipes')
    .select('*, featured_product:products(*)')
    .eq('status', 'published')
    .order('created_at', { ascending: false })

  return (recipes as Recipe[]) || []
}

/**
 * Mengambil detail 1 resep berdasarkan slug beserta produk rekomendasi
 */
export async function getRecipeBySlug(slug: string): Promise<Recipe | null> {
  const supabase = await createClient()
  const { data: recipe } = await supabase
    .from('recipes')
    .select('*, featured_product:products(*)')
    .eq('slug', slug)
    .single()

  return (recipe as Recipe) || null
}

/**
 * Mengambil resep terkait
 */
export async function getRelatedRecipes(currentSlug: string, limit = 4): Promise<Recipe[]> {
  const supabase = await createClient()
  const { data: relatedRecipes } = await supabase
    .from('recipes')
    .select('*')
    .neq('slug', currentSlug)
    .eq('status', 'published')
    .limit(limit)

  return (relatedRecipes as Recipe[]) || []
}
