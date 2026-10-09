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
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0A1628]">Kelola Resep</h1>
          <p className="text-sm text-gray-500 mt-1">
            Tambah, edit, dan hapus resep masakan yang tampil di website.
          </p>
        </div>
        <Link
          href="/admin/recipes/new"
          className="flex items-center gap-2 bg-[#D92B2E] hover:bg-[#b82124] text-white text-sm font-bold px-4 py-2.5 rounded-lg transition-colors shadow-sm"
        >
          <Plus size={16} /> Tambah Resep Baru
        </Link>
      </div>

      <RecipesTable recipes={recipes || []} />
    </div>
  )
}
