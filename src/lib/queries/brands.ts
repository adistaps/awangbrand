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
