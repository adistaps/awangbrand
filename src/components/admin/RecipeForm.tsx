'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Recipe, RecipeVideoLink } from '@/types/database'
import { Plus, Trash2, Save, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import type { CategoryGroup } from '@/types/database'
import { ImageUploader } from '@/components/admin/ImageUploader'
import { RecipeLinksEditor } from '@/components/admin/RecipeLinksEditor'

interface Props {
  initialData?: Recipe
  products: { id: string; name: string }[]
  categoryGroups?: CategoryGroup[]
}

export function RecipeForm({ initialData, products, categoryGroups = [] }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const [title, setTitle] = useState(initialData?.title || '')
  const [slug, setSlug] = useState(initialData?.slug || '')
  const [category, setCategory] = useState(initialData?.category || 'Main Course')
  const [categoryIds, setCategoryIds] = useState<string[]>(initialData?.category_ids || [])
  const [subcategoryIds, setSubcategoryIds] = useState<string[]>(initialData?.subcategory_ids || [])
  const [prepTime, setPrepTime] = useState(initialData?.prep_time || '15 MIN')
  const [cookTime, setCookTime] = useState(initialData?.cook_time || '15 MIN')
  const [servings, setServings] = useState(initialData?.servings || '4 Servings')
  const [calories, setCalories] = useState(initialData?.calories || '380 Calories')
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>(initialData?.difficulty || 'Easy')
  const [description, setDescription] = useState(initialData?.description || '')
  const [mainImage, setMainImage] = useState(initialData?.main_image || '')
  const [tips, setTips] = useState(initialData?.tips || '')
  const [featuredProductId, setFeaturedProductId] = useState(initialData?.featured_product_id || '')
  const [recipeLinks, setRecipeLinks] = useState<RecipeVideoLink[]>(
    (initialData?.recipe_links as RecipeVideoLink[]) || []
  )
  const [status, setStatus] = useState<'published' | 'draft'>(initialData?.status || 'published')

  function toggleCategoryId(id: string) {
    setCategoryIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  function toggleSubcategoryId(id: string, parentGroupId: string) {
    setSubcategoryIds((prev) => {
      const isSelected = prev.includes(id)
      const next = isSelected ? prev.filter((item) => item !== id) : [...prev, id]
      return next
    })

    // Otomatis centang category group parent jika belum
    if (!categoryIds.includes(parentGroupId)) {
      setCategoryIds((prev) => [...prev, parentGroupId])
    }
  }

  const [ingredients, setIngredients] = useState<string[]>(
    Array.isArray(initialData?.ingredients) && initialData.ingredients.length > 0
      ? initialData.ingredients
      : ['']
  )

  const [instructions, setInstructions] = useState<string[]>(
    Array.isArray(initialData?.instructions) && initialData.instructions.length > 0
      ? initialData.instructions
      : ['']
  )

  const generateSlug = (val: string) => {
    return val
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '')
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value)
    if (!initialData) {
      setSlug(generateSlug(e.target.value))
    }
  }

  const handleIngredientChange = (idx: number, val: string) => {
    const next = [...ingredients]
    next[idx] = val
    setIngredients(next)
  }

  const addIngredient = () => setIngredients([...ingredients, ''])
  const removeIngredient = (idx: number) => setIngredients(ingredients.filter((_, i) => i !== idx))

  const handleInstructionChange = (idx: number, val: string) => {
    const next = [...instructions]
    next[idx] = val
    setInstructions(next)
  }

  const addInstruction = () => setInstructions([...instructions, ''])
  const removeInstruction = (idx: number) => setInstructions(instructions.filter((_, i) => i !== idx))

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title || !slug) return alert('Judul dan slug wajib diisi')

    setLoading(true)
    try {
      const supabase = createClient()
      const validRecipeLinks = recipeLinks
        .filter((l) => l.title?.trim() || l.url?.trim())
        .map((l) => ({
          id: l.id,
          title: l.title.trim(),
          url: l.url.trim(),
          platform: l.platform || (l.url.toLowerCase().includes('instagram.com') ? 'instagram' : 'tiktok'),
        }))

      const payload = {
        title,
        slug,
        category,
        prep_time: prepTime,
        cook_time: cookTime,
        servings,
        calories,
        difficulty,
        description,
        main_image: mainImage,
        tips,
        featured_product_id: featuredProductId || null,
        category_ids: categoryIds,
        subcategory_ids: subcategoryIds,
        ingredients: ingredients.filter((i) => i.trim() !== ''),
        instructions: instructions.filter((i) => i.trim() !== ''),
        recipe_links: validRecipeLinks,
        status,
        updated_at: new Date().toISOString()
      }

      if (initialData?.id) {
        const { error } = await supabase
          .from('recipes')
          .update(payload)
          .eq('id', initialData.id)

        if (error) throw error
        alert('Resep berhasil diperbarui!')
      } else {
        const { error } = await supabase.from('recipes').insert([payload])
        if (error) throw error
        alert('Resep baru berhasil disimpan!')
      }

      router.push('/admin/recipes')
      router.refresh()
    } catch (err: any) {
      alert('Gagal menyimpan resep: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 bg-white p-5 sm:p-8 rounded-2xl border border-gray-100 shadow-xs max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-5">
        <Link href="/admin/recipes" className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-gray-900 transition-colors">
          <ArrowLeft size={16} /> Kembali ke daftar resep
        </Link>
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 bg-[#CC0000] hover:bg-[#a00b22] !text-white text-xs sm:text-sm font-bold px-6 py-2.5 rounded-xl transition-all shadow-xs active:scale-95 cursor-pointer disabled:opacity-60"
        >
          <Save size={16} className="!text-white" />
          <span className="!text-white text-white">{loading ? 'Menyimpan...' : 'Simpan Resep'}</span>
        </button>
      </div>

      {/* Basic Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="block text-xs font-bold uppercase text-gray-700 mb-1.5">Judul Resep *</label>
          <input
            type="text"
            required
            value={title}
            onChange={handleTitleChange}
            placeholder="cth: Rendang Daging Tok Warisan"
            className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#CC0000] transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase text-gray-700 mb-1.5">URL Slug *</label>
          <input
            type="text"
            required
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50/50 focus:outline-none focus:border-[#CC0000] transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase text-gray-700 mb-1.5">Kategori</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:border-[#CC0000] transition-colors"
          >
            <option value="Main Course">Main Course</option>
            <option value="Appetizer">Appetizer</option>
            <option value="Salad">Salad</option>
            <option value="Lunch">Lunch</option>
            <option value="Soup">Soup</option>
            <option value="Dessert">Dessert</option>
            <option value="Beverage">Beverage</option>
          </select>
        </div>

        <div className="bg-stone-50/70 p-4 rounded-2xl border border-stone-200">
          <label className="block text-xs font-bold uppercase text-[#590014] mb-1">
            Produk AWANG yang Digunakan (Featured Product)
          </label>
          <p className="text-[11px] text-gray-500 mb-2">
            Pilih produk yang digunakan dalam resep ini. Produk akan tampil di halaman detail resep (&quot;Shop Featured Products&quot;) dan resep ini otomatis muncul di bagian &quot;Cook With Us&quot; pada detail produk terkait.
          </p>
          <select
            value={featuredProductId}
            onChange={(e) => setFeaturedProductId(e.target.value)}
            className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm bg-white font-medium focus:outline-none focus:border-[#CC0000] transition-colors"
          >
            <option value="">-- Pilih Produk AWANG --</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
          {featuredProductId && (
            <p className="text-[11px] text-emerald-700 font-semibold mt-2 flex items-center gap-1">
              ✓ Resep ini terhubung dengan produk: <u>{products.find((p) => p.id === featuredProductId)?.name}</u>
            </p>
          )}
        </div>
      </div>

      {/* FILTER KATEGORI & SUBKATEGORI RESEP (MULTI-SELECT) */}
      {categoryGroups.length > 0 && (
        <div className="border border-gray-200 rounded-2xl p-4 sm:p-5 bg-stone-50/50 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-xs font-extrabold text-[#590014] uppercase tracking-wider">
                Filter Kategori &amp; Subkategori Resep (Multi-Select)
              </h4>
              <p className="text-[11px] text-gray-500 mt-0.5">
                Pilih kategori dan subkategori resep (&quot;What are you cooking?&quot;, &quot;Flavour &amp; Taste&quot;, &quot;Meal Inspiration&quot;) di mana resep ini akan muncul saat difilter oleh pengunjung.
              </p>
            </div>
            <span className="text-[11px] font-bold text-[#CC0000] bg-red-50 border border-red-200 px-2.5 py-1 rounded-full shrink-0">
              {subcategoryIds.length} Subkategori dipilih
            </span>
          </div>

          <div className="space-y-4 pt-1">
            {categoryGroups.map((group) => {
              const isGroupActive = categoryIds.includes(group.id)

              return (
                <div key={group.id} className="bg-white rounded-xl p-3.5 border border-gray-200 shadow-2xs">
                  {/* Header Kategori Induk */}
                  <div className="flex items-center justify-between mb-2.5">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={isGroupActive}
                        onChange={() => toggleCategoryId(group.id)}
                        className="w-4 h-4 rounded text-[#CC0000] focus:ring-[#CC0000] border-gray-300 cursor-pointer accent-[#CC0000]"
                      />
                      <span className="text-xs sm:text-sm font-bold text-stone-900">
                        {group.name}
                      </span>
                    </label>
                    <span className="text-[10px] text-gray-400 font-medium">
                      {group.subcategories.length} pilihan
                    </span>
                  </div>

                  {/* Subkategori Checkbox Chips */}
                  {group.subcategories.length > 0 ? (
                    <div className="flex flex-wrap gap-2 pl-6">
                      {group.subcategories.map((sub) => {
                        const isSubActive = subcategoryIds.includes(sub.id)
                        return (
                          <button
                            type="button"
                            key={sub.id}
                            onClick={() => toggleSubcategoryId(sub.id, group.id)}
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                              isSubActive
                                ? 'bg-[#590014] text-white border-[#590014] shadow-xs'
                                : 'bg-stone-50 text-stone-700 border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            {sub.image_url && (
                              <img
                                src={sub.image_url}
                                alt={sub.name}
                                className="w-4 h-4 rounded-full object-cover shrink-0"
                              />
                            )}
                            <span>{sub.name}</span>
                          </button>
                        )
                      })}
                    </div>
                  ) : (
                    <p className="text-[11px] text-gray-400 italic pl-6">
                      Belum ada subkategori pada kategori ini.
                    </p>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Timing & Servings */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <div>
          <label className="block text-xs font-bold uppercase text-gray-700 mb-1.5">Prep Time</label>
          <input
            type="text"
            value={prepTime}
            onChange={(e) => setPrepTime(e.target.value)}
            placeholder="15 MIN"
            className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#CC0000]"
          />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase text-gray-700 mb-1.5">Cook Time</label>
          <input
            type="text"
            value={cookTime}
            onChange={(e) => setCookTime(e.target.value)}
            placeholder="30 MIN"
            className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#CC0000]"
          />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase text-gray-700 mb-1.5">Servings</label>
          <input
            type="text"
            value={servings}
            onChange={(e) => setServings(e.target.value)}
            placeholder="4 Porsi"
            className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#CC0000]"
          />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase text-gray-700 mb-1.5">Calories</label>
          <input
            type="text"
            value={calories}
            onChange={(e) => setCalories(e.target.value)}
            placeholder="380 Kalori"
            className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#CC0000]"
          />
        </div>
      </div>

      {/* Description & Image */}
      <div className="space-y-5">
        <div className="bg-stone-50/70 p-4 sm:p-5 rounded-2xl border border-gray-200 space-y-3">
          <label className="block text-xs font-bold uppercase text-gray-700">Foto Utama Resep *</label>
          <ImageUploader
            bucket="product-images"
            value={mainImage || null}
            onChange={(url) => setMainImage(url || '')}
            label="Upload Foto Resep (Pilih File Gambar)"
          />
          <div className="pt-2 border-t border-gray-200/60">
            <label className="block text-[11px] font-semibold text-gray-500 mb-1">
              Atau masukkan link/URL gambar secara manual:
            </label>
            <input
              type="url"
              value={mainImage}
              onChange={(e) => setMainImage(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-[#CC0000] bg-white"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase text-gray-700 mb-1.5">Deskripsi Singkat</label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Kisah atau deskripsi ringkas kenikmatan sajian ini..."
            className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#CC0000]"
          />
        </div>
      </div>

      {/* Dynamic Ingredients */}
      <div className="space-y-3 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <label className="block text-xs font-bold uppercase text-gray-700">Daftar Bahan (Ingredients)</label>
          <button
            type="button"
            onClick={addIngredient}
            className="inline-flex items-center gap-1 text-xs font-bold text-[#CC0000] hover:underline cursor-pointer"
          >
            <Plus size={14} /> Tambah Bahan
          </button>
        </div>
        {ingredients.map((ing, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <input
              type="text"
              value={ing}
              onChange={(e) => handleIngredientChange(idx, e.target.value)}
              placeholder={`Bahan ${idx + 1}`}
              className="flex-1 px-3.5 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#CC0000]"
            />
            {ingredients.length > 1 && (
              <button
                type="button"
                onClick={() => removeIngredient(idx)}
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Dynamic Instructions */}
      <div className="space-y-3 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <label className="block text-xs font-bold uppercase text-gray-700">Langkah Pembuatan (Instructions)</label>
          <button
            type="button"
            onClick={addInstruction}
            className="inline-flex items-center gap-1 text-xs font-bold text-[#CC0000] hover:underline cursor-pointer"
          >
            <Plus size={14} /> Tambah Langkah
          </button>
        </div>
        {instructions.map((ins, idx) => (
          <div key={idx} className="flex items-start gap-2">
            <span className="text-xs font-bold text-gray-400 w-12 text-center pt-2.5">Step {idx + 1}</span>
            <textarea
              rows={2}
              value={ins}
              onChange={(e) => handleInstructionChange(idx, e.target.value)}
              placeholder={`Instruksi langkah ${idx + 1}`}
              className="flex-1 px-3.5 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#CC0000]"
            />
            {instructions.length > 1 && (
              <button
                type="button"
                onClick={() => removeInstruction(idx)}
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors mt-1 cursor-pointer"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* VIDEO RESEP (TIKTOK & INSTAGRAM) */}
      <RecipeLinksEditor links={recipeLinks} onChange={setRecipeLinks} />

      {/* Recipe Tips & Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-4 border-t border-gray-100">
        <div>
          <label className="block text-xs font-bold uppercase text-gray-700 mb-1.5">Tips Memasak (Opsional)</label>
          <textarea
            rows={2}
            value={tips}
            onChange={(e) => setTips(e.target.value)}
            placeholder="cth: Tumis bumbu dengan api sedang agar aroma rempah semerbak sempurna..."
            className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#CC0000]"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase text-gray-700 mb-1.5">Status Publikasi</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as 'published' | 'draft')}
            className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:border-[#CC0000]"
          >
            <option value="published">Published (Tampil di Web)</option>
            <option value="draft">Draft (Disembunyikan)</option>
          </select>
        </div>
      </div>
    </form>
  )
}
