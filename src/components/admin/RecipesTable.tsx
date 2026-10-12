'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Recipe } from '@/types/database'
import { Edit, Trash2, ExternalLink } from 'lucide-react'

export function RecipesTable({ recipes }: { recipes: any[] }) {
  const router = useRouter()
  const [list, setList] = useState(recipes)

  async function handleDelete(id: string) {
    if (!confirm('Apakah Anda yakin ingin menghapus resep ini?')) return
    const supabase = createClient()
    const { error } = await supabase.from('recipes').delete().eq('id', id)
    if (!error) {
      setList(list.filter((r) => r.id !== id))
      router.refresh()
    } else {
      alert('Gagal menghapus resep: ' + error.message)
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-xs">
      <div className="overflow-x-auto w-full">
        <table className="w-full text-left text-sm min-w-[700px]">
          <thead className="bg-gray-50/75 text-xs uppercase text-gray-500 font-semibold border-b border-gray-100">
            <tr>
              <th className="px-5 py-3.5">Foto</th>
              <th className="px-5 py-3.5">Judul Resep</th>
              <th className="px-5 py-3.5">Kategori</th>
              <th className="px-5 py-3.5">Waktu / Porsi</th>
              <th className="px-5 py-3.5">Produk Terkait</th>
              <th className="px-5 py-3.5 text-center">Status</th>
              <th className="px-5 py-3.5 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {list.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-gray-400">
                  Belum ada resep. Silakan klik tombol "Tambah Resep Baru".
                </td>
              </tr>
            ) : (
              list.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="w-11 h-11 rounded-xl overflow-hidden bg-gray-100 border border-gray-100 shrink-0">
                      <img
                        src={item.main_image || '/placeholder-recipe.jpg'}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="font-semibold text-[#0A1628] truncate max-w-[200px]">{item.title}</div>
                    <div className="text-[11px] text-gray-400">/recipes/{item.slug}</div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="inline-block bg-stone-100 text-stone-700 text-[11px] font-semibold px-2.5 py-1 rounded-full">
                      {item.category || 'Main Course'}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-xs text-gray-600">
                    <div className="font-medium text-gray-800">{item.prep_time || '15 MIN'}</div>
                    <div className="text-gray-400 text-[11px]">{item.servings || '4 Porsi'}</div>
                  </td>
                  <td className="px-5 py-3.5 text-xs text-gray-600">
                    {item.featured_product?.name || '—'}
                  </td>
                  <td className="px-5 py-3.5 text-center">
                    <span
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                        item.status === 'published'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/50'
                          : 'bg-amber-50 text-amber-700 border border-amber-200/50'
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Link
                        href={`/recipes/${item.slug}`}
                        target="_blank"
                        className="p-1.5 text-gray-400 hover:text-[#0A1628] hover:bg-gray-100 rounded-lg transition-colors"
                        title="Lihat Halaman"
                      >
                        <ExternalLink size={15} />
                      </Link>
                      <Link
                        href={`/admin/recipes/${item.id}/edit`}
                        className="p-1.5 text-gray-400 hover:text-[#C8102E] hover:bg-red-50 rounded-lg transition-colors"
                        title="Edit Resep"
                      >
                        <Edit size={15} />
                      </Link>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        title="Hapus Resep"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
