import { createClient } from '@/lib/supabase/server'
import { RecipeForm } from '@/components/admin/RecipeForm'

export const dynamic = 'force-dynamic'

export default async function NewRecipePage() {
  const supabase = await createClient()
  const [{ data: products }, { data: recipeCatSetting }] = await Promise.all([
    supabase.from('products').select('id, name').eq('status', 'published').order('name'),
    supabase.from('site_settings').select('value').eq('key', 'recipe_categories_hierarchy').maybeSingle(),
  ])

  let categoryGroups = []
  try {
    if (recipeCatSetting?.value) {
      categoryGroups = JSON.parse(recipeCatSetting.value)
    }
  } catch (err) {
    categoryGroups = []
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-extrabold text-[#0A1628] mb-6">Tambah Resep Baru</h1>
      <RecipeForm products={products || []} categoryGroups={categoryGroups} />
    </div>
  )
}
