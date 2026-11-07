import { createClient } from '@/lib/supabase/server'
import { AdminCategoriesClient } from '@/components/admin/AdminCategoriesClient'
import type { CategoryGroup } from '@/types/database'

export const dynamic = 'force-dynamic'

export default async function AdminCategoriesPage() {
  const supabase = await createClient()

  // Gunakan .order + .limit(1) untuk menghindari error jika ada duplikat row di site_settings
  const [{ data: productSettingRows }, { data: recipeSettingRows }] = await Promise.all([
    supabase
      .from('site_settings')
      .select('value')
      .eq('key', 'product_categories_hierarchy')
      .order('updated_at', { ascending: false })
      .limit(1),
    supabase
      .from('site_settings')
      .select('value')
      .eq('key', 'recipe_categories_hierarchy')
      .order('updated_at', { ascending: false })
      .limit(1),
  ])

  const productSetting = productSettingRows?.[0] ?? null
  const recipeSetting = recipeSettingRows?.[0] ?? null

  let productHierarchy: CategoryGroup[] = []
  try {
    if (productSetting?.value) {
      productHierarchy = JSON.parse(productSetting.value)
    }
  } catch (err) {
    productHierarchy = []
  }

  let recipeHierarchy: CategoryGroup[] = []
  try {
    if (recipeSetting?.value) {
      recipeHierarchy = JSON.parse(recipeSetting.value)
    }
  } catch (err) {
    recipeHierarchy = []
  }

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-[#0A1628] mb-1">Kelola Kategori & Subkategori</h1>
      <p className="text-sm text-gray-500 mb-6">Kelola tab kategori dan icon subkategori untuk produk serta resep</p>
      <AdminCategoriesClient
        productHierarchy={productHierarchy}
        recipeHierarchy={recipeHierarchy}
      />
    </div>
  )
}
