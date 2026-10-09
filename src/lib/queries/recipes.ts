import { createClient } from '@/lib/supabase/server'
import type { Recipe } from '@/types/database'

/**
 * Mengambil resep pilihan untuk tampilan Beranda
 */
export async function getHomeRecipes(limit = 6): Promise<Recipe[]> {
  const supabase = await createClient()
  const { data: recipes } = await supabase
    .from('recipes')
    .select('*, featured_product:products(*)')
    .eq('status', 'published')
    .eq('is_featured', true)
    .order('created_at', { ascending: false })
    .limit(limit)

  return (recipes as Recipe[]) || []
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
