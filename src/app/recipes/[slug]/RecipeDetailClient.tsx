'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Recipe } from '@/types/database'
import { ShoppingCart, Check } from 'lucide-react'

interface Props {
  recipe: Recipe | null
  relatedRecipes: Recipe[] | null
  slug: string
}

export function RecipeDetailClient({ recipe, relatedRecipes, slug }: Props) {
  // Fallback demo recipe jika belum terhubung dengan Supabase
  const displayRecipe: Recipe = recipe || {
    id: 'demo-detail',
    title: 'Ayam Goreng Mentega Saus Tomat AWANG',
    slug: slug || 'ayam-goreng-mentega',
    category: 'Main Course',
    prep_time: '15 MENIT',
    cook_time: '20 MENIT',
    servings: '3 PORSI',
    calories: '450 KCAL',
    difficulty: 'Easy',
    description: 'Ayam goreng renyah dibalur saus tomat mentega asam manis lembut buatan rumah yang disukai anak-anak.',
    main_image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=1200&q=80',
    ingredients: [
      '500g daging paha ayam potong dadu',
      '5 sdm AWANG Tomato Ketchup Original',
      '2 sdm mentega',
      '1/2 buah bawang bombay iris tipis',
      '2 siung bawang putih cincang',
      '1 sdm kecap manis'
    ],
    instructions: [
      'Goreng paha ayam hingga keemasan dan matang, sisihkan.',
      'Lelehkan mentega di wajan, tumis bawang putih dan bawang bombay hingga harum.',
      'Masukkan AWANG Tomato Ketchup, kecap manis, dan sedikit air.',
      'Aduk rata hingga saus mengental, lalu masukkan ayam goreng.',
      'Aduk cepat hingga seluruh permukaan ayam terbalut saus. Sajikan hangat.'
    ],
    tips: 'Gunakan paha ayam fillet agar teksturnya lebih juicy dan gurih saat digoreng.',
    featured_product: {
      id: 'p1',
      name: 'AWANG Tomato Ketchup Original',
      slug: 'awang-tomato-ketchup',
      category_id: null,
      description: 'Saus tomat autentik berkualitas tinggi.',
      main_image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=500&q=80',
      is_featured: true,
      status: 'published',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    is_featured: true,
    status: 'published',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }

  const fallbackRelated: Recipe[] = [
    {
      id: 'rel-1',
      title: 'Ayam Goreng Mentega Saus Tomat AWANG',
      slug: 'ayam-goreng-mentega',
      category: 'Main Course',
      prep_time: '15 MIN',
      cook_time: '20 MIN',
      servings: '3 PORSI',
      difficulty: 'Easy',
      main_image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80',
      description: 'Comforting gnocchi baked in creamy chicken pot pie sauce.',
      ingredients: [],
      instructions: [],
      is_featured: false,
      status: 'published',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'rel-2',
      title: 'Nasi Goreng Pedas Mantap AWANG',
      slug: 'nasi-goreng-pedas',
      category: 'Side Dish',
      prep_time: '10 MIN',
      cook_time: '10 MIN',
      servings: '2 PORSI',
      difficulty: 'Easy',
      main_image: 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?auto=format&fit=crop&w=600&q=80',
      description: 'Crispy sauteed green beans tossed in spicy chili crunch oil.',
      ingredients: [],
      instructions: [],
      is_featured: false,
      status: 'published',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ]

  const displayRelated = (relatedRecipes && relatedRecipes.length > 0) ? relatedRecipes : fallbackRelated

  return (
    <div className="w-full bg-white min-h-screen pt-20 sm:pt-28 pb-16 font-sans relative z-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">

        {/* Konten Utama Resep */}
        <div className="space-y-8 mb-16">

          {/* 1. Judul Utama Resep */}
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-[#111111] leading-tight tracking-tight uppercase">
            {displayRecipe.title}
          </h1>

          {/* 2. Foto Resep Utama */}
          <div className="w-full aspect-[16/10] sm:aspect-[16/9] rounded-2xl overflow-hidden bg-stone-100 border border-stone-100 shadow-sm">
            <img
              src={displayRecipe.main_image || 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=1200&q=80'}
              alt={displayRecipe.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* 3. Produk Terkait / Featured Product Card */}
          {displayRecipe.featured_product && (
            <Link
              href={`/products/${displayRecipe.featured_product.slug}`}
              className="group block bg-white p-5 sm:p-6 rounded-2xl border border-stone-200/80 shadow-sm hover:border-[#C8102E] transition-all duration-300 space-y-3"
            >
              <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400 block">
                Produk AWANG Pilihan
              </span>

              <div className="flex items-center gap-4">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-stone-50 rounded-xl overflow-hidden shrink-0 border border-stone-100 p-2 flex items-center justify-center">
                  <img
                    src={displayRecipe.featured_product.main_image || '/placeholder-product.jpg'}
                    alt={displayRecipe.featured_product.name}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                <div className="flex-1 flex items-center justify-between gap-3">
                  <h4 className="text-xs sm:text-base font-extrabold text-[#111111] line-clamp-2 leading-snug tracking-tight">
                    {displayRecipe.featured_product.name}
                  </h4>

                  {/* Tombol Bundar Ikon Keranjang Belanja */}
                  <div className="shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-stone-100 group-hover:bg-[#C8102E] text-stone-700 group-hover:text-white flex items-center justify-center transition-all duration-300">
                    <ShoppingCart className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </Link>
          )}

          {/* 4. Metrik Waktu & Porsi */}
          <div className="grid grid-cols-4 gap-2 sm:flex sm:flex-wrap sm:items-center sm:gap-6 py-3 sm:py-4 border-y border-stone-100 text-xs font-extrabold uppercase text-stone-700 text-center sm:text-left">
            {displayRecipe.prep_time && (
              <div>
                <span className="text-stone-400 block text-[9px] sm:text-[10px] tracking-widest">PREP</span>
                <span className="text-[#C8102E] text-xs sm:text-sm">{displayRecipe.prep_time}</span>
              </div>
            )}
            {displayRecipe.cook_time && (
              <div>
                <span className="text-stone-400 block text-[9px] sm:text-[10px] tracking-widest">COOK</span>
                <span className="text-[#C8102E] text-xs sm:text-sm">{displayRecipe.cook_time}</span>
              </div>
            )}
            {displayRecipe.servings && (
              <div>
                <span className="text-stone-400 block text-[9px] sm:text-[10px] tracking-widest">SERVINGS</span>
                <span className="text-[#C8102E] text-xs sm:text-sm">{displayRecipe.servings}</span>
              </div>
            )}
            {displayRecipe.calories && (
              <div>
                <span className="text-stone-400 block text-[9px] sm:text-[10px] tracking-widest">CALORIES</span>
                <span className="text-[#C8102E] text-xs sm:text-sm">{displayRecipe.calories}</span>
              </div>
            )}
          </div>

          <p className="text-stone-600 text-sm sm:text-base leading-relaxed font-medium">
            {displayRecipe.description}
          </p>

          {/* Daftar Bahan */}
          <div className="pt-4">
            <h2 className="text-xl sm:text-2xl font-bold text-[#C8102E] uppercase tracking-tight mb-4 sm:mb-6">
              INGREDIENTS
            </h2>
            <ul className="space-y-3 text-stone-800 font-semibold text-xs sm:text-base">
              {displayRecipe.ingredients.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 pb-2.5 border-b border-stone-100">
                  <Check size={16} className="text-[#C8102E] shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Instruksi Pembuatan */}
          <div className="pt-4">
            <h2 className="text-xl sm:text-2xl font-bold text-[#C8102E] uppercase tracking-tight mb-4 sm:mb-6">
              INSTRUCTIONS
            </h2>
            <div className="space-y-5">
              {displayRecipe.instructions.map((step, idx) => (
                <div key={idx} className="space-y-1">
                  <h3 className="text-xs font-bold text-[#C8102E] uppercase tracking-widest">
                    Langkah {idx + 1}
                  </h3>
                  <p className="text-stone-800 text-xs sm:text-base leading-relaxed font-medium">
                    {step}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Tips Resep */}
          {displayRecipe.tips && (
            <div className="mt-6 p-5 bg-stone-50 border border-stone-200/60 rounded-2xl">
              <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#C8102E] mb-1.5">
                <svg
                  aria-hidden="true"
                  focusable="false"
                  role="img"
                  viewBox="0 0 384 512"
                  className="w-3.5 h-3.5 fill-[#C8102E]"
                >
                  <path d="M272 384c9.6-31.9 29.5-59.1 49.2-86.2l0 0c5.2-7.1 10.4-14.2 15.4-21.4c19.8-28.5 31.4-63 31.4-100.3C368 78.8 289.2 0 192 0S16 78.8 16 176c0 37.3 11.6 71.9 31.4 100.3c5 7.2 10.2 14.3 15.4 21.4l0 0c19.8 27.1 39.7 54.4 49.2 86.2l160 0zM192 512c44.2 0 80-35.8 80-80l0-16-160 0 0 16c0 44.2 35.8 80 80 80z" />
                </svg>
                <span>Tips Resep</span>
              </h4>
              <p className="text-stone-700 text-xs sm:text-sm leading-relaxed font-medium">
                {displayRecipe.tips}
              </p>
            </div>
          )}

        </div>

        {/* COOK WITH US SECTION */}
        <section className="pt-12 border-t border-stone-200/80">
          <div className="mb-8">
            <h2 className="text-xl sm:text-3xl md:text-4xl font-bold text-[#C8102E] tracking-tight uppercase">
              Cook With Us
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {displayRelated.map((item) => (
              <Link
                key={item.id}
                href={`/recipes/${item.slug}`}
                className="group relative w-full aspect-[16/10] sm:aspect-[16/9] rounded-2xl overflow-hidden cursor-pointer block shadow-sm"
              >
                {/* Background Image */}
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
                    <span className="inline-flex items-center justify-center bg-white text-[#111111] font-bold px-4 py-1.5 sm:px-5 sm:py-2 rounded-full text-xs sm:text-sm group-hover:bg-[#C8102E] group-hover:text-white transition-colors duration-300">
                      Lihat Resep
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

      </div>
    </div>
  )
}