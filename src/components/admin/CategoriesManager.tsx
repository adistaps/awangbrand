'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Plus, Trash2, Pencil, Check, X } from 'lucide-react'
import type { Category } from '@/types/database'

export function CategoriesManager({ initialCategories }: { initialCategories: Category[] }) {
  const [categories, setCategories] = useState(initialCategories)
  const [newName, setNewName] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingName, setEditingName] = useState('')
  const [saving, setSaving] = useState(false)

  function slugify(text: string) {
    return text.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')
  }

  async function handleAdd() {
    if (!newName.trim()) return
    setSaving(true)
    const supabase = createClient()
    const { data, error } = await supabase
      .from('categories')
      .insert({ name: newName, slug: slugify(newName) })
      .select()
      .single()
    if (!error && data) {
      setCategories((c) => [...c, data].sort((a, b) => a.name.localeCompare(b.name)))
      setNewName('')
    }
    setSaving(false)
  }

  async function handleUpdate(id: string) {
    if (!editingName.trim()) return
    const supabase = createClient()
    await supabase.from('categories').update({ name: editingName, slug: slugify(editingName) }).eq('id', id)
    setCategories((c) => c.map((cat) => (cat.id === id ? { ...cat, name: editingName, slug: slugify(editingName) } : cat)))
    setEditingId(null)
  }

  async function handleDelete(id: string) {
    if (!confirm('Hapus kategori ini? Produk terkait tidak akan terhapus, hanya kehilangan kategori.')) return
    const supabase = createClient()
    await supabase.from('categories').delete().eq('id', id)
    setCategories((c) => c.filter((cat) => cat.id !== id))
  }

  return (
    <div className="bg-white rounded-2xl shadow-xs border border-gray-100 p-5 sm:p-6 max-w-xl">
      <div className="flex flex-col sm:flex-row gap-2.5 mb-6">
        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Nama kategori baru..."
          className="flex-1 px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#C8102E] transition-colors"
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
        />
        <button
          onClick={handleAdd}
          disabled={saving}
          className="inline-flex items-center justify-center gap-1.5 bg-[#C8102E] hover:bg-[#a00b22] text-white text-xs sm:text-sm font-bold px-5 py-2.5 rounded-xl transition-all shadow-xs active:scale-95 disabled:opacity-60 cursor-pointer shrink-0"
        >
          <Plus size={16} /> Tambah Kategori
        </button>
      </div>

      <div className="space-y-2">
        {categories.map((cat) => (
          <div key={cat.id} className="flex items-center justify-between border border-gray-100 bg-gray-50/40 rounded-xl px-4 py-3 hover:bg-gray-50 transition-colors">
            {editingId === cat.id ? (
              <input
                value={editingName}
                onChange={(e) => setEditingName(e.target.value)}
                className="flex-1 px-3 py-1.5 border border-[#C8102E] rounded-lg text-sm mr-2 focus:outline-none bg-white"
                autoFocus
              />
            ) : (
              <span className="text-sm font-semibold text-[#0A1628]">{cat.name}</span>
            )}
            <div className="flex items-center gap-2">
              {editingId === cat.id ? (
                <>
                  <button onClick={() => handleUpdate(cat.id)} className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" title="Simpan">
                    <Check size={16} />
                  </button>
                  <button onClick={() => setEditingId(null)} className="p-1.5 text-gray-400 hover:bg-gray-100 rounded-lg transition-colors" title="Batal">
                    <X size={16} />
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setEditingId(cat.id)
                      setEditingName(cat.name)
                    }}
                    className="p-1.5 text-gray-400 hover:text-[#C8102E] hover:bg-red-50 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <Pencil size={14} />
                  </button>
                  <button onClick={() => handleDelete(cat.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Hapus">
                    <Trash2 size={14} />
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
        {categories.length === 0 && <p className="text-sm text-gray-400 text-center py-6">Belum ada kategori.</p>}
      </div>
    </div>
  )
}
