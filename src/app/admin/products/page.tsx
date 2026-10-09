import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { ProductsTable } from '@/components/admin/ProductsTable'

export const dynamic = 'force-dynamic'

export default async function AdminProductsPage() {
  const supabase = await createClient()

  const { data: products } = await supabase
    .from('products')
    .select('*, category:categories(id, name)')
    .order('created_at', { ascending: false })


  const { data: categories } = await supabase.from('categories').select('*').order('name')

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0A1628]">Kelola Produk</h1>
          <p className="text-sm text-gray-500 mt-1">{products?.length || 0} produk terdaftar</p>
        </div>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 bg-[#F5A200] hover:bg-[#D98B00] text-white text-sm font-bold px-4 py-2.5 rounded-lg transition-colors"
        >
          <Plus size={16} /> Tambah Produk
        </Link>
      </div>

      <ProductsTable products={products || []} categories={categories || []} />
    </div>
  )
}
