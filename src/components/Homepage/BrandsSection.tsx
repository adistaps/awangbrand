import { getActiveBrands } from '@/lib/queries'

export async function BrandsSection() {
  const brands = await getActiveBrands()

  if (!brands || brands.length === 0) return null

  return (
    <section className="relative w-full bg-white font-sans py-10 sm:py-14 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 sm:px-12">
        {/* Judul Section */}
        <div className="text-center mb-8">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-stone-900 tracking-tight">
            Available at Leading Stores
          </h2>
        </div>

        {/* Brand Logos Sejajar Horizontal 1 Baris (Berwarna) */}
        <div className="grid grid-cols-3 sm:grid-cols-6 items-center justify-items-center gap-4 sm:gap-6 md:gap-8 max-w-6xl mx-auto">
          {brands.map((brand) => (
            <div
              key={brand.id}
              className="group relative h-12 sm:h-16 w-full px-2 flex items-center justify-center cursor-pointer transition-transform duration-300 hover:scale-105"
            >
              {brand.logo_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={brand.logo_url}
                  alt={brand.name}
                  className="max-h-10 sm:max-h-12 w-auto object-contain transition-all duration-300"
                />
              ) : (
                <span className="text-sm sm:text-base font-bold text-stone-800 tracking-tight text-center">
                  {brand.name}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
