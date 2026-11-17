import { createClient } from '@/lib/supabase/server'
import { ProductForm } from '@/components/admin/ProductForm'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const [{ data: product }, { data: categories }, { data: hierarchyRows }, { data: gallery }, { data: specs }] = await Promise.all([
    supabase.from('products').select('*').eq('id', id).single(),
    supabase.from('categories').select('*').order('name'),
    supabase.from('site_settings').select('value').eq('key', 'product_categories_hierarchy').order('updated_at', { ascending: false }).limit(1),
    supabase.from('product_images').select('*').eq('product_id', id).order('sort_order'),
    supabase.from('product_specifications').select('*').eq('product_id', id).order('sort_order'),
  ])

  if (!product) notFound()

  const hierarchySetting = hierarchyRows?.[0] ?? null

  let categoryGroups = []
  try {
    if (hierarchySetting?.value) {
      categoryGroups = JSON.parse(hierarchySetting.value)
    }
  } catch (err) {
    categoryGroups = []
  }

  const facts = (product.nutritional_facts as { category_ids?: string[]; subcategory_ids?: string[] } | null) || {}

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-[#0A1628] mb-1">Edit Produk</h1>
      <p className="text-sm text-gray-500 mb-6">{product.name}</p>
      <ProductForm
        categories={categories || []}
        categoryGroups={categoryGroups}
        initialValues={{
          id: product.id,
          name: product.name,
          slug: product.slug,
          category_ids: facts.category_ids || [],
          subcategory_ids: facts.subcategory_ids || [],
          description: product.description || '',
          sizes: (product.sizes as string[]) || [],
          ingredients: product.ingredients || '',
          how_to_use: product.how_to_use || '',
          thumbnail_url: product.main_image,
          shopee_url: product.shopee_url || '',
          tokopedia_url: product.tokopedia_url || '',
          lazada_url: product.lazada_url || '',
          is_featured: product.is_featured,
          is_carousel: !!product.is_carousel,
          status: product.status,
          recipe_links: (product.recipe_links as any) || [],
        }}

        initialGallery={(gallery || []).map((g) => ({ id: g.id, image_url: g.image_url, sort_order: g.sort_order }))}
        initialSpecs={(specs || []).map((s) => ({ id: s.id, spec_key: s.spec_key, spec_value: s.spec_value }))}
        initialRecipeLinks={(product.recipe_links as any) || []}
      />
    </div>
  )
}
