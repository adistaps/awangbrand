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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#0A1628] tracking-tight">Kelola Produk</h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">{products?.length || 0} produk terdaftar dalam katalog AWANG</p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center justify-center gap-2 bg-[#CC0000] hover:bg-[#a00b22] !text-white text-xs sm:text-sm font-bold px-4 sm:px-5 py-2.5 rounded-xl transition-all shadow-sm active:scale-95 shrink-0 self-start sm:self-auto"
        >
          <Plus size={16} className="!text-white" />
          <span className="!text-white text-white">Tambah Produk</span>
        </Link>
      </div>

      <ProductsTable products={products || []} />
    </div>
  )
}
