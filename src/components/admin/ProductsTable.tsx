'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Pencil, Trash2, ExternalLink, Search, Star } from 'lucide-react'
import type { Product, Category } from '@/types/database'

export function ProductsTable({
  products,
  categories,
}: {
  products: (Product & { category: { id: string; name: string } | null })[]
  categories: Category[]
}) {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [selected, setSelected] = useState<string[]>([])
  const [busy, setBusy] = useState(false)

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase())
      const matchStatus = !statusFilter || p.status === statusFilter
      const matchCategory = !categoryFilter || p.category_id === categoryFilter
      return matchSearch && matchStatus && matchCategory
    })
  }, [products, search, statusFilter, categoryFilter])

  function toggleSelect(id: string) {
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]))
  }

  function toggleSelectAll() {
    setSelected(selected.length === filtered.length ? [] : filtered.map((p) => p.id))
  }

  async function handleDelete(id: string) {
    if (!confirm('Hapus produk ini? Foto galeri & spesifikasi juga akan terhapus.')) return
    setBusy(true)
    const supabase = createClient()
    await supabase.from('products').delete().eq('id', id)
    setBusy(false)
    window.location.reload()
  }

  async function handleBulkStatus(status: 'draft' | 'published') {
    setBusy(true)
    const supabase = createClient()
    await supabase.from('products').update({ status }).in('id', selected)
    setBusy(false)
    window.location.reload()
  }

  async function handleBulkDelete() {
    if (!confirm(`Hapus ${selected.length} produk terpilih?`)) return
    setBusy(true)
    const supabase = createClient()
    await supabase.from('products').delete().in('id', selected)
    setBusy(false)
    window.location.reload()
  }

  return (
    <div className="bg-white rounded-2xl shadow-xs border border-gray-100 overflow-hidden">
      <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-3 sm:items-center">
        <div className="relative flex-1 min-w-0">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            placeholder="Cari produk..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#C8102E] transition-colors"
          />
        </div>
        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="flex-1 sm:flex-initial px-3 py-2 border border-gray-200 rounded-xl text-xs sm:text-sm bg-white focus:outline-none focus:border-[#C8102E]"
          >
            <option value="">Semua Status</option>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="flex-1 sm:flex-initial px-3 py-2 border border-gray-200 rounded-xl text-xs sm:text-sm bg-white focus:outline-none focus:border-[#C8102E]"
          >
            <option value="">Semua Kategori</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {selected.length > 0 && (
        <div className="px-4 py-2.5 bg-red-50/60 border-b border-red-100 flex items-center gap-3 text-xs sm:text-sm">
          <span className="font-semibold text-[#C8102E]">{selected.length} dipilih</span>
          <button onClick={() => handleBulkStatus('published')} disabled={busy} className="text-emerald-600 font-semibold hover:underline">
            Publish
          </button>
          <button onClick={() => handleBulkStatus('draft')} disabled={busy} className="text-gray-600 font-semibold hover:underline">
            Jadikan Draft
          </button>
          <button onClick={handleBulkDelete} disabled={busy} className="text-red-600 font-semibold hover:underline">
            Hapus
          </button>
        </div>
      )}

      <div className="overflow-x-auto w-full">
        <table className="w-full text-sm min-w-[620px]">
          <thead className="bg-gray-50/75 text-gray-500 text-xs uppercase border-b border-gray-100">
            <tr>
              <th className="p-3.5 text-left w-10">
                <input type="checkbox" checked={selected.length === filtered.length && filtered.length > 0} onChange={toggleSelectAll} className="accent-[#C8102E] rounded" />
              </th>
              <th className="p-3.5 text-left">Produk</th>
              <th className="p-3.5 text-left">Kategori</th>
              <th className="p-3.5 text-left">Status</th>
              <th className="p-3.5 text-left">Featured</th>
              <th className="p-3.5 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.map((p) => (
              <tr key={p.id} className="hover:bg-slate-50/60 transition-colors">
                <td className="p-3.5">
                  <input type="checkbox" checked={selected.includes(p.id)} onChange={() => toggleSelect(p.id)} className="accent-[#C8102E] rounded" />
                </td>
                <td className="p-3.5">
                  <div className="flex items-center gap-3">
                    {p.main_image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={p.main_image} alt={p.name} className="w-10 h-10 rounded-xl object-cover border border-gray-100 shrink-0" />
                    ) : (
                      <div className="w-10 h-10 rounded-xl bg-gray-100 shrink-0" />
                    )}
                    <div className="min-w-0">
                      <span className="font-semibold text-[#0A1628] block truncate max-w-[220px] sm:max-w-xs">{p.name}</span>
                      <span className="text-[11px] text-gray-400 block truncate">/{p.slug}</span>
                    </div>
                  </div>
                </td>
                <td className="p-3.5 text-gray-600 text-xs font-medium">{p.category?.name || '—'}</td>
                <td className="p-3.5">
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${p.status === 'published' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/50' : 'bg-gray-100 text-gray-500'}`}>
                    {p.status}
                  </span>
                </td>
                <td className="p-3.5">{p.is_featured && <Star size={16} className="text-amber-500 fill-amber-500" />}</td>
                <td className="p-3.5">
                  <div className="flex items-center justify-end gap-1.5">
                    <Link href={`/products/${p.slug}`} target="_blank" className="p-1.5 rounded-lg text-gray-400 hover:text-[#0A1628] hover:bg-gray-100 transition-colors" title="Lihat di Web">
                      <ExternalLink size={15} />
                    </Link>
                    <Link href={`/admin/products/${p.id}/edit`} className="p-1.5 rounded-lg text-gray-400 hover:text-[#C8102E] hover:bg-red-50 transition-colors" title="Edit">
                      <Pencil size={15} />
                    </Link>
                    <button onClick={() => handleDelete(p.id)} className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer" title="Hapus">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-gray-400 text-sm">
                  Tidak ada produk ditemukan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
