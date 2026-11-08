'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Plus, Trash2, X, Check, Save } from 'lucide-react'
import { ImageUploader } from './ImageUploader'
import type { Brand } from '@/types/database'

export function BrandsManager({
  initialBrands,
  initialProductDetailBrandIds = [],
}: {
  initialBrands: Brand[]
  initialProductDetailBrandIds?: string[]
}) {
  const [items, setItems] = useState(initialBrands)
  const [productDetailIds, setProductDetailIds] = useState<string[]>(initialProductDetailBrandIds)
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState({ name: '', logo_url: '' as string | null })
  const [saving, setSaving] = useState(false)
  const [savingSettings, setSavingSettings] = useState(false)
  const [settingsSaved, setSettingsSaved] = useState(false)

  async function handleAdd() {
    if (!form.name.trim()) return
    setSaving(true)
    const supabase = createClient()
    const { data } = await supabase
      .from('brands')
      .insert({ name: form.name, logo_url: form.logo_url, sort_order: items.length })
      .select()
      .single()
    if (data) {
      setItems((it) => [...it, data])
      // Default aktifkan juga di detail produk
      setProductDetailIds((prev) => [...prev, data.id])
    }
    setSaving(false)
    setModalOpen(false)
    setForm({ name: '', logo_url: null })
  }

  async function toggleActive(b: Brand) {
    const supabase = createClient()
    await supabase.from('brands').update({ is_active: !b.is_active }).eq('id', b.id)
    setItems((it) => it.map((i) => (i.id === b.id ? { ...i, is_active: !i.is_active } : i)))
  }

  async function toggleProductDetail(brandId: string) {
    const next = productDetailIds.includes(brandId)
      ? productDetailIds.filter((id) => id !== brandId)
      : [...productDetailIds, brandId]

    setProductDetailIds(next)
    setSettingsSaved(false)

    // Langsung auto-save ke site_settings
    setSavingSettings(true)
    const supabase = createClient()
    await supabase.from('site_settings').upsert(
      {
        key: 'product_detail_brand_ids',
        value: JSON.stringify(next),
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'key' }
    )
    setSavingSettings(false)
    setSettingsSaved(true)
    setTimeout(() => setSettingsSaved(false), 2500)
  }

  async function handleDelete(id: string) {
    if (!confirm('Hapus brand ini?')) return
    const supabase = createClient()
    await supabase.from('brands').delete().eq('id', id)
    setItems((it) => it.filter((i) => i.id !== id))
    setProductDetailIds((prev) => prev.filter((item) => item !== id))
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#0A1628]">Kelola Brand & Mitra</h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Atur brand/mitra yang aktif, serta pilih logo mana saja yang ditampilkan di halaman detail produk.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {settingsSaved && (
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg flex items-center gap-1.5 animate-fadeIn">
              <Check size={14} /> Pengaturan Tersimpan
            </span>
          )}
          <button
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-2 bg-[#CC0000] hover:bg-[#a00b22] text-white text-xs sm:text-sm font-bold px-4 sm:px-5 py-2.5 rounded-xl transition-all shadow-xs active:scale-95 cursor-pointer shrink-0"
          >
            <Plus size={16} /> Tambah Brand
          </button>
        </div>
      </div>

      {/* Petunjuk checklist detail produk */}
      <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4 mb-6 text-xs text-amber-900 flex items-start gap-3">
        <span className="text-base">💡</span>
        <div className="leading-relaxed">
          <strong>Centang &quot;Tampil di Detail Produk&quot;</strong> pada logo yang ingin ditampilkan di bagian <em>&quot;Tersedia di&quot;</em> pada halaman detail produk (`/products/[slug]`). Logo yang tidak dicentang hanya akan muncul di bagian <em>&quot;Available at Leading Stores&quot;</em> di Homepage.
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {items.map((b) => {
          const isShownInProductDetail = productDetailIds.includes(b.id)
          return (
            <div
              key={b.id}
              className={`bg-white rounded-2xl shadow-xs border p-4 flex flex-col items-center text-center hover:shadow-md transition-all ${
                isShownInProductDetail ? 'border-red-200 bg-red-50/10' : 'border-gray-100'
              }`}
            >
              {b.logo_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={b.logo_url} alt={b.name} className="w-20 h-14 object-contain mb-3" />
              ) : (
                <div className="w-20 h-14 bg-gray-50 rounded-xl mb-3 flex items-center justify-center text-gray-300 text-xs">
                  No Logo
                </div>
              )}

              <p className="text-sm font-bold text-[#0A1628] mb-3 truncate max-w-full">{b.name}</p>

              {/* Checklist Pengaturan */}
              <div className="w-full pt-3 border-t border-gray-100 mt-auto flex flex-col gap-2">
                {/* 1. Status Aktif */}
                <label className="flex items-center justify-between text-xs font-semibold text-gray-700 cursor-pointer bg-stone-50 hover:bg-stone-100 px-2.5 py-1.5 rounded-lg transition-colors">
                  <span>Aktif (Homepage)</span>
                  <input
                    type="checkbox"
                    checked={b.is_active}
                    onChange={() => toggleActive(b)}
                    className="accent-[#CC0000] rounded w-4 h-4 cursor-pointer"
                  />
                </label>

                {/* 2. Tampil di Detail Produk */}
                <label
                  className={`flex items-center justify-between text-xs font-bold px-2.5 py-1.5 rounded-lg cursor-pointer transition-colors ${
                    isShownInProductDetail
                      ? 'bg-red-50 text-[#CC0000]'
                      : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                  }`}
                  title="Tampilkan logo ini pada section 'Tersedia di' di halaman detail produk"
                >
                  <span>Detail Produk</span>
                  <input
                    type="checkbox"
                    checked={isShownInProductDetail}
                    onChange={() => toggleProductDetail(b.id)}
                    className="accent-[#CC0000] rounded w-4 h-4 cursor-pointer"
                  />
                </label>

                {/* Tombol Hapus */}
                <div className="flex justify-end pt-1">
                  <button
                    onClick={() => handleDelete(b.id)}
                    className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                    title="Hapus"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
          )
        })}
        {items.length === 0 && (
          <p className="col-span-full text-sm text-gray-400 text-center py-8">Belum ada brand.</p>
        )}
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
