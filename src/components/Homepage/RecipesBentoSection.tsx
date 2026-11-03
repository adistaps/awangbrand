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
        className={`group relative overflow-hidden rounded-[18px] sm:rounded-[30px] block shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${className}`}
      >
        <Image
          src={imageSrc}
          alt={recipe.title}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />

        {/* Content container */}
        <div className="absolute inset-x-0 bottom-0 p-3 sm:p-6 flex items-end justify-between gap-2 sm:gap-3 z-10">
          <h3 className="text-white font-extrabold text-sm sm:text-xl md:text-2xl leading-snug sm:leading-tight line-clamp-2 drop-shadow-sm">
            {recipe.title}
          </h3>
          <div className="flex-shrink-0 w-7 h-7 sm:w-11 sm:h-11 rounded-full border border-white/60 bg-white/10 backdrop-blur-xs flex items-center justify-center text-white transition-all duration-300 group-hover:bg-white group-hover:text-black group-hover:scale-105">
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
    <section className="bg-[#FAF6ED] py-20 sm:py-28 md:py-36 px-4 sm:px-6 lg:px-8 w-full">
      <div className="max-w-[1400px] mx-auto">
        {/* Header Section terintegrasi dengan CMS */}
        <div className="text-center mb-10 sm:mb-16">
          <h2 className="text-4xl sm:text-6xl md:text-7xl font-black text-[#CC0000] uppercase tracking-tight mb-4 font-heinz">
            {title}
          </h2>
          <p className="text-sm sm:text-lg text-neutral-600 font-semibold tracking-wide">
            {subtitle}
          </p>
        </div>

        {/* Bento / Masonry Grid */}
        {/* Mobile Layout (2 Kolom Masonry) */}
        <div className="grid grid-cols-2 md:hidden gap-3">
          {/* Kolom Kiri Mobile: card 0, card 2, card 4 dengan variasi tinggi */}
          <div className="flex flex-col gap-3">
            {renderCard(card0, 'h-[290px]')}
            {renderCard(card2, 'h-[220px]')}
            {renderCard(card4, 'h-[265px]')}
          </div>
          {/* Kolom Kanan Mobile: card 1, card 3, card 5 dengan offset tinggi */}
          <div className="flex flex-col gap-3">
            {renderCard(card1, 'h-[235px]')}
            {renderCard(card3, 'h-[295px]')}
            {renderCard(card5, 'h-[225px]')}
          </div>
        </div>

        {/* Desktop & Tablet Layout (3 Kolom Bento) */}
        <div className="hidden md:grid md:grid-cols-3 gap-5 lg:gap-6">
          {/* Column 1 (Left): 2 equal stacked cards */}
          <div className="flex flex-col gap-5 lg:gap-6">
            {renderCard(card0, 'md:h-[400px] lg:h-[480px] xl:h-[540px]')}
            {renderCard(card3, 'md:h-[400px] lg:h-[480px] xl:h-[540px]')}
          </div>

          {/* Column 2 (Center): Tall card on top, medium card below */}
          <div className="flex flex-col gap-5 lg:gap-6">
            {renderCard(card1, 'md:h-[480px] lg:h-[580px] xl:h-[650px]')}
            {renderCard(card4, 'md:h-[320px] lg:h-[380px] xl:h-[430px]')}
          </div>

          {/* Column 3 (Right): 2 equal stacked cards */}
          <div className="flex flex-col gap-5 lg:gap-6">
            {renderCard(card2, 'md:h-[400px] lg:h-[480px] xl:h-[540px]')}
            {renderCard(card5, 'md:h-[400px] lg:h-[480px] xl:h-[540px]')}
          </div>
        </div>

        {/* Tombol Lihat Semua Resep */}
        <div className="mt-12 sm:mt-16 text-center">
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