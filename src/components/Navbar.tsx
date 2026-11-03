'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { ChevronRight, X } from 'lucide-react'

function GridDotsIcon({ isOpen }: { isOpen: boolean }) {
  if (isOpen) {
    return <X size={22} strokeWidth={2.5} className="text-white" />
  }
  return (
    <div className="grid grid-cols-3 gap-[4px]">
      {Array.from({ length: 9 }).map((_, i) => (
        <span key={i} className="w-[4px] h-[4px] rounded-full bg-white" />
      ))}
    </div>
  )
}

export function Navbar() {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)
  const [isTop, setIsTop] = useState(true)
  const [isVisible, setIsVisible] = useState(true)

  const isHomePage = pathname === '/'

  const nav = [
    ['Who We Are', '/about-us'],
    ['Products', '/products'],
    ['Recipes', '/recipes'],
    ['Contact Us', '/contact']
  ]

  const isActivePath = (url: string) =>
    pathname === url || (url !== '/' && !!pathname?.startsWith(url))

  useEffect(() => {
    let lastScrollY = window.scrollY

    const handleScroll = () => {
      const currentScrollY = window.scrollY

      if (currentScrollY <= 10) {
        setIsTop(true)
        setIsVisible(true)
      } else {
        setIsTop(false)
        if (currentScrollY > lastScrollY && currentScrollY > 60) {
          setIsVisible(false)
        } else if (currentScrollY < lastScrollY) {
          setIsVisible(true)
        }
      }

      lastScrollY = currentScrollY
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  if (pathname?.startsWith('/admin')) return null

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 text-white transition-all duration-300 ease-in-out ${isVisible ? 'translate-y-0' : '-translate-y-full'
          } ${isHomePage && isTop ? 'bg-transparent' : 'bg-[#CC0000]'}`}
      >
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 h-[72px] sm:h-[88px] grid grid-cols-[auto_1fr_auto] items-center gap-4">

          {/* Kiri: logo */}
          <div className="flex items-center">
            <Link
              href="/"
              className="flex items-center transition-transform hover:scale-105"
              onClick={() => setMenuOpen(false)}
            >
              <img
                src="/logo.webp"
                alt="AWANG"
                className={`h-9 sm:h-12 w-auto object-contain transition-all duration-300 ${isHomePage && isTop ? '' : 'brightness-0 invert'
                  }`}
                style={
                  isHomePage && isTop
                    ? { filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.85)) drop-shadow(0 0 16px rgba(255,255,255,0.5))' }
                    : undefined
                }
              />
            </Link>
          </div>

          {/* Tengah: navigasi */}
          <nav
            className="hidden lg:flex items-center justify-center space-x-8 xl:space-x-10"
            aria-label="Main navigation"
          >
            {nav.map(([name, url]) => {
              const isActive = isActivePath(url)
              return (
                <Link
                  key={name}
                  href={url}
                  className="relative py-2 text-sm xl:text-base font-extrabold tracking-wide transition-colors duration-200 hover:text-gray-200 whitespace-nowrap"
                >
                  {name}
                  {isActive && (
                    <span className="absolute left-1/2 -bottom-1 -translate-x-1/2 w-1 h-1 rounded-full bg-white" />
                  )}
                </Link>
              )
            })}
          </nav>

          {/* Kanan: tombol grid */}
          <div className="flex items-center justify-end col-start-3">
            <button
              type="button"
              className="w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-black/15 hover:bg-black/25 flex items-center justify-center transition-all active:scale-90 focus:outline-none"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? 'Tutup menu' : 'Buka menu'}
              aria-expanded={menuOpen}
            >
              <GridDotsIcon isOpen={menuOpen} />
            </button>
          </div>
        </div>
      </header>

      {/* Menu slide-in (dibuka lewat tombol grid, muncul dari kanan) */}
      <div
        className={`fixed inset-0 z-50 transition-opacity duration-300 ${menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
      >
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          onClick={() => setMenuOpen(false)}
        />

        <nav
          className={`fixed top-0 right-0 bottom-0 w-4/5 max-w-xs bg-[#CC0000] text-white p-6 flex flex-col justify-between transform transition-transform duration-300 ease-in-out shadow-2xl ${menuOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
          aria-label="Mobile navigation"
        >
          <div>
            <div className="flex items-center justify-between pb-5 border-b border-white/20">
              <span className="font-black text-xl tracking-wider uppercase">MENU</span>
              <button
                type="button"
                className="p-2 text-white/80 hover:text-white rounded-full transition-colors"
                onClick={() => setMenuOpen(false)}
                aria-label="Tutup menu"
              >
                <X size={24} strokeWidth={2.5} />
              </button>
            </div>

            <ul className="mt-6 space-y-2">
              {nav.map(([name, url]) => {
                const isActive = isActivePath(url)
                return (
                  <li key={name}>
                    <Link
                      href={url}
                      className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all ${isActive
                        ? 'bg-white !text-[#CC0000] font-black shadow-md'
                        : 'hover:bg-white/10 text-white/90 font-bold'
                        }`}
                      onClick={() => setMenuOpen(false)}
                    >
                      <span className={`text-base tracking-wide ${isActive ? '!text-[#CC0000]' : 'text-white'}`}>
                        {name}
                      </span>
                      <ChevronRight
                        size={18}
                        strokeWidth={isActive ? 3.5 : 2.5}
                        className={isActive ? '!text-[#CC0000]' : 'text-white/50'}
                      />
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>

          <div className="pt-6 border-t border-white/20">
            <div className="text-center text-xs text-white/80 space-y-0.5 font-medium">
              <p className="font-bold text-white">AWANG Brand Malaysia</p>
              <p>support@awangbrand.com</p>
            </div>
          </div>
        </nav>
      </div>
    </>
  )
}
