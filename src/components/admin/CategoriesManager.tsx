'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Plus, Trash2, Pencil, Check, X, Image as ImageIcon, Loader2 } from 'lucide-react'
import type { Category } from '@/types/database'

export function CategoriesManager({ initialCategories }: { initialCategories: Category[] }) {
  const [categories, setCategories] = useState(initialCategories)
  const [newName, setNewName] = useState('')
  const [newImage, setNewImage] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingName, setEditingName] = useState('')
  const [editingImage, setEditingImage] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [uploadingFor, setUploadingFor] = useState<string | null>(null) // 'new' | category.id

  function slugify(text: string) {
    return text.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')
  }

  async function uploadImageFile(file: File): Promise<string | null> {
    const supabase = createClient()
    const ext = file.name.split('.').pop()
    const fileName = `category-${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

    // Coba upload ke product-images, jika bucket belum dibuat fallback ke product-thumbnails
    let bucket = 'product-images'
    let { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(fileName, file, { cacheControl: '3600', upsert: false })

    if (uploadError && uploadError.message.toLowerCase().includes('bucket not found')) {
      bucket = 'product-thumbnails'
      const retry = await supabase.storage
        .from(bucket)
        .upload(fileName, file, { cacheControl: '3600', upsert: false })
      uploadError = retry.error
    }

    if (uploadError) {
      alert(
        'Upload gagal: ' +
          uploadError.message +
          '\n\nPastikan bucket storage "product-images" sudah dibuat di Supabase Storage Dashboard.'
      )
      return null
    }

    const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(fileName)
    return publicUrlData.publicUrl
  }

  async function handleAdd() {
    if (!newName.trim()) return
    setSaving(true)
    const supabase = createClient()
    const { data, error } = await supabase
      .from('categories')
      .insert({
        name: newName,
        slug: slugify(newName),
        image_url: newImage,
      })
      .select()
      .single()
    if (!error && data) {
      setCategories((c) => [...c, data].sort((a, b) => a.name.localeCompare(b.name)))
      setNewName('')
      setNewImage(null)
    } else if (error) {
      alert('Gagal menambah kategori: ' + error.message)
    }
    setSaving(false)
  }

  async function handleUpdate(id: string) {
    if (!editingName.trim()) return
    setSaving(true)
    const supabase = createClient()
    const { error } = await supabase
      .from('categories')
      .update({
        name: editingName,
        slug: slugify(editingName),
        image_url: editingImage,
      })
      .eq('id', id)

    if (!error) {
      setCategories((c) =>
        c.map((cat) =>
          cat.id === id
            ? { ...cat, name: editingName, slug: slugify(editingName), image_url: editingImage }
            : cat
        )
      )
      setEditingId(null)
    } else {
      alert('Gagal update kategori: ' + error.message)
    }
    setSaving(false)
  }

  async function handleDelete(id: string) {
    if (!confirm('Hapus kategori ini? Produk terkait tidak akan terhapus, hanya kehilangan kategori.'))
      return
    const supabase = createClient()
    await supabase.from('categories').delete().eq('id', id)
    setCategories((c) => c.filter((cat) => cat.id !== id))
  }

  return (
    <div className="bg-white rounded-2xl shadow-xs border border-gray-100 p-5 sm:p-6 max-w-2xl">
      {/* Form Tambah Kategori Baru */}
      <div className="border border-gray-200 rounded-2xl p-4 mb-6 bg-gray-50/50">
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
          Tambah Kategori Baru
        </h3>

        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center mb-3">
          {/* Upload / Preview Foto */}
          <div className="relative shrink-0">
            {newImage ? (
              <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-gray-200 group bg-white">
                <img src={newImage} alt="Preview" className="w-full h-full object-contain p-1" />
                <button
                  type="button"
                  onClick={() => setNewImage(null)}
                  className="absolute inset-0 bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Hapus foto"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <label
                className={`w-16 h-16 rounded-xl border-2 border-dashed border-gray-300 hover:border-[#C8102E] bg-white flex flex-col items-center justify-center cursor-pointer transition-colors ${
                  uploadingFor === 'new' ? 'opacity-50 pointer-events-none' : ''
                }`}
                title="Pilih Foto Kategori (PNG Transparan / Foto Produk)"
              >
                {uploadingFor === 'new' ? (
                  <Loader2 size={16} className="animate-spin text-gray-400" />
                ) : (
                  <>
                    <ImageIcon size={18} className="text-gray-400 mb-0.5" />
                    <span className="text-[9px] font-bold text-gray-400">Foto</span>
                  </>
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={async (e) => {
                    const f = e.target.files?.[0]
                    if (!f) return
                    setUploadingFor('new')
                    const url = await uploadImageFile(f)
                    if (url) setNewImage(url)
                    setUploadingFor(null)
                  }}
                />
              </label>
            )}
          </div>

          <div className="flex-1 w-full flex flex-col sm:flex-row gap-2">
            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Nama kategori baru (contoh: Pes Ramuan Asas)..."
              className="flex-1 px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#C8102E] transition-colors bg-white"
              onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            />
            <button
              onClick={handleAdd}
              disabled={saving || !newName.trim()}
              className="inline-flex items-center justify-center gap-1.5 bg-[#C8102E] hover:bg-[#a00b22] text-white text-xs sm:text-sm font-bold px-5 py-2.5 rounded-xl transition-all shadow-xs active:scale-95 disabled:opacity-50 cursor-pointer shrink-0"
            >
              <Plus size={16} /> Tambah
            </button>
          </div>
        </div>
        <p className="text-[11px] text-gray-400">
          💡 Foto kategori akan ditampilkan di carousel <strong>&quot;TEMUKAN PILIHANMU&quot;</strong> beranda dan sebagai filter foto di katalog produk. Gunakan gambar berformat PNG transparan untuk hasil terbaik.
        </p>
      </div>

      {/* Daftar Kategori */}
      <div className="space-y-2.5">
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
          Daftar Kategori ({categories.length})
        </h3>

        {categories.map((cat) => {
          const isEditing = editingId === cat.id

          return (
            <div
              key={cat.id}
              className={`flex items-center justify-between border rounded-xl p-3 transition-colors ${
                isEditing ? 'border-[#C8102E] bg-red-50/20' : 'border-gray-100 bg-gray-50/40 hover:bg-gray-50'
              }`}
            >
              {/* Sisi Kiri: Foto + Nama */}
              <div className="flex items-center gap-3 flex-1 min-w-0 mr-3">
                {/* Thumbnail / Upload Foto Kategori */}
                {isEditing ? (
                  <div className="relative shrink-0">
                    {editingImage ? (
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-gray-200 group bg-white">
                        <img
                          src={editingImage}
                          alt="Category preview"
                          className="w-full h-full object-contain p-0.5"
                        />
                        <button
                          type="button"
                          onClick={() => setEditingImage(null)}
                          className="absolute inset-0 bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ) : (
                      <label
                        className={`w-12 h-12 rounded-xl border-2 border-dashed border-gray-300 hover:border-[#C8102E] bg-white flex flex-col items-center justify-center cursor-pointer transition-colors ${
                          uploadingFor === cat.id ? 'opacity-50 pointer-events-none' : ''
                        }`}
                        title="Upload foto kategori"
                      >
                        {uploadingFor === cat.id ? (
                          <Loader2 size={14} className="animate-spin text-gray-400" />
                        ) : (
                          <ImageIcon size={16} className="text-gray-400" />
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={async (e) => {
                            const f = e.target.files?.[0]
                            if (!f) return
                            setUploadingFor(cat.id)
                            const url = await uploadImageFile(f)
                            if (url) setEditingImage(url)
                            setUploadingFor(null)
                          }}
                        />
                      </label>
                    )}
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-xl bg-white border border-gray-100 flex items-center justify-center shrink-0 overflow-hidden shadow-2xs">
                    {cat.image_url ? (
                      <img
                        src={cat.image_url}
                        alt={cat.name}
                        className="w-full h-full object-contain p-1"
                      />
                    ) : (
                      <ImageIcon size={18} className="text-gray-300" />
                    )}
                  </div>
                )}

                {/* Input atau Label Nama */}
                <div className="flex-1 min-w-0">
                  {isEditing ? (
                    <input
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      className="w-full px-3 py-1.5 border border-[#C8102E] rounded-lg text-sm focus:outline-none bg-white font-semibold"
                      autoFocus
                    />
                  ) : (
                    <div>
                      <span className="text-sm font-bold text-[#0A1628] block truncate">
                        {cat.name}
                      </span>
                      <span className="text-[11px] text-gray-400 block truncate">
                        /{cat.slug} {cat.image_url ? '· Ada foto' : '· Tanpa foto'}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Sisi Kanan: Action Buttons */}
              <div className="flex items-center gap-1.5 shrink-0">
                {isEditing ? (
                  <>
                    <button
                      onClick={() => handleUpdate(cat.id)}
                      disabled={saving}
                      className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                      title="Simpan"
                    >
                      <Check size={16} />
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="p-1.5 text-gray-400 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                      title="Batal"
                    >
                      <X size={16} />
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        setEditingId(cat.id)
                        setEditingName(cat.name)
                        setEditingImage(cat.image_url || null)
                      }}
                      className="p-1.5 text-gray-400 hover:text-[#C8102E] hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                      title="Edit Nama / Foto"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(cat.id)}
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                      title="Hapus Kategori"
                    >
                      <Trash2 size={14} />
                    </button>
                  </>
                )}
              </div>
            </div>
          )
        })}

        {categories.length === 0 && (
          <p className="text-sm text-gray-400 text-center py-8">Belum ada kategori.</p>
        )}
      </div>
    </div>
  )
}
