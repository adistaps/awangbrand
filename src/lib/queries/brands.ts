import { supabasePublic } from '@/lib/supabase/public'

/**
 * Mengambil daftar Brand aktif
 */
export async function getActiveBrands() {
  const { data: brands } = await supabasePublic
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
  const [{ data: brands }, { data: settingRows }] = await Promise.all([
    supabasePublic
      .from('brands')
      .select('id, name, logo_url')
      .eq('is_active', true)
      .order('sort_order', { ascending: true }),
    supabasePublic
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
