import { FeaturedItemCard } from '@/components/ui/FeaturedItemCard'
import { getFeaturedItems } from '@/lib/queries/featured'
import { createClient } from '@/lib/supabase/server'

export async function FeaturedProductsSection() {
  const supabase = await createClient()

  // Ambil judul kustom dari site_settings jika diubah via CMS
  const [{ data: titleSetting }, items] = await Promise.all([
    supabase
      .from('site_settings')
      .select('value')
      .eq('key', 'homepage_taste_the_heat_title')
      .maybeSingle(),
    getFeaturedItems(4),
  ])

  const sectionTitle = titleSetting?.value || 'TASTE THE HEAT'

  if (!items || items.length === 0) return null

  return (
    // KHUSUS MOBILE: Menambahkan max-md:-mb-[1px] untuk menarik section bawahnya sedikit ke atas agar menutupi celah garis tipis
    <section className="bg-[#CC0000] py-8 sm:py-16 md:py-20 px-4 sm:px-6 md:px-12 lg:px-16 w-full relative max-md:-mb-[1px]">
      <div className="max-w-[1400px] mx-auto">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-6 sm:mb-12 gap-4">
          <div>
            <h2 className="text-2xl sm:text-5xl md:text-6xl font-black text-white uppercase tracking-tight font-heinz">
              {sectionTitle}
            </h2>
          </div>
        </div>

        {/* Grid Featured: Produk & Resep Campuran dengan Badge Trending / Favorite */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          {items.map((item, i) => (
            <FeaturedItemCard
              key={`${item.type}-${item.id}`}
              item={item}
              index={i}
            />
          ))}
        </div>
      </div>
    </section>
  )
}