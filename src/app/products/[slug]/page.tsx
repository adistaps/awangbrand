import type { Metadata } from 'next'
import { supabasePublic } from '@/lib/supabase/public'
import { notFound } from 'next/navigation'
import { ProductDetailClient } from './ProductDetailClient'
import { getProductDetailBrands } from '@/lib/queries'

export const revalidate = 3600

// Generate SEO metadata unik per produk
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params

  const { data: product } = await supabasePublic
    .from('products')
    .select('name, description, main_image, category:categories(name)')
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  if (!product) {
    return { title: 'Produk Tidak Ditemukan' }
  }

  const categoryName = (product.category as unknown as { name: string } | null)?.name ?? 'Pes Masakan'
  const title = product.name
  const description =
    product.description ??
    `${product.name} — pes masakan autentik dari AWANG Brand Malaysia. Dibuat dengan 100% rempah dan ramuan asli semulajadi, disahkan Halal JAKIM, tanpa bahan pengawet tiruan.`
  const imageUrl = product.main_image ?? '/og-image.webp'

  return {
    title: `${title} | AWANG Brand Malaysia`,
    description,
    keywords: [product.name, categoryName, 'pes masakan Malaysia', 'AWANG Brand Malaysia', 'bumbu masak halal JAKIM', 'cooking paste Malaysia', 'rempah asli Melayu'],
    openGraph: {
      title: `${title} | AWANG Brand`,
      description,
      url: `https://awangbrand.com/products/${slug}`,
      images: [{ url: imageUrl, width: 800, height: 600, alt: product.name }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | AWANG Brand`,
      description,
      images: [imageUrl],
    },
    alternates: {
      canonical: `https://awangbrand.com/products/${slug}`,
    },
  }
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  const [{ data: product }, brands] = await Promise.all([
    supabasePublic
      .from('products')
      .select('*, category:categories(name), product_images(id, image_url, sort_order), product_specifications(id, spec_key, spec_value, sort_order)')
      .eq('slug', slug)
      .eq('status', 'published')
      .single(),
    getProductDetailBrands(),
  ])

  if (!product) {
    notFound()
  }

  // Ambil produk lainnya dari kategori yang sama atau produk published acak (maksimal 6 produk)
  const { data: rawRelatedProducts } = await supabasePublic
    .from('products')
    .select('id, name, slug, main_image, sizes, category_id, category:categories(name)')
    .eq('status', 'published')
    .neq('id', product.id)
    .limit(6)

  const relatedProducts = (rawRelatedProducts || []).map((p: any) => ({
    slug: p.slug,
    name: p.name,
    img: p.main_image || '',
    cat: (p.category as unknown as { name: string } | null)?.name?.toUpperCase() || 'PRODUCT',
    sizes: (p.sizes as string[] | null) || [],
  }))

  // Ambil resep yang menggunakan produk ini (featured_product_id = product.id)
  const { data: rawRelatedRecipes } = await supabasePublic
    .from('recipes')
    .select('id, title, slug, main_image, category, prep_time, cook_time')
    .eq('featured_product_id', product.id)
    .eq('status', 'published')
    .limit(6)

  const relatedRecipes = (rawRelatedRecipes || []).map((r: any) => ({
    id: r.id,
    title: r.title,
    slug: r.slug,
    main_image: r.main_image || '',
    category: r.category || 'Recipe',
    prep_time: r.prep_time || null,
    cook_time: r.cook_time || null,
  }))

  const images = [
    ...(product.main_image ? [{ id: 'thumb', image_url: product.main_image }] : []),
    ...(product.product_images || []).sort((a: { sort_order: number }, b: { sort_order: number }) => a.sort_order - b.sort_order),
  ]

  const specs = (product.product_specifications || []).sort(
    (a: { sort_order: number }, b: { sort_order: number }) => a.sort_order - b.sort_order
  )

  // JSON-LD Structured Data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.main_image ? [product.main_image] : [],
    description: product.description || product.short_description,
    brand: {
      '@type': 'Brand',
      name: 'AWANG Brand',
    },
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'MYR',
      lowPrice: '5.00',
      highPrice: '50.00',
      availability: 'https://schema.org/InStock',
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />
      <ProductDetailClient
        product={product}
        images={images}
        specs={specs}
        relatedProducts={relatedProducts}
        relatedRecipes={relatedRecipes}
        brands={brands || []}
      />
    </>
  )
}
