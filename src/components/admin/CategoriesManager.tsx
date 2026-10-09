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
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 max-w-xl">
      <div className="flex gap-2 mb-6">
        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Nama kategori baru..."
          className="flex-1 px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#F5A200]"
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
        />
        <button
          onClick={handleAdd}
          disabled={saving}
          className="flex items-center gap-1.5 bg-[#F5A200] hover:bg-[#D98B00] text-white text-sm font-bold px-4 rounded-lg transition-colors disabled:opacity-60"
        >
          <Plus size={16} /> Tambah
        </button>
      </div>

      <div className="space-y-2">
        {categories.map((cat) => (
          <div key={cat.id} className="flex items-center justify-between border border-gray-100 rounded-lg px-4 py-2.5">
            {editingId === cat.id ? (
              <input
                value={editingName}
                onChange={(e) => setEditingName(e.target.value)}
                className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm mr-2 focus:outline-none focus:border-[#F5A200]"
                autoFocus
              />
            ) : (
              <span className="text-sm font-medium text-[#0A1628]">{cat.name}</span>
            )}
            <div className="flex items-center gap-3">
              {editingId === cat.id ? (
                <>
                  <button onClick={() => handleUpdate(cat.id)} className="text-emerald-500 hover:text-emerald-700">
                    <Check size={16} />
                  </button>
                  <button onClick={() => setEditingId(null)} className="text-gray-400 hover:text-gray-600">
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
                    className="text-gray-400 hover:text-[#F5A200]"
                  >
                    <Pencil size={14} />
                  </button>
                  <button onClick={() => handleDelete(cat.id)} className="text-gray-400 hover:text-red-500">
                    <Trash2 size={14} />
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
        {categories.length === 0 && <p className="text-sm text-gray-400 text-center py-4">Belum ada kategori.</p>}
      </div>
    </div>
  )
}
