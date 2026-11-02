'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Plus, Trash2, X } from 'lucide-react'
import { ImageUploader } from './ImageUploader'
import type { Brand } from '@/types/database'

export function BrandsManager({ initialBrands }: { initialBrands: Brand[] }) {
  const [items, setItems] = useState(initialBrands)
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState({ name: '', logo_url: '' as string | null })
  const [saving, setSaving] = useState(false)

  async function handleAdd() {
    if (!form.name.trim()) return
    setSaving(true)
    const supabase = createClient()
    const { data } = await supabase
      .from('brands')
      .insert({ name: form.name, logo_url: form.logo_url, sort_order: items.length })
      .select()
      .single()
    if (data) setItems((it) => [...it, data])
    setSaving(false)
    setModalOpen(false)
    setForm({ name: '', logo_url: null })
  }

  async function toggleActive(b: Brand) {
    const supabase = createClient()
    await supabase.from('brands').update({ is_active: !b.is_active }).eq('id', b.id)
    setItems((it) => it.map((i) => (i.id === b.id ? { ...i, is_active: !i.is_active } : i)))
  }

  async function handleDelete(id: string) {
    if (!confirm('Hapus brand ini?')) return
    const supabase = createClient()
    await supabase.from('brands').delete().eq('id', id)
    setItems((it) => it.filter((i) => i.id !== id))
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#0A1628]">Kelola Brand & Mitra</h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">Daftar logo brand rekanan / sertifikasi</p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-2 bg-[#CC0000] hover:bg-[#a00b22] text-white text-xs sm:text-sm font-bold px-4 sm:px-5 py-2.5 rounded-xl transition-all shadow-xs active:scale-95 cursor-pointer shrink-0"
        >
          <Plus size={16} /> Tambah Brand
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-4">
        {items.map((b) => (
          <div key={b.id} className="bg-white rounded-2xl shadow-xs border border-gray-100 p-4 flex flex-col items-center text-center hover:shadow-md transition-all">
            {b.logo_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={b.logo_url} alt={b.name} className="w-16 h-16 object-contain mb-3" />
            ) : (
              <div className="w-16 h-16 bg-gray-50 rounded-xl mb-3 flex items-center justify-center text-gray-300 text-xs">No Logo</div>
            )}
            <p className="text-sm font-bold text-[#0A1628] mb-2 truncate max-w-full">{b.name}</p>
            <div className="flex items-center justify-between w-full pt-2 border-t border-gray-50 mt-auto">
              <label className="flex items-center gap-1.5 text-[11px] font-semibold text-gray-500 cursor-pointer">
                <input type="checkbox" checked={b.is_active} onChange={() => toggleActive(b)} className="accent-[#CC0000] rounded" />
                Aktif
              </label>
              <button onClick={() => handleDelete(b.id)} className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer" title="Hapus">
                <Trash2 size={13} />
              </button>
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="col-span-full text-sm text-gray-400 text-center py-8">Belum ada brand.</p>}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-[#0A1628]">Tambah Brand</h3>
              <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={18} />
              </button>
            </div>
            <div className="space-y-4">
              <ImageUploader
                bucket="brand-logos"
                value={form.logo_url}
                onChange={(url) => setForm((f) => ({ ...f, logo_url: url }))}
                label="Logo"
              />
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1 block">Nama Brand</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#CC0000]"
                />
              </div>
              <button
                onClick={handleAdd}
                disabled={saving}
                className="w-full bg-[#CC0000] hover:bg-[#a00b22] text-white font-bold text-sm py-3 rounded-xl transition-all shadow-sm active:scale-95 disabled:opacity-60 cursor-pointer"
              >
                {saving ? 'Menyimpan...' : 'Simpan'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
