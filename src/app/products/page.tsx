import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { ProductsGrid } from '@/components/ProductsGrid'

export const metadata: Metadata = {
  title: 'Products - AwangBrand',
  description:
    'Jelajahi aneka pes masakan autentik, perencah warisan Melayu, sambal, dan sos lazat dari AWANG Brand Malaysia. 100% ramuan asli semulajadi, disahkan Halal JAKIM, tanpa bahan pengawet.',
  keywords: [
    'Awang Brand',
    'Awang Brand Malaysia',
    'pes masakan Malaysia',
    'cooking paste Malaysia',
    'perencah masakan Melayu',
    'pes sambal serbaguna',
    'pes kari dan rendang',
    'bumbu masakan Halal JAKIM',
    'Malaysian culinary paste',
    'Asian cooking paste',
    'natural cooking paste',
  ],
  openGraph: {
    title: 'Katalog Pes Masakan & Bumbu Warisan Melayu | AWANG Brand Malaysia',
    description:
      'Pilihan pes masakan sedia dimasak, ramuan rempah asli berkualiti tinggi disahkan HALAL JAKIM dari AWANG Brand Malaysia.',
    url: 'https://awangbrand.com/products',
    images: [{ url: '/og-image.webp', width: 1200, height: 630, alt: 'Katalog Pes Masakan AWANG Brand Malaysia' }],
  },
  alternates: { canonical: 'https://awangbrand.com/products' },
}

export const dynamic = 'force-dynamic'

export default async function Page() {
  const supabase = await createClient()

  const [{ data: products }, { data: categories }, { data: hierarchySetting }] = await Promise.all([
    supabase
      .from('products')
      .select('id, name, slug, main_image, sizes, nutritional_facts, category:categories(name)')
      .eq('status', 'published')
      .order('created_at', { ascending: false }),

    supabase
      .from('categories')
      .select('id, name, slug, image_url')
      .order('name', { ascending: true }),

    supabase
      .from('site_settings')
      .select('value')
      .eq('key', 'product_categories_hierarchy')
      .maybeSingle(),
  ])

  let categoryGroups = []
  try {
    if (hierarchySetting?.value) {
      categoryGroups = JSON.parse(hierarchySetting.value)
    }
  } catch (err) {
    categoryGroups = []
  }

  return (
    <main className="bg-white font-sans">
      {/* ==========================================
          HERO SECTION (GAYA HEINZ: TEKS KIRI, GAMBAR KANAN)
      ========================================== */}
      <section className="relative w-full bg-[#CC0000] text-white pt-28 sm:pt-36 lg:pt-32 pb-16 sm:pb-24 lg:pb-0 px-6 sm:px-12 md:px-16 lg:pr-0 overflow-hidden flex items-center min-h-[600px] lg:min-h-[700px]">
        <div className="max-w-[1600px] mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 items-center relative z-10">
          {/* Kolom Kiri: Judul, Subtitle, Tombol */}
          <div className="lg:col-span-5 flex flex-col justify-center space-y-4 order-1 lg:pl-12 xl:pl-24">
            <h1 className="text-4xl sm:text-5xl lg:text-5xl xl:text-6xl font-bold text-white leading-[1.05] tracking-tight">
              Favorites from AWANG
            </h1>
            <p className="text-base sm:text-lg md:text-base lg:text-lg text-white/90 font-medium leading-relaxed max-w-md">
              Featuring Sambal Balado Merah, Asam Pedas and Lemak Cili Padi, made with 100% natural spices.
            </p>
            <div className="pt-1">
              <Link
                href="#katalog"
                className="inline-flex items-center gap-2 rounded-full bg-[#4A1521] hover:bg-[#600713] transition-colors text-white font-bold px-8 py-4 text-base sm:text-lg lg:px-6 lg:py-3 lg:text-sm"
              >
                Explore All
                <span aria-hidden="true">↗</span>
              </Link>
            </div>
          </div>

          {/* Kolom Kanan: Gambar produk (mepet kanan, tidak terpotong) */}
          <div className="lg:col-span-7 relative flex justify-center lg:justify-end items-center order-2">
            <div className="relative w-full max-w-[680px] aspect-[3/4] h-[620px] sm:h-[760px] lg:max-w-none lg:aspect-auto lg:h-[680px] xl:h-[720px] lg:w-full lg:mr-1 xl:mr-3 lg:-translate-y-4">
              <Image
                src="/product.webp"
                alt="AWANG Products"
                fill
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-contain object-center lg:object-right"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* PRODUCTS GRID SECTION WITH CATEGORIES */}
      <section
        id="katalog"
        className="py-8 md:py-16 px-3 sm:px-6 lg:px-4 w-full max-w-[1440px] mx-auto bg-white scroll-mt-20"
      >
        <ProductsGrid
          categoryGroups={categoryGroups}
          categories={(categories || []).map((c) => ({
            id: c.id,
            name: c.name,
            slug: c.slug,
            image_url: c.image_url,
          }))}
          products={(products || []).map((p) => {
            const facts = (p.nutritional_facts as { category_ids?: string[]; subcategory_ids?: string[] } | null) || {}
            return {
              slug: p.slug,
              name: p.name,
              img:
                p.main_image ||
                'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=800&auto=format&fit=crop',
              cat:
                (p.category as unknown as { name: string } | null)?.name?.toUpperCase() ||
                'PRODUCT',
              sizes: p.sizes || [],
              category_ids: facts.category_ids || [],
              subcategory_ids: facts.subcategory_ids || [],
            }
          })}
        />
      </section>
    </main>
  )
}