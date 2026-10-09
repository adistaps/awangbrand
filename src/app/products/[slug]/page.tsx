import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { ProductDetailClient } from './ProductDetailClient'

export const dynamic = 'force-dynamic'

// Generate SEO metadata unik per produk
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()

  const { data: product } = await supabase
    .from('products')
    .select('name, description, main_image, category:categories(name)')
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  if (!product) {
    return { title: 'Produk Tidak Ditemukan' }
  }

  const categoryName = (product.category as unknown as { name: string } | null)?.name ?? 'Power Tools'
  const title = product.name
  const description =
    product.description ??
    `${product.name} — power tools profesional dari Keywell Arshaka Innovation untuk kebutuhan industri dan konstruksi.`
  const imageUrl = product.main_image ?? '/og-image.webp'

  return {
    title,
    description,
    keywords: [product.name, categoryName, 'power tools Indonesia', 'Keywell', 'alat industri'],
    openGraph: {
      title: `${title} | Keywell Arshaka Innovation`,
      description,
      url: `https://keywellarshakainnovation.com/products/${slug}`,
      images: [{ url: imageUrl, width: 800, height: 600, alt: product.name }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | Keywell Arshaka Innovation`,
      description,
      images: [imageUrl],
    },
    alternates: { canonical: `https://keywellarshakainnovation.com/products/${slug}` },
  }
}

import { getActiveBrands } from '@/lib/queries'

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()

  const [{ data: product }, brands] = await Promise.all([
    supabase
      .from('products')
      .select('*, category:categories(name), product_images(id, image_url, sort_order), product_specifications(id, spec_key, spec_value, sort_order)')
      .eq('slug', slug)
      .eq('status', 'published')
      .single(),
    getActiveBrands(),
  ])

  if (!product) notFound()

  // Ambil produk lainnya dari kategori yang sama atau produk published acak (maksimal 3 produk)
  const { data: rawRelatedProducts } = await supabase
    .from('products')
    .select('id, name, slug, main_image, category_id, category:categories(name)')
    .eq('status', 'published')
    .neq('id', product.id)
    .limit(3)

  const relatedProducts = (rawRelatedProducts || []).map((p) => ({
    slug: p.slug,
    name: p.name,
    img: p.main_image || 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=800&auto=format&fit=crop',
    cat: (p.category as unknown as { name: string } | null)?.name?.toUpperCase() || 'PRODUCT',
  }))

  const images = [
    ...(product.main_image ? [{ id: 'thumb', image_url: product.main_image }] : []),
    ...(product.product_images || []).sort((a: { sort_order: number }, b: { sort_order: number }) => a.sort_order - b.sort_order),
  ]

  const specs = (product.product_specifications || []).sort(
    (a: { sort_order: number }, b: { sort_order: number }) => a.sort_order - b.sort_order
  )

  return (
    <ProductDetailClient
      product={product}
      images={images}
      specs={specs}
      relatedProducts={relatedProducts}
      brands={brands || []}
    />
  )
}