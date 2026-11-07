-- ============================================================
-- FIX: Bersihkan "Product Categories" dari recipe_categories_hierarchy
-- Jalankan di Supabase SQL Editor
-- ============================================================

-- LANGKAH 1: Lihat dulu isi sekarang (opsional, untuk verifikasi)
SELECT key, value FROM site_settings
WHERE key IN ('product_categories_hierarchy', 'recipe_categories_hierarchy');

-- LANGKAH 2: Hapus group "Product Categories" dari recipe_categories_hierarchy
-- (hanya hapus group yang namanya 'Product Categories' atau id-nya mengandung 'product-categories')
UPDATE site_settings
SET
  value = (
    SELECT COALESCE(jsonb_agg(elem ORDER BY elem->>'name'), '[]'::jsonb)::text
    FROM jsonb_array_elements(value::jsonb) AS elem
    WHERE
      (elem->>'name') NOT ILIKE '%product categor%'
      AND (elem->>'id') NOT ILIKE '%product-categor%'
  ),
  updated_at = NOW()
WHERE key = 'recipe_categories_hierarchy';

-- LANGKAH 3: Verifikasi hasilnya
SELECT key, value FROM site_settings
WHERE key = 'recipe_categories_hierarchy';

