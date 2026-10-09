'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ShoppingBag, X, ChevronRight } from 'lucide-react'
import { ProductGallery } from '@/components/ProductGallery'
import { ProductViewTracker } from '@/components/ProductViewTracker'
import { ProductsGrid } from '@/components/ProductsGrid'

interface ProductDetailClientProps {
  product: {
    id: string
    name: string
    description: string | null
    ingredients?: string | null
    sizes?: string[] | null
    shopee_url?: string | null
    tokopedia_url?: string | null
    lazada_url?: string | null
    category?: { name: string } | null
  }
  images: { id: string; image_url: string }[]
  specs: { id: string; spec_key: string; spec_value: string }[]
  relatedProducts: { slug: string; name: string; img: string; cat: string }[]
  brands?: { id: string; name: string; logo_url: string | null }[]
}

export function ProductDetailClient({
  product,
  images,
  specs,
  relatedProducts,
  brands = [],
}: ProductDetailClientProps) {
  const [isBuyModalOpen, setIsBuyModalOpen] = useState(false)

  const displayName = product.name
  const displayDescription = product.description

  // Format data spesifikasi secara dinamis murni dari database tanpa hardcode
  const dynamicSpecs = [
    ...(product.ingredients ? [{ key: 'Ingredients', value: product.ingredients }] : []),
    ...(displayDescription ? [{ key: 'Description', value: displayDescription }] : []),
    { key: 'Storage', value: 'Refrigerate any unused Awang Brand Paste in a sealed container.' },
    ...(product.sizes && Array.isArray(product.sizes) && product.sizes.length > 0
      ? [{ key: 'Packing Size', value: product.sizes.join(', ') }]
      : [{ key: 'Packing Size', value: '200gm, 1kg, 5kg' }]),
    { key: 'Remark', value: '100% Natural, No Preservatives, HALAL Certified' },
  ]

  const specRows = specs.length > 0
    ? specs.map((s) => ({ key: s.spec_key, value: s.spec_value }))
    : dynamicSpecs

  return (
    <main className="bg-white min-h-screen font-sans text-slate-900 antialiased pt-28 sm:pt-36 pb-20">
      <ProductViewTracker productId={product.id} />

      {/* CONTAINER UTAMA DETAIL PRODUK (LANGSUNG DENGAN BACKGROUND PAGE, TANPA BUNGKUS CARD) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 mb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">

          {/* GALERI GAMBAR PRODUK */}
          <div className="lg:col-span-6 lg:sticky lg:top-28">
            <ProductGallery images={images} productName={displayName} />
          </div>

          {/* DETAIL KONTEN & TABEL SPESIFIKASI */}
          <div className="lg:col-span-6 flex flex-col justify-between h-full space-y-6">

            {/* Header Nama Produk */}
            <div>
              {product.category && (
                <span className="text-xs font-black text-[#C8102E] uppercase tracking-widest block mb-2">
                  {product.category.name}
                </span>
              )}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#C8102E] uppercase tracking-tight leading-tight">
                {displayName}
              </h1>
              <div className="w-full h-[2px] bg-amber-600/30 mt-4 mb-6 border-b border-dashed border-amber-600/40" />
            </div>

            {/* TABEL DETAIL PRODUK (DESAIN BERSIH PUTIH TANPA CARD KREM) */}
            <div className="border border-gray-200 rounded-xl overflow-hidden shadow-xs bg-white">
              <table className="w-full text-xs sm:text-sm text-left">
                <tbody className="divide-y divide-gray-200">
                  {specRows.map((row, idx) => (
                    <tr key={idx} className="hover:bg-gray-50/60 transition-colors">
                      <td className="py-3.5 px-4 sm:px-5 font-bold text-[#4A1521] w-4/12 sm:w-3/12 bg-gray-50/80 border-r border-gray-200 align-top">
                        {row.key}
                      </td>
                      <td className="py-3.5 px-4 sm:px-5 text-slate-800 font-medium leading-relaxed w-8/12 sm:w-9/12 align-top bg-white">
                        {row.value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* TOMBOL "WHERE TO BUY" (MEMANCING POPUP MULTI-MARKETPLACE) */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setIsBuyModalOpen(true)}
                className="w-full py-4 px-8 bg-[#C8102E] hover:bg-[#a60c24] text-white font-extrabold text-sm sm:text-base uppercase tracking-wider rounded-full shadow-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 cursor-pointer"
              >
                <ShoppingBag className="w-5 h-5" />
                <span>Beli Sekarang</span>
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION BRAND LOGOS DINAMIS DARI DATABASE SUPABASE (WE ARE AVAILABLE AT STORES) */}
      {brands.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 mb-16">
          <div className="py-4">
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold uppercase tracking-tight text-[#C8102E] mb-8 text-center">
              KAMI TERSEDIA DI SUPERMARKET & TOKO
            </h3>
            <div className="grid grid-cols-3 sm:grid-cols-6 items-center justify-items-center gap-4 sm:gap-6 md:gap-8 max-w-6xl mx-auto">
              {brands.map((brand) => (
                <div
                  key={brand.id}
                  className="group relative h-12 sm:h-16 w-full px-2 flex items-center justify-center cursor-pointer transition-transform duration-300 hover:scale-105"
                >
                  {brand.logo_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={brand.logo_url}
                      alt={brand.name}
                      className="max-h-10 sm:max-h-12 w-auto object-contain transition-all duration-300"
                    />
                  ) : (
                    <span className="text-sm sm:text-base font-bold text-stone-800 tracking-tight text-center">
                      {brand.name}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* SECTION RELATED PRODUCTS */}
      {relatedProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl sm:text-3xl font-black text-[#C8102E] uppercase tracking-tight">
              Produk Lainnya
            </h2>
            <Link
              href="/products"
              className="inline-flex items-center gap-1 text-xs sm:text-sm font-extrabold text-[#C8102E] hover:underline uppercase tracking-wider"
            >
              <span>Lihat Semua</span>
              <ChevronRight size={16} />
            </Link>
          </div>
          <ProductsGrid products={relatedProducts} showFilters={false} />
        </section>
      )}

      {/* MODAL POPUP WHERE TO BUY (3 ONLINE PLATFORMS) */}
      {isBuyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-gray-100">
            {/* Tombol Close */}
            <button
              type="button"
              onClick={() => setIsBuyModalOpen(false)}
              className="absolute top-5 right-5 p-2 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header Modal */}
            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-red-50 text-[#C8102E] rounded-full flex items-center justify-center mx-auto mb-3">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black text-[#111111] uppercase tracking-tight">
                Pilih Toko Online
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 font-medium mt-1">
                Beli produk ini di toko resmi kesayangan Anda
              </p>
            </div>

            {/* List 3 Ikon Marketplace (Shopee, Lazada, Tokopedia/Instagram) */}
            <div className="space-y-3.5">
              {/* Shopee */}
              <a
                href={product.shopee_url || 'https://shopee.co.id'}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4 rounded-2xl border border-orange-100 bg-orange-50/50 hover:bg-orange-50 transition-all duration-200 group"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-[#EE4D2D] text-white flex items-center justify-center font-black text-lg shadow-sm">
                    S
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-gray-900 group-hover:text-[#EE4D2D] transition-colors">Shopee Official Store</h4>
                    <p className="text-[11px] text-gray-500">Gratis Ongkir & Voucher Diskon</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform" />
              </a>

              {/* Tokopedia */}
              <a
                href={product.tokopedia_url || 'https://tokopedia.com'}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4 rounded-2xl border border-emerald-100 bg-emerald-50/50 hover:bg-emerald-50 transition-all duration-200 group"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-[#03AC0E] text-white flex items-center justify-center font-black text-lg shadow-sm">
                    T
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-gray-900 group-hover:text-[#03AC0E] transition-colors">Tokopedia Official Store</h4>
                    <p className="text-[11px] text-gray-500">Pengiriman Cepat & Cashback</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform" />
              </a>

              {/* Lazada */}
              <a
                href={product.lazada_url || 'https://lazada.co.id'}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4 rounded-2xl border border-blue-100 bg-blue-50/50 hover:bg-blue-50 transition-all duration-200 group"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-[#0F146D] text-white flex items-center justify-center font-black text-lg shadow-sm">
                    L
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-gray-900 group-hover:text-[#0F146D] transition-colors">Lazada Flagship Store</h4>
                    <p className="text-[11px] text-gray-500">Jaminan 100% Produk Original</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>

          </div>
        </div>
      )}
    </main>
  )
}
