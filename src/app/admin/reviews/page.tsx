import { createClient } from '@/lib/supabase/server'
import { ReviewsManager } from '@/components/admin/ReviewsManager'

export const dynamic = 'force-dynamic'

export default async function AdminReviewsPage() {
  const supabase = await createClient()

  const [{ data: reviews }, { data: products }] = await Promise.all([
    supabase
      .from('product_reviews')
      .select('*, product:products(id, name, slug, main_image)')
      .order('created_at', { ascending: false }),

    supabase
      .from('products')
      .select('id, name, slug, main_image')
      .order('name', { ascending: true }),
  ])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-[#0A1628]">Kelola Ulasan Pelanggan (Customer Reviews)</h1>
        <p className="text-sm text-gray-500 mt-1">
          Kelola review produk (bintang, komentar, & upload foto ulasan pelanggan) yang tampil di detail produk dan homepage.
        </p>
      </div>

      <ReviewsManager
        initialReviews={reviews || []}
        products={products || []}
      />
    </div>
  )
}
