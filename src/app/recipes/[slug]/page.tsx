import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { RecipeDetailClient } from './RecipeDetailClient'
import { Recipe } from '@/types/database'

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
  const { data: recipe } = await supabase
    .from('recipes')
    .select('title, description, main_image')
    .eq('slug', slug)
    .single()

  if (!recipe) {
    return {
      title: 'Recipe Not Found | AWANG'
    }
  }

  return {
    title: `${recipe.title} | AWANG Recipes`,
    description: recipe.description || `Cara membuat ${recipe.title} lezat dengan produk AWANG.`,
    openGraph: {
      title: recipe.title,
      description: recipe.description || '',
      images: recipe.main_image ? [recipe.main_image] : []
    }
  }
}

export default async function RecipeDetailPage({
  params
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const supabase = await createClient()

  // Fetch recipe details & linked product
  const { data: recipe } = await supabase
    .from('recipes')
    .select('*, featured_product:products(*)')
    .eq('slug', slug)
    .single()

  // Fetch related recipes
  const { data: relatedRecipes } = await supabase
    .from('recipes')
    .select('*')
    .neq('slug', slug)
    .eq('status', 'published')
    .limit(4)

  return (
    <main className="bg-white font-sans min-h-screen">
      <RecipeDetailClient recipe={recipe as Recipe} relatedRecipes={relatedRecipes as Recipe[]} slug={slug} />
    </main>
  )
}
