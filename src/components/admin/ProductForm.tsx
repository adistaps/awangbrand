'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { ImageUploader } from './ImageUploader'
import { GalleryUploader, type GalleryImage } from './GalleryUploader'
import { SpecificationsEditor, type SpecRow } from './SpecificationsEditor'
import type { Category } from '@/types/database'

interface ProductFormValues {
  id?: string
  name: string
  slug: string
  category_id: string | null
  description: string
  thumbnail_url: string | null
  shopee_url: string
  tokopedia_url: string
  lazada_url: string
  is_featured: boolean
  status: 'draft' | 'published'
}

export function ProductForm({
  categories,
  initialValues,
  initialGallery = [],
  initialSpecs = [],
}: {
  categories: Category[]
  initialValues?: ProductFormValues
  initialGallery?: GalleryImage[]
  initialSpecs?: SpecRow[]
}) {
  const router = useRouter()
  const isEdit = !!initialValues?.id

  const [values, setValues] = useState<ProductFormValues>(
    initialValues || {
      name: '',
      slug: '',
      category_id: null,
      description: '',
      thumbnail_url: null,
      shopee_url: '',
      tokopedia_url: '',
      lazada_url: '',
      is_featured: false,
      status: 'draft',
    }
  )
  const [gallery, setGallery] = useState<GalleryImage[]>(initialGallery)
  const [specs, setSpecs] = useState<SpecRow[]>(initialSpecs)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  function slugify(text: string) {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
  }

  function handleNameChange(name: string) {
    setValues((v) => ({ ...v, name, slug: isEdit ? v.slug : slugify(name) }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError('')

    const supabase = createClient()

    const payload = {
      name: values.name,
      slug: values.slug,
      category_id: values.category_id || null,
      description: values.description,
      main_image: values.thumbnail_url,
      shopee_url: values.shopee_url || null,
      tokopedia_url: values.tokopedia_url || null,
      lazada_url: values.lazada_url || null,
      is_featured: values.is_featured,
      status: values.status,
    }

    let productId = values.id

    if (isEdit && productId) {
      const { error: updateError } = await supabase.from('products').update(payload).eq('id', productId)
      if (updateError) {
        setError(updateError.message)
        setSaving(false)
        return
      }
    } else {
      const { data, error: insertError } = await supabase.from('products').insert(payload).select('id').single()
      if (insertError || !data) {
        setError(insertError?.message || 'Gagal membuat produk')
        setSaving(false)
        return
      }
      productId = data.id
    }

    // Sync gallery: delete old, insert current
    await supabase.from('product_images').delete().eq('product_id', productId)
    if (gallery.length > 0) {
      await supabase.from('product_images').insert(
        gallery.map((img, i) => ({
          product_id: productId,
          image_url: img.image_url,
          sort_order: i,
        }))
      )
    }

    // Sync specifications: delete old, insert current
    await supabase.from('product_specifications').delete().eq('product_id', productId)
    const validSpecs = specs.filter((s) => s.spec_key.trim() && s.spec_value.trim())
    if (validSpecs.length > 0) {
      await supabase.from('product_specifications').insert(
        validSpecs.map((s, i) => ({
          product_id: productId,
          spec_key: s.spec_key,
          spec_value: s.spec_value,
          sort_order: i,
        }))
      )
    }

    setSaving(false)
    router.push('/admin/products')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
      {error && <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg">{error}</div>}

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Nama Produk</label>
          <input
            required
            value={values.name}
            onChange={(e) => handleNameChange(e.target.value)}
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#C8102E]"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Slug (URL)</label>
          <input
            required
            value={values.slug}
            onChange={(e) => setValues((v) => ({ ...v, slug: slugify(e.target.value) }))}
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#C8102E]"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Kategori</label>
          <select
            value={values.category_id || ''}
            onChange={(e) => setValues((v) => ({ ...v, category_id: e.target.value || null }))}
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#C8102E]"
          >
            <option value="">Pilih kategori</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Status</label>
          <select
            value={values.status}
            onChange={(e) => setValues((v) => ({ ...v, status: e.target.value as 'draft' | 'published' }))}
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#C8102E]"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>
      </div>

      <div>
        <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Deskripsi Produk</label>
        <textarea
          rows={4}
          value={values.description}
          onChange={(e) => setValues((v) => ({ ...v, description: e.target.value }))}
          className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#C8102E]"
        />
      </div>

      {/* FIELD INPUT E-COMMERCE / MARKETPLACE */}
      <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-3">
        <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider">Link E-Commerce (Pop-up Marketplace)</h3>
        <div className="grid md:grid-cols-3 gap-3">
          <div>
            <label className="text-[11px] font-semibold text-gray-500 mb-1 block">Link Shopee</label>
            <input
              type="url"
              placeholder="https://shopee.co.id/..."
              value={values.shopee_url}
              onChange={(e) => setValues((v) => ({ ...v, shopee_url: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:outline-none focus:border-[#EE4D2D]"
            />
          </div>
          <div>
            <label className="text-[11px] font-semibold text-gray-500 mb-1 block">Link Tokopedia</label>
            <input
              type="url"
              placeholder="https://tokopedia.com/..."
              value={values.tokopedia_url}
              onChange={(e) => setValues((v) => ({ ...v, tokopedia_url: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:outline-none focus:border-[#03AC0E]"
            />
          </div>
          <div>
            <label className="text-[11px] font-semibold text-gray-500 mb-1 block">Link Lazada</label>
            <input
              type="url"
              placeholder="https://lazada.co.id/..."
              value={values.lazada_url}
              onChange={(e) => setValues((v) => ({ ...v, lazada_url: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:outline-none focus:border-[#0F146D]"
            />
          </div>
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
        <input
          type="checkbox"
          checked={values.is_featured}
          onChange={(e) => setValues((v) => ({ ...v, is_featured: e.target.checked }))}
          className="w-4 h-4 accent-[#C8102E]"
        />
        Tampilkan di section produk homepage (Featured)
      </label>

      <ImageUploader
        bucket="product-thumbnails"
        value={values.thumbnail_url}
        onChange={(url) => setValues((v) => ({ ...v, thumbnail_url: url }))}
        label="Thumbnail Produk (untuk showcase & grid)"
      />

      <GalleryUploader images={gallery} onChange={setGallery} />

      <SpecificationsEditor specs={specs} onChange={setSpecs} />

      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          disabled={saving}
          className="bg-[#C8102E] hover:bg-[#a60c24] text-white font-bold text-sm px-6 py-2.5 rounded-lg transition-colors disabled:opacity-60 cursor-pointer"
        >
          {saving ? 'Menyimpan...' : isEdit ? 'Simpan Perubahan' : 'Buat Produk'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin/products')}
          className="text-sm font-semibold text-gray-500 px-6 py-2.5 hover:text-gray-700 cursor-pointer"
        >
          Batal
        </button>
      </div>
    </form>
  )
}
