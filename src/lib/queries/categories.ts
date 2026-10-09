import { createClient } from '@/lib/supabase/server'

/**
 * Mengambil semua Kategori produk
 */
export async function getAllCategories() {
  const supabase = await createClient()
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('name', { ascending: true })

  return categories || []
}
