import { supabasePublic } from '@/lib/supabase/public'
import type { Recipe } from '@/types/database'

const RECIPE_LIST_FIELDS = `
  id,
  title,
  slug,
  category,
  prep_time,
  cook_time,
  servings,
  difficulty,
  calories,
  description,
  main_image,
  is_featured,
  status,
  created_at,
  home_carousel_sort,
  featured_product:products(id, name, slug, main_image)
`

/**
 * Mengambil resep pilihan untuk tampilan Beranda "COOK SOMETHING GOOD"
 */
export async function getHomeRecipes(limit = 6): Promise<Recipe[]> {
  const { data: featuredRecipes } = await supabasePublic
    .from('recipes')
    .select(RECIPE_LIST_FIELDS)
    .eq('status', 'published')
    .eq('is_featured', true)
    .order('home_carousel_sort', { ascending: true })
    .order('created_at', { ascending: false })
    .limit(limit)

  let list = (featuredRecipes as unknown as Recipe[]) || []

  if (list.length < limit) {
    const existingIds = list.map((r) => r.id)
    let query = supabasePublic
      .from('recipes')
      .select(RECIPE_LIST_FIELDS)
      .eq('status', 'published')
      .order('created_at', { ascending: false })
      .limit(limit - list.length)

    if (existingIds.length > 0) {
      query = query.not('id', 'in', `(${existingIds.join(',')})`)
    }

    const { data: moreRecipes } = await query
    if (moreRecipes && moreRecipes.length > 0) {
      list = [...list, ...(moreRecipes as unknown as Recipe[])]
    }
  }

  return list
}

/**
 * Mengambil semua resep yang berstatus 'published'
 */
export async function getAllRecipes(): Promise<Recipe[]> {
  const { data: recipes } = await supabasePublic
    .from('recipes')
    .select(RECIPE_LIST_FIELDS)
    .eq('status', 'published')
    .order('created_at', { ascending: false })

  return (recipes as unknown as Recipe[]) || []
}

/**
 * Mengambil detail 1 resep berdasarkan slug beserta produk rekomendasi
 */
export async function getRecipeBySlug(slug: string): Promise<Recipe | null> {
  const { data: recipe } = await supabasePublic
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
  const { data: relatedRecipes } = await supabasePublic
    .from('recipes')
    .select('id, title, slug, main_image, prep_time, cook_time, servings, difficulty, calories, status')
    .neq('slug', currentSlug)
    .eq('status', 'published')
    .limit(limit)

  return (relatedRecipes as unknown as Recipe[]) || []
}
