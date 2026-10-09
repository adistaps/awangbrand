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
    setForm({ quote: t.quote, author: t.author, role: t.role || '', image_url: t.image_url })
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
      <button
        onClick={openNew}
        className="flex items-center gap-2 bg-[#F5A200] hover:bg-[#D98B00] text-white text-sm font-bold px-4 py-2.5 rounded-lg transition-colors mb-6"
      >
        <Plus size={16} /> Tambah Testimoni
      </button>

      <div className="grid md:grid-cols-2 gap-4">
        {items.map((t) => (
          <div key={t.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                {t.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={t.image_url} alt={t.author} className="w-10 h-10 rounded-full object-cover" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gray-100" />
                )}
                <div>
                  <p className="font-bold text-sm text-[#0A1628]">{t.author}</p>
                  <p className="text-xs text-gray-500">{t.role}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => openEdit(t)} className="text-gray-400 hover:text-[#F5A200]">
                  <Pencil size={14} />
                </button>
                <button onClick={() => handleDelete(t.id)} className="text-gray-400 hover:text-red-500">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
            <p className="text-sm text-gray-600 italic line-clamp-3">&ldquo;{t.quote}&rdquo;</p>
            <label className="flex items-center gap-2 text-xs font-semibold text-gray-500 mt-3">
              <input type="checkbox" checked={t.is_active} onChange={() => toggleActive(t)} className="accent-[#F5A200]" />
              Aktif (tampil di homepage)
            </label>
          </div>
        ))}
        {items.length === 0 && <p className="text-sm text-gray-400">Belum ada testimoni.</p>}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-[#0A1628]">{editing ? 'Edit Testimoni' : 'Tambah Testimoni'}</h3>
              <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={18} />
              </button>
            </div>
            <div className="space-y-4">
              <ImageUploader
                bucket="testimonial-photos"
                value={form.image_url}
                onChange={(url) => setForm((f) => ({ ...f, image_url: url }))}
                label="Foto"
              />
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1 block">Quote</label>
                <textarea
                  rows={3}
                  value={form.quote}
                  onChange={(e) => setForm((f) => ({ ...f, quote: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#F5A200]"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1 block">Nama</label>
                <input
                  value={form.author}
                  onChange={(e) => setForm((f) => ({ ...f, author: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#F5A200]"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1 block">Jabatan/Role</label>
                <input
                  value={form.role}
                  onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#F5A200]"
                />
              </div>
              <button
                onClick={handleSave}
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
