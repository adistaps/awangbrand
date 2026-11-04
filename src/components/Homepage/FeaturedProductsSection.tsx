import { FeaturedItemCard } from '@/components/ui/FeaturedItemCard'
import { getFeaturedItems } from '@/lib/queries/featured'
import { createClient } from '@/lib/supabase/server'

export async function FeaturedProductsSection() {
  const supabase = await createClient()

  // Ambil judul kustom & palet warna kartu dari site_settings
  const [{ data: settingsRows }, items] = await Promise.all([
    supabase
      .from('site_settings')
      .select('key, value')
      .in('key', ['homepage_taste_the_heat_title', 'homepage_featured_card_colors']),
    getFeaturedItems(4),
  ])

  const settingsMap: Record<string, string> = {}
  ;(settingsRows || []).forEach((row: { key: string; value: string | null }) => {
    if (row.value) settingsMap[row.key] = row.value
  })

  const sectionTitle = settingsMap.homepage_taste_the_heat_title || 'TASTE THE HEAT'

  let cardColors: Record<string, string> = {}
  if (settingsMap.homepage_featured_card_colors) {
    try {
      cardColors = JSON.parse(settingsMap.homepage_featured_card_colors)
    } catch {
      cardColors = {}
    }
  }

  if (!items || items.length === 0) return null

  return (
    // KHUSUS MOBILE: Menambahkan max-md:-mb-[1px] untuk menarik section bawahnya sedikit ke atas agar menutupi celah garis tipis
    <section className="bg-[#CC0000] py-8 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 md:px-12 lg:px-14 w-full relative max-md:-mb-[1px]">
      <div className="max-w-[1800px] mx-auto">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-6 sm:mb-12 lg:mb-14 gap-4">
          <div>
            <h2 className="text-2xl sm:text-5xl md:text-6xl lg:text-8xl xl:text-[6.0rem] font-black text-white uppercase tracking-tight lg:tracking-tighter lg:leading-none font-heinz">
              {sectionTitle}
            </h2>
          </div>
        </div>

        {/* Grid Featured: Produk & Resep Campuran dengan Desain Backdrop Khusus & Warna Terpilih */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 lg:gap-5">
          {items.map((item, i) => (
            <FeaturedItemCard
              key={`${item.type}-${item.id}`}
              item={item}
              index={i}
              themeKey={cardColors[item.id]}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
