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
  Star,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/homepage', label: 'Homepage CMS', icon: Sparkles },
  { href: '/admin/cashflow', label: 'Cashflow & Penjualan', icon: Wallet },
  { href: '/admin/products', label: 'Produk', icon: Package },
  { href: '/admin/recipes', label: 'Resep', icon: Tags },
  { href: '/admin/reviews', label: 'Ulasan Produk', icon: Star },
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
      <div className="relative z-10 p-4 border-b border-white/15 flex items-center shrink-0">
        <Image
          src="/logo.webp"
          alt="AWANG Logo"
          width={120}
          height={34}
          className="object-contain h-8 w-auto brightness-0 invert"
          priority
        />
      </div>

      {/* Navigasi Utama - Compact & Tanpa Scrollbar */}
      <nav className="relative z-10 flex-1 min-h-0 py-2.5 pl-3.5 lg:pr-0 pr-3.5 space-y-0.5 overflow-hidden [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
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
              className={`flex items-center justify-between gap-2.5 px-3.5 py-2 font-semibold text-[13px] transition-all duration-200 ${active
                ? 'bg-white !text-[#CC0000] rounded-l-2xl lg:-mr-3 pr-5 shadow-sm relative z-10'
                : 'text-white/80 hover:bg-white/10 hover:text-white rounded-xl'
                }`}
            >
              <span className="flex items-center gap-2.5">
                <Icon size={17} className={active ? '!text-[#CC0000]' : 'text-white/80'} />
                <span className={active ? '!text-[#CC0000]' : ''}>{label}</span>
              </span>
              {badge > 0 && (
                <span
                  className={`text-[9px] font-extrabold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 ${active ? 'bg-[#CC0000] text-white' : 'bg-white text-[#CC0000]'
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
      <div className="relative z-10 p-3.5 border-t border-white/15 space-y-1.5 shrink-0 mt-auto bg-[#CC0000]">
        <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-white/10">
          <UserCircle size={20} className="text-white/80 shrink-0" />
          <div className="min-w-0">
            <p className="text-[11px] font-bold text-white truncate">
              {userEmail || 'Memuat...'}
            </p>
            <p className="text-[9px] text-white/60">Akun aktif</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-white/80 hover:bg-white/15 hover:text-white transition-colors cursor-pointer"
        >
          <LogOut size={15} />
          Keluar
        </button>
      </div>
    </aside>
  )
}