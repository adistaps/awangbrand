-- ================================================================
-- MIGRATION: Homepage CMS Settings & Badges
-- Tanggal: 2026-11-02
-- ================================================================

-- 1. Tambah kolom badge & featured_sort ke tabel products
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'featured_badge' AND table_schema = 'public'
  ) THEN
    ALTER TABLE public.products ADD COLUMN featured_badge VARCHAR(50) DEFAULT NULL; -- 'trending' | 'favorite' | null
    RAISE NOTICE 'Kolom featured_badge ditambahkan ke products.';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'featured_sort' AND table_schema = 'public'
  ) THEN
    ALTER TABLE public.products ADD COLUMN featured_sort INT DEFAULT 0;
    RAISE NOTICE 'Kolom featured_sort ditambahkan ke products.';
  END IF;
END
$$;

-- 2. Tambah kolom badge & featured_sort ke tabel recipes
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'recipes' AND column_name = 'featured_badge' AND table_schema = 'public'
  ) THEN
    ALTER TABLE public.recipes ADD COLUMN featured_badge VARCHAR(50) DEFAULT NULL; -- 'trending' | 'favorite' | null
    RAISE NOTICE 'Kolom featured_badge ditambahkan ke recipes.';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'recipes' AND column_name = 'featured_sort' AND table_schema = 'public'
  ) THEN
    ALTER TABLE public.recipes ADD COLUMN featured_sort INT DEFAULT 0;
    RAISE NOTICE 'Kolom featured_sort ditambahkan ke recipes.';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'recipes' AND column_name = 'home_carousel_sort' AND table_schema = 'public'
  ) THEN
    ALTER TABLE public.recipes ADD COLUMN home_carousel_sort INT DEFAULT 0;
    RAISE NOTICE 'Kolom home_carousel_sort ditambahkan ke recipes.';
  END IF;
END
$$;

-- 3. Inisialisasi setting TikTok di site_settings jika belum ada
INSERT INTO public.site_settings (key, value, updated_at)
VALUES (
  'homepage_tiktok_videos',
  '[
    {"id":"7611107188828065044","url":"https://www.tiktok.com/@awangbrand_official/video/7611107188828065044","title":"AWANG Brand Official Video 1"},
    {"id":"7204052765557918982","url":"https://www.tiktok.com/@awangbrand_official/video/7204052765557918982","title":"AWANG Brand Official Video 2"},
    {"id":"7696464259382824244","url":"https://www.tiktok.com/@awangbrand_official/video/7696464259382824244","title":"AWANG Brand Official Video 3"},
    {"id":"7696463884009655604","url":"https://www.tiktok.com/@awangbrand_official/video/7696463884009655604","title":"AWANG Brand Official Video 4"},
    {"id":"7693494568842448129","url":"https://www.tiktok.com/@awangbrand_official/video/7693494568842448129","title":"AWANG Brand Official Video 5"}
  ]',
  NOW()
)
ON CONFLICT (key) DO NOTHING;

-- Inisialisasi judul/deskripsi section homepage di site_settings
INSERT INTO public.site_settings (key, value, updated_at)
VALUES 
  ('homepage_taste_the_heat_title', 'TASTE THE HEAT', NOW()),
  ('homepage_cook_good_title', 'COOK SOMETHING GOOD', NOW()),
  ('homepage_cook_good_subtitle', 'Resep pilihan istimewa yang mudah dibuat di rumah dengan produk AWANG.', NOW()),
  ('homepage_tiktok_title', 'IKUTI KAMI DI TIKTOK', NOW()),
  ('homepage_tiktok_subtitle', '@awangbrand_official — Inspirasi resep lezat, kreasi masakan & keseruan dapur AWANG', NOW()),
  ('homepage_tiktok_account_url', 'https://www.tiktok.com/@awangbrand_official', NOW())
ON CONFLICT (key) DO NOTHING;
