-- ================================================================
-- SETUP SUPABASE STORAGE BUCKETS & POLICIES
-- Tanggal: 2026-11-01
-- ================================================================

-- 1. Buat bucket 'product-images' jika belum ada
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 2. Buat bucket 'product-thumbnails' jika belum ada
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-thumbnails', 'product-thumbnails', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 3. Buat bucket 'product-gallery' jika belum ada
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-gallery', 'product-gallery', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 4. Buat bucket 'brand-logos' jika belum ada
INSERT INTO storage.buckets (id, name, public)
VALUES ('brand-logos', 'brand-logos', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 5. Kebijakan Akses: Publik bisa membaca (SELECT/GET) semua gambar
DROP POLICY IF EXISTS "Public Access Product Images" ON storage.objects;
CREATE POLICY "Public Access Product Images"
ON storage.objects FOR SELECT
USING (bucket_id IN ('product-images', 'product-thumbnails', 'product-gallery', 'brand-logos'));

-- 6. Kebijakan Akses: Pengguna Terautentikasi (Admin) bisa Upload (INSERT)
DROP POLICY IF EXISTS "Auth Upload Product Images" ON storage.objects;
CREATE POLICY "Auth Upload Product Images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id IN ('product-images', 'product-thumbnails', 'product-gallery', 'brand-logos'));

-- 7. Kebijakan Akses: Pengguna Terautentikasi (Admin) bisa Update & Delete
DROP POLICY IF EXISTS "Auth Update Product Images" ON storage.objects;
CREATE POLICY "Auth Update Product Images"
ON storage.objects FOR UPDATE
USING (bucket_id IN ('product-images', 'product-thumbnails', 'product-gallery', 'brand-logos'));

DROP POLICY IF EXISTS "Auth Delete Product Images" ON storage.objects;
CREATE POLICY "Auth Delete Product Images"
ON storage.objects FOR DELETE
USING (bucket_id IN ('product-images', 'product-thumbnails', 'product-gallery', 'brand-logos'));
