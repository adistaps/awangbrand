'use client'

import Link from 'next/link'
import { Recipe } from '@/types/database'
import { Check } from 'lucide-react'

interface Props {
  recipe: Recipe
  relatedRecipes: Recipe[] | null
  slug: string
}

export function RecipeDetailClient({ recipe, relatedRecipes }: Props) {
  const displayRecipe = recipe
  const displayRelated = relatedRecipes || []

  return (
    <div className="w-full bg-[#FAF6ED] min-h-screen pt-20 sm:pt-28 pb-20 font-sans relative z-10">

      {/* ========================================================
          MAIN LAYOUT: Left (content) + Right (image + product)
          ======================================================== */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">

          {/* ── LEFT COLUMN ── */}
          <div className="lg:col-span-7 space-y-8">

            {/* Judul Utama */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black text-[#590014] leading-[1.05] tracking-tight">
              {displayRecipe.title}
            </h1>

            {/* Metrics */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 py-4 border-y border-[#590014]/15 text-xs sm:text-sm font-bold text-stone-800">
              {displayRecipe.prep_time && (
                <div className="flex items-center gap-1.5">
                  <span className="text-stone-500 font-medium uppercase text-[10px] tracking-wider">PREP</span>
                  <span className="font-extrabold text-[#590014]">{displayRecipe.prep_time}</span>
                </div>
              )}
              {displayRecipe.cook_time && (
                <div className="flex items-center gap-1.5">
                  <span className="text-stone-500 font-medium uppercase text-[10px] tracking-wider">COOK</span>
                  <span className="font-extrabold text-[#590014]">{displayRecipe.cook_time}</span>
                </div>
              )}
              {displayRecipe.servings && (
                <div className="flex items-center gap-1.5">
                  <span className="text-stone-500 font-medium uppercase text-[10px] tracking-wider">SERVINGS</span>
                  <span className="font-extrabold text-[#590014]">{displayRecipe.servings}</span>
                </div>
              )}
              {displayRecipe.calories && (
                <div className="flex items-center gap-1.5">
                  <span className="text-stone-500 font-medium uppercase text-[10px] tracking-wider">CALORIES</span>
                  <span className="font-extrabold text-[#590014]">{displayRecipe.calories}</span>
                </div>
              )}
            </div>

            {/* Deskripsi */}
            {displayRecipe.description && (
              <p className="text-stone-700 text-sm sm:text-base leading-relaxed font-normal">
                {displayRecipe.description}
              </p>
            )}

            {/* Ingredients */}
            <div className="space-y-4">
              <h2 className="text-lg sm:text-xl font-black text-[#CC0000] uppercase tracking-widest">
                Ingredients
              </h2>
              <ul className="space-y-2.5 text-stone-800 font-medium text-sm sm:text-base">
                {displayRecipe.ingredients.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <Check size={16} className="text-[#CC0000] shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Instructions */}
            <div className="space-y-4">
              <h2 className="text-lg sm:text-xl font-black text-[#CC0000] uppercase tracking-widest">
                Instructions
              </h2>
              <div className="space-y-5">
                {displayRecipe.instructions.map((step, idx) => (
                  <div key={idx} className="space-y-1">
                    <h3 className="text-[10px] font-black text-[#CC0000] uppercase tracking-widest">
                      Step {idx + 1}
                    </h3>
                    <p className="text-stone-800 text-sm sm:text-base leading-relaxed font-normal">
                      {step}
                    </p>
                  </div>
                ))}
              </div>

              {/* Recipe Tip */}
              {displayRecipe.tips && (
                <div className="mt-6 p-5 bg-white/60 border border-[#590014]/10 rounded-2xl">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-[#590014] mb-1.5 flex items-center gap-1.5">
                    <span>💡</span> Recipe Tip
                  </h4>
                  <p className="text-stone-700 text-xs sm:text-sm leading-relaxed font-normal">
                    {displayRecipe.tips}
                  </p>
                </div>
              )}
            </div>

          </div>

          {/* ── RIGHT COLUMN ── */}
          <div className="lg:col-span-5 space-y-6 sticky top-28 self-start">

            {/* Recipe Photo */}
            <div className="relative w-full aspect-[4/4.5] rounded-2xl overflow-hidden shadow-lg bg-stone-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={displayRecipe.main_image || 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=900&q=80'}
                alt={displayRecipe.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Featured Product */}
            {displayRecipe.featured_product && (
              <div className="space-y-2">
                <p className="text-[10px] font-black uppercase tracking-widest text-stone-400">
                  Shop Featured Products
                </p>
                <Link
                  href={`/products/${displayRecipe.featured_product.slug}`}
                  className="flex items-center gap-4 bg-white px-4 py-3.5 rounded-2xl border border-stone-200 shadow-xs hover:border-[#CC0000] hover:shadow-md transition-all group"
                >
                  <div className="w-14 h-14 rounded-xl overflow-hidden bg-stone-50 p-1.5 shrink-0 flex items-center justify-center border border-stone-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={displayRecipe.featured_product.main_image || '/placeholder-product.jpg'}
                      alt={displayRecipe.featured_product.name}
                      className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-bold text-[#111111] group-hover:text-[#CC0000] transition-colors block truncate">
                      {displayRecipe.featured_product.name}
                    </span>
                  </div>
                </Link>
              </div>
            )}

          </div>

        </div>
      </section>

      {/* ========================================================
          COOK WITH US SECTION
          ======================================================== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 border-t border-stone-200/80">
        <div className="mb-8 sm:mb-10">
          <h2
            className="text-xl sm:text-3xl md:text-4xl font-extrabold text-[#CC0000] tracking-tight uppercase"
            style={{ fontFamily: 'Impact, "Arial Black", sans-serif' }}
          >
            Cook With Us
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {displayRelated.map((item) => (
            <Link
              key={item.id}
              href={`/recipes/${item.slug}`}
              className="group relative w-full aspect-[16/9] rounded-2xl overflow-hidden cursor-pointer block shadow-sm"
            >
              {/* Background Image */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.main_image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80'}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />

              {/* Dark Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/20 group-hover:from-black/85 transition-colors duration-300" />

              {/* Content Overlay */}
              <div className="absolute inset-0 p-5 sm:p-8 flex flex-col justify-between text-white z-10">
                <div className="space-y-1 sm:space-y-2">
                  <h3 className="text-lg sm:text-2xl font-bold leading-snug tracking-tight text-white drop-shadow-md">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-white/80 font-medium">
                    Masakan Praktis • AWANG Heritage Paste
                  </p>
                </div>

                <div>
                  <span className="inline-flex items-center justify-center bg-white text-[#111111] font-bold px-4 py-1.5 sm:px-5 sm:py-2 rounded-full text-xs sm:text-sm group-hover:bg-[#CC0000] group-hover:text-white transition-colors duration-300">
                    Lihat Resep
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

    </div>
  )
}