'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'
import { ChevronRight, Search, X, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

const MENU_BG = 'bg-[#CC0000]'
const ACTIVE_TEXT = '!text-[#CC0000]'
const LIGHT_BG = 'bg-[#FFFFFF]'
const LIGHT_TEXT = 'text-[#540B26]'

interface SearchItem {
  id: string
  title: string
  subtitle: string
  kind: 'Product' | 'Recipe'
  slug: string
  image: string | null
  url: string
}

function GridDotsIcon({ isOpen, dark }: { isOpen: boolean; dark: boolean }) {
  if (isOpen) {
    return <X size={22} strokeWidth={2.5} className={dark ? 'text-[#540B26]' : 'text-white'} />
  }
  return (
    <div className="grid grid-cols-3 gap-[4px]">
      {Array.from({ length: 9 }).map((_, i) => (
        <span
          key={i}
          className={`w-[4px] h-[4px] rounded-full ${dark ? 'bg-[#540B26]' : 'bg-white'}`}
        />
      ))}
    </div>
  )
}

export function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [isTop, setIsTop] = useState(true)
  const [query, setQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const [searchResults, setSearchResults] = useState<SearchItem[]>([])
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false)

  const desktopSearchRef = useRef<HTMLDivElement>(null)
  const mobileInputRef = useRef<HTMLInputElement>(null)

  const nav = [
    ['Who We Are', '/about-us'],
    ['Products', '/products'],
    ['Recipes', '/recipes'],
    ['Contact Us', '/contact'],
  ]

  const isActivePath = (url: string) =>
    pathname === url || (url !== '/' && !!pathname?.startsWith(url))

  // Scroll down = sembunyi, scroll up = muncul (krem)
  useEffect(() => {
    let lastScrollY = window.scrollY

    const handleScroll = () => {
      const currentScrollY = window.scrollY

      setIsTop(currentScrollY <= 10)

      if (currentScrollY <= 10) {
        setIsVisible(true)
      } else if (currentScrollY > lastScrollY && currentScrollY > 60) {
        setIsVisible(false)
        setShowDropdown(false)
      } else if (currentScrollY < lastScrollY) {
        setIsVisible(true)
      }

      lastScrollY = currentScrollY
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
    setShowDropdown(false)
    setIsMobileSearchOpen(false)
  }, [pathname])

  useEffect(() => {
    document.body.style.overflow = menuOpen || isMobileSearchOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen, isMobileSearchOpen])

  // Focus mobile input saat pop-up search mobile dibuka
  useEffect(() => {
    if (isMobileSearchOpen) {
      setTimeout(() => mobileInputRef.current?.focus(), 150)
    }
  }, [isMobileSearchOpen])

  // Click outside listener untuk menutup dropdown search desktop
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        desktopSearchRef.current &&
        !desktopSearchRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Live search debounced query ke Supabase (Produk & Resep digabung flat)
  useEffect(() => {
    const trimmed = query.trim()
    if (!trimmed) {
      setSearchResults([])
      setIsSearching(false)
      return
    }

    setIsSearching(true)
    const timeout = setTimeout(async () => {
      try {
        const supabase = createClient()
        const [prodRes, recipeRes] = await Promise.all([
          supabase
            .from('products')
            .select('id, name, slug, main_image')
            .eq('status', 'published')
            .ilike('name', `%${trimmed}%`)
            .limit(6),
          supabase
            .from('recipes')
            .select('id, title, slug, main_image')
            .eq('status', 'published')
            .ilike('title', `%${trimmed}%`)
            .limit(6),
        ])

        const products: SearchItem[] = (prodRes.data || []).map((p: any) => ({
          id: `p-${p.id}`,
          title: p.name,
          subtitle: 'Awang   Product',
          kind: 'Product',
          slug: p.slug,
          image: p.main_image || '/placeholder-product.jpg',
          url: `/products/${p.slug}`,
        }))

        const recipes: SearchItem[] = (recipeRes.data || []).map((r: any) => ({
          id: `r-${r.id}`,
          title: r.title,
          subtitle: 'Awang   Recipe',
          kind: 'Recipe',
          slug: r.slug,
          image: r.main_image || '/placeholder-recipe.jpg',
          url: `/recipes/${r.slug}`,
        }))

        // Gabungkan produk & resep
        setSearchResults([...products, ...recipes])
      } catch (err) {
        console.error('Search error:', err)
      } finally {
        setIsSearching(false)
      }
    }, 250)

    return () => clearTimeout(timeout)
  }, [query])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const q = query.trim()
    if (!q) return

    if (searchResults.length > 0) {
      router.push(searchResults[0].url)
    } else {
      router.push(`/products?search=${encodeURIComponent(q)}`)
    }
    setShowDropdown(false)
    setIsMobileSearchOpen(false)
    setMenuOpen(false)
  }

  const handleSelectResult = (url: string) => {
    router.push(url)
    setShowDropdown(false)
    setIsMobileSearchOpen(false)
    setMenuOpen(false)
    setQuery('')
  }

  if (pathname?.startsWith('/admin')) return null

  const circleBtn = isTop
    ? 'bg-black/10 hover:bg-black/20'
    : 'bg-[#540B26]/10 hover:bg-[#540B26]/20'

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out ${isVisible ? 'translate-y-0' : '-translate-y-full'
          } ${isTop ? 'bg-[#CC0000] text-white' : `${LIGHT_BG} ${LIGHT_TEXT} shadow-md`}`}
      >
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12 h-[72px] sm:h-[88px] grid grid-cols-[auto_1fr_auto] items-center gap-4">
          {/* Kiri: tombol grid + logo */}
          <div className="flex items-center gap-3 sm:gap-5">
            <button
              type="button"
              className={`w-11 h-11 sm:w-14 sm:h-14 rounded-full flex items-center justify-center transition-all active:scale-90 focus:outline-none ${circleBtn}`}
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? 'Tutup menu' : 'Buka menu'}
              aria-expanded={menuOpen}
            >
              <GridDotsIcon isOpen={menuOpen} dark={!isTop} />
            </button>

            <Link
              href="/"
              className="flex items-center transition-transform hover:scale-105"
              onClick={() => setMenuOpen(false)}
            >
              <img
                src="/logo.webp"
                alt="AWANG"
                className={`h-9 sm:h-12 w-auto object-contain transition-all duration-300 ${isTop ? 'brightness-0 invert' : ''
                  }`}
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
                  className="relative py-2 text-sm xl:text-base font-extrabold tracking-wide transition-opacity duration-200 hover:opacity-70 whitespace-nowrap"
                >
                  {name}
                  {isActive && (
                    <span
                      className={`absolute left-1/2 -bottom-1 -translate-x-1/2 w-1 h-1 rounded-full ${isTop ? 'bg-white' : 'bg-[#540B26]'
                        }`}
                    />
                  )}
                </Link>
              )
            })}
          </nav>

          {/* Kanan: search produk & resep */}
          <div className="flex items-center justify-end col-start-3 relative">
            {/* Desktop: kolom search live search */}
            <div ref={desktopSearchRef} className="hidden lg:block relative">
              <form
                onSubmit={handleSearchSubmit}
                className={`flex items-center w-[270px] xl:w-[320px] h-12 pl-5 pr-4 rounded-full transition-colors ${isTop
                  ? 'bg-black/15 focus-within:bg-black/25 text-white'
                  : 'bg-[#540B26]/10 focus-within:bg-[#540B26]/15 text-[#540B26]'
                  }`}
                role="search"
              >
                <input
                  type="text"
                  value={query}
                  onFocus={() => setShowDropdown(true)}
                  onChange={(e) => {
                    setQuery(e.target.value)
                    setShowDropdown(true)
                  }}
                  placeholder="Search..."
                  aria-label="Cari produk atau resep"
                  className={`flex-1 min-w-0 bg-transparent text-sm font-bold outline-none ${isTop
                    ? 'text-white placeholder:text-white/70'
                    : 'text-[#540B26] placeholder:text-[#540B26]/60'
                    }`}
                />
                {isSearching ? (
                  <Loader2 size={18} className="animate-spin opacity-80 shrink-0 ml-1" />
                ) : query ? (
                  <button
                    type="button"
                    onClick={() => {
                      setQuery('')
                      setShowDropdown(false)
                    }}
                    className="p-1 hover:opacity-80 shrink-0"
                    aria-label="Hapus pencarian"
                  >
                    <X size={16} />
                  </button>
                ) : (
                  <Search size={18} strokeWidth={2.4} className="shrink-0 opacity-80" />
                )}
              </form>

              {/* Dropdown Hasil Pencarian Persis Gaya Heinz (Gambar Referensi) */}
              {showDropdown && query.trim().length > 0 && (
                <div className="absolute top-full right-0 mt-3 w-[460px] xl:w-[500px] bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150 text-stone-900">
                  <div className="p-4 sm:p-5">
                    <h3 className="text-sm font-bold text-stone-900 mb-3 tracking-tight">
                      Top Suggestions
                    </h3>

                    <div className="max-h-[380px] overflow-y-auto pr-1 space-y-2.5 scrollbar-thin">
                      {searchResults.map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => handleSelectResult(item.url)}
                          className="w-full flex items-center gap-3.5 p-1 rounded-xl hover:bg-stone-50 transition-colors text-left group cursor-pointer"
                        >
                          {/* Kotak Gambar Abu-abu Terang Sudut Membulat Halus */}
                          <div className="w-14 h-14 rounded-lg bg-[#EFEFEF] flex items-center justify-center shrink-0 overflow-hidden p-1">
                            <img
                              src={item.image || '/placeholder-product.jpg'}
                              alt={item.title}
                              className={`w-full h-full object-contain ${item.kind === 'Recipe' ? 'object-cover rounded-md' : ''
                                }`}
                            />
                          </div>

                          {/* Teks Judul & Subtitle "Awang Product" / "Awang Recipe" */}
                          <div className="min-w-0 flex-1">
                            <h4 className="text-sm font-bold text-stone-900 leading-snug truncate">
                              {item.title}
                            </h4>
                            <p className="text-xs text-stone-800 font-semibold mt-1">
                              <span>Awang</span>
                              <span className="ml-4 font-normal text-stone-700">{item.kind}</span>
                            </p>
                          </div>
                        </button>
                      ))}

                      {/* Not Found */}
                      {!isSearching && searchResults.length === 0 && (
                        <div className="py-8 text-center text-stone-500">
                          <p className="text-sm font-medium">
                            No suggestions found for &ldquo;{query}&rdquo;
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile/tablet: tombol buka modal search */}
            <button
              type="button"
              onClick={() => setIsMobileSearchOpen(true)}
              aria-label="Cari produk atau resep"
              className={`lg:hidden w-11 h-11 sm:w-14 sm:h-14 rounded-full flex items-center justify-center transition-all active:scale-90 ${circleBtn}`}
            >
              <Search size={22} strokeWidth={2.2} />
            </button>
          </div>
        </div>
      </header>

      {/* MODAL SEARCH MOBILE PERSIS GAYA HEINZ */}
      {isMobileSearchOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden flex flex-col justify-start animate-in fade-in duration-200">
          <div className="w-full bg-white p-4 sm:p-6 shadow-2xl rounded-b-3xl">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <span className="font-bold text-sm text-stone-900">
                Top Suggestions
              </span>
              <button
                type="button"
                onClick={() => setIsMobileSearchOpen(false)}
                className="p-1.5 rounded-full hover:bg-stone-100 text-stone-700 transition-colors"
                aria-label="Tutup pencarian"
              >
                <X size={22} />
              </button>
            </div>

            <form onSubmit={handleSearchSubmit} className="mt-4 relative flex items-center">
              <input
                ref={mobileInputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search..."
                className="w-full h-12 pl-11 pr-10 rounded-full bg-stone-100 border border-stone-200 text-stone-900 font-bold text-sm outline-none focus:border-[#CC0000] focus:bg-white"
              />
              <Search size={18} className="absolute left-4 text-stone-400 pointer-events-none" />
              {isSearching ? (
                <Loader2 size={18} className="absolute right-4 animate-spin text-stone-500" />
              ) : query ? (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="absolute right-4 text-stone-400 hover:text-stone-600"
                >
                  <X size={18} />
                </button>
              ) : null}
            </form>

            {/* List Suggestions Mobile */}
            <div className="mt-4 max-h-[60vh] overflow-y-auto space-y-2.5">
              {searchResults.map((item) => (
                <button
                  key={`m-${item.id}`}
                  type="button"
                  onClick={() => handleSelectResult(item.url)}
                  className="w-full flex items-center gap-3.5 p-1 rounded-xl hover:bg-stone-50 transition-colors text-left"
                >
                  <div className="w-14 h-14 rounded-lg bg-[#EFEFEF] flex items-center justify-center shrink-0 overflow-hidden p-1">
                    <img
                      src={item.image || '/placeholder-product.jpg'}
                      alt={item.title}
                      className={`w-full h-full object-contain ${item.kind === 'Recipe' ? 'object-cover rounded-md' : ''
                        }`}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-sm font-bold text-stone-900 leading-snug truncate">
                      {item.title}
                    </h4>
                    <p className="text-xs text-stone-800 font-semibold mt-1">
                      <span>Awang</span>
                      <span className="ml-4 font-normal text-stone-700">{item.kind}</span>
                    </p>
                  </div>
                </button>
              ))}

              {!isSearching && query.trim().length > 0 && searchResults.length === 0 && (
                <div className="py-8 text-center text-stone-500">
                  <p className="text-sm font-medium">No suggestions found for &ldquo;{query}&rdquo;</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Menu slide-in dari kiri (dibuka lewat tombol grid) */}
      <div
        className={`fixed inset-0 z-50 transition-opacity duration-300 ${menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
      >
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          onClick={() => setMenuOpen(false)}
        />

        <nav
          className={`fixed top-0 left-0 bottom-0 w-4/5 max-w-xs ${MENU_BG} text-white p-6 flex flex-col justify-between transform transition-transform duration-300 ease-in-out shadow-2xl ${menuOpen ? 'translate-x-0' : '-translate-x-full'
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

            {/* Quick search shortcut di dalam menu */}
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false)
                setIsMobileSearchOpen(true)
              }}
              className="mt-6 w-full flex items-center justify-between h-12 px-5 rounded-full bg-black/15 text-white/80 hover:text-white hover:bg-black/25 transition-all text-sm font-bold"
            >
              <span className="flex items-center gap-2">
                <Search size={18} />
                Search...
              </span>
              <ChevronRight size={16} />
            </button>

            <ul className="mt-5 space-y-2">
              {nav.map(([name, url]) => {
                const isActive = isActivePath(url)
                return (
                  <li key={name}>
                    <Link
                      href={url}
                      className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all ${isActive
                        ? `bg-white ${ACTIVE_TEXT} font-black shadow-md`
                        : 'hover:bg-white/10 text-white/90 font-bold'
                        }`}
                      onClick={() => setMenuOpen(false)}
                    >
                      <span
                        className={`text-base tracking-wide ${isActive ? ACTIVE_TEXT : 'text-white'}`}
                      >
                        {name}
                      </span>
                      <ChevronRight
                        size={18}
                        strokeWidth={isActive ? 3.5 : 2.5}
                        className={isActive ? ACTIVE_TEXT : 'text-white/50'}
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
