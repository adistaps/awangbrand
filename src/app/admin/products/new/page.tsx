import { createClient } from '@/lib/supabase/server'
import { ProductForm } from '@/components/admin/ProductForm'

export const dynamic = 'force-dynamic'

export default async function NewProductPage() {
  const supabase = await createClient()
  const { data: categories } = await supabase.from('categories').select('*').order('name')

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-[#0A1628] mb-1">Tambah Produk</h1>
      <p className="text-sm text-gray-500 mb-6">Isi detail produk, upload thumbnail & galeri foto</p>
      <ProductForm categories={categories || []} />
    </div>
  )
}
