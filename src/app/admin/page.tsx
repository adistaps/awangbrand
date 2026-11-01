import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import {
  Package,
  Inbox,
  Mail,
  Star,
  Plus,
  Eye,
  TrendingUp,
  ArrowRight,
  Activity,
  Wallet,
  Store,
  DollarSign,
  ArrowUpRight,
} from 'lucide-react'
import { SubmissionsChart } from '@/components/admin/SubmissionsChart'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Dashboard | AWANG Brand Admin',
}

export default async function AdminDashboardPage() {
  const supabase = await createClient()

  const [
    { count: totalProducts },
    { count: publishedProducts },
    { count: featuredProducts },
    { count: featuredRecipes },
    { count: newQuotes },
    { count: newContacts },
    { data: recentQuotes },
    { data: recentContacts },
    { data: quotesRaw },
    { data: contactsRaw },
    { data: cashflowRaw },
  ] = await Promise.all([
    supabase.from('products').select('*', { count: 'exact', head: true }),
    supabase.from('products').select('*', { count: 'exact', head: true }).eq('status', 'published'),
    supabase.from('products').select('*', { count: 'exact', head: true }).eq('is_featured', true),
    supabase.from('recipes').select('*', { count: 'exact', head: true }).eq('is_featured', true).eq('status', 'published'),
    supabase.from('quote_submissions').select('*', { count: 'exact', head: true }).eq('status', 'new'),
    supabase.from('contact_submissions').select('*', { count: 'exact', head: true }).eq('status', 'new'),
    supabase.from('quote_submissions').select('*').order('created_at', { ascending: false }).limit(5),
    supabase.from('contact_submissions').select('*').order('created_at', { ascending: false }).limit(5),
    supabase.from('quote_submissions').select('created_at'),
    supabase.from('contact_submissions').select('created_at'),
    supabase.from('cashflow_transactions').select('amount, type, channel, store_name, transaction_date, description').order('transaction_date', { ascending: false }),
  ])

  // Hitung metrik cashflow
  let totalIncome = 0
  let offlineIncome = 0
  let totalExpense = 0
  const recentCashflow = (cashflowRaw || []).slice(0, 5)

  ;(cashflowRaw || []).forEach((item: any) => {
    const amt = Number(item.amount) || 0
    if (item.type === 'income') {
      totalIncome += amt
      if (item.channel === 'offline_store' || item.channel === 'supermarket' || item.channel === 'distributor') {
        offlineIncome += amt
      }
    } else {
      totalExpense += amt
    }
  })

  const netCashflow = totalIncome - totalExpense

  const formatRM = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'MYR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(val)
  }

  const stats = [
    {
      label: 'Pendapatan Kas',
      value: formatRM(totalIncome),
      sublabel: 'Penjualan masuk',
      icon: Wallet,
      gradient: 'from-emerald-500 to-emerald-600',
      bg: 'bg-emerald-50',
      textColor: 'text-emerald-600',
    },
    {
      label: 'Penjualan Offline',
      value: formatRM(offlineIncome),
      sublabel: 'Toko mitra & ritel',
      icon: Store,
      gradient: 'from-blue-500 to-blue-600',
      bg: 'bg-blue-50',
      textColor: 'text-blue-600',
    },
    {
      label: 'Total Produk',
      value: totalProducts || 0,
      sublabel: `${publishedProducts || 0} tayang`,
      icon: Package,
      gradient: 'from-[#C8102E] to-[#a00b22]',
      bg: 'bg-red-50',
      textColor: 'text-[#C8102E]',
    },
    {
      label: 'Featured Homepage',
      value: `${featuredProducts || 0}P · ${featuredRecipes || 0}R`,
      sublabel: 'Produk & Resep di Taste Heat',
      icon: Star,
      gradient: 'from-orange-500 to-orange-600',
      bg: 'bg-orange-50',
      textColor: 'text-orange-600',
    },
    {
      label: 'Quote Masuk',
      value: newQuotes || 0,
      sublabel: 'Permintaan baru',
      icon: Inbox,
      gradient: 'from-amber-500 to-amber-600',
      bg: 'bg-amber-50',
      textColor: 'text-amber-600',
    },
    {
      label: 'Pesan Kontak',
      value: newContacts || 0,
      sublabel: 'Pesan belum dibalas',
      icon: Mail,
      gradient: 'from-purple-500 to-purple-600',
      bg: 'bg-purple-50',
      textColor: 'text-purple-600',
    },
  ]

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

  const quickActions = [
    { href: '/admin/cashflow', label: 'Catat Penjualan', icon: Wallet, description: 'Cashflow & omzet' },
    { href: '/admin/products/new', label: 'Tambah Produk', icon: Plus, description: 'Produk baru' },
    { href: '/admin/recipes/new', label: 'Tambah Resep', icon: Plus, description: 'Resep baru' },
    { href: '/admin/brands', label: 'Brand & Mitra', icon: Store, description: 'Integrasi ritel' },
  ]

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0A1628] tracking-tight">Dashboard</h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1 flex items-center gap-1.5">
            <Activity size={13} className="text-[#C8102E]" />
            Ringkasan omzet penjualan, produk & aktivitas AWANG Brand
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <Link
            href="/admin/cashflow"
            className="inline-flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-[#0A1628] border border-gray-200 text-xs sm:text-sm font-bold px-4 sm:px-5 py-2.5 rounded-xl transition-all shadow-xs active:scale-95 shrink-0"
          >
            <Wallet size={15} className="text-[#C8102E]" />
            <span>Lihat Cashflow</span>
          </Link>
          <Link
            href="/admin/products/new"
            className="inline-flex items-center justify-center gap-2 bg-[#C8102E] hover:bg-[#a00b22] !text-white text-xs sm:text-sm font-bold px-4 sm:px-5 py-2.5 rounded-xl transition-all shadow-xs active:scale-95 shrink-0"
          >
            <Plus size={16} className="!text-white text-white" />
            <span className="!text-white text-white">Tambah Produk</span>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4">
        {stats.map(({ label, value, sublabel, icon: Icon, gradient, textColor }) => (
          <div
            key={label}
            className="bg-white rounded-2xl p-4 sm:p-5 shadow-xs border border-gray-100 hover:shadow-md transition-all hover:-translate-y-0.5 group"
          >
            <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br ${gradient} text-white flex items-center justify-center mb-3 shadow-xs group-hover:scale-110 transition-transform`}>
              <Icon size={17} />
            </div>
            <p className="text-xl sm:text-2xl font-extrabold text-[#0A1628] leading-tight truncate">{value}</p>
            <p className={`text-xs font-semibold mt-1 ${textColor}`}>{label}</p>
            <p className="text-[10px] text-gray-400 mt-0.5">{sublabel}</p>
          </div>
        ))}
      </div>

      {/* Cashflow & Penjualan Terkini Row */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-xs border border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5">
          <div>
            <h2 className="font-bold text-[#0A1628] text-base flex items-center gap-2">
              <Wallet size={17} className="text-[#C8102E]" />
              Penjualan & Cashflow Terkini
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">Transaksi masuk dari toko offline, ritel modern, dan kanal penjualan</p>
          </div>
          <Link
            href="/admin/cashflow"
            className="text-xs font-bold text-[#C8102E] hover:underline flex items-center gap-1 self-start sm:self-auto"
          >
            Buka Manajemen Cashflow <ArrowRight size={13} />
          </Link>
        </div>

        {recentCashflow.length === 0 ? (
          <div className="text-center py-8 bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
            <Store size={28} className="text-gray-300 mx-auto mb-2" />
            <p className="text-xs text-gray-400">Belum ada catatan penjualan cashflow.</p>
            <Link
              href="/admin/cashflow"
              className="inline-block mt-2 text-xs font-bold text-[#C8102E] hover:underline"
            >
              + Catat Penjualan Sekarang
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {recentCashflow.map((cf: any, idx: number) => {
              const isIncome = cf.type === 'income'
              return (
                <div key={idx} className="p-3.5 rounded-xl border border-gray-100 bg-gray-50/30 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] font-semibold text-gray-500 truncate">
                      {cf.store_name || cf.channel}
                    </span>
                    <span className="text-[10px] text-gray-400">
                      {new Date(cf.transaction_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-[#0A1628] truncate mb-1">{cf.description}</p>
                  <p className={`text-sm font-extrabold ${isIncome ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {isIncome ? '+' : '-'} {formatRM(Number(cf.amount))}
                  </p>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Chart + Quick Actions row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-bold text-[#0A1628] text-base">Aktivitas 6 Bulan Terakhir</h2>
              <p className="text-xs text-gray-400 mt-0.5">Quote & pesan kontak masuk</p>
            </div>
            <span className="flex items-center gap-1 text-xs font-semibold text-emerald-500 bg-emerald-50 px-2.5 py-1 rounded-full">
              <TrendingUp size={11} /> Live
            </span>
          </div>
          <SubmissionsChart
            labels={labels}
            quotes={Object.values(quoteByMonth)}
            contacts={Object.values(contactByMonth)}
          />
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="font-bold text-[#0A1628] text-base mb-1">Aksi Cepat</h2>
          <p className="text-xs text-gray-400 mb-5">Shortcut navigasi admin</p>
          <div className="space-y-3">
            {quickActions.map(({ href, label, icon: Icon, description }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center justify-between p-3.5 rounded-xl bg-gray-50 hover:bg-red-50 hover:border-red-100 border border-transparent transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#C8102E]/10 text-[#C8102E] flex items-center justify-center group-hover:bg-[#C8102E] group-hover:text-white transition-all">
                    <Icon size={14} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#0A1628]">{label}</p>
                    <p className="text-[11px] text-gray-400">{description}</p>
                  </div>
                </div>
                <ArrowRight size={14} className="text-gray-300 group-hover:text-[#C8102E] transition-colors" />
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Recent Quotes */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-[#0A1628] text-base">Quote Terbaru</h2>
            <Link href="/admin/quote-submissions" className="text-[11px] font-semibold text-[#C8102E] hover:underline flex items-center gap-1">
              Lihat Semua <ArrowRight size={11} />
            </Link>
          </div>
          <div className="space-y-3">
            {(recentQuotes || []).length === 0 && (
              <div className="text-center py-6">
                <Inbox size={28} className="text-gray-200 mx-auto mb-2" />
                <p className="text-sm text-gray-400">Belum ada quote masuk.</p>
              </div>
            )}
            {(recentQuotes || []).map((q) => (
              <div key={q.id} className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0">
                <div>
                  <p className="text-sm font-semibold text-[#0A1628]">{q.name}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{q.category || '—'}</p>
                </div>
                <span
                  className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                    q.status === 'new'
                      ? 'bg-red-100 text-[#C8102E]'
                      : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {q.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Contacts */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-[#0A1628] text-base">Pesan Kontak Terbaru</h2>
            <Link href="/admin/contact-submissions" className="text-[11px] font-semibold text-[#C8102E] hover:underline flex items-center gap-1">
              Lihat Semua <ArrowRight size={11} />
            </Link>
          </div>
          <div className="space-y-3">
            {(recentContacts || []).length === 0 && (
              <div className="text-center py-6">
                <Mail size={28} className="text-gray-200 mx-auto mb-2" />
                <p className="text-sm text-gray-400">Belum ada pesan masuk.</p>
              </div>
            )}
            {(recentContacts || []).map((c) => (
              <div key={c.id} className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0">
                <div className="min-w-0 flex-1 mr-3">
                  <p className="text-sm font-semibold text-[#0A1628] truncate">{c.email}</p>
                  <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{c.comment}</p>
                </div>
                <span
                  className={`text-[10px] font-bold px-2.5 py-1 rounded-full shrink-0 ${
                    c.status === 'new'
                      ? 'bg-red-100 text-[#C8102E]'
                      : 'bg-gray-100 text-gray-500'
                  }`}
                >
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
