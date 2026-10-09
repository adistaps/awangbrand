'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

const fields = [
  { key: 'whatsapp_number', label: 'Nomor WhatsApp (format: 62xxx)' },
  { key: 'contact_email', label: 'Email Kontak' },
  { key: 'contact_phone', label: 'Nomor Telepon' },
  { key: 'address', label: 'Alamat' },
]

export function SettingsForm({ initialSettings }: { initialSettings: Record<string, string> }) {
  const [values, setValues] = useState(initialSettings)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  async function handleSave() {
    setSaving(true)
    setSaved(false)
    const supabase = createClient()
    await Promise.all(
      fields.map(({ key }) => supabase.from('site_settings').upsert({ key, value: values[key] || '' }))
    )
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 max-w-lg space-y-4">
      {fields.map(({ key, label }) => (
        <div key={key}>
          <label className="text-xs font-semibold text-gray-600 mb-1.5 block">{label}</label>
          <input
            value={values[key] || ''}
            onChange={(e) => setValues((v) => ({ ...v, [key]: e.target.value }))}
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#F5A200]"
          />
        </div>
      ))}
      <button
        onClick={handleSave}
        disabled={saving}
        className="bg-[#F5A200] hover:bg-[#D98B00] text-white font-bold text-sm px-6 py-2.5 rounded-lg transition-colors disabled:opacity-60"
      >
        {saving ? 'Menyimpan...' : 'Simpan Pengaturan'}
      </button>
      {saved && <p className="text-xs text-emerald-600 font-semibold">Tersimpan!</p>}
      <p className="text-xs text-gray-400 pt-2 border-t border-gray-100">
        Catatan: nomor WhatsApp untuk redirect form di homepage/contact masih memakai env var{' '}
        <code className="bg-gray-100 px-1 rounded">NEXT_PUBLIC_WHATSAPP_NUMBER</code>. Field di atas untuk
        keperluan tampilan info kontak lain di website.
      </p>
    </div>
  )
}
