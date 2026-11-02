import Link from 'next/link'
import Image from 'next/image'
import { ChevronRight } from 'lucide-react'
import { getHomeRecipes } from '@/lib/queries'
import { createClient } from '@/lib/supabase/server'

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

  // Recipe item component for clean bento cards
  const renderCard = (recipe: typeof recipes[0] | undefined, className = '') => {
    if (!recipe) return null

    const imageSrc =
      recipe.main_image ||
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800&auto=format&fit=crop'

    return (
      <Link
        key={recipe.id}
        href={`/recipes/${recipe.slug}`}
        className={`group relative overflow-hidden rounded-[24px] sm:rounded-[30px] block shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${className}`}
      >
        <Image
          src={imageSrc}
          alt={recipe.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />
        {/* Soft bottom dark gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent pointer-events-none" />

        {/* Content container */}
        <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5 flex items-end justify-between gap-3 z-10">
          <h3 className="text-white font-extrabold text-base sm:text-lg md:text-xl leading-tight line-clamp-2 drop-shadow-sm">
            {recipe.title}
          </h3>
          <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-white/60 bg-white/10 backdrop-blur-xs flex items-center justify-center text-white transition-all duration-300 group-hover:bg-white group-hover:text-black group-hover:scale-105">
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:translate-x-0.5" />
          </div>
        </div>
      </Link>
    )
  }

  // Cards layout indexing per reference design:
  // Col 1: Card 0 (top), Card 3 (bottom)
  // Col 2: Card 1 (top tall), Card 4 (bottom medium)
  // Col 3: Card 2 (top), Card 5 (bottom)
  const card0 = recipes[0]
  const card1 = recipes[1]
  const card2 = recipes[2]
  const card3 = recipes[3]
  const card4 = recipes[4]
  const card5 = recipes[5]

  return (
    <section className="bg-[#FAF6ED] py-14 sm:py-20 md:py-24 px-4 sm:px-6 lg:px-8 w-full">
      <div className="max-w-6xl mx-auto">
        {/* Header Section terintegrasi dengan CMS */}
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-black text-[#CC0000] uppercase tracking-tight mb-3 font-heinz">
            {title}
          </h2>
          <p className="text-sm sm:text-base text-neutral-600 font-semibold tracking-wide">
            {subtitle}
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
          {/* Column 1 (Left): 2 equal stacked cards */}
          <div className="flex flex-col gap-4 sm:gap-5">
            {renderCard(card0, 'h-[240px] sm:h-[280px] md:h-[290px]')}
            {renderCard(card3, 'h-[240px] sm:h-[280px] md:h-[290px]')}
          </div>

          {/* Column 2 (Center): Tall card on top, medium card below */}
          <div className="flex flex-col gap-4 sm:gap-5">
            {renderCard(card1, 'h-[260px] sm:h-[320px] md:h-[340px]')}
            {renderCard(card4, 'h-[220px] sm:h-[240px] md:h-[240px]')}
          </div>

          {/* Column 3 (Right): 2 equal stacked cards */}
          <div className="flex flex-col gap-4 sm:gap-5">
            {renderCard(card2, 'h-[240px] sm:h-[280px] md:h-[290px]')}
            {renderCard(card5, 'h-[240px] sm:h-[280px] md:h-[290px]')}
          </div>
        </div>

        {/* Tombol Lihat Semua Resep */}
        <div className="mt-10 sm:mt-12 text-center">
          <Link
            href="/recipes"
            className="inline-flex items-center gap-2 bg-[#CC0000] hover:bg-[#a60c24] text-white !text-white font-extrabold text-sm uppercase px-8 py-3.5 rounded-full transition-all hover:scale-105 active:scale-95 shadow-md"
          >
            <span className="text-white !text-white">Lihat Semua Resep</span>
            <ChevronRight size={18} className="text-white !text-white" />
          </Link>
        </div>
      </div>
    </section>
  )
}