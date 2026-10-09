import { createClient } from '@/lib/supabase/server'
import { SubmissionsTable } from '@/components/admin/SubmissionsTable'

export const dynamic = 'force-dynamic'

export default async function AdminQuoteSubmissionsPage() {
  const supabase = await createClient()
  const { data: submissions } = await supabase
    .from('quote_submissions')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-[#0A1628] mb-1">Quote Submission</h1>
      <p className="text-sm text-gray-500 mb-6">Permintaan quote dari homepage</p>
      <SubmissionsTable
        table="quote_submissions"
        rows={submissions || []}
        columns={[
          { key: 'name', label: 'Nama' },
          { key: 'email', label: 'Email' },
          { key: 'category', label: 'Kategori' },
          { key: 'message', label: 'Pesan' },
        ]}
      />
    </div>
  )
}
