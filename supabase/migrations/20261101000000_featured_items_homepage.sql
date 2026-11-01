-- ================================================================
-- MIGRATION: Featured Items on Homepage (Products + Recipes)
-- Tanggal: 2026-11-01
-- 
-- Kolom is_featured sudah ada di tabel recipes sejak init_schema.
-- Migration ini TIDAK perlu ALTER TABLE, hanya verifikasi & view helper.
-- ================================================================

-- 1. Verifikasi kolom is_featured ada di tabel recipes
--    (Jika belum ada, jalankan ALTER TABLE ini)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'recipes'
      AND column_name = 'is_featured'
      AND table_schema = 'public'
  ) THEN
    ALTER TABLE public.recipes ADD COLUMN is_featured BOOLEAN DEFAULT false;
    RAISE NOTICE 'Kolom is_featured ditambahkan ke tabel recipes.';
  ELSE
    RAISE NOTICE 'Kolom is_featured sudah ada di tabel recipes. Tidak ada perubahan.';
  END IF;
END
$$;

-- 2. View helper: tampilkan semua featured items (produk + resep) untuk homepage
--    Berguna untuk debugging dari Supabase Dashboard
CREATE OR REPLACE VIEW public.v_featured_homepage AS
  SELECT
    id,
    'product'   AS item_type,
    name        AS display_name,
    slug,
    main_image,
    status,
    is_featured,
    created_at
  FROM public.products
  WHERE is_featured = true AND status = 'published'

  UNION ALL

  SELECT
    id,
    'recipe'    AS item_type,
    title       AS display_name,
    slug,
    main_image,
    status,
    is_featured,
    created_at
  FROM public.recipes
  WHERE is_featured = true AND status = 'published'

  ORDER BY created_at DESC;

-- 3. Pastikan RLS view bisa dibaca publik
-- (view mewarisi RLS tabel asalnya, jadi tidak perlu policy tambahan)

-- 4. Contoh: tandai 2 resep pertama sebagai featured (OPSIONAL - uncomment jika perlu)
-- UPDATE public.recipes
-- SET is_featured = true
-- WHERE id IN (
--   SELECT id FROM public.recipes
--   WHERE status = 'published'
--   ORDER BY created_at DESC
--   LIMIT 2
-- );

-- ================================================================
-- SETELAH MENJALANKAN SQL INI:
-- 1. Buka Admin > Kelola Resep
-- 2. Klik tombol "Taste Heat: Off" pada resep yang ingin ditampilkan
--    di section Featured homepage (maksimal 4 item gabungan produk+resep)
-- 3. Homepage section "TASTE THE HEAT" akan otomatis menampilkan campuran
--    produk featured DAN resep featured
-- ================================================================
