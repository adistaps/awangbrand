import { createClient } from '@/lib/supabase/server'
import { HomepageCMSClient } from '@/components/admin/HomepageCMSClient'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Homepage CMS | AWANG Brand Admin',
}

export default async function AdminHomepageCMSPage() {
  const supabase = await createClient()

  // Ambil data produk, resep, dan site_settings
  const [
    { data: products },
    { data: recipes },
    { data: siteSettingsRaw },
  ] = await Promise.all([
    supabase
      .from('products')
      .select('id, name, slug, main_image, is_featured, featured_badge, featured_sort, category:categories(name)')
      .eq('status', 'published')
      .order('featured_sort', { ascending: true })
      .order('created_at', { ascending: false }),

    supabase
      .from('recipes')
      .select('id, title, slug, main_image, is_featured, featured_badge, featured_sort, home_carousel_sort, category')
      .eq('status', 'published')
      .order('featured_sort', { ascending: true })
      .order('created_at', { ascending: false }),

    supabase
      .from('site_settings')
      .select('key, value'),
  ])

  const siteSettings: Record<string, string> = {}
  ;(siteSettingsRaw || []).forEach((row) => {
    if (row.key && row.value !== null) {
      siteSettings[row.key] = row.value
    }
  })

  return (
    <HomepageCMSClient
      products={products || []}
      recipes={recipes || []}
      siteSettings={siteSettings}
    />
  )
}
