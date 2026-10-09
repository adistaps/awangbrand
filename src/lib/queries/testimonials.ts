import { createClient } from '@/lib/supabase/server'

/**
 * Mengambil daftar Testimonial aktif
 */
export async function getActiveTestimonials() {
  const supabase = await createClient()
  const { data: testimonials } = await supabase
    .from('testimonials')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })

  return testimonials || []
}
