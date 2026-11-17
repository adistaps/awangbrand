'use client'

import { Plus, Trash2, ExternalLink } from 'lucide-react'
import type { RecipeVideoLink } from '@/types/database'

function detectPlatform(url: string): 'tiktok' | 'instagram' | 'other' {
  const lower = url.toLowerCase()
  if (lower.includes('tiktok.com')) return 'tiktok'
  if (lower.includes('instagram.com')) return 'instagram'
  return 'other'
}

export function RecipeLinksEditor({
  links,
  onChange,
}: {
  links: RecipeVideoLink[]
  onChange: (links: RecipeVideoLink[]) => void
}) {
  function addRow() {
    onChange([
      ...links,
      {
        id: `link-${Date.now()}`,
        title: '',
        url: '',
        platform: 'tiktok',
      },
    ])
  }

  function updateRow(index: number, field: keyof RecipeVideoLink, value: string) {
    const next = [...links]
    const updated = { ...next[index], [field]: value }
    if (field === 'url') {
      const autoPlatform = detectPlatform(value)
      if (autoPlatform !== 'other') {
        updated.platform = autoPlatform
      }
    }
    next[index] = updated
    onChange(next)
  }

  function removeRow(index: number) {
    onChange(links.filter((_, i) => i !== index))
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
            <span>Video Resep Masak (TikTok / Instagram)</span>
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Tampilkan tombol link resep interaktif berlogo TikTok &amp; Instagram di detail produk
          </p>
        </div>
        <button
          type="button"
          onClick={addRow}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#CC0000] hover:bg-[#a30000] text-white text-xs font-semibold rounded-lg shadow-sm transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          Tambah Link Resep
        </button>
      </div>

      {links.length === 0 ? (
        <div className="text-center py-6 border-2 border-dashed border-gray-100 rounded-lg bg-stone-50/50">
          <p className="text-xs text-gray-400">
            Belum ada video resep yang ditautkan ke produk ini.
          </p>
          <button
            type="button"
            onClick={addRow}
            className="mt-2 text-xs font-bold text-[#CC0000] hover:underline cursor-pointer"
          >
            + Tambah link pertama
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {links.map((link, idx) => (
            <div
              key={link.id || idx}
              className="p-3.5 rounded-lg border border-gray-200 bg-gray-50/60 flex flex-col sm:flex-row gap-3 items-start sm:items-center"
            >
              {/* Platform selector */}
              <div className="w-full sm:w-36 shrink-0">
                <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">
                  Platform
                </label>
                <select
                  value={link.platform || 'tiktok'}
                  onChange={(e) =>
                    updateRow(idx, 'platform', e.target.value as 'tiktok' | 'instagram' | 'other')
                  }
                  className="w-full text-xs font-semibold bg-white border border-gray-200 rounded-lg px-2.5 py-2 text-gray-800 focus:outline-none focus:border-[#CC0000]"
                >
                  <option value="tiktok">🎵 TikTok</option>
                  <option value="instagram">📸 Instagram</option>
                  <option value="other">🔗 Lainnya</option>
                </select>
              </div>

              {/* Title Input */}
              <div className="flex-1 w-full">
                <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">
                  Judul Resep
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Resep Daging Salai Masak Lemak Simple"
                  value={link.title}
                  onChange={(e) => updateRow(idx, 'title', e.target.value)}
                  className="w-full text-xs bg-white border border-gray-200 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:border-[#CC0000]"
                />
              </div>

              {/* URL Input */}
              <div className="flex-1 w-full">
                <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">
                  URL Video TikTok / IG
                </label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="url"
                    placeholder="https://www.tiktok.com/@... atau https://www.instagram.com/reel/..."
                    value={link.url}
                    onChange={(e) => updateRow(idx, 'url', e.target.value)}
                    className="w-full text-xs bg-white border border-gray-200 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:border-[#CC0000]"
                  />
                  {link.url && (
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-gray-400 hover:text-gray-700 transition-colors"
                      title="Buka link"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>

              {/* Delete button */}
              <div className="sm:self-end pb-0.5">
                <button
                  type="button"
                  onClick={() => removeRow(idx)}
                  className="p-2 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                  title="Hapus"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
