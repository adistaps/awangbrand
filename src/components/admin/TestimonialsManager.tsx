'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Plus, Trash2, Pencil, X } from 'lucide-react'
import { ImageUploader } from './ImageUploader'
import type { Testimonial } from '@/types/database'

export function TestimonialsManager({ initialTestimonials }: { initialTestimonials: Testimonial[] }) {
  const [items, setItems] = useState(initialTestimonials)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Testimonial | null>(null)
  const [form, setForm] = useState({ quote: '', author: '', role: '', image_url: '' as string | null })
  const [saving, setSaving] = useState(false)

  function openNew() {
    setEditing(null)
    setForm({ quote: '', author: '', role: '', image_url: null })
    setModalOpen(true)
  }

  function openEdit(t: Testimonial) {
    setEditing(t)
    setForm({ quote: t.quote || t.content || '', author: t.author || t.name || '', role: t.role || '', image_url: t.image_url ?? null })
    setModalOpen(true)
  }

  async function handleSave() {
    setSaving(true)
    const supabase = createClient()
    if (editing) {
      const { data } = await supabase
        .from('testimonials')
        .update({ quote: form.quote, author: form.author, role: form.role, image_url: form.image_url })
        .eq('id', editing.id)
        .select()
        .single()
      if (data) setItems((it) => it.map((i) => (i.id === editing.id ? data : i)))
    } else {
      const { data } = await supabase
        .from('testimonials')
        .insert({ quote: form.quote, author: form.author, role: form.role, image_url: form.image_url, sort_order: items.length })
        .select()
        .single()
      if (data) setItems((it) => [...it, data])
    }
    setSaving(false)
    setModalOpen(false)
  }

  async function toggleActive(t: Testimonial) {
    const supabase = createClient()
    await supabase.from('testimonials').update({ is_active: !t.is_active }).eq('id', t.id)
    setItems((it) => it.map((i) => (i.id === t.id ? { ...i, is_active: !i.is_active } : i)))
  }

  async function handleDelete(id: string) {
    if (!confirm('Hapus testimoni ini?')) return
    const supabase = createClient()
    await supabase.from('testimonials').delete().eq('id', id)
    setItems((it) => it.filter((i) => i.id !== id))
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#0A1628]">Kelola Testimoni</h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">Ulasan dan rekomendasi dari pelanggan / chef</p>
        </div>
        <button
          onClick={openNew}
          className="inline-flex items-center gap-2 bg-[#CC0000] hover:bg-[#a00b22] !text-white text-xs sm:text-sm font-bold px-4 sm:px-5 py-2.5 rounded-xl transition-all shadow-xs active:scale-95 cursor-pointer shrink-0"
        >
          <Plus size={16} className="!text-white" />
          <span className="!text-white text-white">Tambah Testimoni</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((t) => (
          <div key={t.id} className="bg-white rounded-2xl shadow-xs border border-gray-100 p-5 hover:shadow-md transition-all">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                {t.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={t.image_url} alt={t.author} className="w-11 h-11 rounded-full object-cover border border-gray-100" />
                ) : (
                  <div className="w-11 h-11 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-400 text-xs">
                    {(t.author || 'A').charAt(0)}
                  </div>
                )}
                <div>
                  <p className="font-bold text-sm text-[#0A1628]">{t.author}</p>
                  <p className="text-xs text-gray-400">{t.role}</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => openEdit(t)} className="p-1.5 text-gray-400 hover:text-[#CC0000] hover:bg-red-50 rounded-lg transition-colors" title="Edit">
                  <Pencil size={14} />
                </button>
                <button onClick={() => handleDelete(t.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Hapus">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
            <p className="text-sm text-gray-600 italic line-clamp-3 bg-gray-50/50 p-3 rounded-xl border border-gray-50">&ldquo;{t.quote}&rdquo;</p>
            <label className="flex items-center gap-2 text-xs font-semibold text-gray-500 mt-3 cursor-pointer">
              <input type="checkbox" checked={t.is_active} onChange={() => toggleActive(t)} className="accent-[#CC0000] rounded" />
              Aktif (tampil di homepage)
            </label>
          </div>
        ))}
        {items.length === 0 && <p className="col-span-full text-sm text-gray-400 text-center py-8">Belum ada testimoni.</p>}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-[#0A1628] text-base">{editing ? 'Edit Testimoni' : 'Tambah Testimoni'}</h3>
              <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-gray-600 p-1 rounded-lg">
                <X size={18} />
              </button>
            </div>
            <div className="space-y-4">
              <ImageUploader
                bucket="testimonial-photos"
                value={form.image_url}
                onChange={(url) => setForm((f) => ({ ...f, image_url: url }))}
                label="Foto Profil"
              />
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1 block">Quote Testimoni</label>
                <textarea
                  rows={3}
                  value={form.quote}
                  onChange={(e) => setForm((f) => ({ ...f, quote: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-[#CC0000]"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1 block">Nama Pelanggan/Chef</label>
                <input
                  value={form.author}
                  onChange={(e) => setForm((f) => ({ ...f, author: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-[#CC0000]"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1 block">Jabatan / Role</label>
                <input
                  value={form.role}
                  onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
                  placeholder="cth: Ibu Rumah Tangga / Chef Eksekutif"
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-[#CC0000]"
                />
              </div>
              <button
                onClick={handleSave}
                disabled={saving}
                className="w-full bg-[#CC0000] hover:bg-[#a00b22] !text-white font-bold text-sm py-3 rounded-xl transition-all shadow-sm active:scale-95 disabled:opacity-60 cursor-pointer"
              >
                <span className="!text-white text-white">{saving ? 'Menyimpan...' : 'Simpan'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
