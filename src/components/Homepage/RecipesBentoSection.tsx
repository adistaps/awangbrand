import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { getHomeRecipes } from '@/lib/queries'
import ImageGallery, { GalleryImage } from '@/components/ui/image-gallery'

export async function RecipesBentoSection() {
  const recipes = await getHomeRecipes(4)

  if (!recipes || recipes.length === 0) return null

  // Transformasi data resep menjadi format GalleryImage — sertakan title dari backend
  const recipeGalleryImages: GalleryImage[] = recipes.map((recipe) => ({
    src: recipe.main_image || '/placeholder-recipe.jpg',
    alt: recipe.title,
    title: recipe.title,
  }))

  return (
    <section className="bg-[#FAF6ED] py-16 sm:py-20 md:py-24 px-4 sm:px-6 md:px-12 lg:px-16 w-full">
      <div className="max-w-[1400px] mx-auto">
        {/* Header — font size sama dengan ProductCarouselSection */}
        <div className="text-center mb-10 sm:mb-14">
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-black text-[#C8102E] uppercase tracking-tight mb-2">
            COOK SOMETHING GOOD
          </h2>
          <p className="text-sm sm:text-base text-neutral-600 font-medium">
            Crowd-pleasing recipes you can only find here.
          </p>
        </div>

        {/* Image Gallery dengan autoplay stabil & judul tiap card */}
        <ImageGallery
          images={recipeGalleryImages}
          showHeader={false}
          autoPlayInterval={3000}
          className="p-0"
        />

        {/* Tombol Lihat Semua Resep */}
        <div className="mt-10 text-center">
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