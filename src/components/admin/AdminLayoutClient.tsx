'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
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
            className="fixed inset-0 bg-[#0A1628]/50 backdrop-blur-xs transition-opacity"
            onClick={() => setSidebarOpen(false)}
          />
          {/* Sidebar drawer content */}
          <div className="relative flex w-72 max-w-[85vw] flex-1 flex-col bg-[#CC0000] h-full shadow-2xl z-10">
            <div className="absolute top-3.5 right-3 z-20">
              <button
                type="button"
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors focus:outline-none cursor-pointer"
                onClick={() => setSidebarOpen(false)}
              >
                <span className="sr-only">Tutup menu</span>
                <X className="h-5 w-5 text-white" aria-hidden="true" />
              </button>
            </div>
            <div className="flex-1 h-full min-h-0 flex flex-col">
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
      <div className="flex-1 flex flex-col min-w-0 w-full bg-white">
        {/* Mobile Header with Active Account & Logout */}
        <header className="flex h-16 items-center justify-between border-b border-gray-100 bg-white/95 backdrop-blur-md px-3 sm:px-4 shadow-xs lg:hidden shrink-0 sticky top-0 z-30">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <button
              type="button"
              className="text-gray-600 hover:text-gray-900 focus:outline-none p-1.5 sm:p-2 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer shrink-0"
              onClick={() => setSidebarOpen(true)}
              aria-label="Buka menu navigasi"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="flex items-center shrink-0">
              <Image
                src="/logo.webp"
                alt="AWANG Logo"
                width={100}
                height={28}
                className="h-7 sm:h-8 w-auto object-contain"
                priority
              />
            </div>
          </div>

          {/* User Account & Logout for Mobile */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <div
              className="flex items-center gap-1.5 text-gray-700 bg-gray-50 border border-gray-100 px-2 sm:px-2.5 py-1.5 rounded-xl max-w-[120px] sm:max-w-[170px]"
              title={userEmail || 'Akun Admin'}
            >
              <UserCircle size={15} className="text-gray-400 shrink-0" />
              <span className="text-[11px] sm:text-xs font-semibold truncate text-[#0A1628]">
                {userEmail ? userEmail.split('@')[0] : 'Admin'}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1 text-[11px] sm:text-xs font-bold text-[#CC0000] bg-red-50 hover:bg-red-100 border border-red-100/60 px-2 sm:px-2.5 py-1.5 rounded-xl transition-all cursor-pointer active:scale-95"
              title="Keluar / Logout"
            >
              <LogOut size={13} />
              <span>Keluar</span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 md:p-8 lg:p-10 overflow-x-hidden w-full bg-white">{children}</main>
      </div>
    </div>
  )
}
