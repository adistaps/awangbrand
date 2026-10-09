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
    title: 'Air Fryer Hawaiian Chicken Tacos with Pineapple Salsa',
    slug: slug || 'air-fryer-hawaiian-chicken-tacos',
    category: 'Main Course',
    prep_time: '15 MIN',
    cook_time: '15 MIN',
    servings: '4 Servings',
    calories: '380 Calories',
    difficulty: 'Easy',
    description: 'These Air Fryer Hawaiian Chicken Tacos are a quick and flavorful main course, perfect for a family meal. With only 380 calories per serving, these tacos feature tender chicken thighs coated in a tropical teriyaki sauce, served in mini corn tortillas and topped with a vibrant pineapple salsa.',
    main_image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=1200&q=80',
    ingredients: [
      '1 lb boneless skinless chicken thighs',
      '1/2 cup AWANG Hawaiian-Inspired Tropical Teriyaki Sauce, divided',
      '1 can (8 oz.) pineapple chunks in juice, undrained',
      '1/4 cup chopped red onions',
      '1 tbsp chopped fresh cilantro',
      '12 mini corn tortillas (4 inch)'
    ],
    instructions: [
      'HEAT air fryer to 375°F.',
      'PLACE chicken in medium bowl. Add half of the Tropical Teriyaki sauce; toss to evenly coat chicken with sauce.',
      'PLACE chicken in single layer in air fryer basket.',
      'COOK 14 min. or until chicken is done (165°F), turning chicken after 7 min.',
      'MEANWHILE, drain pineapple, reserving 2 Tbsp. of the juice. Chop the pineapple chunks; place in small bowl. Add onions, cilantro and reserved pineapple juice; mix lightly.',
      'TRANSFER chicken to cutting board; cut into thin strips.',
      'PLACE chicken on tortillas; top with pineapple mixture and remaining teriyaki sauce. Fold in half to serve.'
    ],
    tips: 'If your local grocery store doesn\'t carry 4-inch corn tortillas, check a Mexican grocery store or taco shop near you.',
    featured_product: {
      id: 'p1',
      name: 'AWANG Barbecue Sauce Smokey Grill',
      slug: 'hawaiian-tropical-teriyaki-sauce',
      category_id: null,
      description: 'Authentic tropical glaze teriyaki sauce.',
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
    <div className="bg-white min-h-screen pt-28 pb-20 font-sans">
      <div className="max-w-7xl mx-auto px-6">

        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs text-stone-500 font-bold uppercase tracking-wider mb-8">
          <Link href="/recipes" className="hover:text-[#C8102E] transition-colors">All Recipes</Link>
          <span>/</span>
          <span className="text-[#C8102E] line-clamp-1">{displayRecipe.title}</span>
        </div>

        {/* Main Recipe Header Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-20">

          {/* Left Column Info */}
          <div className="lg:col-span-7 space-y-6">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#111111] leading-tight tracking-tight uppercase" style={{ fontFamily: 'Impact, "Arial Black", sans-serif' }}>
              {displayRecipe.title}
            </h1>

            {/* Time / Servings Metrics */}
            <div className="flex flex-wrap items-center gap-6 py-4 border-y border-stone-200 text-xs font-extrabold uppercase text-stone-700">
              {displayRecipe.prep_time && (
                <div>
                  <span className="text-stone-400 block text-[10px] tracking-widest">Prep</span>
                  <span className="text-[#C8102E]">{displayRecipe.prep_time}</span>
                </div>
              )}
              {displayRecipe.cook_time && (
                <div>
                  <span className="text-stone-400 block text-[10px] tracking-widest">Cook</span>
                  <span className="text-[#C8102E]">{displayRecipe.cook_time}</span>
                </div>
              )}
              {displayRecipe.servings && (
                <div>
                  <span className="text-stone-400 block text-[10px] tracking-widest">Servings</span>
                  <span className="text-[#C8102E]">{displayRecipe.servings}</span>
                </div>
              )}
              {displayRecipe.calories && (
                <div>
                  <span className="text-stone-400 block text-[10px] tracking-widest">Calories</span>
                  <span className="text-[#C8102E]">{displayRecipe.calories}</span>
                </div>
              )}
            </div>

            <p className="text-stone-700 text-base leading-relaxed font-medium">
              {displayRecipe.description}
            </p>

            {/* Ingredients List */}
            <div className="pt-6">
              <h2 className="text-2xl font-black text-[#C8102E] uppercase tracking-tight mb-6">
                Ingredients
              </h2>
              <ul className="space-y-3.5 text-stone-800 font-semibold text-sm sm:text-base">
                {displayRecipe.ingredients.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 pb-3 border-b border-stone-100">
                    <Check size={18} className="text-[#C8102E] shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Step-by-Step Instructions */}
            <div className="pt-6">
              <h2 className="text-2xl font-black text-[#C8102E] uppercase tracking-tight mb-6">
                Instructions
              </h2>
              <div className="space-y-6">
                {displayRecipe.instructions.map((step, idx) => (
                  <div key={idx} className="space-y-1.5">
                    <h3 className="text-xs font-black text-[#C8102E] uppercase tracking-widest">
                      Step {idx + 1}
                    </h3>
                    <p className="text-stone-800 text-sm sm:text-base leading-relaxed font-medium">
                      {step}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Recipe Tip Box */}
            {displayRecipe.tips && (
              <div className="mt-8 p-6 bg-stone-50 border border-stone-200/60 rounded-2xl">
                <h4 className="text-xs font-black uppercase tracking-widest text-[#C8102E] mb-2">
                  💡 Recipe Tip
                </h4>
                <p className="text-stone-700 text-xs sm:text-sm leading-relaxed font-medium">
                  {displayRecipe.tips}
                </p>
              </div>
            )}

          </div>

          {/* Right Sidebar (Image & Featured Product Card) */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-28">

            {/* Main Recipe Image */}
            <div className="w-full aspect-[4/3] sm:aspect-square rounded-2xl overflow-hidden bg-stone-100 border border-stone-100">
              <img
                src={displayRecipe.main_image || 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=1200&q=80'}
                alt={displayRecipe.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Integrated Shop Featured Product Card (Clean & Clean with Cart Icon) */}
            {displayRecipe.featured_product && (
              <Link
                href={`/products/${displayRecipe.featured_product.slug}`}
                className="group block bg-white p-6 rounded-2xl border border-stone-200/80 shadow-sm hover:border-[#C8102E] transition-all duration-300 space-y-3"
              >
                <span className="text-[10px] font-black uppercase tracking-widest text-stone-400 block">
                  Shop Featured Products
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
                    <h4 className="text-sm sm:text-base font-extrabold text-[#111111] line-clamp-2 leading-snug tracking-tight">
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

          </div>

        </div>

        {/* ==========================================
            COOK WITH US SECTION (MATCHING CLIENT RECIPE)
        ========================================== */}
        <section className="pt-16 border-t border-stone-200/80">
          <div className="mb-10">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#C8102E] tracking-tight uppercase" style={{ fontFamily: 'Impact, "Arial Black", sans-serif' }}>
              Cook With Us
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {displayRelated.map((item) => (
              <Link
                key={item.id}
                href={`/recipes/${item.slug}`}
                className="group relative w-full aspect-[16/10] sm:aspect-[16/9] rounded-2xl overflow-hidden cursor-pointer block"
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
                <div className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-between text-white z-10">
                  <div className="space-y-1 sm:space-y-2">
                    <h3 className="text-xl sm:text-2xl font-extrabold leading-snug tracking-tight text-white drop-shadow-md">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-white/80 font-medium">
                      Easy Home Cooking • AWANG Heritage Paste
                    </p>
                  </div>

                  <div>
                    <span className="inline-flex items-center justify-center bg-white text-[#111111] font-bold px-5 py-2 rounded-full text-xs sm:text-sm group-hover:bg-[#C8102E] group-hover:text-white transition-colors duration-300">
                      Get Recipe
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