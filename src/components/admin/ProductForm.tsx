'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Check } from 'lucide-react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFire, faSliders } from '@fortawesome/free-solid-svg-icons'
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
  is_carousel: boolean
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
      is_carousel: false,
      status: 'published',
    }
  )
  const [gallery, setGallery] = useState<GalleryImage[]>(initialGallery)
  const [specs, setSpecs] = useState<SpecRow[]>(initialSpecs)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const [isSlugCustomized, setIsSlugCustomized] = useState(false)

  function slugify(text: string) {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }

  function handleNameChange(name: string) {
    setValues((v) => ({
      ...v,
      name,
      slug: isSlugCustomized ? v.slug : slugify(name),
    }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError('')

    const supabase = createClient()

    if (values.is_featured && (!isEdit || !initialValues?.is_featured)) {
      const { count } = await supabase.from('products').select('*', { count: 'exact', head: true }).eq('is_featured', true)
      if ((count || 0) >= 4) {
        setError('Maksimal 4 produk untuk section "TASTE THE HEAT" (Featured Grid). Silakan nonaktifkan produk lain terlebih dahulu!')
        setSaving(false)
        return
      }
    }

    if (values.is_carousel && (!isEdit || !initialValues?.is_carousel)) {
      const { count } = await supabase.from('products').select('*', { count: 'exact', head: true }).eq('is_carousel', true)
      if ((count || 0) >= 8) {
        setError('Maksimal 8 produk untuk section "TEMUKAN PILIHANMU" (Product Carousel). Silakan nonaktifkan produk lain terlebih dahulu!')
        setSaving(false)
        return
      }
    }

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
      is_carousel: values.is_carousel,
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
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl bg-white p-5 sm:p-8 rounded-2xl border border-gray-100 shadow-xs">
      {error && <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl border border-red-100">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-semibold text-gray-700 mb-1.5 block">Nama Produk</label>
          <input
            required
            value={values.name}
            onChange={(e) => handleNameChange(e.target.value)}
            placeholder="cth: Pes Rendang Tok Warisan"
            className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#C8102E] transition-colors"
          />
        </div>
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-semibold text-gray-700">Slug (URL)</label>
            {isSlugCustomized && (
              <button
                type="button"
                onClick={() => {
                  setIsSlugCustomized(false)
                  setValues((v) => ({ ...v, slug: slugify(v.name) }))
                }}
                className="text-[11px] text-[#C8102E] hover:underline font-medium"
              >
                Reset otomatis
              </button>
            )}
          </div>
          <input
            required
            value={values.slug}
            onChange={(e) => {
              setIsSlugCustomized(true)
              setValues((v) => ({ ...v, slug: slugify(e.target.value) }))
            }}
            placeholder="otomatis-dari-nama-produk"
            className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#C8102E] bg-gray-50/50 transition-colors"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-semibold text-gray-700 mb-1.5 block">Kategori</label>
          <select
            value={values.category_id || ''}
            onChange={(e) => setValues((v) => ({ ...v, category_id: e.target.value || null }))}
            className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#C8102E] bg-white transition-colors"
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
          <label className="text-xs font-semibold text-gray-700 mb-1.5 block">Status Publikasi</label>
          <select
            value={values.status}
            onChange={(e) => setValues((v) => ({ ...v, status: e.target.value as 'draft' | 'published' }))}
            className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#C8102E] bg-white transition-colors"
          >
            <option value="draft">Draft (Disembunyikan)</option>
            <option value="published">Published (Tayang)</option>
          </select>
        </div>
      </div>

      <div>
        <label className="text-xs font-semibold text-gray-700 mb-1.5 block">Deskripsi Produk</label>
        <textarea
          rows={4}
          value={values.description}
          onChange={(e) => setValues((v) => ({ ...v, description: e.target.value }))}
          placeholder="Jelaskan cita rasa, keunggulan bahan alami, dan panduan saji..."
          className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#C8102E] transition-colors"
        />
      </div>

      {/* FIELD INPUT E-COMMERCE / MARKETPLACE */}
      <div className="bg-gray-50/70 p-4 sm:p-5 rounded-2xl border border-gray-100 space-y-3">
        <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider">Link E-Commerce (Shopee, Tokopedia, Lazada)</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="text-[11px] font-semibold text-gray-500 mb-1 block">Link Shopee</label>
            <input
              type="url"
              placeholder="https://shopee.co.id/..."
              value={values.shopee_url}
              onChange={(e) => setValues((v) => ({ ...v, shopee_url: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs bg-white focus:outline-none focus:border-[#EE4D2D]"
            />
          </div>
          <div>
            <label className="text-[11px] font-semibold text-gray-500 mb-1 block">Link Tokopedia</label>
            <input
              type="url"
              placeholder="https://tokopedia.com/..."
              value={values.tokopedia_url}
              onChange={(e) => setValues((v) => ({ ...v, tokopedia_url: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs bg-white focus:outline-none focus:border-[#03AC0E]"
            />
          </div>
          <div>
            <label className="text-[11px] font-semibold text-gray-500 mb-1 block">Link Lazada</label>
            <input
              type="url"
              placeholder="https://lazada.co.id/..."
              value={values.lazada_url}
              onChange={(e) => setValues((v) => ({ ...v, lazada_url: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs bg-white focus:outline-none focus:border-[#0F146D]"
            />
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {/* Checkbox 1: TASTE THE HEAT (Featured Grid) */}
        <div className="bg-red-50/40 p-4 rounded-2xl border border-red-100">
          <label className="flex items-start gap-3.5 cursor-pointer select-none">
            <div className="relative flex items-center justify-center shrink-0 mt-0.5">
              <input
                type="checkbox"
                checked={values.is_featured}
                onChange={(e) => setValues((v) => ({ ...v, is_featured: e.target.checked }))}
                className="sr-only peer"
              />
              <div className="w-5 h-5 rounded-full border-2 border-[#C8102E] bg-white transition-all flex items-center justify-center shadow-xs peer-focus-visible:ring-2 peer-focus-visible:ring-[#C8102E]/30">
                <Check
                  size={13}
                  strokeWidth={3}
                  className={`text-emerald-600 transition-transform duration-150 ${
                    values.is_featured ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
                  }`}
                />
              </div>
            </div>
            <div>
              <span className="text-sm font-semibold text-[#C8102E] flex items-center gap-2">
                <FontAwesomeIcon icon={faFire} className="text-[#C8102E]" />
                Section &ldquo;TASTE THE HEAT&rdquo; (Featured Grid)
              </span>
              <span className="text-xs text-gray-500 block mt-0.5">
                Centang jika produk ini ingin ditampilkan di grid unggulan berlatar merah.
              </span>
            </div>
          </label>
        </div>

        {/* Checkbox 2: TEMUKAN PILIHANMU (Product Carousel) */}
        <div className="bg-amber-50/40 p-4 rounded-2xl border border-amber-100">
          <label className="flex items-start gap-3.5 cursor-pointer select-none">
            <div className="relative flex items-center justify-center shrink-0 mt-0.5">
              <input
                type="checkbox"
                checked={values.is_carousel}
                onChange={(e) => setValues((v) => ({ ...v, is_carousel: e.target.checked }))}
                className="sr-only peer"
              />
              <div className="w-5 h-5 rounded-full border-2 border-[#C8102E] bg-white transition-all flex items-center justify-center shadow-xs peer-focus-visible:ring-2 peer-focus-visible:ring-[#C8102E]/30">
                <Check
                  size={13}
                  strokeWidth={3}
                  className={`text-emerald-600 transition-transform duration-150 ${
                    values.is_carousel ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
                  }`}
                />
              </div>
            </div>
            <div>
              <span className="text-sm font-semibold text-[#0A1628] flex items-center gap-2">
                <FontAwesomeIcon icon={faSliders} className="text-amber-600" />
                Section &ldquo;TEMUKAN PILIHANMU&rdquo; (Product Carousel Pop-out)
              </span>
              <span className="text-xs text-gray-500 block mt-0.5">
                Centang jika produk ini ingin ditampilkan di carousel scroll horizontal homepage.
              </span>
            </div>
          </label>
        </div>
      </div>

      <ImageUploader
        bucket="product-thumbnails"
        value={values.thumbnail_url}
        onChange={(url) => setValues((v) => ({ ...v, thumbnail_url: url }))}
        label="Thumbnail Produk (untuk katalog & grid produk)"
      />

      <GalleryUploader images={gallery} onChange={setGallery} />

      <SpecificationsEditor specs={specs} onChange={setSpecs} />

      <div className="flex flex-col sm:flex-row items-center gap-3 pt-4 border-t border-gray-100">
        <button
          type="submit"
          disabled={saving}
          className="w-full sm:w-auto bg-[#C8102E] hover:bg-[#a60c24] !text-white font-bold text-sm px-7 py-3 rounded-xl transition-all shadow-xs active:scale-95 disabled:opacity-60 cursor-pointer text-center"
        >
          <span className="!text-white text-white">{saving ? 'Menyimpan...' : isEdit ? 'Simpan Perubahan' : 'Buat Produk'}</span>
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin/products')}
          className="w-full sm:w-auto text-sm font-semibold text-gray-500 px-6 py-3 hover:text-gray-700 cursor-pointer text-center"
        >
          Batal
        </button>
      </div>
    </form>
  )
}
