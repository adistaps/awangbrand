'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Download, Trash2 } from 'lucide-react'

interface SubmissionRow {
  id: string
  status: 'new' | 'contacted' | 'closed'
  created_at: string
  [key: string]: unknown
}

export function SubmissionsTable({
  table,
  rows,
  columns,
}: {
  table: 'quote_submissions' | 'contact_submissions'
  rows: SubmissionRow[]
  columns: { key: string; label: string }[]
}) {
  const [items, setItems] = useState(rows)

  async function updateStatus(id: string, status: 'new' | 'contacted' | 'closed') {
    const supabase = createClient()
    await supabase.from(table).update({ status }).eq('id', id)
    setItems((it) => it.map((i) => (i.id === id ? { ...i, status } : i)))
  }

  async function handleDelete(id: string) {
    if (!confirm('Hapus submission ini?')) return
    const supabase = createClient()
    await supabase.from(table).delete().eq('id', id)
    setItems((it) => it.filter((i) => i.id !== id))
  }

  function exportCsv() {
    const headers = [...columns.map((c) => c.label), 'Status', 'Tanggal']
    const csvRows = items.map((row) => [
      ...columns.map((c) => `"${String(row[c.key] ?? '').replace(/"/g, '""')}"`),
      row.status,
      new Date(row.created_at).toLocaleString('id-ID'),
    ])
    const csv = [headers.join(','), ...csvRows.map((r) => r.join(','))].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${table}-${Date.now()}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="bg-white rounded-2xl shadow-xs border border-gray-100 overflow-hidden">
      <div className="p-4 border-b border-gray-100 flex items-center justify-between gap-3">
        <span className="text-xs text-gray-400 font-medium">{items.length} data ditemukan</span>
        <button
          onClick={exportCsv}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-700 hover:text-[#C8102E] border border-gray-200 hover:border-red-200 px-3.5 py-2 rounded-xl transition-all cursor-pointer bg-white shadow-xs"
        >
          <Download size={13} /> Export CSV
        </button>
      </div>
      <div className="overflow-x-auto w-full">
        <table className="w-full text-sm min-w-[650px]">
          <thead className="bg-gray-50/75 text-gray-500 text-xs uppercase border-b border-gray-100">
            <tr>
              {columns.map((c) => (
                <th key={c.key} className="p-3.5 text-left font-semibold">
                  {c.label}
                </th>
              ))}
              <th className="p-3.5 text-left font-semibold">Status</th>
              <th className="p-3.5 text-left font-semibold">Tanggal</th>
              <th className="p-3.5 text-right font-semibold">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {items.map((row) => (
              <tr key={row.id} className="hover:bg-slate-50/60 transition-colors">
                {columns.map((c) => (
                  <td key={c.key} className="p-3.5 text-[#0A1628] max-w-[200px] truncate">
                    {String(row[c.key] ?? '—')}
                  </td>
                ))}
                <td className="p-3.5">
                  <select
                    value={row.status}
                    onChange={(e) => updateStatus(row.id, e.target.value as 'new' | 'contacted' | 'closed')}
                    className={`text-[11px] font-bold px-2.5 py-1 rounded-full border-0 focus:outline-none cursor-pointer ${
                      row.status === 'new'
                        ? 'bg-red-50 text-[#C8102E] border border-red-200/60'
                        : row.status === 'contacted'
                        ? 'bg-amber-50 text-amber-700 border border-amber-200/60'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    <option value="new">Baru</option>
                    <option value="contacted">Dihubungi</option>
                    <option value="closed">Selesai</option>
                  </select>
                </td>
                <td className="p-3.5 text-gray-400 text-xs whitespace-nowrap">{new Date(row.created_at).toLocaleDateString('id-ID')}</td>
                <td className="p-3.5 text-right">
                  <button onClick={() => handleDelete(row.id)} className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer" title="Hapus">
                    <Trash2 size={14} />
                  </button>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan={columns.length + 3} className="p-8 text-center text-gray-400 text-sm">
                  Belum ada data masuk.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
