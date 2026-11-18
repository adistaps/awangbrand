'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Upload, X, Loader2 } from 'lucide-react'

export function ReviewPhotosUploader({
  photos,
  onChange,
}: {
  photos: string[]
  onChange: (photos: string[]) => void
}) {
  const [uploading, setUploading] = useState(false)

  async function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploading(true)
    const supabase = createClient()
    const newUrls: string[] = []

    for (const file of Array.from(files)) {
      const ext = file.name.split('.').pop() || 'jpg'
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
      const { error } = await supabase.storage.from('review-photos').upload(fileName, file, {
        cacheControl: '31536000',
        upsert: false,
      })
      if (!error) {
        const { data } = supabase.storage.from('review-photos').getPublicUrl(fileName)
        newUrls.push(data.publicUrl)
      } else {
        console.error('Upload review photo error:', error)
      }
    }

    onChange([...photos, ...newUrls])
    setUploading(false)
    e.target.value = ''
  }

  function removePhoto(indexToRemove: number) {
    onChange(photos.filter((_, idx) => idx !== indexToRemove))
  }

  return (
    <div>
      <label className="text-xs font-semibold text-gray-700 mb-2 block">
        Foto Ulasan / Produk Pelanggan (Bisa upload lebih dari 1)
      </label>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
        {photos.map((url, idx) => (
          <div
            key={idx}
            className="relative aspect-square rounded-xl overflow-hidden border border-gray-200 group bg-stone-100 shadow-2xs"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={url} alt={`Review photo ${idx + 1}`} className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => removePhoto(idx)}
              className="absolute top-1.5 right-1.5 bg-black/70 hover:bg-[#CC0000] text-white rounded-full p-1 transition-colors"
              title="Hapus foto"
            >
              <X size={13} />
            </button>
          </div>
        ))}

        <label className="flex flex-col items-center justify-center aspect-square border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-[#CC0000] hover:bg-red-50/20 transition-all bg-white">
          {uploading ? (
            <Loader2 className="animate-spin text-[#CC0000]" size={20} />
          ) : (
            <>
              <Upload className="text-gray-400 mb-1" size={20} />
              <span className="text-[11px] font-semibold text-gray-500 text-center px-1">Tambah Foto</span>
            </>
          )}
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleFiles}
            disabled={uploading}
          />
        </label>
      </div>
    </div>
  )
}
