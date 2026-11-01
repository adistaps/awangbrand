import type { Metadata } from 'next'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import { ProductsGrid } from '@/components/ProductsGrid'

export const metadata: Metadata = {
  title: 'Katalog Pes Masakan & Bumbu Warisan Melayu | AWANG Brand Malaysia',
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

  const [{ data: products }, { data: categories }] = await Promise.all([
    supabase
      .from('products')
      .select('id, name, slug, main_image, category:categories(name)')
      .eq('status', 'published')
      .order('created_at', { ascending: false }),

    supabase
      .from('categories')
      .select('id, name, slug, image_url')
      .order('name', { ascending: true }),
  ])

  return (
    <main className="bg-white font-sans">
      {/* ==========================================
          HERO SECTION CUSTOM (RASIO VERTIKAL & SIZES FIXED)
      ========================================== */}
      <section className="relative w-full bg-[#C8102E] text-white pt-28 sm:pt-36 pb-16 sm:pb-24 px-6 sm:px-12 md:px-16 overflow-hidden flex items-center min-h-[600px]">
        {/* Ornamen Bintik-Bintik Maroon Padat */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          <svg className="absolute top-0 right-0 w-full lg:w-1/2 h-full opacity-90" viewBox="0 0 500 500" fill="none">
            <g fill="#800A1D">
              <circle cx="320" cy="80" r="3" />
              <circle cx="340" cy="95" r="1.5" />
              <circle cx="310" cy="110" r="4" />
              <circle cx="360" cy="70" r="2" />
              <circle cx="380" cy="120" r="2.5" />
              <circle cx="290" cy="140" r="1" />
              <circle cx="410" cy="90" r="3.5" />
              <circle cx="430" cy="115" r="2" />
              <circle cx="350" cy="150" r="4" />
              <circle cx="370" cy="175" r="1.5" />
              <circle cx="330" cy="190" r="3" />
              <circle cx="250" cy="220" r="2.5" />
              <circle cx="280" cy="240" r="4" />
              <circle cx="230" cy="260" r="1.5" />
              <circle cx="300" cy="210" r="3" />
              <circle cx="320" cy="250" r="2" />
              <circle cx="340" cy="230" r="3.5" />
              <circle cx="370" cy="270" r="1" />
              <circle cx="390" cy="240" r="4" />
              <circle cx="420" cy="220" r="2" />
              <circle cx="280" cy="330" r="3" />
              <circle cx="310" cy="350" r="1.5" />
              <circle cx="330" cy="310" r="4" />
              <circle cx="360" cy="340" r="2.5" />
              <circle cx="380" cy="380" r="3" />
              <circle cx="400" cy="320" r="1" />
              <circle cx="430" cy="360" r="2" />
              <circle cx="450" cy="300" r="3.5" />
            </g>

            <g fill="#4A1521">
              <circle cx="330" cy="75" r="2" />
              <circle cx="355" cy="105" r="3.5" />
              <circle cx="295" cy="125" r="2.5" />
              <circle cx="375" cy="85" r="1" />
              <circle cx="395" cy="135" r="3" />
              <circle cx="425" cy="100" r="1.5" />
              <circle cx="345" cy="165" r="2" />
              <circle cx="365" cy="185" r="4" />
              <circle cx="265" cy="235" r="3" />
              <circle cx="295" cy="255" r="1.5" />
              <circle cx="315" cy="225" r="2" />
              <circle cx="335" cy="265" r="4" />
              <circle cx="365" cy="235" r="1.5" />
              <circle cx="385" cy="285" r="2.5" />
              <circle cx="415" cy="250" r="3" />
              <circle cx="295" cy="320" r="2" />
              <circle cx="325" cy="360" r="3.5" />
              <circle cx="345" cy="330" r="1" />
              <circle cx="375" cy="365" r="4" />
              <circle cx="395" cy="345" r="2" />
              <circle cx="425" cy="385" r="3" />
            </g>

            <g fill="#600713">
              <circle cx="315" cy="88" r="1" />
              <circle cx="348" cy="118" r="2" />
              <circle cx="388" cy="108" r="1" />
              <circle cx="418" cy="148" r="2.5" />
              <circle cx="328" cy="208" r="1.5" />
              <circle cx="278" cy="218" r="2" />
              <circle cx="358" cy="248" r="1" />
              <circle cx="408" cy="268" r="2" />
              <circle cx="308" cy="338" r="1.5" />
              <circle cx="358" cy="378" r="2" />
              <circle cx="418" cy="338" r="1" />
              <circle cx="448" cy="378" r="2.5" />
            </g>
          </svg>
        </div>

        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
          {/* Kolom Kiri: Gambar Vertikal product.webp (Diperbesar) */}
          <div className="lg:col-span-6 relative flex justify-center items-center order-2 lg:order-1">
            <div className="relative w-full max-w-[620px] aspect-[3/4] h-[580px] sm:h-[700px]">
              <Image
                src="/product.webp"
                alt="AWANG Products"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-contain"
                priority
              />
            </div>
          </div>

          {/* Kolom Kanan: Judul & Subtitle */}
          <div className="lg:col-span-6 flex flex-col justify-center space-y-4 order-1 lg:order-2">
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white leading-tight uppercase tracking-tight">
              Favorites from AWANG
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-white/90 font-medium leading-relaxed max-w-xl">
              Featuring authentic Malay heritage pastes crafted with 100% natural spices for effortless, burst-of-flavour home cooking.
            </p>
          </div>
        </div>
      </section>

      {/* PRODUCTS GRID SECTION WITH CATEGORIES */}
      <section className="py-8 md:py-16 px-3 sm:px-6 lg:px-4 w-full max-w-[1440px] mx-auto bg-white">
        <ProductsGrid
          categories={(categories || []).map((c) => ({
            id: c.id,
            name: c.name,
            slug: c.slug,
            image_url: c.image_url,
          }))}
          products={(products || []).map((p) => ({
            slug: p.slug,
            name: p.name,
            img:
              p.main_image ||
              'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=800&auto=format&fit=crop',
            cat:
              (p.category as unknown as { name: string } | null)?.name?.toUpperCase() ||
              'PRODUCT',
          }))}
        />
      </section>
    </main>
  )
}