import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { AdminLayoutClient } from '@/components/admin/AdminLayoutClient'

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Login page renders its own standalone layout (no sidebar)
  if (!user) {
    return <div className="min-h-screen bg-white">{children}</div>
  }

  const { count: newQuoteCount } = await supabase
    .from('quote_submissions')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'new')

  const { count: newContactCount } = await supabase
    .from('contact_submissions')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'new')

  return (
    <AdminLayoutClient
      newQuoteCount={newQuoteCount || 0}
      newContactCount={newContactCount || 0}
    >
      {children}
    </AdminLayoutClient>
  )
}
