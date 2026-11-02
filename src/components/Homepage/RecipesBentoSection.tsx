import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { getHomeRecipes } from '@/lib/queries'
import { createClient } from '@/lib/supabase/server'
import PolaroidLineCarousel, { Slide } from '@/components/ui/polaroid-line-carousel'

export async function RecipesBentoSection() {
  const supabase = await createClient()

  const [recipes, { data: titleSetting }, { data: subtitleSetting }] = await Promise.all([
    getHomeRecipes(6),
    supabase
      .from('site_settings')
      .select('value')
      .eq('key', 'homepage_cook_good_title')
      .maybeSingle(),
    supabase
      .from('site_settings')
      .select('value')
      .eq('key', 'homepage_cook_good_subtitle')
      .maybeSingle(),
  ])

  if (!recipes || recipes.length === 0) return null

  const title = titleSetting?.value || 'COOK SOMETHING GOOD'
  const subtitle =
    subtitleSetting?.value ||
    'Resep pilihan istimewa yang mudah dibuat di rumah dengan produk AWANG.'

  // Transformasi data resep ke format Slide Polaroid
  const recipeSlides: Slide[] = recipes.map((recipe) => ({
    image:
      recipe.main_image ||
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800&auto=format&fit=crop',
    title: recipe.title,
    caption: recipe.description || 'Resep lezat otentik dengan pes masakan AWANG.',
    href: `/recipes/${recipe.slug}`,
  }))

  return (
    <section className="bg-[#FAF6ED] py-16 sm:py-20 md:py-24 px-0 w-full overflow-hidden">
      <div className="w-full">
        {/* Header Section terintegrasi dengan CMS */}
        <div className="text-center mb-6 sm:mb-10 px-4 sm:px-6">
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-black text-[#C8102E] uppercase tracking-tight mb-2 font-heinz">
            {title}
          </h2>
          <p className="text-sm sm:text-base text-neutral-600 font-medium">
            {subtitle}
          </p>
        </div>

        {/* 21st.dev Polaroid Line Carousel */}
        <div className="w-full relative">
          <PolaroidLineCarousel
            slides={recipeSlides}
            height="560px"
            cardWidth={390}
            sag={38}
            swing={1.05}
            autoplay={4000}
            string="#8a7f72"
            background="transparent"
            ink="#1A1A1A"
            showBar={false}
          />
        </div>

        {/* Tombol Lihat Semua Resep */}
        <div className="mt-8 text-center px-4">
          <Link
            href="/recipes"
            className="inline-flex items-center gap-2 bg-[#C8102E] hover:bg-[#a60c24] text-white !text-white font-extrabold text-sm uppercase px-8 py-3.5 rounded-full transition-all hover:scale-105 active:scale-95 shadow-md"
          >
            <span className="text-white !text-white">Lihat Semua Resep</span>
            <ChevronRight size={18} className="text-white !text-white" />
          </Link>
        </div>
      </div>
    </section>
  )
}