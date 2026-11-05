import type { Metadata } from 'next'
import { RecipesClient } from '@/app/recipes/RecipesClient'

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

export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import type { CategoryGroup } from '@/types/database'

export default async function RecipesPage() {
  const supabase = await createClient()
  const { data: recipeCatSetting } = await supabase
    .from('site_settings')
    .select('value')
    .eq('key', 'recipe_categories_hierarchy')
    .maybeSingle()

  let categoryGroups: CategoryGroup[] = []
  try {
    if (recipeCatSetting?.value) {
      categoryGroups = JSON.parse(recipeCatSetting.value)
    }
  } catch (err) {
    categoryGroups = []
  }

  return (
    <main className="bg-white font-sans min-h-screen">
      <RecipesClient initialCategoryGroups={categoryGroups} />
    </main>
  )
}
