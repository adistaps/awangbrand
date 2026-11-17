'use client'

import { useState, useRef, useEffect } from 'react'
import { Plus, Trash2, ExternalLink, ChevronDown, Video } from 'lucide-react'
import type { RecipeVideoLink } from '@/types/database'

function TikTokIcon({ className = 'w-3.5 h-3.5' }: { className?: string }) {
  return (
    <svg className={`fill-current ${className}`} viewBox="0 0 24 24">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.29 0 .58.04.86.12V9.42a6.34 6.34 0 0 0-.86-.06 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.75a8.18 8.18 0 0 0 4.77 1.52V6.82a4.83 4.83 0 0 1-1-.13z" />
    </svg>
  )
}

function InstagramIcon({ className = 'w-3.5 h-3.5' }: { className?: string }) {
  return (
    <svg className={`fill-current ${className}`} viewBox="0 0 24 24">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  )
}

function detectPlatform(url: string): 'tiktok' | 'instagram' | 'other' {
  const lower = url.toLowerCase()
  if (lower.includes('tiktok.com')) return 'tiktok'
  if (lower.includes('instagram.com')) return 'instagram'
  return 'other'
}

function PlatformDropdown({
  value,
  onChange,
}: {
  value: 'tiktok' | 'instagram' | 'other'
  onChange: (val: 'tiktok' | 'instagram' | 'other') => void
}) {
  const [open, setOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const options: { id: 'tiktok' | 'instagram' | 'other'; label: string; icon: React.ReactNode }[] = [
    {
      id: 'tiktok',
      label: 'TikTok',
      icon: (
        <span className="w-5 h-5 rounded-md bg-black text-white flex items-center justify-center shrink-0">
          <TikTokIcon className="w-3 h-3 text-white" />
        </span>
      ),
    },
    {
      id: 'instagram',
      label: 'Instagram',
      icon: (
        <span className="w-5 h-5 rounded-md bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white flex items-center justify-center shrink-0">
          <InstagramIcon className="w-3 h-3 text-white" />
        </span>
      ),
    },
    {
      id: 'other',
      label: 'Lainnya',
      icon: (
        <span className="w-5 h-5 rounded-md bg-gray-200 text-gray-700 flex items-center justify-center shrink-0">
          <Video className="w-3 h-3" />
        </span>
      ),
    },
  ]

  const selected = options.find((o) => o.id === value) || options[0]

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-2 text-xs font-semibold bg-white border border-gray-200 hover:border-gray-300 rounded-lg px-2.5 py-2 text-gray-800 transition-colors shadow-2xs cursor-pointer focus:outline-none focus:border-[#CC0000]"
      >
        <div className="flex items-center gap-2 truncate">
          {selected.icon}
          <span className="truncate">{selected.label}</span>
        </div>
        <ChevronDown className="w-3.5 h-3.5 text-gray-400 shrink-0" />
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-1 w-full min-w-[140px] bg-white border border-gray-200 rounded-xl shadow-lg z-50 py-1 overflow-hidden">
          {options.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => {
                onChange(opt.id)
                setOpen(false)
              }}
              className={`w-full flex items-center gap-2 px-3 py-2 text-xs text-left transition-colors cursor-pointer ${
                value === opt.id ? 'bg-red-50 text-[#CC0000] font-bold' : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              {opt.icon}
              <span>{opt.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
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
            Tampilkan tombol link resep interaktif berlogo TikTok &amp; Instagram di detail resep
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
            Belum ada video resep yang ditautkan ke resep ini.
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
              {/* Platform selector with official icons */}
              <div className="w-full sm:w-40 shrink-0">
                <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">
                  Platform
                </label>
                <PlatformDropdown
                  value={link.platform || 'tiktok'}
                  onChange={(val) => updateRow(idx, 'platform', val)}
                />
              </div>

              {/* Title Input */}
              <div className="flex-1 w-full">
                <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">
                  Judul Resep
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Resep Ikan Kerisi Goreng Sambal Lemak Petai"
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
