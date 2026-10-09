import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Package, Inbox, Mail, Star, Plus, Eye } from 'lucide-react'
import { SubmissionsChart } from '@/components/admin/SubmissionsChart'

export const dynamic = 'force-dynamic'

export default async function AdminDashboardPage() {
  const supabase = await createClient()

  const [
    { count: totalProducts },
    { count: publishedProducts },
    { count: featuredProducts },
    { count: newQuotes },
    { count: newContacts },
    { data: recentQuotes },
    { data: recentContacts },
    { data: viewsRaw },
    { data: quotesRaw },
    { data: contactsRaw },
  ] = await Promise.all([
    supabase.from('products').select('*', { count: 'exact', head: true }),
    supabase.from('products').select('*', { count: 'exact', head: true }).eq('status', 'published'),
    supabase.from('products').select('*', { count: 'exact', head: true }).eq('is_featured', true),
    supabase.from('quote_submissions').select('*', { count: 'exact', head: true }).eq('status', 'new'),
    supabase.from('contact_submissions').select('*', { count: 'exact', head: true }).eq('status', 'new'),
    supabase.from('quote_submissions').select('*').order('created_at', { ascending: false }).limit(5),
    supabase.from('contact_submissions').select('*').order('created_at', { ascending: false }).limit(5),
    supabase.from('product_views').select('viewed_at').order('viewed_at', { ascending: false }).limit(500),
    supabase.from('quote_submissions').select('created_at'),
    supabase.from('contact_submissions').select('created_at'),
  ])

  const stats = [
    { label: 'Total Produk', value: totalProducts || 0, icon: Package, color: 'bg-blue-500' },
    { label: 'Produk Tayang', value: publishedProducts || 0, icon: Eye, color: 'bg-emerald-500' },
    { label: 'Produk Featured', value: featuredProducts || 0, icon: Star, color: 'bg-amber-500' },
    { label: 'Quote Baru', value: newQuotes || 0, icon: Inbox, color: 'bg-red-500' },
    { label: 'Pesan Baru', value: newContacts || 0, icon: Mail, color: 'bg-purple-500' },
  ]

  // Group submissions per month for chart (last 6 months)
  function groupByMonth(rows: { created_at: string }[] | null) {
    const map: Record<string, number> = {}
    const now = new Date()
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const key = d.toLocaleDateString('id-ID', { month: 'short', year: '2-digit' })
      map[key] = 0
    }
    ;(rows || []).forEach((r) => {
      const d = new Date(r.created_at)
      const key = d.toLocaleDateString('id-ID', { month: 'short', year: '2-digit' })
      if (key in map) map[key]++
    })
    return map
  }

  const quoteByMonth = groupByMonth(quotesRaw)
  const contactByMonth = groupByMonth(contactsRaw)
  const labels = Object.keys(quoteByMonth)

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0A1628]">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Ringkasan aktivitas website Keywell Arshaka Innovation</p>
        </div>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 bg-[#F5A200] hover:bg-[#D98B00] text-white text-sm font-bold px-4 py-2.5 rounded-lg transition-colors"
        >
          <Plus size={16} /> Tambah Produk
        </Link>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className={`w-9 h-9 rounded-lg ${color} text-white flex items-center justify-center mb-3`}>
              <Icon size={18} />
            </div>
            <p className="text-2xl font-extrabold text-[#0A1628]">{value}</p>
            <p className="text-xs text-gray-500 mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-8">
        <h2 className="font-bold text-[#0A1628] mb-4">Submission 6 Bulan Terakhir</h2>
        <SubmissionsChart
          labels={labels}
          quotes={Object.values(quoteByMonth)}
          contacts={Object.values(contactByMonth)}
        />
      </div>

      {/* Quick actions */}
      <div className="grid md:grid-cols-4 gap-3 mb-8">
        <Link href="/admin/products/new" className="bg-white border border-gray-100 rounded-xl p-4 text-sm font-semibold text-[#0A1628] hover:border-[#F5A200] transition-colors shadow-sm">
          + Tambah Produk
        </Link>
        <Link href="/admin/testimonials" className="bg-white border border-gray-100 rounded-xl p-4 text-sm font-semibold text-[#0A1628] hover:border-[#F5A200] transition-colors shadow-sm">
          + Tambah Testimoni
        </Link>
        <Link href="/admin/brands" className="bg-white border border-gray-100 rounded-xl p-4 text-sm font-semibold text-[#0A1628] hover:border-[#F5A200] transition-colors shadow-sm">
          + Tambah Brand
        </Link>
        <Link href="/admin/quote-submissions" className="bg-white border border-gray-100 rounded-xl p-4 text-sm font-semibold text-[#0A1628] hover:border-[#F5A200] transition-colors shadow-sm">
          Lihat Quote Baru →
        </Link>
      </div>

      {/* Recent activity */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="font-bold text-[#0A1628] mb-4">Quote Terbaru</h2>
          <div className="space-y-3">
            {(recentQuotes || []).length === 0 && <p className="text-sm text-gray-400">Belum ada quote masuk.</p>}
            {(recentQuotes || []).map((q) => (
              <div key={q.id} className="flex items-center justify-between text-sm border-b border-gray-50 pb-2 last:border-0">
                <div>
                  <p className="font-semibold text-[#0A1628]">{q.name}</p>
                  <p className="text-xs text-gray-500">{q.category || '-'}</p>
                </div>
                <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${q.status === 'new' ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-500'}`}>
                  {q.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="font-bold text-[#0A1628] mb-4">Pesan Kontak Terbaru</h2>
          <div className="space-y-3">
            {(recentContacts || []).length === 0 && <p className="text-sm text-gray-400">Belum ada pesan masuk.</p>}
            {(recentContacts || []).map((c) => (
              <div key={c.id} className="flex items-center justify-between text-sm border-b border-gray-50 pb-2 last:border-0">
                <div>
                  <p className="font-semibold text-[#0A1628]">{c.email}</p>
                  <p className="text-xs text-gray-500 line-clamp-1 max-w-[200px]">{c.comment}</p>
                </div>
                <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${c.status === 'new' ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-500'}`}>
                  {c.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
