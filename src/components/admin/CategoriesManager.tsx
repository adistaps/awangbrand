'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Plus, Trash2, Pencil, Check, X, Image as ImageIcon, Loader2 } from 'lucide-react'
import type { CategoryGroup, Subcategory } from '@/types/database'

// State untuk edit subkategori
interface EditingSubState {
  groupId: string
  subId: string
  name: string
  image: string | null
}

export function CategoriesManager({
  initialHierarchy = [],
  settingsKey = 'product_categories_hierarchy',
  title = 'Kategori',
}: {
  initialCategories?: unknown[] // tetap diterima agar tidak breaking, tapi tidak dipakai
  initialHierarchy?: CategoryGroup[]
  settingsKey?: string
  title?: string
}) {
  const [hierarchy, setHierarchy] = useState<CategoryGroup[]>(initialHierarchy)

  // Pastikan jika initialHierarchy dari parent berganti, state lokal juga di-sync
  useEffect(() => {
    setHierarchy(initialHierarchy)
  }, [initialHierarchy])

  // State tambah group baru
  const [newGroupName, setNewGroupName] = useState('')

  // State edit group
  const [editingGroupId, setEditingGroupId] = useState<string | null>(null)
  const [editingGroupName, setEditingGroupName] = useState('')

  // State tambah sub
  const [newSubName, setNewSubName] = useState('')
  const [newSubImage, setNewSubImage] = useState<string | null>(null)
  const [selectedGroupIdForSub, setSelectedGroupIdForSub] = useState<string>('')

  // State edit sub
  const [editingSub, setEditingSub] = useState<EditingSubState | null>(null)

  const [saving, setSaving] = useState(false)
  const [uploadingFor, setUploadingFor] = useState<string | null>(null)

  function slugify(text: string) {
    return text.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')
  }

  async function uploadImageFile(file: File): Promise<string | null> {
    const supabase = createClient()
    const ext = file.name.split('.').pop()
    const fileName = `category-${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

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
      alert('Upload gagal: ' + uploadError.message)
      return null
    }

    const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(fileName)
    return publicUrlData.publicUrl
  }

  async function saveHierarchy(updated: CategoryGroup[]) {
    setSaving(true)
    const supabase = createClient()
    // onConflict: 'key' — pastikan upsert update baris yang key-nya sama, bukan membuat baris baru
    const { error } = await supabase.from('site_settings').upsert(
      {
        key: settingsKey,
        value: JSON.stringify(updated),
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'key' }
    )
    if (!error) {
      setHierarchy(updated)
    } else {
      alert('Gagal menyimpan: ' + error.message)
    }
    setSaving(false)
  }

  // ── GROUP ACTIONS ──────────────────────────────────────────

  function handleAddGroup() {
    if (!newGroupName.trim()) return
    const newGroup: CategoryGroup = {
      id: `cat-${slugify(newGroupName)}-${Date.now()}`,
      name: newGroupName.trim(),
      slug: slugify(newGroupName),
      subcategories: [],
    }
    saveHierarchy([...hierarchy, newGroup])
    setNewGroupName('')
  }

  function handleSaveGroupName(groupId: string) {
    if (!editingGroupName.trim()) return
    const updated = hierarchy.map((g) =>
      g.id === groupId ? { ...g, name: editingGroupName.trim() } : g
    )
    saveHierarchy(updated)
    setEditingGroupId(null)
  }

  function handleDeleteGroup(groupId: string) {
    if (!confirm('Hapus kategori ini beserta semua subkategorinya?')) return
    saveHierarchy(hierarchy.filter((g) => g.id !== groupId))
  }

  // ── SUBCATEGORY ACTIONS ────────────────────────────────────

  function handleAddSubcategory(groupId: string) {
    if (!newSubName.trim()) return
    const newSub: Subcategory = {
      id: `sub-${slugify(newSubName)}-${Date.now()}`,
      name: newSubName.trim(),
      slug: slugify(newSubName),
      image_url: selectedGroupIdForSub === groupId ? newSubImage : null,
    }
    const updated = hierarchy.map((g) =>
      g.id === groupId ? { ...g, subcategories: [...g.subcategories, newSub] } : g
    )
    saveHierarchy(updated)
    setNewSubName('')
    setNewSubImage(null)
    setSelectedGroupIdForSub('')
  }

  function handleSaveSubcategory() {
    if (!editingSub || !editingSub.name.trim()) return
    const updated = hierarchy.map((g) => {
      if (g.id !== editingSub.groupId) return g
      return {
        ...g,
        subcategories: g.subcategories.map((s) =>
          s.id === editingSub.subId
            ? { ...s, name: editingSub.name.trim(), image_url: editingSub.image }
            : s
        ),
      }
    })
    saveHierarchy(updated)
    setEditingSub(null)
  }

  function handleDeleteSubcategory(groupId: string, subId: string) {
    if (!confirm('Hapus subkategori ini?')) return
    const updated = hierarchy.map((g) =>
      g.id === groupId
        ? { ...g, subcategories: g.subcategories.filter((s) => s.id !== subId) }
        : g
    )
    saveHierarchy(updated)
  }

  return (
    <div className="space-y-6 max-w-3xl">

      {/* ── TAMBAH KATEGORI PARENT BARU ── */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs">
        <h3 className="text-xs font-bold text-[#590014] uppercase tracking-wider mb-3">
          + Tambah {title} Baru
        </h3>
        <p className="text-xs text-gray-400 mb-3">
          Kelola tab kategori utama dan subkategorinya yang dapat diberi foto untuk icon filter.
        </p>
        <div className="flex gap-2">
          <input
            value={newGroupName}
            onChange={(e) => setNewGroupName(e.target.value)}
            placeholder={`Nama ${title.toLowerCase()} baru...`}
            className="flex-1 px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#CC0000] bg-white"
            onKeyDown={(e) => e.key === 'Enter' && handleAddGroup()}
          />
          <button
            onClick={handleAddGroup}
            disabled={saving || !newGroupName.trim()}
            className="bg-[#CC0000] hover:bg-[#a00b22] text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-all disabled:opacity-50 cursor-pointer shrink-0"
          >
            {saving ? <Loader2 size={16} className="animate-spin" /> : 'Tambah'}
          </button>
        </div>
      </div>

      {/* ── LIST KATEGORI & SUBKATEGORI ── */}
      <div className="space-y-5">
        {hierarchy.length === 0 && (
          <p className="text-sm text-gray-400 text-center py-10 bg-white rounded-2xl border border-gray-200">
            Belum ada kategori. Tambahkan kategori di atas.
          </p>
        )}

        {hierarchy.map((group) => (
          <div key={group.id} className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs">

            {/* Header Kategori */}
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2 flex-1 min-w-0 mr-3">
                {editingGroupId === group.id ? (
                  <>
                    <input
                      value={editingGroupName}
                      onChange={(e) => setEditingGroupName(e.target.value)}
                      className="flex-1 px-3 py-1.5 border border-[#CC0000] rounded-lg text-sm font-bold focus:outline-none"
                      autoFocus
                      onKeyDown={(e) => e.key === 'Enter' && handleSaveGroupName(group.id)}
                    />
                    <button
                      onClick={() => handleSaveGroupName(group.id)}
                      disabled={saving}
                      className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                      title="Simpan"
                    >
                      <Check size={16} />
                    </button>
                    <button
                      onClick={() => setEditingGroupId(null)}
                      className="p-1.5 text-gray-400 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                      title="Batal"
                    >
                      <X size={16} />
                    </button>
                  </>
                ) : (
                  <>
                    <div>
                      <h4 className="text-base font-extrabold text-[#590014]">{group.name}</h4>
                      <span className="text-[11px] text-gray-400 font-mono">ID: {group.id}</span>
                    </div>
                    <button
                      onClick={() => {
                        setEditingGroupId(group.id)
                        setEditingGroupName(group.name)
                      }}
                      className="p-1.5 text-gray-400 hover:text-[#CC0000] hover:bg-red-50 rounded-lg transition-colors cursor-pointer ml-1"
                      title="Edit nama kategori"
                    >
                      <Pencil size={14} />
                    </button>
                  </>
                )}
              </div>
              <button
                onClick={() => handleDeleteGroup(group.id)}
                className="p-1.5 text-gray-300 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer shrink-0"
                title="Hapus Kategori"
              >
                <Trash2 size={16} />
              </button>
            </div>

            {/* Subkategori List */}
            <div className="mb-4">
              <h5 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2.5">
                Subkategori ({group.subcategories.length})
              </h5>

              {group.subcategories.length === 0 ? (
                <p className="text-xs text-gray-400 italic py-2">Belum ada subkategori.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {group.subcategories.map((sub) => {
                    const isEditingSub = editingSub?.groupId === group.id && editingSub?.subId === sub.id
                    return (
                      <div
                        key={sub.id}
                        className={`flex items-center gap-2 p-2.5 rounded-xl border transition-colors ${
                          isEditingSub
                            ? 'border-[#CC0000] bg-red-50/30'
                            : 'border-gray-100 bg-stone-50/50 hover:bg-stone-50'
                        }`}
                      >
                        {/* Foto subkategori */}
                        {isEditingSub ? (
                          <div className="relative shrink-0">
                            {editingSub.image ? (
                              <div className="relative w-9 h-9 rounded-full overflow-hidden border border-gray-200 bg-[#590014] p-1 group">
                                <img src={editingSub.image} alt="" className="w-full h-full object-contain" />
                                <button
                                  type="button"
                                  onClick={() => setEditingSub((s) => s ? { ...s, image: null } : null)}
                                  className="absolute inset-0 bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <X size={10} />
                                </button>
                              </div>
                            ) : (
                              <label
                                className="w-9 h-9 rounded-full border-2 border-dashed border-gray-300 hover:border-[#CC0000] bg-white flex items-center justify-center cursor-pointer transition-colors"
                                title="Upload foto"
                              >
                                {uploadingFor === `edit-sub-${sub.id}` ? (
                                  <Loader2 size={12} className="animate-spin text-gray-400" />
                                ) : (
                                  <ImageIcon size={12} className="text-gray-400" />
                                )}
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={async (e) => {
                                    const f = e.target.files?.[0]
                                    if (!f) return
                                    setUploadingFor(`edit-sub-${sub.id}`)
                                    const url = await uploadImageFile(f)
                                    if (url) setEditingSub((s) => s ? { ...s, image: url } : null)
                                    setUploadingFor(null)
                                  }}
                                />
                              </label>
                            )}
                          </div>
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-[#590014] p-1 flex items-center justify-center shrink-0 overflow-hidden">
                            {sub.image_url ? (
                              <img src={sub.image_url} alt={sub.name} className="w-full h-full object-contain" />
                            ) : (
                              <span className="text-[9px] text-white font-bold">AW</span>
                            )}
                          </div>
                        )}

                        {/* Nama sub */}
                        <div className="flex-1 min-w-0">
                          {isEditingSub ? (
                            <input
                              value={editingSub.name}
                              onChange={(e) => setEditingSub((s) => s ? { ...s, name: e.target.value } : null)}
                              className="w-full px-2 py-1 border border-[#CC0000] rounded-lg text-xs font-bold focus:outline-none"
                              autoFocus
                              onKeyDown={(e) => e.key === 'Enter' && handleSaveSubcategory()}
                            />
                          ) : (
                            <span className="text-xs font-bold text-stone-900 truncate block">{sub.name}</span>
                          )}
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-1 shrink-0">
                          {isEditingSub ? (
                            <>
                              <button
                                onClick={handleSaveSubcategory}
                                disabled={saving}
                                className="p-1 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                                title="Simpan"
                              >
                                <Check size={14} />
                              </button>
                              <button
                                onClick={() => setEditingSub(null)}
                                className="p-1 text-gray-400 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                                title="Batal"
                              >
                                <X size={14} />
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => setEditingSub({
                                  groupId: group.id,
                                  subId: sub.id,
                                  name: sub.name,
                                  image: sub.image_url || null,
                                })}
                                className="p-1 text-gray-400 hover:text-[#CC0000] hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                                title="Edit subkategori"
                              >
                                <Pencil size={12} />
                              </button>
                              <button
                                onClick={() => handleDeleteSubcategory(group.id, sub.id)}
                                className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                                title="Hapus"
                              >
                                <X size={14} />
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Tambah Subkategori Baru */}
            <div className="pt-3 border-t border-gray-100 flex flex-col sm:flex-row items-center gap-2">
              {/* Upload foto subkategori baru */}
              <div className="relative shrink-0">
                {selectedGroupIdForSub === group.id && newSubImage ? (
                  <div className="relative w-9 h-9 rounded-full overflow-hidden border border-gray-200 bg-[#590014] p-1 group">
                    <img src={newSubImage} alt="Preview" className="w-full h-full object-contain" />
                    <button
                      type="button"
                      onClick={() => setNewSubImage(null)}
                      className="absolute inset-0 bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={10} />
                    </button>
                  </div>
                ) : (
                  <label
                    className="w-9 h-9 rounded-full border-2 border-dashed border-gray-300 hover:border-[#CC0000] bg-white flex items-center justify-center cursor-pointer transition-colors"
                    title="Upload foto subkategori"
                  >
                    {uploadingFor === `sub-${group.id}` ? (
                      <Loader2 size={12} className="animate-spin text-gray-400" />
                    ) : (
                      <ImageIcon size={12} className="text-gray-400" />
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={async (e) => {
                        const f = e.target.files?.[0]
                        if (!f) return
                        setUploadingFor(`sub-${group.id}`)
                        setSelectedGroupIdForSub(group.id)
                        const url = await uploadImageFile(f)
                        if (url) setNewSubImage(url)
                        setUploadingFor(null)
                      }}
                    />
                  </label>
                )}
              </div>

              <input
                value={selectedGroupIdForSub === group.id ? newSubName : ''}
                onChange={(e) => {
                  setSelectedGroupIdForSub(group.id)
                  setNewSubName(e.target.value)
                }}
                placeholder={`Tambah subkategori ke ${group.name}...`}
                className="flex-1 w-full px-3 py-1.5 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-[#CC0000] bg-white"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAddSubcategory(group.id)
                }}
              />
              <button
                onClick={() => handleAddSubcategory(group.id)}
                disabled={saving || selectedGroupIdForSub !== group.id || !newSubName.trim()}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1 bg-[#590014] hover:bg-[#3d000e] text-white text-xs font-bold px-3 py-1.5 rounded-xl transition-all disabled:opacity-50 cursor-pointer shrink-0"
              >
                <Plus size={13} />
                <span>Tambah Sub</span>
              </button>
            </div>

          </div>
        ))}
      </div>

    </div>
  )
}
