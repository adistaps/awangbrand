'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ShoppingBag, X, ChevronRight, ChevronLeft, Plus, Minus } from 'lucide-react'
import { ProductGallery } from '@/components/ProductGallery'
import { ProductViewTracker } from '@/components/ProductViewTracker'

interface RelatedProduct {
  slug: string
  name: string
  img: string
  cat: string
  sizes?: string[]
}

interface RelatedRecipe {
  id: string
  title: string
  slug: string
  main_image: string
  category: string
  prep_time?: string | null
  cook_time?: string | null
  servings?: string | number | null
}

interface ProductDetailClientProps {
  product: {
    id: string
    name: string
    description: string | null
    ingredients?: string | null
    how_to_use?: string | null
    sizes?: string[] | null
    shopee_url?: string | null
    tokopedia_url?: string | null
    lazada_url?: string | null
    category?: { name: string } | null
    nutritional_facts?: Record<string, unknown> | null
  }
  images: { id: string; image_url: string }[]
  specs: { id: string; spec_key: string; spec_value: string }[]
  relatedProducts: RelatedProduct[]
  relatedRecipes?: RelatedRecipe[]
  brands?: { id: string; name: string; logo_url: string | null }[]
}

// Accordion item component
function AccordionItem({
  title,
  children,
  defaultOpen = false,
}: {
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div className="border-b border-[#e0d8cc]">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between py-4 text-left group"
        aria-expanded={open}
      >
        <span className="text-[15px] font-semibold text-[#2b1a10] tracking-wide group-hover:text-[#CC0000] transition-colors">
          {title}
        </span>
        {open ? (
          <Minus className="w-4 h-4 text-[#CC0000] shrink-0" />
        ) : (
          <Plus className="w-4 h-4 text-[#CC0000] shrink-0" />
        )}
      </button>
      {open && (
        <div className="pb-5 text-[14px] text-[#5a4636] leading-relaxed whitespace-pre-line">
          {children}
        </div>
      )}
    </div>
  )
}

// Carousel horizontal bergaya Heinz: judul merah di kiri, panah bulat di kanan.
// Panah kiri/kanan otomatis redup saat sudah mentok.
function Carousel({
  title,
  itemCount,
  action,
  children,
}: {
  title: string
  itemCount: number
  action?: React.ReactNode
  children: React.ReactNode
}) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  function updateScrollState() {
    const el = scrollRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 4)
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4)
  }

  useEffect(() => {
    updateScrollState()
    window.addEventListener('resize', updateScrollState)
    return () => window.removeEventListener('resize', updateScrollState)
  }, [itemCount])

  function scrollByCard(dir: 'left' | 'right') {
    const el = scrollRef.current
    if (!el) return
    const firstCard = el.firstElementChild as HTMLElement | null
    const step = firstCard ? firstCard.offsetWidth + 24 : 320
    el.scrollBy({ left: dir === 'left' ? -step : step, behavior: 'smooth' })
  }

  const arrowClass =
    'w-10 h-10 sm:w-11 sm:h-11 rounded-full border-2 border-[#CC0000] text-[#CC0000] flex items-center justify-center transition-all duration-200 cursor-pointer enabled:hover:bg-[#CC0000] enabled:hover:text-white disabled:opacity-35 disabled:cursor-default'

  return (
    <div className="max-w-[1440px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl sm:text-4xl font-black text-[#CC0000] tracking-tight font-heinz">
          {title}
        </h2>
        <div className="flex items-center gap-3">
          {action}
          <button
            type="button"
            onClick={() => scrollByCard('left')}
            disabled={!canScrollLeft}
            className={arrowClass}
            aria-label={`Scroll ${title} left`}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={() => scrollByCard('right')}
            disabled={!canScrollRight}
            className={arrowClass}
            aria-label={`Scroll ${title} right`}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Horizontal scroll */}
      <div
        ref={scrollRef}
        onScroll={updateScrollState}
        className="flex gap-6 overflow-x-auto pb-6 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {children}
      </div>
    </div>
  )
}

// Format jumlah porsi: angka -> "6 Servings", teks lain dipakai apa adanya
function formatServings(servings?: string | number | null): string | null {
  if (servings === null || servings === undefined || servings === '') return null
  const text = String(servings).trim()
  if (/^\d+$/.test(text)) return `${text} ${text === '1' ? 'Serving' : 'Servings'}`
  return text
}

export function ProductDetailClient({
  product,
  images,
  specs,
  relatedProducts,
  relatedRecipes = [],
  brands = [],
}: ProductDetailClientProps) {
  const [isBuyModalOpen, setIsBuyModalOpen] = useState(false)

  const categoryName =
    (product.category as unknown as { name: string } | null)?.name ?? 'AWANG Brand'

  // Helper: ambil nilai dari specs berdasarkan key (case-insensitive)
  function getSpec(key: string): string | null {
    const found = specs.find((s) => s.spec_key.toLowerCase().includes(key.toLowerCase()))
    return found ? found.spec_value : null
  }

  // Accordion fields — prioritize dedicated DB columns, then specs
  const descriptionText = product.description || getSpec('description')
  const ingredientsText = product.ingredients || getSpec('ingredient')
  const howToUseText = product.how_to_use || getSpec('how to use') || getSpec('cara')
  const sizeText =
    product.sizes && product.sizes.length > 0
      ? product.sizes.join(', ')
      : getSpec('size') || getSpec('berat') || getSpec('packing')
  const remarkText = getSpec('remark') || getSpec('catatan')
  const tipsText = getSpec('tips') || getSpec('tip') || getSpec('petua')

  return (
    <main className="bg-white min-h-screen font-sans text-slate-900 antialiased">
      <ProductViewTracker productId={product.id} />

      {/* ── BREADCRUMB ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 pt-28 sm:pt-36 pb-4">
        <nav className="flex items-center gap-1.5 text-xs text-[#7a6555]">
          <Link href="/" className="hover:text-[#CC0000] transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/products" className="hover:text-[#CC0000] transition-colors">Products</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-[#2b1a10] font-medium truncate max-w-[200px]">{product.name}</span>
        </nav>
      </div>

      {/* ── MAIN PRODUCT SECTION ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">

          {/* LEFT — Gallery */}
          <div className="lg:sticky lg:top-28">
            <ProductGallery images={images} productName={product.name} />
          </div>

          {/* RIGHT — Info */}
          <div className="flex flex-col gap-6 pt-2">

            {/* Brand / Category label */}
            <p className="text-xs font-bold text-[#CC0000] uppercase tracking-widest">
              {categoryName}
            </p>

            {/* Product name */}
            <h1 className="text-3xl sm:text-4xl lg:text-[2.6rem] font-black text-[#1a0f08] leading-tight tracking-tight">
              {product.name}
            </h1>

            {/* Size pill */}
            {sizeText && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#7a6555] font-semibold uppercase tracking-wide">
                  Sizes available:
                </span>
                <span className="text-xs font-bold text-[#2b1a10] border border-[#c5b49a] rounded-full px-3 py-0.5 bg-white">
                  {sizeText}
                </span>
              </div>
            )}

            {/* Buy button */}
            <div className="pt-1">
              <button
                type="button"
                id="btn-buy-now"
                onClick={() => setIsBuyModalOpen(true)}
                className="inline-flex items-center gap-2.5 bg-[#1a0f08] hover:bg-[#CC0000] text-white font-bold text-sm uppercase tracking-widest px-8 py-3.5 rounded-full shadow-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                Beli Sekarang
              </button>
            </div>

            {/* Divider */}
            <div className="border-t border-[#e0d8cc] pt-4">
              <p className="text-[13px] font-bold text-[#2b1a10] uppercase tracking-widest mb-3">
                Product Information
              </p>

              {/* Accordion */}
              <div>
                {descriptionText && (
                  <AccordionItem title="Description" defaultOpen={true}>
                    {descriptionText}
                  </AccordionItem>
                )}
                {ingredientsText && (
                  <AccordionItem title="Ingredients">
                    {ingredientsText}
                  </AccordionItem>
                )}
                {howToUseText && (
                  <AccordionItem title="How to Use">
                    {howToUseText}
                  </AccordionItem>
                )}
                {sizeText && (
                  <AccordionItem title="Size">
                    {sizeText}
                  </AccordionItem>
                )}
                {remarkText && (
                  <AccordionItem title="Remark">
                    {remarkText}
                  </AccordionItem>
                )}
                {tipsText && (
                  <AccordionItem title="Tips!">
                    {tipsText}
                  </AccordionItem>
                )}

                {/* Jika tidak ada field manapun yang terisi, fallback ke specs lain */}
                {!descriptionText && !ingredientsText && !howToUseText && !sizeText && !remarkText && specs.length > 0 && (
                  specs.map((s) => (
                    <AccordionItem key={s.id} title={s.spec_key}>
                      {s.spec_value}
                    </AccordionItem>
                  ))
                )}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── BRANDS / AVAILABLE AT ── */}
      {brands.length > 0 && (
        <section className="bg-white py-12 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto">
            <p className="text-center text-xs font-bold text-[#7a6555] uppercase tracking-widest mb-8">
              Tersedia di
            </p>
            <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10">
              {brands.map((brand) => (
                <div
                  key={brand.id}
                  className="h-10 sm:h-12 flex items-center justify-center transition-all duration-300 hover:scale-105"
                >
                  {brand.logo_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={brand.logo_url}
                      alt={brand.name}
                      className="max-h-10 sm:max-h-12 w-auto object-contain"
                    />
                  ) : (
                    <span className="text-sm font-bold text-stone-700">{brand.name}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── OTHER PRODUCTS YOU MAY LIKE (gaya Heinz + efek hover seperti ProductsGrid) ── */}
      {relatedProducts.length > 0 && (
        <section className="py-14 px-4 sm:px-8 lg:px-12 bg-white">
          <Carousel title="Other Products You May Like" itemCount={relatedProducts.length}>
            {relatedProducts.map((p) => (
              <Link
                key={p.slug}
                href={`/products/${p.slug}`}
                className="group shrink-0 snap-start w-[72%] sm:w-[44%] lg:w-[29%] flex flex-col items-center text-center focus:outline-none"
              >
                {/* Kotak gambar: putih, hover berubah merah (sama seperti ProductsGrid) */}
                <div className="relative w-full aspect-[4/5] flex items-center justify-center p-2 sm:p-3 overflow-hidden bg-white group-hover:bg-[#9B1527] transition-colors duration-500 ease-out">
                  {/* Gambar produk: naik sedikit, bergeser + miring saat hover */}
                  <div className="relative w-full h-[76%] -translate-y-3 sm:-translate-y-4 lg:-translate-y-5 z-10 flex items-center justify-center">
                    {p.img ? (
                      <Image
                        src={p.img}
                        alt={p.name}
                        fill
                        unoptimized
                        sizes="(max-width: 640px) 72vw, (max-width: 1024px) 44vw, 29vw"
                        className="object-contain filter drop-shadow-[0_8px_10px_rgba(0,0,0,0.22)] group-hover:translate-x-1.5 group-hover:rotate-3 transition-transform duration-500 ease-out origin-center"
                      />
                    ) : (
                      <div className="w-24 h-24 rounded-2xl bg-stone-100 flex items-center justify-center text-[#7a6555] text-4xl">
                        🍲
                      </div>
                    )}
                  </div>

                  {/* Bayangan di bawah produk */}
                  <div className="absolute bottom-8 sm:bottom-9 lg:bottom-11 left-1/2 -translate-x-1/2 w-2/5 h-2 bg-black/20 group-hover:bg-black/30 rounded-full blur-[4px] transition-all duration-500 pointer-events-none" />
                </div>

                {/* Info produk di bawah kartu */}
                <div className="mt-4 w-full flex flex-col items-center text-center px-1">
                  <span className="text-sm font-bold text-[#540B26] tracking-tight">
                    Awang
                  </span>
                  <h3 className="mt-1 w-full truncate text-xl sm:text-2xl font-black text-[#CC0000] tracking-tight leading-tight font-heinz">
                    {p.name}
                  </h3>
                  {p.sizes && p.sizes.length > 0 ? (
                    <p className="mt-1.5 text-xs sm:text-sm font-medium text-[#540B26]">
                      Available in {p.sizes.length} {p.sizes.length === 1 ? 'size' : 'sizes'}
                    </p>
                  ) : p.cat ? (
                    <p className="mt-1.5 text-xs sm:text-sm font-medium text-[#540B26]">
                      {p.cat}
                    </p>
                  ) : null}
                </div>
              </Link>
            ))}
          </Carousel>
        </section>
      )}

      {/* ── COOK WITH US (gaya Heinz: teks di bawah gambar, rata tengah) ── */}
      {relatedRecipes.length > 0 && (
        <section className="py-14 px-4 sm:px-8 lg:px-12 bg-white">
          <Carousel
            title="Cook With Us"
            itemCount={relatedRecipes.length}
            action={
              <Link
                href="/recipes"
                className="text-xs font-bold text-[#2b1a10] hover:text-[#CC0000] uppercase tracking-widest transition-colors mr-2 hidden sm:inline"
              >
                See All Recipes
              </Link>
            }
          >
            {relatedRecipes.map((recipe) => {
              // Baris meta: waktu • porsi • kategori
              const metaItems = [
                recipe.prep_time ? `Prep ${recipe.prep_time}` : null,
                recipe.cook_time ? `Cook ${recipe.cook_time}` : null,
                formatServings(recipe.servings),
                recipe.category || null,
              ].filter(Boolean) as string[]

              return (
                <Link
                  key={recipe.id}
                  href={`/recipes/${recipe.slug}`}
                  className="group shrink-0 snap-start w-[72%] sm:w-[44%] lg:w-[29%] flex flex-col items-center text-center focus:outline-none"
                >
                  {/* Gambar full-bleed, rasio sama dengan kartu produk */}
                  <div className="w-full aspect-[4/5] overflow-hidden bg-[#e0d8cc]">
                    {recipe.main_image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={recipe.main_image}
                        alt={recipe.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-5xl">
                        🍳
                      </div>
                    )}
                  </div>

                  {/* Teks di bawah gambar: judul, label "Recipes", lalu meta */}
                  <div className="mt-4 w-full flex flex-col items-center text-center px-1">
                    <h3 className="w-full truncate text-xl sm:text-2xl font-black text-[#CC0000] uppercase tracking-tight leading-tight font-heinz">
                      {recipe.title}
                    </h3>
                    <p className="mt-1.5 text-sm font-bold text-[#540B26]">
                      Recipes
                    </p>
                    {metaItems.length > 0 && (
                      <p className="mt-1 text-xs sm:text-sm font-medium text-[#540B26] flex flex-wrap items-center justify-center gap-x-2">
                        {metaItems.map((item, i) => (
                          <span key={`${item}-${i}`} className="inline-flex items-center gap-2">
                            {i > 0 && <span aria-hidden="true">•</span>}
                            <span className={i < 2 && (recipe.prep_time || recipe.cook_time) ? 'uppercase' : ''}>
                              {item}
                            </span>
                          </span>
                        ))}
                      </p>
                    )}
                  </div>
                </Link>
              )
            })}
          </Carousel>

          <div className="text-center mt-4 sm:hidden">
            <Link
              href="/recipes"
              className="inline-flex items-center gap-1 text-sm font-bold text-[#CC0000] hover:underline uppercase tracking-widest"
            >
              See All Recipes <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      )}

      {/* ── BUY MODAL ── */}
      {isBuyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-gray-100">
            <button
              type="button"
              onClick={() => setIsBuyModalOpen(false)}
              className="absolute top-5 right-5 p-2 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-red-50 text-[#CC0000] rounded-full flex items-center justify-center mx-auto mb-3">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black text-[#111111] uppercase tracking-tight">
                Pilih Toko Online
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 font-medium mt-1">
                Beli produk ini di toko resmi kesayangan Anda
              </p>
            </div>

            <div className="space-y-3.5">
              {/* Shopee */}
              {product.shopee_url ? (
                <a
                  href={product.shopee_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 rounded-2xl border border-orange-100 bg-orange-50/50 hover:bg-orange-50 transition-all duration-200 group"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-white border border-orange-100 flex items-center justify-center p-2 shadow-sm shrink-0">
                      <Image src="/icon/shopee.svg" alt="Shopee" width={28} height={28} className="object-contain w-full h-full" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-gray-900 group-hover:text-[#EE4D2D] transition-colors">Shopee Official Store</h4>
                      <p className="text-[11px] text-gray-500">Gratis Ongkir & Voucher Diskon</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform" />
                </a>
              ) : (
                <div
                  className="flex items-center justify-between p-4 rounded-2xl border border-gray-200 bg-gray-50/70 opacity-60 cursor-not-allowed select-none"
                  title="Belum tersedia untuk produk ini"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center p-2 shadow-sm shrink-0 grayscale">
                      <Image src="/icon/shopee.svg" alt="Shopee" width={28} height={28} className="object-contain w-full h-full" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-gray-400">Shopee Official Store</h4>
                      <p className="text-[11px] text-gray-400 italic">Belum tersedia</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-semibold text-gray-400 bg-gray-200/60 px-2 py-0.5 rounded-md">Off</span>
                </div>
              )}

              {/* Tokopedia */}
              {product.tokopedia_url ? (
                <a
                  href={product.tokopedia_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 rounded-2xl border border-emerald-100 bg-emerald-50/50 hover:bg-emerald-50 transition-all duration-200 group"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-white border border-emerald-100 flex items-center justify-center p-2 shadow-sm shrink-0">
                      <Image src="/icon/tokopedia.svg" alt="Tokopedia" width={28} height={28} className="object-contain w-full h-full" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-gray-900 group-hover:text-[#03AC0E] transition-colors">Tokopedia Official Store</h4>
                      <p className="text-[11px] text-gray-500">Pengiriman Cepat & Cashback</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform" />
                </a>
              ) : (
                <div
                  className="flex items-center justify-between p-4 rounded-2xl border border-gray-200 bg-gray-50/70 opacity-60 cursor-not-allowed select-none"
                  title="Belum tersedia untuk produk ini"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center p-2 shadow-sm shrink-0 grayscale">
                      <Image src="/icon/tokopedia.svg" alt="Tokopedia" width={28} height={28} className="object-contain w-full h-full" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-gray-400">Tokopedia Official Store</h4>
                      <p className="text-[11px] text-gray-400 italic">Belum tersedia</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-semibold text-gray-400 bg-gray-200/60 px-2 py-0.5 rounded-md">Off</span>
                </div>
              )}

              {/* Lazada */}
              {product.lazada_url ? (
                <a
                  href={product.lazada_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 rounded-2xl border border-blue-100 bg-blue-50/50 hover:bg-blue-50 transition-all duration-200 group"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-white border border-blue-100 flex items-center justify-center p-2 shadow-sm shrink-0">
                      <Image src="/icon/lazada.svg" alt="Lazada" width={28} height={28} className="object-contain w-full h-full" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-gray-900 group-hover:text-[#0F146D] transition-colors">Lazada Flagship Store</h4>
                      <p className="text-[11px] text-gray-500">Jaminan 100% Produk Original</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform" />
                </a>
              ) : (
                <div
                  className="flex items-center justify-between p-4 rounded-2xl border border-gray-200 bg-gray-50/70 opacity-60 cursor-not-allowed select-none"
                  title="Belum tersedia untuk produk ini"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center p-2 shadow-sm shrink-0 grayscale">
                      <Image src="/icon/lazada.svg" alt="Lazada" width={28} height={28} className="object-contain w-full h-full" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-gray-400">Lazada Flagship Store</h4>
                      <p className="text-[11px] text-gray-400 italic">Belum tersedia</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-semibold text-gray-400 bg-gray-200/60 px-2 py-0.5 rounded-md">Off</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  )
}