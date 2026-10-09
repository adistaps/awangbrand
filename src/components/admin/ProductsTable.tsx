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
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-4 border-b border-gray-100 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            placeholder="Cari produk..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#F5A200]"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none"
        >
          <option value="">Semua Status</option>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none"
        >
          <option value="">Semua Kategori</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {selected.length > 0 && (
        <div className="px-4 py-2.5 bg-amber-50 border-b border-amber-100 flex items-center gap-3 text-sm">
          <span className="font-semibold text-amber-700">{selected.length} dipilih</span>
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

      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
          <tr>
            <th className="p-3 text-left w-8">
              <input type="checkbox" checked={selected.length === filtered.length && filtered.length > 0} onChange={toggleSelectAll} />
            </th>
            <th className="p-3 text-left">Produk</th>
            <th className="p-3 text-left">Kategori</th>
            <th className="p-3 text-left">Status</th>
            <th className="p-3 text-left">Featured</th>
            <th className="p-3 text-right">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((p) => (
            <tr key={p.id} className="border-t border-gray-50 hover:bg-gray-50/50">
              <td className="p-3">
                <input type="checkbox" checked={selected.includes(p.id)} onChange={() => toggleSelect(p.id)} />
              </td>
              <td className="p-3">
                <div className="flex items-center gap-3">
                  {p.main_image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.main_image} alt={p.name} className="w-10 h-10 rounded-lg object-cover border border-gray-100" />
                  ) : (
                    <div className="w-10 h-10 rounded-lg bg-gray-100" />
                  )}
                  <span className="font-semibold text-[#0A1628]">{p.name}</span>
                </div>
              </td>
              <td className="p-3 text-gray-500">{p.category?.name || '-'}</td>
              <td className="p-3">
                <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${p.status === 'published' ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-500'}`}>
                  {p.status}
                </span>
              </td>
              <td className="p-3">{p.is_featured && <Star size={16} className="text-[#F5A200] fill-[#F5A200]" />}</td>
              <td className="p-3">
                <div className="flex items-center justify-end gap-3">
                  <Link href={`/products/${p.slug}`} target="_blank" className="text-gray-400 hover:text-[#0A1628]">
                    <ExternalLink size={16} />
                  </Link>
                  <Link href={`/admin/products/${p.id}/edit`} className="text-gray-400 hover:text-[#F5A200]">
                    <Pencil size={16} />
                  </Link>
                  <button onClick={() => handleDelete(p.id)} className="text-gray-400 hover:text-red-500">
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
          {filtered.length === 0 && (
            <tr>
              <td colSpan={7} className="p-8 text-center text-gray-400 text-sm">
                Tidak ada produk ditemukan.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
