'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Recipe } from '@/types/database'
import { Plus, Trash2, Save, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface Props {
  initialData?: Recipe
  products: { id: string; name: string }[]
}

export function RecipeForm({ initialData, products }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const [title, setTitle] = useState(initialData?.title || '')
  const [slug, setSlug] = useState(initialData?.slug || '')
  const [category, setCategory] = useState(initialData?.category || 'Main Course')
  const [prepTime, setPrepTime] = useState(initialData?.prep_time || '15 MIN')
  const [cookTime, setCookTime] = useState(initialData?.cook_time || '15 MIN')
  const [servings, setServings] = useState(initialData?.servings || '4 Servings')
  const [calories, setCalories] = useState(initialData?.calories || '380 Calories')
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>(initialData?.difficulty || 'Easy')
  const [description, setDescription] = useState(initialData?.description || '')
  const [mainImage, setMainImage] = useState(initialData?.main_image || '')
  const [tips, setTips] = useState(initialData?.tips || '')
  const [featuredProductId, setFeaturedProductId] = useState(initialData?.featured_product_id || '')
  const [status, setStatus] = useState<'published' | 'draft'>(initialData?.status || 'published')

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
        ingredients: ingredients.filter((i) => i.trim() !== ''),
        instructions: instructions.filter((i) => i.trim() !== ''),
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
          className="inline-flex items-center justify-center gap-2 bg-[#C8102E] hover:bg-[#a00b22] !text-white text-xs sm:text-sm font-bold px-6 py-2.5 rounded-xl transition-all shadow-xs active:scale-95 cursor-pointer disabled:opacity-60"
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
            className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#C8102E] transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase text-gray-700 mb-1.5">URL Slug *</label>
          <input
            type="text"
            required
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50/50 focus:outline-none focus:border-[#C8102E] transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase text-gray-700 mb-1.5">Kategori</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:border-[#C8102E] transition-colors"
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

        <div>
          <label className="block text-xs font-bold uppercase text-gray-700 mb-1.5">Produk Rekomendasi Terkait</label>
          <select
            value={featuredProductId}
            onChange={(e) => setFeaturedProductId(e.target.value)}
            className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:border-[#C8102E] transition-colors"
          >
            <option value="">-- Tidak ada produk terpaut --</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Timing & Servings */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <div>
          <label className="block text-xs font-bold uppercase text-gray-700 mb-1.5">Prep Time</label>
          <input
            type="text"
            value={prepTime}
            onChange={(e) => setPrepTime(e.target.value)}
            placeholder="15 MIN"
            className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#C8102E]"
          />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase text-gray-700 mb-1.5">Cook Time</label>
          <input
            type="text"
            value={cookTime}
            onChange={(e) => setCookTime(e.target.value)}
            placeholder="30 MIN"
            className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#C8102E]"
          />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase text-gray-700 mb-1.5">Servings</label>
          <input
            type="text"
            value={servings}
            onChange={(e) => setServings(e.target.value)}
            placeholder="4 Porsi"
            className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#C8102E]"
          />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase text-gray-700 mb-1.5">Calories</label>
          <input
            type="text"
            value={calories}
            onChange={(e) => setCalories(e.target.value)}
            placeholder="380 Kalori"
            className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#C8102E]"
          />
        </div>
      </div>

      {/* Description & Image */}
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-bold uppercase text-gray-700 mb-1.5">URL Foto Utama Resep</label>
          <input
            type="url"
            value={mainImage}
            onChange={(e) => setMainImage(e.target.value)}
            placeholder="https://images.unsplash.com/..."
            className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#C8102E]"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase text-gray-700 mb-1.5">Deskripsi Singkat</label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Kisah atau deskripsi ringkas kenikmatan sajian ini..."
            className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#C8102E]"
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
            className="inline-flex items-center gap-1 text-xs font-bold text-[#C8102E] hover:underline cursor-pointer"
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
              className="flex-1 px-3.5 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#C8102E]"
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
            className="inline-flex items-center gap-1 text-xs font-bold text-[#C8102E] hover:underline cursor-pointer"
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
              className="flex-1 px-3.5 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#C8102E]"
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

      {/* Recipe Tips & Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-4 border-t border-gray-100">
        <div>
          <label className="block text-xs font-bold uppercase text-gray-700 mb-1.5">Tips Memasak (Opsional)</label>
          <textarea
            rows={2}
            value={tips}
            onChange={(e) => setTips(e.target.value)}
            placeholder="cth: Tumis bumbu dengan api sedang agar aroma rempah semerbak sempurna..."
            className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#C8102E]"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase text-gray-700 mb-1.5">Status Publikasi</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as 'published' | 'draft')}
            className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:border-[#C8102E]"
          >
            <option value="published">Published (Tampil di Web)</option>
            <option value="draft">Draft (Disembunyikan)</option>
          </select>
        </div>
      </div>
    </form>
  )
}
