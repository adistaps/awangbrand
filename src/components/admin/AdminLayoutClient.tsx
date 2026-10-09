'use client'

import { useState } from 'react'
import { Sidebar } from './Sidebar'
import { Menu, X } from 'lucide-react'

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

  return (
    <div className="flex min-h-screen bg-[#F8F9FA] font-sans relative w-full">
      {/* Sidebar for Desktop */}
      <div className="hidden lg:flex lg:w-64 shrink-0">
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
      <div className="flex-1 flex flex-col min-w-0 w-full">
        {/* Mobile Header */}
        <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 shadow-xs lg:hidden shrink-0">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="text-gray-500 hover:text-gray-600 focus:outline-none p-1 rounded-lg hover:bg-gray-100 transition-colors"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </button>
            <span className="font-extrabold text-base tracking-tight text-[#0A1628]">Keywell Admin</span>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 md:p-10 overflow-x-hidden w-full">{children}</main>
      </div>
    </div>
  )
}
