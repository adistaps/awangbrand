import { createClient } from '@/lib/supabase/server'

/**
 * Mengambil produk unggulan (Featured Products) untuk tampilan Beranda
 */
export async function getFeaturedProducts(limit = 4) {
  const supabase = await createClient()
  const { data: products } = await supabase
    .from('products')
    .select('id, name, slug, main_image, category:categories(name)')
    .eq('status', 'published')
    .eq('is_featured', true)
    .order('created_at', { ascending: false })
    .limit(limit)

  return products || []
}

/**
 * Mengambil semua produk yang berstatus 'published'
 */
export async function getAllProducts() {
  const supabase = await createClient()
  const { data: products } = await supabase
    .from('products')
    .select('*, category:categories(*)')
    .eq('status', 'published')
    .order('created_at', { ascending: false })

  return products || []
}

/**
 * Mengambil detail 1 produk berdasarkan slug
 */
export async function getProductBySlug(slug: string) {
  const supabase = await createClient()
  const { data: product } = await supabase
    .from('products')
    .select(`
      *,
      category:categories(*),
      product_images(*),
      product_specifications(*)
    `)
    .eq('slug', slug)
    .single()

  return product
}

/**
 * Mengambil produk terkait (Related Products)
 */
export async function getRelatedProducts(categoryId?: string | null, currentSlug?: string, limit = 4) {
  const supabase = await createClient()
  let query = supabase
    .from('products')
    .select('*')
    .eq('status', 'published')
    .limit(limit)

  if (currentSlug) {
    query = query.neq('slug', currentSlug)
  }

  if (categoryId) {
    query = query.eq('category_id', categoryId)
  }

  const { data: products } = await query
  return products || []
}
