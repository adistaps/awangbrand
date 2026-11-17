'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Edit, Trash2, ExternalLink, Star } from 'lucide-react'

export function RecipesTable({ recipes }: { recipes: any[] }) {
  const router = useRouter()
  const [list, setList] = useState(recipes)
  const [busy, setBusy] = useState(false)

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

  async function handleToggleFeatured(id: string, currentFeatured: boolean) {
    if (!currentFeatured) {
      const currentCount = list.filter((r) => r.is_featured).length
      if (currentCount >= 4) {
        alert(
          'Maksimal 4 resep untuk section "TASTE THE HEAT" (Featured Grid). Silakan nonaktifkan resep lain terlebih dahulu!'
        )
        return
      }
    }
    setBusy(true)
    const supabase = createClient()
    const { error } = await supabase
      .from('recipes')
      .update({ is_featured: !currentFeatured })
      .eq('id', id)
    if (!error) {
      setList((prev) =>
        prev.map((r) => (r.id === id ? { ...r, is_featured: !currentFeatured } : r))
      )
    } else {
      alert('Gagal mengubah status featured: ' + error.message)
    }
    setBusy(false)
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-xs">
      <div className="overflow-x-auto w-full">
        <table className="w-full text-left text-sm min-w-[800px]">
          <thead className="bg-gray-50/75 text-xs uppercase text-gray-500 font-semibold border-b border-gray-100">
            <tr>
              <th className="px-5 py-3.5">Foto</th>
              <th className="px-5 py-3.5">Judul Resep</th>
              <th className="px-5 py-3.5">Kategori</th>
              <th className="px-5 py-3.5">Waktu / Porsi</th>
              <th className="px-5 py-3.5">Produk Terkait</th>
              <th className="px-5 py-3.5 text-center whitespace-nowrap">Homepage</th>
              <th className="px-5 py-3.5 text-center">Status</th>
              <th className="px-5 py-3.5 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {list.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-6 py-12 text-center text-gray-400">
                  Belum ada resep. Silakan klik tombol &quot;Tambah Resep Baru&quot;.
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

                  {/* Toggle Featured */}
                  <td className="px-5 py-3.5 text-center">
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => handleToggleFeatured(item.id, item.is_featured)}
                      title={
                        item.is_featured
                          ? "Keluarkan dari section 'Taste The Heat' (Featured Grid)"
                          : "Tampilkan di section 'Taste The Heat' (Featured Grid)"
                      }
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all cursor-pointer whitespace-nowrap shrink-0 disabled:opacity-50 ${
                        item.is_featured
                          ? 'bg-red-50 border-red-200 text-[#CC0000] hover:bg-red-100 shadow-xs'
                          : 'bg-gray-50 border-gray-200 text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Star
                        size={12}
                        className={item.is_featured ? 'text-[#CC0000] fill-[#CC0000]' : 'text-gray-400'}
                      />
                      <span>Taste Heat: {item.is_featured ? 'On' : 'Off'}</span>
                    </button>
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
                        className="p-1.5 text-gray-400 hover:text-[#CC0000] hover:bg-red-50 rounded-lg transition-colors"
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
