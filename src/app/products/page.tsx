import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { supabasePublic } from '@/lib/supabase/public'
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

export const revalidate = 3600

export default async function Page() {
  const [{ data: products }, { data: categories }, { data: hierarchySetting }] = await Promise.all([
    supabasePublic
      .from('products')
      .select('id, name, slug, main_image, sizes, category:categories(name)')
      .eq('status', 'published')
      .order('created_at', { ascending: false }),

    supabasePublic
      .from('categories')
      .select('id, name, slug, image_url')
      .order('name', { ascending: true }),

    supabasePublic
      .from('site_settings')
      .select('value')
      .eq('key', 'product_categories_hierarchy')
      .order('updated_at', { ascending: false })
      .limit(1),
  ])

  let categoryGroups = []
  try {
    if (hierarchySetting?.[0]?.value) {
      categoryGroups = JSON.parse(hierarchySetting[0].value)
    }
  } catch {
    categoryGroups = []
  }

  return (
    <main className="bg-white min-h-screen font-sans pt-0 pb-16">
      {/* HERO SECTION */}
      <section className="bg-[#CC0000] text-white w-full min-h-[560px] sm:min-h-[640px] lg:min-h-[680px] grid grid-cols-1 lg:grid-cols-12 items-end overflow-visible">
        <div className="lg:col-span-6 p-8 sm:p-14 md:p-20 xl:p-24 flex flex-col justify-center space-y-3 sm:space-y-4 pt-28 sm:pt-36 lg:pt-20 self-center">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-white uppercase tracking-tight leading-none">
            Delicious<br />Starts Here
          </h1>
          <p className="text-white/90 text-sm sm:text-base md:text-lg font-medium leading-relaxed max-w-lg pt-2">
            Nikmati pelbagai pes masakan autentik, perencah warisan Melayu, sambal, dan sos premium dari AWANG.
          </p>
        </div>

        <div className="lg:col-span-6 relative w-full flex items-end justify-center pt-10 lg:pt-0" style={{ height: '540px' }}>
          <div className="relative h-full mx-auto" style={{ width: '72%', maxHeight: '540px' }}>
            <Image
              src="/pes.webp"
              alt="AWANG Pes Masakan & Sambal Autentik"
              fill
              className="object-contain object-bottom drop-shadow-2xl"
              style={{ objectPosition: 'center bottom' }}
              priority
            />
          </div>
        </div>
      </section>

      {/* Breadcrumb Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs sm:text-sm text-stone-500 font-medium">
          <Link href="/" className="hover:text-[#CC0000] transition-colors">Home</Link>
          <span>/</span>
          <span className="text-[#111111] font-semibold">Products</span>
        </nav>
      </section>

      {/* PRODUCTS GRID DENGAN CLIENT FILTER & SEARCH */}
      <div className="mt-4">
        <ProductsGrid
          products={(products || []) as any}
          categories={categories || []}
          categoryGroups={categoryGroups}
        />
      </div>
    </main>
  )
}
