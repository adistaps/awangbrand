import { supabasePublic } from '@/lib/supabase/public'

/**
 * Mengambil semua Kategori produk
 */
export async function getAllCategories() {
  const { data: categories } = await supabasePublic
    .from('categories')
    .select('id, name, slug, description')
    .order('name', { ascending: true })

  return categories || []
}
