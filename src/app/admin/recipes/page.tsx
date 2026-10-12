import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Plus, Utensils, Edit, Trash2 } from 'lucide-react'
import { RecipesTable } from '@/components/admin/RecipesTable'

export const dynamic = 'force-dynamic'

export default async function AdminRecipesPage() {
  const supabase = await createClient()
  const { data: recipes } = await supabase
    .from('recipes')
    .select('*, featured_product:products(name)')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#0A1628] tracking-tight">Kelola Resep</h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Tambah, edit, dan kelola resep masakan khas AWANG Brand.
          </p>
        </div>
        <Link
          href="/admin/recipes/new"
          className="inline-flex items-center justify-center gap-2 bg-[#C8102E] hover:bg-[#a00b22] !text-white text-xs sm:text-sm font-bold px-4 sm:px-5 py-2.5 rounded-xl transition-all shadow-sm active:scale-95 shrink-0 self-start sm:self-auto"
        >
          <Plus size={16} className="!text-white" />
          <span className="!text-white text-white">Tambah Resep Baru</span>
        </Link>
      </div>

      <RecipesTable recipes={recipes || []} />
    </div>
  )
}
