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

  return (
    <div>
      <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Spesifikasi Teknis</label>
      <div className="space-y-2">
        {specs.map((spec) => (
          <div key={spec.id} className="flex gap-2">
            <input
              value={spec.spec_key}
              onChange={(e) => updateRow(spec.id, 'spec_key', e.target.value)}
              placeholder="Nama (mis. Voltage)"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#F5A200]"
            />
            <input
              value={spec.spec_value}
              onChange={(e) => updateRow(spec.id, 'spec_value', e.target.value)}
              placeholder="Nilai (mis. 20V)"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#F5A200]"
            />
            <button
              type="button"
              onClick={() => removeRow(spec.id)}
              className="px-2 text-red-400 hover:text-red-600"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={addRow}
        className="flex items-center gap-1.5 text-xs font-semibold text-[#F5A200] mt-2 hover:text-[#D98B00]"
      >
        <Plus size={14} /> Tambah Spesifikasi
      </button>
    </div>
  )
}
