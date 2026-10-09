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
  Settings,
  LogOut,
  UserCircle,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/products', label: 'Produk', icon: Package },
  { href: '/admin/recipes', label: 'Resep', icon: Tags },
  { href: '/admin/categories', label: 'Kategori', icon: Tags },
  { href: '/admin/testimonials', label: 'Testimoni', icon: MessageSquareQuote },
  { href: '/admin/brands', label: 'Brand', icon: Building2 },
  { href: '/admin/quote-submissions', label: 'Quote Masuk', icon: Inbox },
  { href: '/admin/contact-submissions', label: 'Pesan Kontak', icon: Mail },
  { href: '/admin/settings', label: 'Pengaturan', icon: Settings },
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
    <aside className="relative w-full lg:w-64 shrink-0 bg-[#0A1628] text-white min-h-full lg:min-h-screen flex flex-col overflow-hidden">
      {/* Vertical "KEYWELL" watermark accent */}
      <span
        aria-hidden="true"
        className="pointer-events-none select-none absolute right-2 top-1/2 -translate-y-1/2 rotate-180 text-white/[0.06] font-thin tracking-[0.5em] text-[64px] leading-none"
        style={{ writingMode: 'vertical-rl' }}
      >
        KEYWELL
      </span>

      <div className="relative z-10 p-6 border-b border-white/10 flex items-center">
        <Image
          src="/logokey.webp"
          alt="Keywell Logo"
          width={140}
          height={40}
          className="object-contain h-10 w-auto"
        />
      </div>

      <nav className="relative z-10 flex-1 py-4 px-3 space-y-1">
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
              className={`flex items-center justify-between gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${active ? 'bg-[#F5A200] text-white' : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`}
            >
              <span className="flex items-center gap-3">
                <Icon size={18} />
                {label}
              </span>
              {badge > 0 && (
                <span className="bg-red-500 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                  {badge}
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      <div className="relative z-10 p-3 border-t border-white/10 space-y-2">
        <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-white/5">
          <UserCircle size={22} className="text-white/60 shrink-0" />
          <div className="min-w-0">
            <p className="text-xs font-semibold text-white truncate">
              {userEmail || 'Memuat...'}
            </p>
            <p className="text-[10px] text-white/40">Akun aktif</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-white/70 hover:bg-white/10 hover:text-white transition-colors"
        >
          <LogOut size={18} />
          Keluar
        </button>
      </div>
    </aside>
  )
}