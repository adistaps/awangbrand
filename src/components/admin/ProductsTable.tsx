'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Pencil, Trash2, ExternalLink, Search, Star, Check, Minus } from 'lucide-react'
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

  async function handleToggleFeatured(id: string, currentFeatured: boolean) {
    if (!currentFeatured) {
      const currentCount = products.filter((p) => p.is_featured).length
      if (currentCount >= 4) {
        alert('Maksimal 4 produk untuk section "TASTE THE HEAT" (Featured Grid). Silakan nonaktifkan produk lain terlebih dahulu!')
        return
      }
    }
    setBusy(true)
    const supabase = createClient()
    await supabase.from('products').update({ is_featured: !currentFeatured }).eq('id', id)
    setBusy(false)
    window.location.reload()
  }

  const isAllSelected = selected.length === filtered.length && filtered.length > 0
  const isPartiallySelected = selected.length > 0 && selected.length < filtered.length

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
        <div className="px-4 py-3 bg-red-50/70 border-b border-red-100 flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm">
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="inline-flex items-center justify-center bg-[#C8102E] text-white font-bold px-2 py-0.5 rounded-full text-xs">
              {selected.length}
            </span>
            <span className="font-semibold text-gray-800">produk dipilih</span>
            <span className="text-gray-300">|</span>
            <button
              onClick={() => setSelected([])}
              type="button"
              className="text-gray-600 hover:text-gray-900 font-medium underline underline-offset-2 hover:bg-white/80 px-2 py-1 rounded-lg transition-colors cursor-pointer"
            >
              Batalkan pilihan
            </button>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => handleBulkStatus('published')}
              disabled={busy}
              className="px-3 py-1.5 bg-white border border-emerald-200 text-emerald-700 hover:bg-emerald-50 rounded-lg font-semibold shadow-xs transition-colors cursor-pointer disabled:opacity-50"
            >
              Publish
            </button>
            <button
              onClick={() => handleBulkStatus('draft')}
              disabled={busy}
              className="px-3 py-1.5 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-lg font-semibold shadow-xs transition-colors cursor-pointer disabled:opacity-50"
            >
              Jadikan Draft
            </button>
            <button
              onClick={handleBulkDelete}
              disabled={busy}
              className="px-3 py-1.5 bg-[#C8102E] text-white hover:bg-[#a60c24] rounded-lg font-semibold shadow-xs transition-colors cursor-pointer disabled:opacity-50"
            >
              Hapus Terpilih
            </button>
          </div>
        </div>
      )}

      <div className="overflow-x-auto w-full">
        <table className="w-full text-sm min-w-[620px]">
          <thead className="bg-gray-50/75 text-gray-500 text-xs uppercase border-b border-gray-100">
            <tr>
              <th className="p-3.5 text-left w-12">
                <label className="flex items-center cursor-pointer select-none" title={isAllSelected ? "Batalkan semua" : "Pilih semua"}>
                  <div className="relative flex items-center justify-center shrink-0">
                    <input
                      type="checkbox"
                      checked={isAllSelected}
                      onChange={toggleSelectAll}
                      className="sr-only peer"
                    />
                    <div className="w-5 h-5 rounded-full border-2 border-[#C8102E] bg-white transition-all flex items-center justify-center shadow-xs peer-focus-visible:ring-2 peer-focus-visible:ring-[#C8102E]/30 peer-checked:border-emerald-600">
                      {isPartiallySelected ? (
                        <Minus size={12} strokeWidth={3} className="text-emerald-600" />
                      ) : (
                        <Check
                          size={12}
                          strokeWidth={3}
                          className={`text-emerald-600 transition-transform duration-150 ${
                            isAllSelected ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
                          }`}
                        />
                      )}
                    </div>
                  </div>
                </label>
              </th>
              <th className="p-3.5 text-left">Produk</th>
              <th className="p-3.5 text-left">Kategori</th>
              <th className="p-3.5 text-left">Status</th>
              <th className="p-3.5 text-left whitespace-nowrap">Homepage Display</th>
              <th className="p-3.5 text-right whitespace-nowrap">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.map((p) => {
              const isChecked = selected.includes(p.id)
              return (
                <tr
                  key={p.id}
                  className={`transition-colors ${isChecked ? 'bg-red-50/30' : 'hover:bg-slate-50/60'}`}
                >
                  <td className="p-3.5">
                    <label className="flex items-center cursor-pointer select-none">
                      <div className="relative flex items-center justify-center shrink-0">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleSelect(p.id)}
                          className="sr-only peer"
                        />
                        <div className="w-5 h-5 rounded-full border-2 border-[#C8102E] bg-white transition-all flex items-center justify-center shadow-xs peer-focus-visible:ring-2 peer-focus-visible:ring-[#C8102E]/30 peer-checked:border-emerald-600">
                          <Check
                            size={12}
                            strokeWidth={3}
                            className={`text-emerald-600 transition-transform duration-150 ${
                              isChecked ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
                            }`}
                          />
                        </div>
                      </div>
                    </label>
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
                  <td className="p-3.5 whitespace-nowrap text-center">
                    {/* Toggle Taste The Heat */}
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => handleToggleFeatured(p.id, p.is_featured)}
                      title={
                        p.is_featured
                          ? "Keluarkan dari section 'Taste The Heat' (Featured Grid)"
                          : "Tampilkan di section 'Taste The Heat' (Featured Grid)"
                      }
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                        p.is_featured
                          ? 'bg-red-50 border-red-200 text-[#C8102E] hover:bg-red-100 shadow-xs'
                          : 'bg-gray-50 border-gray-200 text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Star
                        size={12}
                        className={p.is_featured ? 'text-[#C8102E] fill-[#C8102E]' : 'text-gray-400'}
                      />
                      <span>Taste Heat: {p.is_featured ? 'On' : 'Off'}</span>
                    </button>
                  </td>
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
              )
            })}
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
