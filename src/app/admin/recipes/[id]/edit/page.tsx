import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { RecipeForm } from '@/components/admin/RecipeForm'

export const dynamic = 'force-dynamic'

export default async function EditRecipePage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const [{ data: recipe }, { data: products }, { data: recipeCatRows }] = await Promise.all([
    supabase.from('recipes').select('*').eq('id', id).single(),
    supabase.from('products').select('id, name').order('name'),
    supabase.from('site_settings').select('value').eq('key', 'recipe_categories_hierarchy').order('updated_at', { ascending: false }).limit(1),
  ])

  if (!recipe) return notFound()

  const recipeCatSetting = recipeCatRows?.[0] ?? null

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
      <h1 className="text-2xl font-extrabold text-[#0A1628] mb-6">Edit Resep: {recipe.title}</h1>
      <RecipeForm initialData={recipe} products={products || []} categoryGroups={categoryGroups} />
    </div>
  )
}
