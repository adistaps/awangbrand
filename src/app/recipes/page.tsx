import type { Metadata } from 'next'
import { RecipesClient } from '@/app/recipes/RecipesClient'

export const metadata: Metadata = {
  title: 'All Recipes | AWANG Delicious Inspirations',
  description: 'Temukan aneka resep masakan lezat dan kreatif menggunakan produk saus dan bumbu AWANG.',
  openGraph: {
    title: 'Recipes | AWANG',
    description: 'Kreasi resep pilihan terbaik untuk keluarga Anda.',
    url: 'https://awangbrand.com/recipes',
  },
  alternates: { canonical: 'https://awangbrand.com/recipes' },
}

export const dynamic = 'force-dynamic'

export default function RecipesPage() {
  return (
    <main className="bg-[#FDFBF7] font-sans min-h-screen">
      <RecipesClient />
    </main>
  )
}
