import { supabasePublic } from '@/lib/supabase/public'

/**
 * Mengambil produk unggulan (Featured Products) untuk tampilan Beranda
 */
export async function getFeaturedProducts(limit = 4) {
  const { data: products } = await supabasePublic
    .from('products')
    .select('id, name, slug, main_image, category:categories(name)')
    .eq('status', 'published')
    .eq('is_featured', true)
    .order('created_at', { ascending: false })
    .limit(limit)

  return products || []
}

/**
 * Mengambil semua produk yang berstatus 'published' untuk daftar katalog
 */
export async function getAllProducts() {
  const { data: products } = await supabasePublic
    .from('products')
    .select(`
      id,
      name,
      slug,
      category_id,
      brand_id,
      short_description,
      main_image,
      sizes,
      status,
      is_featured,
      category:categories(id, name, slug)
    `)
    .eq('status', 'published')
    .order('created_at', { ascending: false })

  return products || []
}

/**
 * Mengambil detail 1 produk berdasarkan slug
 */
export async function getProductBySlug(slug: string) {
  const { data: product } = await supabasePublic
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
  let query = supabasePublic
    .from('products')
    .select('id, name, slug, main_image, sizes, category:categories(name)')
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
