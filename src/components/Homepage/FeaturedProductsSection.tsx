import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { FeaturedProductCard } from '@/components/ui/FeaturedProductCard'
import { getFeaturedProducts } from '@/lib/queries'

export async function FeaturedProductsSection() {
  const products = await getFeaturedProducts(4)

  if (!products || products.length === 0) return null

  return (
    // KHUSUS MOBILE: Menambahkan max-md:-mb-[1px] untuk menarik section bawahnya sedikit ke atas agar menutupi celah garis tipis
    <section className="bg-[#C8102E] py-8 sm:py-16 md:py-20 px-4 sm:px-6 md:px-12 lg:px-16 w-full relative max-md:-mb-[1px]">
      <div className="max-w-[1400px] mx-auto">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-6 sm:mb-12 gap-4">
          <div>
            <h2 className="text-2xl sm:text-5xl md:text-6xl font-black text-white uppercase tracking-tight">
              TASTE THE HEAT
            </h2>
          </div>
        </div>

        {/* Grid khusus Featured Products menggunakan FeaturedProductCard dari /components/ui */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          {products.map((p) => (
            <FeaturedProductCard
              key={p.id}
              slug={p.slug}
              name={p.name}
              img={p.main_image || 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=800&auto=format&fit=crop'}
              category={(p as any).category?.name || (p as any).category || ''}
            />
          ))}
        </div>
      </div>
    </section>
  )
}