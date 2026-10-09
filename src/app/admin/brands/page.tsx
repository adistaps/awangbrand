import { createClient } from '@/lib/supabase/server'
import { BrandsManager } from '@/components/admin/BrandsManager'

export const dynamic = 'force-dynamic'

export default async function AdminBrandsPage() {
  const supabase = await createClient()
  const { data: brands } = await supabase.from('brands').select('*').order('sort_order')

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-[#0A1628] mb-1">Kelola Brand</h1>
      <p className="text-sm text-gray-500 mb-6">Brand/partner yang tampil di homepage</p>
      <BrandsManager initialBrands={brands || []} />
    </div>
  )
}
