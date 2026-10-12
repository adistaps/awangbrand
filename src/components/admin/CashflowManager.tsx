'use client'

import { useState, useMemo, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { CashflowTransaction, CashflowChannel, CashflowType, Brand } from '@/types/database'
import {
  Plus,
  DollarSign,
  Store,
  Building2,
  Trash2,
  X,
  Search,
  Download,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Truck,
  ShoppingCart,
  ShoppingBag,
  Globe,
  Tent,
  Package,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

const CHANNEL_LABELS: Record<CashflowChannel, { label: string; Icon: LucideIcon }> = {
  offline_store: { label: 'Toko Offline / Mitra', Icon: Store },
  distributor: { label: 'Distributor / Agen', Icon: Truck },
  supermarket: { label: 'Supermarket / Retail Modern', Icon: ShoppingCart },
  online_shopee: { label: 'Online Shopee', Icon: ShoppingBag },
  online_tokopedia: { label: 'Online Tokopedia', Icon: Globe },
  online_lazada: { label: 'Online Lazada', Icon: Globe },
  event_bazaar: { label: 'Event / Food Bazaar', Icon: Tent },
  other: { label: 'Lainnya', Icon: Package },
}

export function CashflowManager({
  initialTransactions,
  brands,
}: {
  initialTransactions: CashflowTransaction[]
  brands: Brand[]
}) {
  const [transactions, setTransactions] = useState<CashflowTransaction[]>(initialTransactions)
  const [modalOpen, setModalOpen] = useState(false)

  // Lock body scroll when modal is open
  useEffect(() => {
    if (modalOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [modalOpen])
  const [saving, setSaving] = useState(false)
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<'all' | 'income' | 'expense'>('all')
  const [channelFilter, setChannelFilter] = useState<string>('all')
  const [brandFilter, setBrandFilter] = useState<string>('all')

  const [form, setForm] = useState({
    transaction_date: new Date().toISOString().split('T')[0],
    type: 'income' as CashflowType,
    amount: '',
    channel: 'offline_store' as CashflowChannel,
    brand_id: '',
    store_name: '',
    description: '',
    reference_no: '',
    payment_method: 'Transfer Bank',
    notes: '',
  })

  // Summary Metrics
  const summary = useMemo(() => {
    let income = 0
    let expense = 0
    let offlineIncome = 0

    transactions.forEach((t) => {
      const amt = Number(t.amount) || 0
      if (t.type === 'income') {
        income += amt
        if (t.channel === 'offline_store' || t.channel === 'supermarket' || t.channel === 'distributor') {
          offlineIncome += amt
        }
      } else {
        expense += amt
      }
    })

    const netProfit = income - expense
    return { income, expense, netProfit, offlineIncome }
  }, [transactions])

  // Filtered list
  const filtered = useMemo(() => {
    return transactions.filter((t) => {
      const matchSearch =
        t.description.toLowerCase().includes(search.toLowerCase()) ||
        (t.store_name && t.store_name.toLowerCase().includes(search.toLowerCase())) ||
        (t.reference_no && t.reference_no.toLowerCase().includes(search.toLowerCase()))

      const matchType = typeFilter === 'all' || t.type === typeFilter
      const matchChannel = channelFilter === 'all' || t.channel === channelFilter
      const matchBrand = brandFilter === 'all' || t.brand_id === brandFilter

      return matchSearch && matchType && matchChannel && matchBrand
    })
  }, [transactions, search, typeFilter, channelFilter, brandFilter])

  // Breakdown by brand
  const brandBreakdown = useMemo(() => {
    const map: Record<string, { name: string; income: number; count: number }> = {}

    transactions
      .filter((t) => t.type === 'income' && t.brand_id)
      .forEach((t) => {
        const bId = t.brand_id!
        const bName = t.brand?.name || brands.find((b) => b.id === bId)?.name || 'Brand Partner'
        if (!map[bId]) {
          map[bId] = { name: bName, income: 0, count: 0 }
        }
        map[bId].income += Number(t.amount) || 0
        map[bId].count += 1
      })

    return Object.values(map).sort((a, b) => b.income - a.income)
  }, [transactions, brands])

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'MYR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(val)
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    if (!form.amount || Number(form.amount) <= 0 || !form.description.trim()) {
      alert('Mohon isi nominal dan deskripsi transaksi dengan benar.')
      return
    }

    setSaving(true)
    const supabase = createClient()

    const payload = {
      transaction_date: form.transaction_date,
      type: form.type,
      amount: Number(form.amount),
      channel: form.channel,
      brand_id: form.brand_id || null,
      store_name: form.store_name.trim() || null,
      description: form.description.trim(),
      reference_no: form.reference_no.trim() || null,
      payment_method: form.payment_method,
      notes: form.notes.trim() || null,
    }

    const { data, error } = await supabase
      .from('cashflow_transactions')
      .insert([payload])
      .select('*, brand:brands(id, name, logo_url)')
      .single()

    if (error) {
      alert('Gagal menambah transaksi: ' + error.message)
    } else if (data) {
      setTransactions((prev) => [data as CashflowTransaction, ...prev])
      setModalOpen(false)
      setForm({
        transaction_date: new Date().toISOString().split('T')[0],
        type: 'income',
        amount: '',
        channel: 'offline_store',
        brand_id: '',
        store_name: '',
        description: '',
        reference_no: '',
        payment_method: 'Transfer Bank',
        notes: '',
      })
    }
    setSaving(false)
  }

  async function handleDelete(id: string) {
    if (!confirm('Hapus pencatatan transaksi ini?')) return
    const supabase = createClient()
    const { error } = await supabase.from('cashflow_transactions').delete().eq('id', id)
    if (!error) {
      setTransactions((prev) => prev.filter((t) => t.id !== id))
    } else {
      alert('Gagal menghapus: ' + error.message)
    }
  }

  function exportCsv() {
    const headers = ['Tanggal', 'Tipe', 'Nominal', 'Kanal/Toko', 'Brand Mitra', 'Nama Toko/Cabang', 'Deskripsi', 'Ref No', 'Metode Pembayaran']
    const csvRows = filtered.map((t) => [
      t.transaction_date,
      t.type === 'income' ? 'Pemasukan' : 'Pengeluaran',
      t.amount,
      CHANNEL_LABELS[t.channel]?.label || t.channel,
      t.brand?.name || '-',
      t.store_name || '-',
      `"${(t.description || '').replace(/"/g, '""')}"`,
      t.reference_no || '-',
      t.payment_method || '-',
    ])
    const csv = [headers.join(','), ...csvRows.map((r) => r.join(','))].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `cashflow-awang-${Date.now()}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      {/* Header Halaman */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#0A1628] tracking-tight">Cashflow & Penjualan</h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Manajemen pemasukan toko offline, ritel modern, marketplace & integrasi penjualan per brand
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={exportCsv}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-700 hover:text-[#C8102E] bg-white border border-gray-200 px-3.5 py-2.5 rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <Download size={14} /> Export CSV
          </button>
          <button
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-2 bg-[#C8102E] hover:bg-[#a00b22] text-white text-xs sm:text-sm font-bold px-4 sm:px-5 py-2.5 rounded-xl transition-all shadow-xs active:scale-95 cursor-pointer shrink-0"
          >
            <Plus size={16} /> Catat Transaksi
          </button>
        </div>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-xs border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-gray-500">Total Pemasukan</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ArrowUpRight size={16} />
            </div>
          </div>
          <p className="text-lg sm:text-2xl font-extrabold text-emerald-600 tracking-tight">
            {formatCurrency(summary.income)}
          </p>
          <p className="text-[11px] text-gray-400 mt-1">Penjualan produk & ritel</p>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-xs border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-gray-500">Pemasukan Offline</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Store size={16} />
            </div>
          </div>
          <p className="text-lg sm:text-2xl font-extrabold text-blue-600 tracking-tight">
            {formatCurrency(summary.offlineIncome)}
          </p>
          <p className="text-[11px] text-gray-400 mt-1">Toko ritel, supermarket, agen</p>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-xs border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-gray-500">Total Pengeluaran</span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <ArrowDownRight size={16} />
            </div>
          </div>
          <p className="text-lg sm:text-2xl font-extrabold text-rose-600 tracking-tight">
            {formatCurrency(summary.expense)}
          </p>
          <p className="text-[11px] text-gray-400 mt-1">Bahan baku & operasional</p>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-xs border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-gray-500">Laba Bersih (Net)</span>
            <div className="w-8 h-8 rounded-xl bg-[#C8102E]/10 text-[#C8102E] flex items-center justify-center">
              <DollarSign size={16} />
            </div>
          </div>
          <p className={`text-lg sm:text-2xl font-extrabold tracking-tight ${summary.netProfit >= 0 ? 'text-[#0A1628]' : 'text-rose-600'}`}>
            {formatCurrency(summary.netProfit)}
          </p>
          <p className="text-[11px] text-gray-400 mt-1">Surplus kas operasional</p>
        </div>
      </div>

      {/* Performa Pemasukan per Brand Mitra */}
      {brandBreakdown.length > 0 && (
        <div className="bg-white rounded-2xl p-5 shadow-xs border border-gray-100">
          <div className="flex items-center justify-between mb-3.5">
            <div>
              <h2 className="text-sm font-bold text-[#0A1628]">Integrasi Penjualan per Brand / Mitra</h2>
              <p className="text-xs text-gray-400">Total pemasukan tercatat berdasarkan brand & supplier rekanan</p>
            </div>
            <span className="text-xs font-semibold text-[#C8102E] bg-red-50 px-2.5 py-1 rounded-full">
              {brandBreakdown.length} Brand Aktif
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {brandBreakdown.map((item) => (
              <div key={item.name} className="p-3.5 rounded-xl border border-gray-100 bg-gray-50/40 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-[#0A1628] truncate">{item.name}</span>
                  <span className="text-[10px] font-semibold text-gray-400">{item.count} tranksasi</span>
                </div>
                <p className="text-sm font-extrabold text-[#C8102E]">{formatCurrency(item.income)}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tabel & Filter Transaksi */}
      <div className="bg-white rounded-2xl shadow-xs border border-gray-100 overflow-hidden">
        {/* Filter Bar */}
        <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row gap-3 md:items-center">
          <div className="relative flex-1 min-w-0">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
            <input
              placeholder="Cari transaksi, toko offline, no ref..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#C8102E] transition-colors"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as any)}
              className="px-3 py-2 border border-gray-200 rounded-xl text-xs bg-white focus:outline-none focus:border-[#C8102E]"
            >
              <option value="all">Semua Tipe</option>
              <option value="income">Pemasukan (+)</option>
              <option value="expense">Pengeluaran (-)</option>
            </select>
            <select
              value={channelFilter}
              onChange={(e) => setChannelFilter(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-xl text-xs bg-white focus:outline-none focus:border-[#C8102E]"
            >
              <option value="all">Semua Kanal</option>
              {Object.entries(CHANNEL_LABELS).map(([key, val]) => (
                <option key={key} value={key}>
                  {val.label}
                </option>
              ))}
            </select>
            <select
              value={brandFilter}
              onChange={(e) => setBrandFilter(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-xl text-xs bg-white focus:outline-none focus:border-[#C8102E]"
            >
              <option value="all">Semua Brand</option>
              {brands.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Tabel Data Responsif */}
        <div className="overflow-x-auto w-full">
          <table className="w-full text-sm min-w-[760px]">
            <thead className="bg-gray-50/75 text-gray-500 text-xs uppercase border-b border-gray-100">
              <tr>
                <th className="p-3.5 text-left font-semibold">Tanggal</th>
                <th className="p-3.5 text-left font-semibold">Kanal / Toko</th>
                <th className="p-3.5 text-left font-semibold">Deskripsi & Ref</th>
                <th className="p-3.5 text-left font-semibold">Brand Mitra</th>
                <th className="p-3.5 text-right font-semibold">Nominal</th>
                <th className="p-3.5 text-right font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((t) => {
                const isIncome = t.type === 'income'
                const channelInfo = CHANNEL_LABELS[t.channel] || { label: t.channel, Icon: Package }
                const ChannelIcon = channelInfo.Icon
                return (
                  <tr key={t.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="p-3.5 text-xs text-gray-500 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 font-medium text-gray-700">
                        <Calendar size={13} className="text-gray-400" />
                        {new Date(t.transaction_date).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </div>
                      <span className="text-[10px] text-gray-400">{t.payment_method || 'Tunai/Bank'}</span>
                    </td>
                    <td className="p-3.5">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                          <ChannelIcon size={13} className="text-gray-500" />
                        </div>
                        <div>
                          <p className="font-semibold text-xs text-[#0A1628]">{t.store_name || channelInfo.label}</p>
                          {t.store_name && <p className="text-[10px] text-gray-400">{channelInfo.label}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="p-3.5 max-w-[240px]">
                      <p className="font-semibold text-xs text-[#0A1628] truncate">{t.description}</p>
                      {t.reference_no && <p className="text-[10px] text-gray-400 font-mono">Ref: {t.reference_no}</p>}
                    </td>
                    <td className="p-3.5">
                      {t.brand?.name ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-gray-700 bg-gray-100 px-2 py-0.5 rounded-md">
                          <Building2 size={11} className="text-gray-400" />
                          {t.brand.name}
                        </span>
                      ) : (
                        <span className="text-xs text-gray-300">—</span>
                      )}
                    </td>
                    <td className="p-3.5 text-right whitespace-nowrap">
                      <span
                        className={`font-extrabold text-xs sm:text-sm ${
                          isIncome ? 'text-emerald-600' : 'text-rose-600'
                        }`}
                      >
                        {isIncome ? '+' : '-'} {formatCurrency(Number(t.amount))}
                      </span>
                    </td>
                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => handleDelete(t.id)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                        title="Hapus Transaksi"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                )
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-10 text-center text-gray-400 text-sm">
                    Belum ada data transaksi cashflow. Silakan klik tombol "Catat Transaksi" untuk memasukkan penjualan baru.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Input Transaksi */}
      {modalOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-end sm:items-center justify-center sm:p-4 overflow-y-auto"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="bg-white rounded-t-3xl sm:rounded-2xl w-full sm:max-w-lg max-h-[82vh] sm:max-h-[85vh] flex flex-col shadow-2xl overflow-hidden border border-gray-100/80 my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drag handle for mobile */}
            <div className="flex justify-center pt-3 pb-1 sm:hidden shrink-0">
              <div className="w-10 h-1 bg-gray-200 rounded-full" />
            </div>

            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 sm:px-7 pt-4 sm:pt-5 pb-3.5 border-b border-gray-100 shrink-0 bg-white">
              <div>
                <h3 className="font-extrabold text-base text-[#0A1628]">Catat Transaksi Penjualan / Kas</h3>
                <p className="text-xs text-gray-400">Pemasukan penjualan offline, ritel, atau operasional</p>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1.5 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
                aria-label="Tutup"
              >
                <X size={18} />
              </button>
            </div>

            {/* Form wrapping scrollable inputs + sticky footer */}
            <form onSubmit={handleAdd} className="flex-1 min-h-0 flex flex-col">
              {/* Scrollable form body */}
              <div className="flex-1 min-h-0 overflow-y-auto px-5 sm:px-7 py-4 space-y-4 custom-scrollbar">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-gray-700 mb-1 block">Tipe Transaksi *</label>
                    <select
                      value={form.type}
                      onChange={(e) => setForm({ ...form, type: e.target.value as CashflowType })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs sm:text-sm bg-white focus:outline-none focus:border-[#C8102E]"
                    >
                      <option value="income">Pemasukan (+)</option>
                      <option value="expense">Pengeluaran (-)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-700 mb-1 block">Tanggal *</label>
                    <input
                      type="date"
                      required
                      value={form.transaction_date}
                      onChange={(e) => setForm({ ...form, transaction_date: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#C8102E]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-700 mb-1 block">Nominal (MYR) *</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">RM</span>
                    <input
                      type="number"
                      step="0.01"
                      required
                      placeholder="0.00"
                      value={form.amount}
                      onChange={(e) => setForm({ ...form, amount: e.target.value })}
                      className="w-full pl-11 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm font-bold focus:outline-none focus:border-[#C8102E]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-gray-700 mb-1 block">Kanal Penjualan / Jalur *</label>
                    <select
                      value={form.channel}
                      onChange={(e) => setForm({ ...form, channel: e.target.value as CashflowChannel })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs sm:text-sm bg-white focus:outline-none focus:border-[#C8102E]"
                    >
                      {Object.entries(CHANNEL_LABELS).map(([k, v]) => (
                        <option key={k} value={k}>
                          {v.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-700 mb-1 block">Integrasi Brand Mitra</label>
                    <select
                      value={form.brand_id}
                      onChange={(e) => setForm({ ...form, brand_id: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs sm:text-sm bg-white focus:outline-none focus:border-[#C8102E]"
                    >
                      <option value="">-- Tanpa Brand Khusus --</option>
                      {brands.map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-700 mb-1 block">Nama Toko Offline / Cabang / Pihak Pembeli</label>
                  <input
                    type="text"
                    placeholder="cth: Kedai Runcit Pak Ali / Mydin Subang Jaya"
                    value={form.store_name}
                    onChange={(e) => setForm({ ...form, store_name: e.target.value })}
                    className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#C8102E]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-700 mb-1 block">Deskripsi Transaksi *</label>
                  <input
                    type="text"
                    required
                    placeholder="cth: Restock 50 Botol Pes Rendang Tok Warisan"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#C8102E]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-gray-700 mb-1 block">Nomor Invoice / Ref</label>
                    <input
                      type="text"
                      placeholder="INV-2026-001"
                      value={form.reference_no}
                      onChange={(e) => setForm({ ...form, reference_no: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-[#C8102E]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-700 mb-1 block">Metode Pembayaran</label>
                    <select
                      value={form.payment_method}
                      onChange={(e) => setForm({ ...form, payment_method: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs bg-white focus:outline-none focus:border-[#C8102E]"
                    >
                      <option value="Transfer Bank">Transfer Bank</option>
                      <option value="Tunai (Cash)">Tunai (Cash)</option>
                      <option value="DuitNow / QR">DuitNow / QR</option>
                      <option value="Tempo (30 Hari)">Tempo (30 Hari)</option>
                      <option value="Marketplace Payout">Marketplace Payout</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Sticky Footer Actions */}
              <div className="shrink-0 px-5 sm:px-7 py-3.5 pb-6 sm:pb-3.5 border-t border-gray-100 bg-white flex items-center gap-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-[#C8102E] hover:bg-[#a00b22] text-white font-bold text-sm py-3 rounded-xl transition-all shadow-md active:scale-95 disabled:opacity-60 cursor-pointer text-center"
                >
                  {saving ? 'Menyimpan...' : 'Simpan Transaksi'}
                </button>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-3 text-sm font-semibold text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
