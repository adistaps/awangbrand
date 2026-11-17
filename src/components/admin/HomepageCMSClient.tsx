'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { revalidatePublicSite } from '@/app/admin/revalidate-actions'
import { CARD_THEMES } from '@/components/Homepage/ProductCarouselSection'
import { FEATURED_CARD_THEMES } from '@/components/ui/FeaturedItemCard'
import {
  Flame,
  ChefHat,
  Video,
  Save,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Sparkles,
  ExternalLink,
  Check,
  Star,
  Film,
  Move,
  LayoutGrid,
} from 'lucide-react'

interface ItemCMS {
  id: string
  name: string
  type: 'product' | 'recipe'
  main_image: string | null
  is_featured: boolean
  featured_badge?: 'trending' | 'favorite' | null
  featured_sort?: number
  slug: string
  category?: string
}

interface RecipeHomeCMS {
  id: string
  title: string
  slug: string
  main_image: string | null
  is_featured: boolean
  home_carousel_sort?: number
  category?: string
}

interface TikTokVideoCMS {
  id: string
  url: string
  title: string
}

interface HomepageCMSProps {
  products: any[]
  recipes: any[]
  siteSettings: Record<string, string>
  productHierarchy?: any[]
}

export function HomepageCMSClient({
  products: initialProducts,
  recipes: initialRecipes,
  siteSettings: initialSettings,
  productHierarchy = [],
}: HomepageCMSProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'taste_heat' | 'cook_good' | 'carousel' | 'tiktok'>('taste_heat')
  const [saving, setSaving] = useState(false)
  const [savedSuccess, setSavedSuccess] = useState(false)

  // 1. STATE: TASTE THE HEAT
  const [tasteHeatTitle, setTasteHeatTitle] = useState(
    initialSettings.homepage_taste_the_heat_title || 'TASTE THE HEAT'
  )

  // Gabungkan produk & resep untuk pool Taste The Heat
  const initialTasteHeatItems: ItemCMS[] = [
    ...initialProducts.map((p) => ({
      id: p.id,
      name: p.name,
      type: 'product' as const,
      main_image: p.main_image,
      is_featured: Boolean(p.is_featured),
      featured_badge: p.featured_badge || null,
      featured_sort: p.featured_sort ?? 99,
      slug: p.slug,
      category: p.category?.name || 'Produk',
    })),
    ...initialRecipes.map((r) => ({
      id: r.id,
      name: r.title,
      type: 'recipe' as const,
      main_image: r.main_image,
      is_featured: Boolean(r.is_featured),
      featured_badge: r.featured_badge || null,
      featured_sort: r.featured_sort ?? 99,
      slug: r.slug,
      category: r.category || 'Resep',
    })),
  ]

  const [allItems, setAllItems] = useState<ItemCMS[]>(initialTasteHeatItems)

  // Warna per kartu featured Taste The Heat (itemId -> themeKey)
  let initialFeaturedColors: Record<string, string> = {}
  try {
    if (initialSettings.homepage_featured_card_colors) {
      initialFeaturedColors = JSON.parse(initialSettings.homepage_featured_card_colors)
    }
  } catch (e) { /* ignore */ }
  const [featuredCardColors, setFeaturedCardColors] = useState<Record<string, string>>(initialFeaturedColors)

  function setFeaturedColor(itemId: string, themeKey: string) {
    setFeaturedCardColors((prev) => ({ ...prev, [itemId]: themeKey }))
  }

  function clearFeaturedColor(itemId: string) {
    setFeaturedCardColors((prev) => {
      const next = { ...prev }
      delete next[itemId]
      return next
    })
  }

  // 2. STATE: COOK SOMETHING GOOD
  const [cookGoodTitle, setCookGoodTitle] = useState(
    initialSettings.homepage_cook_good_title || 'COOK SOMETHING GOOD'
  )
  const [cookGoodSubtitle, setCookGoodSubtitle] = useState(
    initialSettings.homepage_cook_good_subtitle ||
    'Resep pilihan istimewa yang mudah dibuat di rumah dengan produk AWANG.'
  )
  const [recipePool, setRecipePool] = useState<RecipeHomeCMS[]>(
    initialRecipes.map((r) => ({
      id: r.id,
      title: r.title,
      slug: r.slug,
      main_image: r.main_image,
      is_featured: Boolean(r.is_featured),
      home_carousel_sort: r.home_carousel_sort ?? 99,
      category: r.category,
    }))
  )

  // 3. STATE: TIKTOK VIDEOS
  const [tiktokTitle, setTiktokTitle] = useState(
    initialSettings.homepage_tiktok_title || 'IKUTI KAMI DI TIKTOK'
  )
  const [tiktokSubtitle, setTiktokSubtitle] = useState(
    initialSettings.homepage_tiktok_subtitle ||
    '@awangbrand_official — Inspirasi resep lezat, kreasi masakan & keseruan dapur AWANG'
  )
  const [tiktokAccountUrl, setTiktokAccountUrl] = useState(
    initialSettings.homepage_tiktok_account_url || 'https://www.tiktok.com/@awangbrand_official'
  )

  let parsedVideos: TikTokVideoCMS[] = []
  try {
    if (initialSettings.homepage_tiktok_videos) {
      parsedVideos = JSON.parse(initialSettings.homepage_tiktok_videos)
    }
  } catch {
    parsedVideos = []
  }

  const [tiktokVideos, setTiktokVideos] = useState<TikTokVideoCMS[]>(
    parsedVideos.length > 0
      ? parsedVideos
      : [
        {
          id: '7611107188828065044',
          url: 'https://www.tiktok.com/@awangbrand_official/video/7611107188828065044',
          title: 'AWANG Brand Official Video 1',
        },
        {
          id: '7204052765557918982',
          url: 'https://www.tiktok.com/@awangbrand_official/video/7204052765557918982',
          title: 'AWANG Brand Official Video 2',
        },
        {
          id: '7696464259382824244',
          url: 'https://www.tiktok.com/@awangbrand_official/video/7696464259382824244',
          title: 'AWANG Brand Official Video 3',
        },
      ]
  )

  // 4. STATE: PRODUCT CAROUSEL ("TEMUKAN PILIHANMU")
  const [carouselTitle, setCarouselTitle] = useState(
    initialSettings.homepage_product_carousel_title || 'TEMUKAN PILIHANMU'
  )

  // Ekstrak semua subkategori dari productHierarchy
  const availableSubcategories: { id: string; name: string; groupName: string; image_url: string | null }[] = []
  productHierarchy.forEach((group: any) => {
    if (Array.isArray(group.subcategories)) {
      group.subcategories.forEach((sub: any) => {
        availableSubcategories.push({
          id: sub.id,
          name: sub.name,
          groupName: group.name,
          image_url: sub.image_url || null,
        })
      })
    }
  })

  // Parse ID subkategori yang sudah dipilih sebelumnya
  let initialSelectedSubs: string[] = []
  try {
    if (initialSettings.homepage_product_carousel_subcategories) {
      initialSelectedSubs = JSON.parse(initialSettings.homepage_product_carousel_subcategories)
    }
  } catch (e) {
    initialSelectedSubs = []
  }

  // Jika belum diset sama sekali, default ke semua subkategori yang ada
  const [selectedCarouselSubs, setSelectedCarouselSubs] = useState<string[]>(
    initialSelectedSubs.length > 0 ? initialSelectedSubs : availableSubcategories.map((s) => s.id)
  )

  // Warna per kartu carousel (subId -> themeKey)
  let initialCardColors: Record<string, string> = {}
  try {
    if (initialSettings.homepage_product_carousel_card_colors) {
      initialCardColors = JSON.parse(initialSettings.homepage_product_carousel_card_colors)
    }
  } catch (e) { /* ignore */ }
  const [carouselCardColors, setCarouselCardColors] = useState<Record<string, string>>(initialCardColors)

  function setCardColor(subId: string, themeKey: string) {
    setCarouselCardColors((prev) => ({ ...prev, [subId]: themeKey }))
  }

  function toggleCarouselSub(id: string) {
    setSelectedCarouselSubs((prev) => {
      if (prev.includes(id)) {
        return prev.filter((x) => x !== id)
      } else {
        return [...prev, id]
      }
    })
  }

  function moveCarouselSub(id: string, direction: 'up' | 'down') {
    setSelectedCarouselSubs((prev) => {
      const idx = prev.indexOf(id)
      if (idx === -1) return prev
      if (direction === 'up' && idx === 0) return prev
      if (direction === 'down' && idx === prev.length - 1) return prev

      const copy = [...prev]
      const swapIdx = direction === 'up' ? idx - 1 : idx + 1
      const temp = copy[idx]
      copy[idx] = copy[swapIdx]
      copy[swapIdx] = temp
      return copy
    })
  }

  // Helper filter Taste The Heat yang aktif
  const featuredTasteHeat = allItems
    .filter((it) => it.is_featured)
    .sort((a, b) => (a.featured_sort ?? 99) - (b.featured_sort ?? 99))

  // Toggle Featured Taste The Heat
  function toggleTasteHeatFeatured(id: string) {
    setAllItems((prev) => {
      const target = prev.find((x) => x.id === id)
      if (!target) return prev
      const newStatus = !target.is_featured
      const currentActive = prev.filter((x) => x.is_featured)
      if (newStatus && currentActive.length >= 4) {
        alert(
          'Maksimal 4 kartu terpilih untuk section "TASTE THE HEAT". Nonaktifkan salah satu kartu yang sedang aktif terlebih dahulu!'
        )
        return prev
      }
      return prev.map((x) =>
        x.id === id
          ? {
            ...x,
            is_featured: newStatus,
            featured_sort: newStatus ? currentActive.length + 1 : 99,
          }
          : x
      )
    })
  }

  // Set Badge: 'trending' | 'favorite' | null
  function setTasteHeatBadge(id: string, badge: 'trending' | 'favorite' | null) {
    setAllItems((prev) =>
      prev.map((x) => (x.id === id ? { ...x, featured_badge: badge } : x))
    )
  }

  // Geser urutan tata letak kartu (Up / Down)
  function moveTasteHeatOrder(id: string, direction: 'up' | 'down') {
    const list = [...featuredTasteHeat]
    const idx = list.findIndex((x) => x.id === id)
    if (idx === -1) return
    if (direction === 'up' && idx === 0) return
    if (direction === 'down' && idx === list.length - 1) return

    const swapIdx = direction === 'up' ? idx - 1 : idx + 1
    const temp = list[idx]
    list[idx] = list[swapIdx]
    list[swapIdx] = temp

    // Re-assign sort
    const idOrderMap = new Map<string, number>()
    list.forEach((item, index) => {
      idOrderMap.set(item.id, index + 1)
    })

    setAllItems((prev) =>
      prev.map((x) => {
        if (idOrderMap.has(x.id)) {
          return { ...x, featured_sort: idOrderMap.get(x.id) }
        }
        return x
      })
    )
  }

  // Helper fungsi TikTok
  function handleAddTikTok() {
    setTiktokVideos((prev) => [
      ...prev,
      {
        id: '',
        url: '',
        title: `AWANG Video ${prev.length + 1}`,
      },
    ])
  }

  function handleUpdateTikTok(index: number, field: keyof TikTokVideoCMS, value: string) {
    setTiktokVideos((prev) => {
      const updated = [...prev]
      updated[index] = { ...updated[index], [field]: value }
      // Otomatis ekstrak id dari url jika user paste url
      if (field === 'url') {
        const match = value.match(/\/video\/(\d+)/)
        if (match && match[1]) {
          updated[index].id = match[1]
        }
      }
      return updated
    })
  }

  function handleDeleteTikTok(index: number) {
    setTiktokVideos((prev) => prev.filter((_, i) => i !== index))
  }

  // SIMPAN SEMUA PERUBAHAN KE SUPABASE
  async function handleSaveAll() {
    setSaving(true)
    setSavedSuccess(false)
    const supabase = createClient()

    try {
      // Re-assign featured_sort yang benar (1, 2, 3, 4) berdasarkan urutan saat ini
      // Ambil daftar item yang aktif dan urutkan berdasarkan featured_sort yang ada
      const orderedActive = [...allItems]
        .filter((x) => x.is_featured)
        .sort((a, b) => (a.featured_sort ?? 99) - (b.featured_sort ?? 99))

      // Buat map id -> sort yang benar (1-based)
      const sortMap = new Map<string, number>()
      orderedActive.forEach((item, idx) => {
        sortMap.set(item.id, idx + 1)
      })

      // Terapkan sort yang benar ke allItems
      const itemsWithCorrectSort = allItems.map((x) => ({
        ...x,
        featured_sort: x.is_featured ? (sortMap.get(x.id) ?? 99) : 99,
      }))

      // 1. Simpan Taste The Heat updates ke tabel products
      const productPromises = itemsWithCorrectSort
        .filter((x) => x.type === 'product')
        .map((p) =>
          supabase
            .from('products')
            .update({
              is_featured: p.is_featured,
              featured_badge: p.is_featured ? (p.featured_badge ?? null) : null,
              featured_sort: p.featured_sort,
            })
            .eq('id', p.id)
        )

      // 2. Simpan Taste The Heat updates ke tabel recipes
      const recipePromises = itemsWithCorrectSort
        .filter((x) => x.type === 'recipe')
        .map((r) =>
          supabase
            .from('recipes')
            .update({
              is_featured: r.is_featured,
              featured_badge: r.is_featured ? (r.featured_badge ?? null) : null,
              featured_sort: r.featured_sort,
            })
            .eq('id', r.id)
        )

      // 3. Simpan setting Cook Something Good, Carousel Subkategori & TikTok ke site_settings
      const settingsPayload = [
        { key: 'homepage_taste_the_heat_title', value: tasteHeatTitle },
        { key: 'homepage_featured_card_colors', value: JSON.stringify(featuredCardColors) },
        { key: 'homepage_cook_good_title', value: cookGoodTitle },
        { key: 'homepage_cook_good_subtitle', value: cookGoodSubtitle },
        { key: 'homepage_product_carousel_title', value: carouselTitle },
        { key: 'homepage_product_carousel_subcategories', value: JSON.stringify(selectedCarouselSubs) },
        { key: 'homepage_product_carousel_card_colors', value: JSON.stringify(carouselCardColors) },
        { key: 'homepage_tiktok_title', value: tiktokTitle },
        { key: 'homepage_tiktok_subtitle', value: tiktokSubtitle },
        { key: 'homepage_tiktok_account_url', value: tiktokAccountUrl },
        { key: 'homepage_tiktok_videos', value: JSON.stringify(tiktokVideos) },
      ]

      const settingsPromises = settingsPayload.map((s) =>
        supabase.from('site_settings').upsert(s, { onConflict: 'key' })
      )

      const results = await Promise.all([
        ...productPromises,
        ...recipePromises,
        ...settingsPromises,
      ])

      const failed = results.find((r) => r.error)
      if (failed?.error) {
        throw new Error(failed.error.message)
      }

      // Update local state dengan sort yang benar
      setAllItems(itemsWithCorrectSort)

      // Revalidate cache publik ISR
      await revalidatePublicSite()

      setSavedSuccess(true)
      setTimeout(() => setSavedSuccess(false), 3500)

      // Refresh server components agar web publik langsung update
      router.refresh()
    } catch (err: any) {
      alert(
        'Gagal menyimpan perubahan ke Supabase:\n\n' +
        err.message +
        '\n\nCatatan: Pastikan script SQL migrasi homepage_cms sudah dijalankan di Supabase SQL Editor.'
      )
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header Halaman */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0A1628] tracking-tight">
            Homepage CMS
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Kelola tata letak, produk/resep unggulan, badge, dan video TikTok di beranda website.
          </p>
        </div>

        {/* Tombol Simpan Terpadu */}
        <div className="flex items-center gap-3">
          {savedSuccess && (
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-2 rounded-xl animate-in fade-in">
              <Check size={14} /> Tersimpan ke Beranda!
            </span>
          )}
          <button
            onClick={handleSaveAll}
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 bg-[#CC0000] hover:bg-[#a00b22] text-white text-xs sm:text-sm font-bold px-6 py-2.5 rounded-xl transition-all shadow-md active:scale-95 cursor-pointer disabled:opacity-60"
          >
            <Save size={16} />
            <span>{saving ? 'Menyimpan...' : 'Simpan Semua Perubahan'}</span>
          </button>
        </div>
      </div>

      {/* Tab Navigasi Section */}
      <div className="flex items-center gap-2 border-b border-gray-200 pb-2 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab('taste_heat')}
          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${activeTab === 'taste_heat'
              ? 'bg-[#CC0000] text-white shadow-sm'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
        >
          <Flame size={16} />
          <span>Taste The Heat ({featuredTasteHeat.length}/4)</span>
        </button>

        <button
          onClick={() => setActiveTab('cook_good')}
          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${activeTab === 'cook_good'
              ? 'bg-[#CC0000] text-white shadow-sm'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
        >
          <ChefHat size={16} />
          <span>Cook Something Good (Resep)</span>
        </button>

        <button
          onClick={() => setActiveTab('carousel')}
          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${activeTab === 'carousel'
              ? 'bg-[#CC0000] text-white shadow-sm'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
        >
          <LayoutGrid size={16} />
          <span>Carousel Subkategori ({selectedCarouselSubs.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('tiktok')}
          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${activeTab === 'tiktok'
              ? 'bg-[#CC0000] text-white shadow-sm'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
        >
          <Video size={16} />
          <span>Video di TikTok ({tiktokVideos.length})</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: TASTE THE HEAT */}
      {/* ========================================================================= */}
      {activeTab === 'taste_heat' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Setting Judul Section */}
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-[#0A1628] flex items-center gap-2">
              <Flame size={17} className="text-[#CC0000]" />
              Pengaturan Teks Section
            </h3>
            <div className="max-w-md">
              <label className="text-xs font-semibold text-gray-500 block mb-1">
                Judul Utama Section
              </label>
              <input
                type="text"
                value={tasteHeatTitle}
                onChange={(e) => setTasteHeatTitle(e.target.value)}
                placeholder="TASTE THE HEAT"
                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm font-bold focus:outline-none focus:border-[#CC0000]"
              />
            </div>
          </div>

          {/* Kartu Terpilih (Maksimal 4) & Pengaturan Tata Letak + Badge */}
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-[#0A1628] flex items-center gap-2">
                  <Sparkles size={17} className="text-amber-500" />
                  Kartu Terpilih di Beranda ({featuredTasteHeat.length} dari 4)
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  Atur urutan posisi (1 sampai 4) dan pilih badge <strong>Trending Now</strong> atau{' '}
                  <strong>Fan Favorite</strong> untuk setiap kartu.
                </p>
              </div>
            </div>

            {featuredTasteHeat.length === 0 ? (
              <div className="text-center py-8 bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
                <p className="text-sm text-gray-400">
                  Belum ada item yang dipilih untuk Taste The Heat. Pilih dari daftar di bawah.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                {featuredTasteHeat.map((item, idx) => (
                  <div
                    key={item.id}
                    className="relative bg-gray-50 border border-gray-200 rounded-2xl p-3 flex flex-col justify-between group hover:border-[#CC0000] transition-all shadow-2xs"
                  >
                    {/* Badge Nomor Urut Posisi */}
                    <div className="flex items-center justify-between mb-2">
                      <span className="w-6 h-6 rounded-full bg-[#CC0000] text-white text-xs font-black flex items-center justify-center shadow-xs">
                        {idx + 1}
                      </span>
                      <div className="flex items-center gap-1">
                        {/* Tombol Geser Posisi */}
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => moveTasteHeatOrder(item.id, 'up')}
                          className="p-1 rounded bg-white hover:bg-gray-100 disabled:opacity-30 text-gray-700 shadow-2xs"
                          title="Geser ke kiri / urutan sebelumnya"
                        >
                          <ArrowUp size={13} className="rotate-[-90deg] sm:rotate-0" />
                        </button>
                        <button
                          type="button"
                          disabled={idx === featuredTasteHeat.length - 1}
                          onClick={() => moveTasteHeatOrder(item.id, 'down')}
                          className="p-1 rounded bg-white hover:bg-gray-100 disabled:opacity-30 text-gray-700 shadow-2xs"
                          title="Geser ke kanan / urutan berikutnya"
                        >
                          <ArrowDown size={13} className="rotate-[-90deg] sm:rotate-0" />
                        </button>
                      </div>
                    </div>

                    {/* Foto & Info Preview */}
                    <div
                      style={{
                        backgroundColor: featuredCardColors[item.id]
                          ? FEATURED_CARD_THEMES[featuredCardColors[item.id]]?.hex || '#ffffff'
                          : '#ffffff',
                      }}
                      className="aspect-[4/3] rounded-xl overflow-hidden border border-gray-100 mb-2.5 relative flex items-center justify-center p-2 transition-colors"
                    >
                      <img
                        src={item.main_image || '/placeholder-product.jpg'}
                        alt={item.name}
                        className="max-h-full max-w-full object-contain relative z-10 drop-shadow-md"
                      />

                      {/* Preview Badge di Foto */}
                      {item.featured_badge === 'trending' && (
                        <span className="absolute top-1.5 left-1.5 bg-white text-black text-[9px] font-black px-2 py-0.5 rounded shadow-sm">
                          Trending Now
                        </span>
                      )}
                      {item.featured_badge === 'favorite' && (
                        <span className="absolute top-1.5 left-1.5 bg-black text-white text-[9px] font-black px-2 py-0.5 rounded shadow-sm">
                          ★ Fan Favorite
                        </span>
                      )}
                    </div>

                    <div className="min-w-0 mb-3">
                      <span className="text-[10px] uppercase font-bold text-gray-400 block truncate">
                        {item.type === 'product' ? '📦 Produk' : '🍳 Resep'} · {item.category}
                      </span>
                      <h4 className="text-xs font-extrabold text-[#0A1628] truncate" title={item.name}>
                        {item.name}
                      </h4>
                    </div>

                    {/* Selector Badge Heinz Style */}
                    <div className="pt-2 border-t border-gray-200/80 space-y-1.5">
                      <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">
                        Tandai Badge:
                      </label>
                      <div className="grid grid-cols-3 gap-1 text-[10px] font-bold">
                        <button
                          type="button"
                          onClick={() => setTasteHeatBadge(item.id, null)}
                          className={`py-1 rounded-md transition-colors cursor-pointer ${!item.featured_badge
                              ? 'bg-gray-800 text-white shadow-2xs'
                              : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                            }`}
                        >
                          Polos
                        </button>
                        <button
                          type="button"
                          onClick={() => setTasteHeatBadge(item.id, 'trending')}
                          className={`py-1 rounded-md transition-colors cursor-pointer ${item.featured_badge === 'trending'
                              ? 'bg-[#CC0000] text-white shadow-2xs'
                              : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                            }`}
                        >
                          Trending
                        </button>
                        <button
                          type="button"
                          onClick={() => setTasteHeatBadge(item.id, 'favorite')}
                          className={`py-1 rounded-md transition-colors cursor-pointer ${item.featured_badge === 'favorite'
                              ? 'bg-amber-500 text-white shadow-2xs'
                              : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                            }`}
                        >
                          Favorite
                        </button>
                      </div>

                      {/* Selector Warna Background Kartu (Palet Gourmet Kaya Warna Khusus Featured) */}
                      <div className="pt-2 border-t border-gray-200/80 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">
                            Warna Kartu:
                          </label>
                          {featuredCardColors[item.id] && (
                            <span className="text-[10px] font-bold text-[#CC0000] truncate max-w-[120px]">
                              {FEATURED_CARD_THEMES[featuredCardColors[item.id]]?.label}
                            </span>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {Object.entries(FEATURED_CARD_THEMES).map(([key, theme]) => {
                            const isSelected = featuredCardColors[item.id] === key
                            return (
                              <button
                                key={key}
                                type="button"
                                title={theme.label}
                                onClick={() => setFeaturedColor(item.id, key)}
                                className={`w-5 h-5 rounded-full border-2 transition-all cursor-pointer ${isSelected
                                    ? 'border-white ring-2 ring-offset-1 ring-gray-700 scale-110 shadow-xs'
                                    : 'border-transparent hover:scale-110'
                                  }`}
                                style={{ backgroundColor: theme.hex }}
                              />
                            )
                          })}
                          {/* Tombol Reset ke default */}
                          {featuredCardColors[item.id] && (
                            <button
                              type="button"
                              title="Reset ke warna default"
                              onClick={() => clearFeaturedColor(item.id)}
                              className="w-5 h-5 rounded-full border border-dashed border-gray-300 text-gray-400 hover:border-gray-500 hover:text-black flex items-center justify-center text-[10px] cursor-pointer"
                            >
                              ✕
                            </button>
                          )}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => toggleTasteHeatFeatured(item.id)}
                        className="w-full mt-2 text-[10px] font-semibold text-rose-600 hover:text-rose-800 py-1 cursor-pointer hover:underline"
                      >
                        Keluarkan dari Beranda
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pool Pemilihan: Pilih Produk & Resep untuk Taste The Heat */}
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-[#0A1628]">
              Pilih Item Tambahan (Produk &amp; Resep)
            </h3>
            <p className="text-xs text-gray-400">
              Klik tombol &ldquo;Pilih ke Beranda&rdquo; untuk memasukkan ke dalam 4 slot kartu Taste The Heat.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 max-h-96 overflow-y-auto p-1">
              {allItems.map((item) => {
                const isActive = item.is_featured

                return (
                  <div
                    key={item.id}
                    className={`flex items-center justify-between p-2.5 rounded-xl border transition-colors ${isActive ? 'bg-red-50/40 border-red-200' : 'bg-gray-50/50 border-gray-100 hover:bg-gray-50'
                      }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0 mr-2">
                      <div className="w-10 h-10 rounded-lg bg-white border border-gray-100 flex items-center justify-center shrink-0 p-1">
                        <img
                          src={item.main_image || '/placeholder-product.jpg'}
                          alt={item.name}
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>
                      <div className="min-w-0">
                        <span className="text-[10px] text-gray-400 block truncate">
                          {item.type === 'product' ? 'Produk' : 'Resep'}
                        </span>
                        <p className="text-xs font-bold text-[#0A1628] truncate">{item.name}</p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleTasteHeatFeatured(item.id)}
                      className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition-all cursor-pointer shrink-0 ${isActive
                          ? 'bg-[#CC0000] text-white border-[#CC0000]'
                          : 'bg-white text-gray-700 hover:bg-gray-100 border-gray-200'
                        }`}
                    >
                      {isActive ? 'Aktif ✓' : '+ Pilih'}
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: COOK SOMETHING GOOD (RESEP GANTUNGAN TALI) */}
      {/* ========================================================================= */}
      {activeTab === 'cook_good' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-[#0A1628] flex items-center gap-2">
              <ChefHat size={17} className="text-[#CC0000]" />
              Pengaturan Teks &amp; Judul
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-gray-500 block mb-1">
                  Judul Utama Section
                </label>
                <input
                  type="text"
                  value={cookGoodTitle}
                  onChange={(e) => setCookGoodTitle(e.target.value)}
                  placeholder="COOK SOMETHING GOOD"
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm font-bold focus:outline-none focus:border-[#CC0000]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-500 block mb-1">
                  Sub-judul / Deskripsi
                </label>
                <input
                  type="text"
                  value={cookGoodSubtitle}
                  onChange={(e) => setCookGoodSubtitle(e.target.value)}
                  placeholder="Resep pilihan istimewa yang mudah dibuat di rumah..."
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#CC0000]"
                />
              </div>
            </div>
          </div>

          {/* Info Status Resep Polaroid Carousel */}
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-xs space-y-4">
            <div>
              <h3 className="text-base font-bold text-[#0A1628]">
                Daftar Resep di Carousel Tali Polaroid
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                Semua resep berstatus <strong>Published</strong> otomatis tampil berayun di tali gantungan polaroid beranda.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {recipePool.map((recipe, idx) => (
                <div
                  key={recipe.id}
                  className="p-3 rounded-xl border border-gray-100 bg-gray-50/50 flex items-center gap-3"
                >
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-white border border-gray-200 shrink-0">
                    <img
                      src={recipe.main_image || '/placeholder-recipe.jpg'}
                      alt={recipe.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] font-bold text-emerald-600 block">
                      Slide #{idx + 1}
                    </span>
                    <p className="text-xs font-bold text-[#0A1628] truncate">{recipe.title}</p>
                    <span className="text-[10px] text-gray-400 block">{recipe.category || 'Resep'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: VIDEO TIKTOK */}
      {/* ========================================================================= */}
      {activeTab === 'tiktok' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Setting Judul & Link Akun TikTok */}
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-[#0A1628] flex items-center gap-2">
              <Film size={17} className="text-[#CC0000]" />
              Pengaturan Teks &amp; Akun TikTok
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div>
                <label className="text-xs font-semibold text-gray-500 block mb-1">
                  Judul Section
                </label>
                <input
                  type="text"
                  value={tiktokTitle}
                  onChange={(e) => setTiktokTitle(e.target.value)}
                  placeholder="IKUTI KAMI DI TIKTOK"
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm font-bold focus:outline-none focus:border-[#CC0000]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-500 block mb-1">
                  Sub-judul / Bio
                </label>
                <input
                  type="text"
                  value={tiktokSubtitle}
                  onChange={(e) => setTiktokSubtitle(e.target.value)}
                  placeholder="@awangbrand_official — Inspirasi resep..."
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#CC0000]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-500 block mb-1">
                  URL Akun TikTok
                </label>
                <input
                  type="text"
                  value={tiktokAccountUrl}
                  onChange={(e) => setTiktokAccountUrl(e.target.value)}
                  placeholder="https://www.tiktok.com/@awangbrand_official"
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#CC0000]"
                />
              </div>
            </div>
          </div>

          {/* Manajemen Video TikTok */}
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-[#0A1628]">Daftar Video TikTok</h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  Masukkan ID Video TikTok atau URL Video TikTok. Sistem akan otomatis mengekstrak ID-nya.
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddTikTok}
                className="inline-flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-[#0A1628] text-xs font-bold px-3.5 py-2 rounded-xl transition-colors cursor-pointer"
              >
                <Plus size={14} /> Tambah Video
              </button>
            </div>

            <div className="space-y-3">
              {tiktokVideos.map((video, idx) => (
                <div
                  key={idx}
                  className="p-3.5 bg-gray-50/50 border border-gray-200 rounded-xl flex flex-col sm:flex-row items-start sm:items-center gap-3"
                >
                  <span className="w-6 h-6 rounded-full bg-black text-white text-xs font-bold flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 flex-1 w-full">
                    <div>
                      <input
                        type="text"
                        value={video.title}
                        onChange={(e) => handleUpdateTikTok(idx, 'title', e.target.value)}
                        placeholder="Judul / Keterangan video"
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs font-semibold focus:outline-none focus:border-[#CC0000]"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <input
                        type="text"
                        value={video.url}
                        onChange={(e) => handleUpdateTikTok(idx, 'url', e.target.value)}
                        placeholder="https://www.tiktok.com/@awangbrand_official/video/7611107188828065044"
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-[#CC0000]"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                    {video.id && (
                      <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono px-2 py-1 rounded-md">
                        ID: {video.id}
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => handleDeleteTikTok(idx)}
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                      title="Hapus video ini"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: CAROUSEL SUBKATEGORI ("TEMUKAN PILIHANMU") */}
      {/* ========================================================================= */}
      {activeTab === 'carousel' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Setting Judul Section */}
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-[#0A1628] flex items-center gap-2">
              <LayoutGrid size={17} className="text-[#CC0000]" />
              Pengaturan Teks Carousel
            </h3>
            <div className="max-w-md">
              <label className="text-xs font-semibold text-gray-500 block mb-1">
                Judul Utama Section
              </label>
              <input
                type="text"
                value={carouselTitle}
                onChange={(e) => setCarouselTitle(e.target.value)}
                placeholder="TEMUKAN PILIHANMU"
                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm font-bold focus:outline-none focus:border-[#CC0000]"
              />
            </div>
          </div>

          {/* Subkategori yang Ditampilkan di Carousel */}
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-[#0A1628]">
                  Urutan Subkategori Terpilih ({selectedCarouselSubs.length})
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Gunakan tombol panah untuk mengatur urutan kartu di carousel beranda
                </p>
              </div>
            </div>

            {selectedCarouselSubs.length === 0 ? (
              <div className="p-8 text-center text-gray-400 text-xs border border-dashed border-gray-200 rounded-xl">
                Belum ada subkategori yang dipilih untuk carousel. Pilih dari daftar di bawah.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {selectedCarouselSubs.map((subId, idx) => {
                  const sub = availableSubcategories.find((s) => s.id === subId)
                  if (!sub) return null
                  const currentColorKey = carouselCardColors[sub.id]

                  return (
                    <div
                      key={sub.id}
                      className="p-3 bg-white border border-gray-200 rounded-xl flex flex-col gap-3 shadow-xs hover:border-[#CC0000] transition-colors"
                    >
                      {/* Baris atas: nomor + gambar + nama + tombol urutan + hapus */}
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-[#CC0000] text-white text-xs font-bold flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>

                        <div className="w-12 h-12 rounded-lg bg-stone-100 p-1 flex items-center justify-center shrink-0 overflow-hidden border border-gray-100">
                          {sub.image_url ? (
                            <img
                              src={sub.image_url}
                              alt={sub.name}
                              className="max-h-full max-w-full object-contain"
                            />
                          ) : (
                            <LayoutGrid size={20} className="text-gray-300" />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-gray-900 truncate">{sub.name}</p>
                          <p className="text-[10px] text-gray-400 truncate">{sub.groupName}</p>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            disabled={idx === 0}
                            onClick={() => moveCarouselSub(sub.id, 'up')}
                            className="p-1 rounded-md text-gray-400 hover:text-black hover:bg-gray-100 disabled:opacity-30 cursor-pointer"
                            title="Geser ke kiri / awal"
                          >
                            <ArrowUp size={14} />
                          </button>
                          <button
                            type="button"
                            disabled={idx === selectedCarouselSubs.length - 1}
                            onClick={() => moveCarouselSub(sub.id, 'down')}
                            className="p-1 rounded-md text-gray-400 hover:text-black hover:bg-gray-100 disabled:opacity-30 cursor-pointer"
                            title="Geser ke kanan / akhir"
                          >
                            <ArrowDown size={14} />
                          </button>
                          <button
                            type="button"
                            onClick={() => toggleCarouselSub(sub.id)}
                            className="p-1 rounded-md text-gray-400 hover:text-red-600 hover:bg-red-50 cursor-pointer"
                            title="Hapus dari carousel"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>

                      {/* Baris bawah: Pilih Warna Kartu */}
                      <div>
                        <p className="text-[10px] font-semibold text-gray-400 mb-1.5">Warna Kartu</p>
                        <div className="flex flex-wrap gap-1.5">
                          {Object.entries(CARD_THEMES).map(([key, theme]) => (
                            <button
                              key={key}
                              type="button"
                              title={theme.label}
                              onClick={() => setCardColor(sub.id, key)}
                              className={`w-6 h-6 rounded-full border-2 transition-all cursor-pointer ${currentColorKey === key
                                  ? 'border-white ring-2 ring-offset-1 ring-gray-600 scale-110'
                                  : 'border-transparent hover:scale-110'
                                }`}
                              style={{ backgroundColor: theme.hex }}
                            />
                          ))}
                          {/* Tombol reset ke rotasi otomatis */}
                          {currentColorKey && (
                            <button
                              type="button"
                              title="Reset ke warna otomatis"
                              onClick={() => {
                                setCarouselCardColors((prev) => {
                                  const next = { ...prev }
                                  delete next[sub.id]
                                  return next
                                })
                              }}
                              className="w-6 h-6 rounded-full border-2 border-dashed border-gray-300 text-gray-400 hover:border-gray-500 flex items-center justify-center text-[10px] cursor-pointer"
                            >
                              ✕
                            </button>
                          )}
                        </div>
                        {currentColorKey && (
                          <p className="text-[10px] text-gray-500 mt-1">
                            {CARD_THEMES[currentColorKey]?.label}
                          </p>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Daftar Semua Subkategori dari Kategori Produk */}
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-xs space-y-4">
            <div>
              <h3 className="text-sm font-bold text-[#0A1628]">
                Semua Subkategori Produk ({availableSubcategories.length})
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Klik pada kartu untuk mengaktifkan atau menonaktifkannya di carousel beranda
              </p>
            </div>

            {availableSubcategories.length === 0 ? (
              <div className="p-8 text-center text-gray-400 text-xs border border-dashed border-gray-200 rounded-xl">
                Belum ada subkategori produk. Buat terlebih dahulu di menu{' '}
                <a href="/admin/categories" className="text-[#CC0000] underline font-bold">
                  Kategori
                </a>
                .
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {availableSubcategories.map((sub) => {
                  const isSelected = selectedCarouselSubs.includes(sub.id)

                  return (
                    <button
                      key={sub.id}
                      type="button"
                      onClick={() => toggleCarouselSub(sub.id)}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer relative group flex flex-col items-center justify-between gap-2.5 ${isSelected
                          ? 'border-[#CC0000] bg-red-50/20 shadow-xs'
                          : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                        }`}
                    >
                      <div className="w-16 h-16 rounded-xl bg-stone-50 p-1.5 flex items-center justify-center overflow-hidden border border-gray-100">
                        {sub.image_url ? (
                          <img
                            src={sub.image_url}
                            alt={sub.name}
                            className="max-h-full max-w-full object-contain"
                          />
                        ) : (
                          <LayoutGrid size={24} className="text-gray-300" />
                        )}
                      </div>

                      <div className="w-full text-center">
                        <p className="text-xs font-bold text-gray-900 truncate">{sub.name}</p>
                        <p className="text-[10px] text-gray-400 truncate">{sub.groupName}</p>
                      </div>

                      <div
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isSelected
                            ? 'bg-[#CC0000] text-white'
                            : 'bg-gray-100 text-gray-500 group-hover:bg-gray-200'
                          }`}
                      >
                        {isSelected ? '✓ Ditampilkan' : '+ Tampilkan'}
                      </div>
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
