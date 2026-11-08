import { createClient } from '@/lib/supabase/server'

/**
 * Mengambil daftar Brand aktif
 */
export async function getActiveBrands() {
  const supabase = await createClient()
  const { data: brands } = await supabase
    .from('brands')
    .select('id, name, logo_url')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })

  return brands || []
}

/**
 * Mengambil daftar Brand yang ditampilkan di Detail Produk
 */
export async function getProductDetailBrands() {
  const supabase = await createClient()

  const [{ data: brands }, { data: settingRows }] = await Promise.all([
    supabase
      .from('brands')
      .select('id, name, logo_url')
      .eq('is_active', true)
      .order('sort_order', { ascending: true }),
    supabase
      .from('site_settings')
      .select('value')
      .eq('key', 'product_detail_brand_ids')
      .order('updated_at', { ascending: false })
      .limit(1),
  ])

  if (!brands || brands.length === 0) return []

  // Jika setting belum pernah diatur, default tampilkan semua brand aktif
  const settingVal = settingRows?.[0]?.value
  if (!settingVal) return brands

  try {
    const allowedIds = JSON.parse(settingVal)
    if (Array.isArray(allowedIds)) {
      return brands.filter((b) => allowedIds.includes(b.id))
    }
  } catch {
    // fallback
  }

  return brands
}
