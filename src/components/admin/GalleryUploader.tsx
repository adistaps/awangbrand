'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Upload, X, Loader2, GripVertical } from 'lucide-react'

export interface GalleryImage {
  id: string
  image_url: string
  sort_order: number
}

export function GalleryUploader({
  images,
  onChange,
}: {
  images: GalleryImage[]
  onChange: (images: GalleryImage[]) => void
}) {
  const [uploading, setUploading] = useState(false)
  const [dragIndex, setDragIndex] = useState<number | null>(null)

  async function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploading(true)
    const supabase = createClient()
    const newImages: GalleryImage[] = []

    for (const file of Array.from(files)) {
      const ext = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
      const { error } = await supabase.storage.from('product-gallery').upload(fileName, file)
      if (!error) {
        const { data } = supabase.storage.from('product-gallery').getPublicUrl(fileName)
        newImages.push({
          id: `temp-${Date.now()}-${Math.random()}`,
          image_url: data.publicUrl,
          sort_order: images.length + newImages.length,
        })
      }
    }

    onChange([...images, ...newImages])
    setUploading(false)
    e.target.value = ''
  }

  function removeImage(id: string) {
    onChange(images.filter((img) => img.id !== id))
  }

  function handleDrop(dropIndex: number) {
    if (dragIndex === null || dragIndex === dropIndex) return
    const reordered = [...images]
    const [moved] = reordered.splice(dragIndex, 1)
    reordered.splice(dropIndex, 0, moved)
    onChange(reordered.map((img, i) => ({ ...img, sort_order: i })))
    setDragIndex(null)
  }

  return (
    <div>
      <label className="text-xs font-semibold text-gray-600 mb-1.5 block">
        Galeri Foto Detail Produk (drag untuk urutkan)
      </label>
      <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
        {images.map((img, index) => (
          <div
            key={img.id}
            draggable
            onDragStart={() => setDragIndex(index)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => handleDrop(index)}
            className="relative h-28 rounded-lg overflow-hidden border border-gray-200 group cursor-move"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={img.image_url} alt="" className="w-full h-full object-cover" />
            <div className="absolute top-1 left-1 bg-black/50 text-white rounded p-1">
              <GripVertical size={12} />
            </div>
            <button
              type="button"
              onClick={() => removeImage(img.id)}
              className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X size={12} />
            </button>
          </div>
        ))}

        <label className="flex flex-col items-center justify-center h-28 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-[#CC0000] hover:bg-red-50/20 transition-all">
          {uploading ? (
            <Loader2 className="animate-spin text-gray-400" size={18} />
          ) : (
            <>
              <Upload className="text-gray-400 mb-1" size={18} />
              <span className="text-[10px] text-gray-400">Tambah foto</span>
            </>
          )}
          <input type="file" accept="image/*" multiple className="hidden" onChange={handleFiles} disabled={uploading} />
        </label>
      </div>
    </div>
  )
}
