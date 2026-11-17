import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { supabasePublic } from '@/lib/supabase/public'
import { RecipeDetailClient } from './RecipeDetailClient'
import { Recipe } from '@/types/database'

export const revalidate = 3600

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const { data: recipe } = await supabasePublic
    .from('recipes')
    .select('title, description, main_image')
    .eq('slug', slug)
    .eq('status', 'published')
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

  // Fetch recipe details & linked product
  const { data: recipe } = await supabasePublic
    .from('recipes')
    .select('*, featured_product:products(*)')
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  if (!recipe) {
    notFound()
  }

  // Fetch related recipes
  const { data: relatedRecipes } = await supabasePublic
    .from('recipes')
    .select('id, title, slug, main_image, prep_time, cook_time, servings, difficulty, calories, status')
    .neq('slug', slug)
    .eq('status', 'published')
    .limit(4)

  return (
    <RecipeDetailClient
      recipe={recipe as Recipe}
      relatedRecipes={(relatedRecipes as Recipe[]) || []}
      slug={slug}
    />
  )
}
