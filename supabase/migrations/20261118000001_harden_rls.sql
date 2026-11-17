-- Migration: Harden Row Level Security (RLS) & Policies
-- Pastikan supabase/manual/seed_admin.sql sudah dijalankan terlebih dahulu!

BEGIN;

-- 1. Guard anti-lockout: batalkan transaksi jika admin_users masih kosong
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.admin_users) THEN
    RAISE EXCEPTION 'admin_users kosong. Jalankan supabase/manual/seed_admin.sql dulu.';
  END IF;
END $$;

-- 2. Pastikan RLS aktif di cashflow_transactions dan seluruh tabel
ALTER TABLE IF EXISTS public.cashflow_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.product_specifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.quote_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.product_views ENABLE ROW LEVEL SECURITY;

-- 3. Hapus policy Admin lama yang tidak membatasi role ("Admin Full Access%")
DO $$
DECLARE
  pol RECORD;
BEGIN
  FOR pol IN
    SELECT schemaname, tablename, policyname
    FROM pg_policies
    WHERE schemaname = 'public' AND policyname LIKE 'Admin Full Access%'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I', pol.policyname, pol.schemaname, pol.tablename);
  END LOOP;
END $$;

-- 4. Buat policy admin_all untuk setiap tabel (hanya untuk authenticated user yang ada di allowlist admin_users)
DO $$
DECLARE
  tbl TEXT;
  tbls TEXT[] := ARRAY[
    'categories', 'brands', 'products', 'product_images', 'product_specifications',
    'testimonials', 'site_settings', 'recipes', 'quote_submissions', 'contact_submissions',
    'cashflow_transactions', 'product_views'
  ];
BEGIN
  FOREACH tbl IN ARRAY tbls LOOP
    EXECUTE format('DROP POLICY IF EXISTS "admin_all" ON public.%I', tbl);
    EXECUTE format(
      'CREATE POLICY "admin_all" ON public.%I FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin())',
      tbl
    );
  END LOOP;
END $$;

-- 5. Perbarui kebijakan baca publik (SELECT)
-- Hapus policy baca publik lama untuk products dan recipes
DROP POLICY IF EXISTS "Public Read Products" ON public.products;
DROP POLICY IF EXISTS "public_read_products" ON public.products;
CREATE POLICY "public_read_products" ON public.products
  FOR SELECT TO anon, authenticated
  USING (status = 'published');

DROP POLICY IF EXISTS "Public Read Recipes" ON public.recipes;
DROP POLICY IF EXISTS "public_read_recipes" ON public.recipes;
CREATE POLICY "public_read_recipes" ON public.recipes
  FOR SELECT TO anon, authenticated
  USING (status = 'published');

-- Pastikan policy baca publik untuk konten umum tetap aktif
DROP POLICY IF EXISTS "Public Read Categories" ON public.categories;
CREATE POLICY "public_read_categories" ON public.categories FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Public Read Brands" ON public.brands;
CREATE POLICY "public_read_brands" ON public.brands FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Public Read Product Images" ON public.product_images;
CREATE POLICY "public_read_product_images" ON public.product_images FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Public Read Product Specs" ON public.product_specifications;
CREATE POLICY "public_read_product_specs" ON public.product_specifications FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Public Read Testimonials" ON public.testimonials;
CREATE POLICY "public_read_testimonials" ON public.testimonials FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Public Read Site Settings" ON public.site_settings;
CREATE POLICY "public_read_site_settings" ON public.site_settings FOR SELECT TO anon, authenticated USING (true);

-- 6. Form submissions publik: hanya INSERT dengan validasi panjang dan status dipaksa 'new'
DROP POLICY IF EXISTS "Public Insert Quote Submissions" ON public.quote_submissions;
DROP POLICY IF EXISTS "public_insert_quote" ON public.quote_submissions;
CREATE POLICY "public_insert_quote" ON public.quote_submissions
  FOR INSERT TO anon, authenticated
  WITH CHECK (
    status = 'new'
    AND char_length(trim(name)) BETWEEN 1 AND 100
    AND char_length(trim(email)) BETWEEN 3 AND 254
    AND (phone IS NULL OR char_length(trim(phone)) <= 100)
    AND (company IS NULL OR char_length(trim(company)) <= 255)
    AND (message IS NULL OR char_length(trim(message)) <= 2000)
  );

DROP POLICY IF EXISTS "Public Insert Contact Submissions" ON public.contact_submissions;
DROP POLICY IF EXISTS "public_insert_contact" ON public.contact_submissions;
CREATE POLICY "public_insert_contact" ON public.contact_submissions
  FOR INSERT TO anon, authenticated
  WITH CHECK (
    status = 'new'
    AND char_length(trim(name)) BETWEEN 1 AND 100
    AND char_length(trim(email)) BETWEEN 3 AND 254
    AND (subject IS NULL OR char_length(trim(subject)) <= 255)
    AND char_length(trim(message)) BETWEEN 1 AND 2000
  );

DROP POLICY IF EXISTS "Public Insert Product Views" ON public.product_views;
DROP POLICY IF EXISTS "public_insert_product_views" ON public.product_views;
CREATE POLICY "public_insert_product_views" ON public.product_views
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

-- 7. Storage Policies
DROP POLICY IF EXISTS "Public Access Product Images" ON storage.objects;
DROP POLICY IF EXISTS "Auth Upload Product Images" ON storage.objects;
DROP POLICY IF EXISTS "Auth Update Product Images" ON storage.objects;
DROP POLICY IF EXISTS "Auth Delete Product Images" ON storage.objects;
DROP POLICY IF EXISTS "assets_admin_all" ON storage.objects;

CREATE POLICY "assets_admin_all" ON storage.objects
  FOR ALL TO authenticated
  USING (
    bucket_id IN ('product-images', 'product-thumbnails', 'product-gallery', 'brand-logos')
    AND public.is_admin()
  )
  WITH CHECK (
    bucket_id IN ('product-images', 'product-thumbnails', 'product-gallery', 'brand-logos')
    AND public.is_admin()
  );

UPDATE storage.buckets
SET file_size_limit = 1048576, -- 1MB
    allowed_mime_types = ARRAY['image/webp','image/jpeg','image/png','image/avif']
WHERE id IN ('product-images', 'product-thumbnails', 'product-gallery', 'brand-logos');

COMMIT;
