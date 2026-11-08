import { createClient } from '@/lib/supabase/server'
import { ProductForm } from '@/components/admin/ProductForm'

export const dynamic = 'force-dynamic'

export default async function NewProductPage() {
  const supabase = await createClient()
  const [{ data: categories }, { data: hierarchyRows }] = await Promise.all([
    supabase.from('categories').select('*').order('name'),
    supabase.from('site_settings').select('value').eq('key', 'product_categories_hierarchy').order('updated_at', { ascending: false }).limit(1),
  ])

  const hierarchySetting = hierarchyRows?.[0] ?? null

  let categoryGroups = []
  try {
    if (hierarchySetting?.value) {
      categoryGroups = JSON.parse(hierarchySetting.value)
    }
  } catch (err) {
    categoryGroups = []
  }

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-[#0A1628] mb-1">Tambah Produk</h1>
      <p className="text-sm text-gray-500 mb-6">Isi detail produk, upload thumbnail & galeri foto</p>
      <ProductForm categories={categories || []} categoryGroups={categoryGroups} />
    </div>
  )
}
