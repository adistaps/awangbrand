import { createClient } from '@/lib/supabase/server'
import { CashflowManager } from '@/components/admin/CashflowManager'
import type { CashflowTransaction, Brand } from '@/types/database'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Cashflow & Penjualan | AWANG Admin',
}

export default async function AdminCashflowPage() {
  const supabase = await createClient()

  // Ambil data transaksi cashflow dengan relasi brand
  const { data: rawTransactions } = await supabase
    .from('cashflow_transactions')
    .select('*, brand:brands(id, name, logo_url)')
    .order('transaction_date', { ascending: false })

  // Ambil daftar brand aktif untuk dropdown integrasi toko/brand
  const { data: rawBrands } = await supabase
    .from('brands')
    .select('*')
    .order('name')

  const transactions: CashflowTransaction[] = (rawTransactions || []) as CashflowTransaction[]
  const brands: Brand[] = (rawBrands || []) as Brand[]

  return (
    <div className="space-y-6">
      <CashflowManager initialTransactions={transactions} brands={brands} />
    </div>
  )
}
