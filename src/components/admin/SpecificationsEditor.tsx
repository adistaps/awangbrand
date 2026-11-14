'use client'

import { Plus, Trash2 } from 'lucide-react'

export interface SpecRow {
  id: string
  spec_key: string
  spec_value: string
}

export function SpecificationsEditor({
  specs,
  onChange,
}: {
  specs: SpecRow[]
  onChange: (specs: SpecRow[]) => void
}) {
  function addRow() {
    onChange([...specs, { id: `temp-${Date.now()}`, spec_key: '', spec_value: '' }])
  }

  function updateRow(id: string, field: 'spec_key' | 'spec_value', value: string) {
    onChange(specs.map((s) => (s.id === id ? { ...s, [field]: value } : s)))
  }

  function removeRow(id: string) {
    onChange(specs.filter((s) => s.id !== id))
  }

  function addPreset(key: string) {
    if (specs.some((s) => s.spec_key.toLowerCase() === key.toLowerCase())) return
    onChange([...specs, { id: `temp-${Date.now()}`, spec_key: key, spec_value: '' }])
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-xs font-semibold text-gray-700 block">
          Spesifikasi, Remark &amp; Tips Produk
        </label>
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] text-gray-400">Preset cepat:</span>
          <button
            type="button"
            onClick={() => addPreset('Remark')}
            className="text-[11px] font-bold text-stone-700 bg-stone-100 hover:bg-stone-200 px-2 py-0.5 rounded cursor-pointer transition-colors"
          >
            + Remark
          </button>
          <button
            type="button"
            onClick={() => addPreset('Tips')}
            className="text-[11px] font-bold text-[#b56e07] bg-amber-100 hover:bg-amber-200 px-2 py-0.5 rounded cursor-pointer transition-colors"
          >
            + Tips!
          </button>
        </div>
      </div>
      <p className="text-[11px] text-gray-400 mb-2.5">
        Gunakan <strong>Remark</strong> dan <strong>Tips</strong> untuk menambahkan accordion informasi tambahan (Ingredients, How to Use, Size, Remark, Tips!).
      </p>
      <div className="space-y-2">
        {specs.map((spec) => {
          const isTips = spec.spec_key.trim().toLowerCase() === 'tips'
          return (
            <div key={spec.id} className="flex gap-2 items-start">
              <input
                value={spec.spec_key}
                onChange={(e) => updateRow(spec.id, 'spec_key', e.target.value)}
                placeholder="Nama (cth: Remark, Tips, dll)"
                className={`w-1/3 px-3 py-2 border rounded-xl text-sm focus:outline-none ${
                  isTips ? 'border-amber-300 bg-amber-50/40 text-amber-900 font-bold' : 'border-gray-200 bg-white'
                }`}
              />
              {isTips ? (
                <textarea
                  rows={3}
                  value={spec.spec_value}
                  onChange={(e) => updateRow(spec.id, 'spec_value', e.target.value)}
                  placeholder="Isi tips penggunaan/kegunaan produk (cth: Pes Sambal Ayam Penyet boleh juga digunakan untuk makanan laut, daging, telur dan sayuran...)"
                  className="flex-1 px-3 py-2 border border-amber-300 bg-amber-50/20 rounded-xl text-sm focus:outline-none focus:border-amber-500"
                />
              ) : (
                <input
                  value={spec.spec_value}
                  onChange={(e) => updateRow(spec.id, 'spec_value', e.target.value)}
                  placeholder="Nilai (mis. 200g / Sachet)"
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#CC0000]"
                />
              )}
              <button
                type="button"
                onClick={() => removeRow(spec.id)}
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer mt-0.5"
              >
                <Trash2 size={16} />
              </button>
            </div>
          )
        })}
      </div>
      <button
        type="button"
        onClick={addRow}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#CC0000] mt-2.5 hover:underline cursor-pointer"
      >
        <Plus size={14} /> Tambah Spesifikasi
      </button>
    </div>
  )
}
