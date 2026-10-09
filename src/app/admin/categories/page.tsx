import { createClient } from '@/lib/supabase/server'
import { CategoriesManager } from '@/components/admin/CategoriesManager'

export const dynamic = 'force-dynamic'

export default async function AdminCategoriesPage() {
  const supabase = await createClient()
  const { data: categories } = await supabase.from('categories').select('*').order('name')

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-[#0A1628] mb-1">Kelola Kategori</h1>
      <p className="text-sm text-gray-500 mb-6">Kategori digunakan untuk mengelompokkan produk</p>
      <CategoriesManager initialCategories={categories || []} />
    </div>
  )
}
