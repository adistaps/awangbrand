'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Sidebar } from './Sidebar'
import { Menu, X, LogOut, UserCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export function AdminLayoutClient({
  children,
  newQuoteCount,
  newContactCount,
}: {
  children: React.ReactNode
  newQuoteCount: number
  newContactCount: number
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => {
      setUserEmail(data.user?.email ?? null)
    })
  }, [])

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <div className="flex min-h-screen bg-white font-sans relative w-full">
      {/* Sidebar for Desktop */}
      <div className="hidden lg:flex lg:w-64 shrink-0 sticky top-0 h-screen">
        <Sidebar newQuoteCount={newQuoteCount} newContactCount={newContactCount} />
      </div>

      {/* Sidebar Drawer for Mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-[#0A1628]/40 backdrop-blur-xs transition-opacity"
            onClick={() => setSidebarOpen(false)}
          />
          {/* Sidebar drawer content */}
          <div className="relative flex w-64 max-w-xs flex-1 flex-col bg-[#0A1628] h-full shadow-xl">
            <div className="absolute top-4 right-4 z-10">
              <button
                type="button"
                className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-white/10 transition-colors focus:outline-none"
                onClick={() => setSidebarOpen(false)}
              >
                <span className="sr-only">Close sidebar</span>
                <X className="h-6 w-6 text-white" aria-hidden="true" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <Sidebar
                newQuoteCount={newQuoteCount}
                newContactCount={newContactCount}
                onClose={() => setSidebarOpen(false)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 w-full bg-slate-50/50">
        {/* Mobile Header */}
        <header className="flex h-16 items-center justify-between border-b border-gray-100 bg-white/95 backdrop-blur-md px-4 shadow-xs lg:hidden shrink-0 sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="text-gray-600 hover:text-gray-900 focus:outline-none p-2 rounded-xl hover:bg-gray-100 transition-colors"
              onClick={() => setSidebarOpen(true)}
              aria-label="Buka menu navigasi"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="flex items-center">
              <Image
                src="/logo.webp"
                alt="AWANG Logo"
                width={120}
                height={32}
                className="h-8 w-auto object-contain"
                priority
              />
            </div>
          </div>
        </header>

        {/* Desktop Top Navbar Header */}
        <header className="hidden lg:flex h-16 items-center justify-between border-b border-gray-100 bg-white/95 backdrop-blur-md px-8 shadow-xs shrink-0 sticky top-0 z-30">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-gray-400">Portal Administrasi</span>
            <span className="text-gray-300">/</span>
            <span className="text-xs font-bold text-[#0A1628]">AWANG Brand Official</span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/"
              target="_blank"
              className="text-xs font-semibold text-gray-500 hover:text-[#C8102E] px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
            >
              Lihat Website ↗
            </Link>
            <div className="h-4 w-px bg-gray-200" />
            <div className="flex items-center gap-2.5">
              <UserCircle size={18} className="text-gray-400" />
              <span className="text-xs font-medium text-gray-600 max-w-[160px] truncate">
                {userEmail || '—'}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-[#C8102E] px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
            >
              <LogOut size={14} />
              Keluar
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 md:p-8 lg:p-10 overflow-x-hidden w-full">{children}</main>
      </div>
    </div>
  )
}
