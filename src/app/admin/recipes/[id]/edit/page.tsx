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

  const [{ data: recipe }, { data: products }] = await Promise.all([
    supabase.from('recipes').select('*').eq('id', id).single(),
    supabase.from('products').select('id, name').order('name')
  ])

  if (!recipe) return notFound()

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-extrabold text-[#0A1628] mb-6">Edit Resep: {recipe.title}</h1>
      <RecipeForm initialData={recipe} products={products || []} />
    </div>
  )
}
