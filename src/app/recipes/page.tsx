import type { Metadata } from 'next'
import { RecipesClient } from '@/app/recipes/RecipesClient'
import { supabasePublic } from '@/lib/supabase/public'
import type { CategoryGroup, Recipe } from '@/types/database'

export const metadata: Metadata = {
  title: 'All Recipes - AwangBrand',
  description: 'Temukan aneka resep masakan lezat dan kreatif menggunakan produk saus dan bumbu AWANG.',
  openGraph: {
    title: 'Recipes - AWANG',
    description: 'Kreasi resep pilihan terbaik untuk keluarga Anda.',
    url: 'https://awangbrand.com/recipes',
  },
  alternates: { canonical: 'https://awangbrand.com/recipes' },
}

export const revalidate = 3600

export default async function RecipesPage() {
  const [{ data: recipeCatRows }, { data: recipes }] = await Promise.all([
    supabasePublic
      .from('site_settings')
      .select('value')
      .eq('key', 'recipe_categories_hierarchy')
      .order('updated_at', { ascending: false })
      .limit(1),

    supabasePublic
      .from('recipes')
      .select('id, title, slug, category, prep_time, cook_time, servings, difficulty, calories, description, main_image, is_featured, status, created_at, featured_product:products(id, name, slug, main_image)')
      .eq('status', 'published')
      .order('created_at', { ascending: false }),
  ])

  const recipeCatSetting = recipeCatRows?.[0] ?? null

  let categoryGroups: CategoryGroup[] = []
  try {
    if (recipeCatSetting?.value) {
      categoryGroups = JSON.parse(recipeCatSetting.value)
    }
  } catch {
    categoryGroups = []
  }

  return (
    <main className="bg-white font-sans min-h-screen">
      <RecipesClient
        initialCategoryGroups={categoryGroups}
        initialRecipes={(recipes as unknown as Recipe[]) || []}
      />
    </main>
  )
}
