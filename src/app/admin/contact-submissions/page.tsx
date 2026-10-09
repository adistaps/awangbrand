import { createClient } from '@/lib/supabase/server'
import { SubmissionsTable } from '@/components/admin/SubmissionsTable'

export const dynamic = 'force-dynamic'

export default async function AdminContactSubmissionsPage() {
  const supabase = await createClient()
  const { data: submissions } = await supabase
    .from('contact_submissions')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-[#0A1628] mb-1">Pesan Kontak</h1>
      <p className="text-sm text-gray-500 mb-6">Pesan dari form halaman contact</p>
      <SubmissionsTable
        table="contact_submissions"
        rows={submissions || []}
        columns={[
          { key: 'email', label: 'Email' },
          { key: 'website', label: 'Website' },
          { key: 'comment', label: 'Pesan' },
        ]}
      />
    </div>
  )
}
