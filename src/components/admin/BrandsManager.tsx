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
      <button
        onClick={() => setModalOpen(true)}
        className="flex items-center gap-2 bg-[#F5A200] hover:bg-[#D98B00] text-white text-sm font-bold px-4 py-2.5 rounded-lg transition-colors mb-6"
      >
        <Plus size={16} /> Tambah Brand
      </button>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {items.map((b) => (
          <div key={b.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex flex-col items-center text-center">
            {b.logo_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={b.logo_url} alt={b.name} className="w-16 h-16 object-contain mb-2" />
            ) : (
              <div className="w-16 h-16 bg-gray-100 rounded-lg mb-2" />
            )}
            <p className="text-sm font-semibold text-[#0A1628] mb-2">{b.name}</p>
            <label className="flex items-center gap-1.5 text-[10px] font-semibold text-gray-500 mb-2">
              <input type="checkbox" checked={b.is_active} onChange={() => toggleActive(b)} className="accent-[#F5A200]" />
              Aktif
            </label>
            <button onClick={() => handleDelete(b.id)} className="text-gray-400 hover:text-red-500">
              <Trash2 size={14} />
            </button>
          </div>
        ))}
        {items.length === 0 && <p className="text-sm text-gray-400">Belum ada brand.</p>}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm">
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#F5A200]"
                />
              </div>
              <button
                onClick={handleAdd}
                disabled={saving}
                className="w-full bg-[#F5A200] hover:bg-[#D98B00] text-white font-bold text-sm py-2.5 rounded-lg transition-colors disabled:opacity-60"
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
