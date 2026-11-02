'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  Package,
  Tags,
  MessageSquareQuote,
  Building2,
  Inbox,
  Mail,
  LogOut,
  UserCircle,
  TrendingUp,
  Wallet,
  Sparkles,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/homepage', label: 'Homepage CMS', icon: Sparkles },
  { href: '/admin/cashflow', label: 'Cashflow & Penjualan', icon: Wallet },
  { href: '/admin/products', label: 'Produk', icon: Package },
  { href: '/admin/recipes', label: 'Resep', icon: Tags },
  { href: '/admin/categories', label: 'Kategori', icon: Tags },
  { href: '/admin/testimonials', label: 'Testimoni', icon: MessageSquareQuote },
  { href: '/admin/brands', label: 'Brand & Mitra', icon: Building2 },
  { href: '/admin/quote-submissions', label: 'Quote Masuk', icon: Inbox },
  { href: '/admin/contact-submissions', label: 'Pesan Kontak', icon: Mail },
]

export function Sidebar({
  newQuoteCount,
  newContactCount,
  onClose,
}: {
  newQuoteCount: number
  newContactCount: number
  onClose?: () => void
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [userEmail, setUserEmail] = useState<string | null>(null)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => {
      setUserEmail(data.user?.email ?? null)
    })
  }, [])

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    if (onClose) onClose()
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <aside className="relative w-full lg:w-64 shrink-0 bg-[#CC0000] text-white h-full flex flex-col z-20">

      {/* Header / Logo */}
      <div className="relative z-10 p-5 border-b border-white/15 flex items-center shrink-0">
        <Image
          src="/logo.webp"
          alt="AWANG Logo"
          width={130}
          height={38}
          className="object-contain h-9 w-auto brightness-0 invert"
          priority
        />
      </div>

      {/* Navigasi Utama */}
      <nav className="relative z-10 flex-1 min-h-0 py-4 pl-4 lg:pr-0 pr-4 space-y-1 overflow-y-auto overflow-x-hidden custom-scrollbar">
        {navItems.map(({ href, label, icon: Icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href)
          const badge =
            href === '/admin/quote-submissions'
              ? newQuoteCount
              : href === '/admin/contact-submissions'
                ? newContactCount
                : 0

          return (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className={`flex items-center justify-between gap-3 px-4 py-3 font-semibold text-sm transition-all duration-200 ${active
                ? 'bg-white !text-[#CC0000] rounded-l-2xl lg:-mr-3 pr-6 shadow-sm relative z-10'
                : 'text-white/80 hover:bg-white/10 hover:text-white rounded-xl'
                }`}
            >
              <span className="flex items-center gap-3">
                <Icon size={19} className={active ? '!text-[#CC0000]' : 'text-white/80'} />
                <span className={active ? '!text-[#CC0000]' : ''}>{label}</span>
              </span>
              {badge > 0 && (
                <span
                  className={`text-[10px] font-extrabold rounded-full min-w-[20px] h-[20px] flex items-center justify-center px-1.5 ${active ? 'bg-[#CC0000] text-white' : 'bg-white text-[#CC0000]'
                    }`}
                >
                  {badge}
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Footer Akun & Logout */}
      <div className="relative z-10 p-4 border-t border-white/15 space-y-2 shrink-0 mt-auto bg-[#CC0000]">
        <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-white/10">
          <UserCircle size={22} className="text-white/80 shrink-0" />
          <div className="min-w-0">
            <p className="text-xs font-bold text-white truncate">
              {userEmail || 'Memuat...'}
            </p>
            <p className="text-[10px] text-white/60">Akun aktif</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold text-white/80 hover:bg-white/15 hover:text-white transition-colors cursor-pointer"
        >
          <LogOut size={16} />
          Keluar
        </button>
      </div>
    </aside>
  )
}