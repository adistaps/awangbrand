import { createClient } from '@/lib/supabase/server'
import { BrandsManager } from '@/components/admin/BrandsManager'

export const dynamic = 'force-dynamic'

export default async function AdminBrandsPage() {
  const supabase = await createClient()

  const [{ data: brands }, { data: settingRows }] = await Promise.all([
    supabase.from('brands').select('*').order('sort_order'),
    supabase
      .from('site_settings')
      .select('value')
      .eq('key', 'product_detail_brand_ids')
      .order('updated_at', { ascending: false })
      .limit(1),
  ])

  let initialProductDetailBrandIds: string[] = []
  if (settingRows?.[0]?.value) {
    try {
      initialProductDetailBrandIds = JSON.parse(settingRows[0].value)
    } catch {
      initialProductDetailBrandIds = []
    }
  } else {
    // Default semua brand id aktif
    initialProductDetailBrandIds = (brands || []).map((b) => b.id)
  }

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-[#0A1628] mb-1">Kelola Brand</h1>
      <p className="text-sm text-gray-500 mb-6">Kelola logo brand/mitra di homepage dan detail produk</p>
      <BrandsManager
        initialBrands={brands || []}
        initialProductDetailBrandIds={initialProductDetailBrandIds}
      />
    </div>
  )
}
