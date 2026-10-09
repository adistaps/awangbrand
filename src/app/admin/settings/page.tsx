import { createClient } from '@/lib/supabase/server'
import { SettingsForm } from '@/components/admin/SettingsForm'

export const dynamic = 'force-dynamic'

export default async function AdminSettingsPage() {
  const supabase = await createClient()
  const { data: settings } = await supabase.from('site_settings').select('*')

  const settingsMap: Record<string, string> = {}
  ;(settings || []).forEach((s) => {
    settingsMap[s.key] = s.value || ''
  })

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-[#0A1628] mb-1">Pengaturan Website</h1>
      <p className="text-sm text-gray-500 mb-6">Nomor WA, email, dan alamat yang tampil di website</p>
      <SettingsForm initialSettings={settingsMap} />
    </div>
  )
}
