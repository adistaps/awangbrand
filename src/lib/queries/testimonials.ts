import { supabasePublic } from '@/lib/supabase/public'

/**
 * Mengambil daftar Testimonial aktif
 */
export async function getActiveTestimonials() {
  const { data: testimonials } = await supabasePublic
    .from('testimonials')
    .select('id, name, role, company, content, rating, avatar_url')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })

  return testimonials || []
}
