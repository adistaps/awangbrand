import { createClient } from '@/lib/supabase/server'
import { TestimonialsManager } from '@/components/admin/TestimonialsManager'

export const dynamic = 'force-dynamic'

export default async function AdminTestimonialsPage() {
  const supabase = await createClient()
  const { data: testimonials } = await supabase.from('testimonials').select('*').order('sort_order')

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-[#0A1628] mb-1">Kelola Testimoni</h1>
      <p className="text-sm text-gray-500 mb-6">Testimoni yang aktif akan tampil di homepage</p>
      <TestimonialsManager initialTestimonials={testimonials || []} />
    </div>
  )
}
