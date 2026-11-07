'use client'

import { useState } from 'react'
import { CategoriesManager } from '@/components/admin/CategoriesManager'
import type { CategoryGroup } from '@/types/database'
import { Package, BookOpen } from 'lucide-react'

export function AdminCategoriesClient({
  productHierarchy = [],
  recipeHierarchy = [],
}: {
  productHierarchy: CategoryGroup[]
  recipeHierarchy: CategoryGroup[]
}) {
  const [activeTab, setActiveTab] = useState<'product' | 'recipe'>('product')

  return (
    <div className="space-y-6">
      {/* Switcher Tab: Produk vs Resep */}
      <div className="flex border-b border-gray-200">
        <button
          type="button"
          onClick={() => setActiveTab('product')}
          className={`flex items-center gap-2 py-3 px-6 text-sm font-extrabold border-b-2 transition-all cursor-pointer ${
            activeTab === 'product'
              ? 'border-[#CC0000] text-[#CC0000]'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <Package size={16} />
          <span>Kategori Produk ({productHierarchy.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('recipe')}
          className={`flex items-center gap-2 py-3 px-6 text-sm font-extrabold border-b-2 transition-all cursor-pointer ${
            activeTab === 'recipe'
              ? 'border-[#CC0000] text-[#CC0000]'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <BookOpen size={16} />
          <span>Kategori Resep ({recipeHierarchy.length})</span>
        </button>
      </div>

      {activeTab === 'product' ? (
        <div>
          <div className="mb-4">
            <h2 className="text-base font-bold text-gray-800">Kategori & Subkategori Produk</h2>
            <p className="text-xs text-gray-500">
              Digunakan pada filter katalog produk (/products). Subkategori dapat diberi foto icon lingkaran.
            </p>
          </div>
          <CategoriesManager
            key="product_categories_hierarchy"
            initialHierarchy={productHierarchy}
            settingsKey="product_categories_hierarchy"
            title="Kategori Produk"
          />
        </div>
      ) : (
        <div>
          <div className="mb-4">
            <h2 className="text-base font-bold text-gray-800">Kategori & Subkategori Resep</h2>
            <p className="text-xs text-gray-500">
              Digunakan pada filter halaman resep (/recipes) seperti: &quot;What are you cooking?&quot;, &quot;Flavour &amp; Taste&quot;, &quot;Meal Inspiration&quot;.
            </p>
          </div>
          <CategoriesManager
            key="recipe_categories_hierarchy"
            initialHierarchy={recipeHierarchy}
            settingsKey="recipe_categories_hierarchy"
            title="Kategori Resep"
          />
        </div>
      )}
    </div>
  )
}
