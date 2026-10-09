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
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-600">
          <thead className="bg-gray-50 text-xs uppercase text-gray-500 font-bold border-b border-gray-200">
            <tr>
              <th className="px-6 py-4">Foto</th>
              <th className="px-6 py-4">Judul Resep</th>
              <th className="px-6 py-4">Kategori</th>
              <th className="px-6 py-4">Waktu / Porsi</th>
              <th className="px-6 py-4">Produk Terkait</th>
              <th className="px-6 py-4 text-center">Status</th>
              <th className="px-6 py-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {list.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-gray-400">
                  Belum ada resep. Silakan klik tombol "Tambah Resep Baru".
                </td>
              </tr>
            ) : (
              list.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50/80 transition-colors">
                  <td className="px-6 py-4">
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                      <img
                        src={item.main_image || '/placeholder-recipe.jpg'}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-gray-900">{item.title}</div>
                    <div className="text-xs text-gray-400">/recipes/{item.slug}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-block bg-stone-100 text-stone-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                      {item.category || 'Main Course'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs font-medium text-gray-600">
                    <div>{item.prep_time || '15 MIN'}</div>
                    <div className="text-gray-400">{item.servings || '4 Porsi'}</div>
                  </td>
                  <td className="px-6 py-4 text-xs text-gray-600">
                    {item.featured_product?.name || '-'}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase ${
                        item.status === 'published'
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/recipes/${item.slug}`}
                        target="_blank"
                        className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                        title="Lihat Halaman"
                      >
                        <ExternalLink size={16} />
                      </Link>
                      <Link
                        href={`/admin/recipes/${item.id}/edit`}
                        className="p-2 text-blue-600 hover:text-blue-800 transition-colors"
                        title="Edit Resep"
                      >
                        <Edit size={16} />
                      </Link>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-2 text-red-500 hover:text-red-700 transition-colors cursor-pointer"
                        title="Hapus Resep"
                      >
                        <Trash2 size={16} />
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
