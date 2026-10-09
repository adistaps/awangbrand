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
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-4 border-b border-gray-100 flex justify-end">
        <button
          onClick={exportCsv}
          className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-[#0A1628] border border-gray-200 px-3 py-2 rounded-lg"
        >
          <Download size={14} /> Export CSV
        </button>
      </div>
      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
          <tr>
            {columns.map((c) => (
              <th key={c.key} className="p-3 text-left">
                {c.label}
              </th>
            ))}
            <th className="p-3 text-left">Status</th>
            <th className="p-3 text-left">Tanggal</th>
            <th className="p-3 text-right">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {items.map((row) => (
            <tr key={row.id} className="border-t border-gray-50 hover:bg-gray-50/50">
              {columns.map((c) => (
                <td key={c.key} className="p-3 text-[#0A1628] max-w-[200px] truncate">
                  {String(row[c.key] ?? '-')}
                </td>
              ))}
              <td className="p-3">
                <select
                  value={row.status}
                  onChange={(e) => updateStatus(row.id, e.target.value as 'new' | 'contacted' | 'closed')}
                  className={`text-xs font-bold px-2 py-1 rounded-full border-0 focus:outline-none ${
                    row.status === 'new' ? 'bg-red-100 text-red-600' : row.status === 'contacted' ? 'bg-amber-100 text-amber-600' : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  <option value="new">Baru</option>
                  <option value="contacted">Dihubungi</option>
                  <option value="closed">Selesai</option>
                </select>
              </td>
              <td className="p-3 text-gray-400 text-xs">{new Date(row.created_at).toLocaleDateString('id-ID')}</td>
              <td className="p-3 text-right">
                <button onClick={() => handleDelete(row.id)} className="text-gray-400 hover:text-red-500">
                  <Trash2 size={14} />
                </button>
              </td>
            </tr>
          ))}
          {items.length === 0 && (
            <tr>
              <td colSpan={columns.length + 3} className="p-8 text-center text-gray-400">
                Belum ada data.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
