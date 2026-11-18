'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Plus, Trash2, Pencil, X, Star, Image as ImageIcon, CheckCircle, ExternalLink } from 'lucide-react'
import { ReviewPhotosUploader } from './ReviewPhotosUploader'
import type { ProductReview, Product } from '@/types/database'

interface Props {
  initialReviews: ProductReview[]
  products: Pick<Product, 'id' | 'name' | 'slug' | 'main_image'>[]
}

export function ReviewsManager({ initialReviews, products }: Props) {
  const [reviews, setReviews] = useState<ProductReview[]>(initialReviews)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<ProductReview | null>(null)
  const [saving, setSaving] = useState(false)
  const [filterProduct, setFilterProduct] = useState<string>('all')

  const [form, setForm] = useState({
    product_id: '' as string,
    reviewer_name: '',
    rating: 5,
    title: '',
    content: '',
    review_date: new Date().toISOString().split('T')[0],
    photos: [] as string[],
    is_verified_buyer: true,
    is_featured_homepage: false,
    status: 'published' as 'published' | 'draft',
  })

  function openNew() {
    setEditing(null)
    setForm({
      product_id: products[0]?.id || '',
      reviewer_name: '',
      rating: 5,
      title: '',
      content: '',
      review_date: new Date().toISOString().split('T')[0],
      photos: [],
      is_verified_buyer: true,
      is_featured_homepage: false,
      status: 'published',
    })
    setModalOpen(true)
  }

  function openEdit(r: ProductReview) {
    setEditing(r)
    setForm({
      product_id: r.product_id || '',
      reviewer_name: r.reviewer_name || '',
      rating: r.rating || 5,
      title: r.title || '',
      content: r.content || '',
      review_date: r.review_date ? r.review_date.split('T')[0] : new Date().toISOString().split('T')[0],
      photos: r.photos || [],
      is_verified_buyer: r.is_verified_buyer ?? true,
      is_featured_homepage: r.is_featured_homepage ?? false,
      status: r.status || 'published',
    })
    setModalOpen(true)
  }

  async function handleSave() {
    if (!form.reviewer_name.trim() || !form.title.trim() || !form.content.trim()) {
      alert('Nama, Judul, dan Isi Ulasan wajib diisi!')
      return
    }

    setSaving(true)
    const supabase = createClient()

    const payload = {
      product_id: form.product_id || null,
      reviewer_name: form.reviewer_name.trim(),
      rating: Number(form.rating),
      title: form.title.trim(),
      content: form.content.trim(),
      review_date: form.review_date || new Date().toISOString().split('T')[0],
      photos: form.photos || [],
      is_verified_buyer: form.is_verified_buyer,
      is_featured_homepage: form.is_featured_homepage,
      status: form.status,
      updated_at: new Date().toISOString(),
    }

    if (editing) {
      const { data, error } = await supabase
        .from('product_reviews')
        .update(payload)
        .eq('id', editing.id)
        .select('*, product:products(id, name, slug, main_image)')
        .single()

      if (!error && data) {
        setReviews(reviews.map((r) => (r.id === editing.id ? data : r)))
        setModalOpen(false)
      } else {
        alert(error?.message || 'Gagal menyimpan ulasan')
      }
    } else {
      const { data, error } = await supabase
        .from('product_reviews')
        .insert(payload)
        .select('*, product:products(id, name, slug, main_image)')
        .single()

      if (!error && data) {
        setReviews([data, ...reviews])
        setModalOpen(false)
      } else {
        alert(error?.message || 'Gagal menambahkan ulasan')
      }
    }

    setSaving(false)
  }

  async function handleDelete(id: string) {
    if (!confirm('Yakin ingin menghapus ulasan ini?')) return
    const supabase = createClient()
    const { error } = await supabase.from('product_reviews').delete().eq('id', id)
    if (!error) {
      setReviews(reviews.filter((r) => r.id !== id))
    } else {
      alert('Gagal menghapus: ' + error.message)
    }
  }

  async function toggleHomepage(review: ProductReview) {
    const supabase = createClient()
    const nextVal = !review.is_featured_homepage
    const { error } = await supabase
      .from('product_reviews')
      .update({ is_featured_homepage: nextVal })
      .eq('id', review.id)

    if (!error) {
      setReviews(reviews.map((r) => (r.id === review.id ? { ...r, is_featured_homepage: nextVal } : r)))
    }
  }

  const filtered = filterProduct === 'all'
    ? reviews
    : reviews.filter((r) => r.product_id === filterProduct)

  return (
    <div className="space-y-6">
      {/* Top action & filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-gray-200">
        <div className="flex items-center gap-3">
          <label className="text-xs font-bold text-gray-500 uppercase">Filter Produk:</label>
          <select
            value={filterProduct}
            onChange={(e) => setFilterProduct(e.target.value)}
            className="text-xs sm:text-sm font-semibold bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 outline-none focus:border-[#CC0000]"
          >
            <option value="all">Semua Produk ({reviews.length})</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={openNew}
          className="flex items-center justify-center gap-2 bg-[#CC0000] text-white px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm hover:bg-[#A30000] transition-colors shadow-xs cursor-pointer"
        >
          <Plus size={16} />
          Tambah Ulasan Baru
        </button>
      </div>

      {/* Reviews Table / Grid */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
          <p className="text-gray-400 text-sm font-medium">Belum ada ulasan yang sesuai filter.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-2xs">
          <div className="divide-y divide-gray-100">
            {filtered.map((item) => (
              <div key={item.id} className="p-5 sm:p-6 hover:bg-gray-50/60 transition-colors flex flex-col md:flex-row gap-5 justify-between">
                
                {/* Info Utama */}
                <div className="space-y-2.5 flex-1 min-w-0">
                  {/* Baris Rating + Produk + Badge */}
                  <div className="flex flex-wrap items-center gap-2.5">
                    {/* Bintang */}
                    <div className="flex items-center text-[#CC0000]">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          className={i < item.rating ? 'fill-[#CC0000] text-[#CC0000]' : 'text-gray-200 fill-gray-200'}
                        />
                      ))}
                    </div>

                    <span className="text-xs font-extrabold text-gray-900">• {item.rating}/5</span>

                    {/* Nama Produk */}
                    {item.product && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-stone-100 text-stone-700 text-xs font-bold">
                        {item.product.name}
                      </span>
                    )}

                    {item.is_verified_buyer && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                        <CheckCircle size={12} /> Verified Buyer
                      </span>
                    )}

                    {item.is_featured_homepage && (
                      <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                        ⭐ Tampil di Homepage
                      </span>
                    )}

                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                      item.status === 'published' ? 'bg-blue-50 text-blue-700' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {item.status}
                    </span>
                  </div>

                  {/* Judul & Reviewer */}
                  <div>
                    <h3 className="text-base font-extrabold text-gray-900">{item.title}</h3>
                    <p className="text-xs text-stone-500 font-medium">
                      Oleh <strong className="text-[#CC0000] font-bold">{item.reviewer_name}</strong> •{' '}
                      {item.review_date || 'Baru saja'}
                    </p>
                  </div>

                  {/* Isi Review */}
                  <p className="text-xs sm:text-sm text-gray-700 leading-relaxed font-normal">
                    {item.content}
                  </p>

                  {/* Grid Foto Review jika ada */}
                  {item.photos && item.photos.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {item.photos.map((pUrl, pIdx) => (
                        <a
                          key={pIdx}
                          href={pUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="relative w-14 h-14 rounded-lg overflow-hidden border border-gray-200 hover:border-[#CC0000] transition-colors"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={pUrl} alt="" className="w-full h-full object-cover" />
                        </a>
                      ))}
                    </div>
                  )}
                </div>

                {/* Tombol Aksi */}
                <div className="flex md:flex-col items-center md:items-end justify-between md:justify-center gap-2 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-gray-100">
                  <button
                    type="button"
                    onClick={() => toggleHomepage(item)}
                    className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                      item.is_featured_homepage
                        ? 'bg-amber-100/80 border-amber-300 text-amber-900 hover:bg-amber-200'
                        : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {item.is_featured_homepage ? '★ Di Homepage' : '+ Pasang di Homepage'}
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEdit(item)}
                      className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                      title="Edit ulasan"
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                      title="Hapus ulasan"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal Add / Edit */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h2 className="text-lg font-black text-gray-900">
                {editing ? 'Edit Ulasan Produk' : 'Tambah Ulasan Pelanggan Baru'}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="text-gray-400 hover:text-gray-700 p-1 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4 text-xs sm:text-sm">
              {/* Pilih Produk */}
              <div>
                <label className="block font-bold text-gray-700 mb-1.5">Produk yang Diulas *</label>
                <select
                  value={form.product_id}
                  onChange={(e) => setForm({ ...form, product_id: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2.5 font-semibold text-gray-800 outline-none focus:border-[#CC0000]"
                >
                  <option value="">-- Tanpa Produk Spesifik --</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Grid Baris: Nama & Rating */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 mb-1.5">Nama Reviewer / Pembeli *</label>
                  <input
                    type="text"
                    value={form.reviewer_name}
                    onChange={(e) => setForm({ ...form, reviewer_name: e.target.value })}
                    placeholder="Contoh: Wendy O. / Puan Sarah"
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2.5 font-medium outline-none focus:border-[#CC0000]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1.5">Rating Bintang (1 - 5) *</label>
                  <div className="flex items-center gap-2 py-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setForm({ ...form, rating: star })}
                        className="p-1 cursor-pointer"
                      >
                        <Star
                          size={24}
                          className={star <= form.rating ? 'fill-[#CC0000] text-[#CC0000]' : 'text-gray-200 fill-gray-200'}
                        />
                      </button>
                    ))}
                    <span className="font-extrabold text-sm text-gray-800 ml-2">{form.rating} Bintang</span>
                  </div>
                </div>
              </div>

              {/* Tanggal & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 mb-1.5">Tanggal Review</label>
                  <input
                    type="date"
                    value={form.review_date}
                    onChange={(e) => setForm({ ...form, review_date: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2.5 font-medium outline-none focus:border-[#CC0000]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1.5">Status Publikasi</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value as 'published' | 'draft' })}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2.5 font-semibold outline-none focus:border-[#CC0000]"
                  >
                    <option value="published">Published (Tampil di Web)</option>
                    <option value="draft">Draft (Disembunyikan)</option>
                  </select>
                </div>
              </div>

              {/* Judul Review */}
              <div>
                <label className="block font-bold text-gray-700 mb-1.5">Judul Review / Headline *</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Contoh: Great Tasting / Rasa Asli Sedap Banget!"
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2.5 font-bold outline-none focus:border-[#CC0000]"
                />
              </div>

              {/* Isi Ulasan */}
              <div>
                <label className="block font-bold text-gray-700 mb-1.5">Isi Ulasan Pelanggan *</label>
                <textarea
                  rows={4}
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  placeholder="Tulis ulasan pelanggan di sini..."
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2.5 font-medium outline-none focus:border-[#CC0000] resize-y"
                />
              </div>

              {/* Upload Foto Pelanggan */}
              <div className="pt-2">
                <ReviewPhotosUploader
                  photos={form.photos}
                  onChange={(photos) => setForm({ ...form, photos })}
                />
              </div>

              {/* Opsi Tambahan */}
              <div className="pt-3 border-t border-gray-100 flex flex-wrap gap-6">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-gray-700">
                  <input
                    type="checkbox"
                    checked={form.is_verified_buyer}
                    onChange={(e) => setForm({ ...form, is_verified_buyer: e.target.checked })}
                    className="rounded text-[#CC0000] focus:ring-[#CC0000] w-4 h-4"
                  />
                  <span>Tandai sebagai "Verified Buyer"</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-bold text-gray-700">
                  <input
                    type="checkbox"
                    checked={form.is_featured_homepage}
                    onChange={(e) => setForm({ ...form, is_featured_homepage: e.target.checked })}
                    className="rounded text-[#CC0000] focus:ring-[#CC0000] w-4 h-4"
                  />
                  <span>Tampilkan di Homepage</span>
                </label>
              </div>

            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="px-4 py-2.5 rounded-xl border border-gray-300 font-bold text-gray-600 hover:bg-gray-50 cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="px-6 py-2.5 rounded-xl bg-[#CC0000] text-white font-bold hover:bg-[#A30000] transition-colors disabled:opacity-50 cursor-pointer"
              >
                {saving ? 'Menyimpan...' : editing ? 'Simpan Perubahan' : 'Terbitkan Ulasan'}
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  )
}
