-- ==============================================================================
-- MIGRATION & SEED SCRIPT UNTUK DETAIL PRODUK DAN MARKETPLACE AWANG BRAND
-- Jalankan skrip ini di Supabase SQL Editor
-- ==============================================================================

-- 1. Tambahkan kolom link e-commerce & marketplace ke tabel products
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS shopee_url TEXT,
ADD COLUMN IF NOT EXISTS tokopedia_url TEXT,
ADD COLUMN IF NOT EXISTS lazada_url TEXT;

-- 2. Pastikan tabel product_specifications ada untuk menyimpan spesifikasi dinamis
CREATE TABLE IF NOT EXISTS public.product_specifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  spec_key TEXT NOT NULL,
  spec_value TEXT NOT NULL,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Hapus data spesifikasi lama untuk reseeding ulang yang bersih
DELETE FROM public.product_specifications 
WHERE product_id IN (
  '11111111-0000-0000-0000-000000000001',
  '11111111-0000-0000-0000-000000000002',
  '11111111-0000-0000-0000-000000000003',
  '11111111-0000-0000-0000-000000000004',
  '11111111-0000-0000-0000-000000000005',
  '11111111-0000-0000-0000-000000000006',
  '11111111-0000-0000-0000-000000000007',
  '11111111-0000-0000-0000-000000000008'
);

-- 4. Update data produk dengan URL E-Commerce Asli & Deskripsi Lengkap
UPDATE public.products SET 
  shopee_url = 'https://shopee.co.id/search?keyword=awang%20brand',
  tokopedia_url = 'https://www.tokopedia.com/search?q=awang%20brand',
  lazada_url = 'https://www.lazada.co.id/catalog/?q=awang%20brand'
WHERE status = 'published';

-- 5. Insert Spesifikasi Dinamis per Produk ke Tabel product_specifications

-- Produk 1: AWANG Tomato Ketchup Original
INSERT INTO public.product_specifications (product_id, spec_key, spec_value, sort_order) VALUES
('11111111-0000-0000-0000-000000000001', 'Ingredients', 'Tomat segar pilihan, gula alami, cuka beras, garam, rempah-rempah alami', 1),
('11111111-0000-0000-0000-000000000001', 'Tips', 'Sangat cocok untuk cocolan kentang goreng, burger, hotdog, serta bumbu tumisan manis.', 2),
('11111111-0000-0000-0000-000000000001', 'Storage', 'Simpan di tempat sejuk dan kering. Masukkan ke lemari es setelah dibuka.', 3),
('11111111-0000-0000-0000-000000000001', 'Packing Size', '300g, 500g, 1kg', 4),
('11111111-0000-0000-0000-000000000001', 'Remark', '100% Tomat Asli Alami, Tanpa Pewarna Buatan, Sertifikasi HALAL MUI & Jakim', 5);

-- Produk 2: AWANG Chili Sauce Extra Hot
INSERT INTO public.product_specifications (product_id, spec_key, spec_value, sort_order) VALUES
('11111111-0000-0000-0000-000000000002', 'Ingredients', 'Cabai merah segar pilihan, bawang putih, gula alami, garam, cuka, penstabil alami', 1),
('11111111-0000-0000-0000-000000000002', 'Tips', 'Kombinasi sempurna untuk dimsum, gorengan renyah, mie goreng, dan mi instant.', 2),
('11111111-0000-0000-0000-000000000002', 'Storage', 'Simpan dalam wadah tertutup di tempat sejuk atau lemari es.', 3),
('11111111-0000-0000-0000-000000000002', 'Packing Size', '300g, 500g', 4),
('11111111-0000-0000-0000-000000000002', 'Remark', 'Sensasi Pedas Alami dari Cabai Segar, Tanpa Pengawet Buatan, HALAL', 5);

-- Produk 3: AWANG Barbecue Sauce Smokey Grill
INSERT INTO public.product_specifications (product_id, spec_key, spec_value, sort_order) VALUES
('11111111-0000-0000-0000-000000000003', 'Ingredients', 'Pasta tomat, gula merah aren, cuka apel, ekstrak asap alami, bawang merah, mustard, rempah', 1),
('11111111-0000-0000-0000-000000000003', 'Tips', 'Oleskan pada daging sapi, ayam, atau sosis 5 menit sebelum selesai dipanggang.', 2),
('11111111-0000-0000-0000-000000000003', 'Storage', 'Simpan di lemari es setelah kemasan dibuka agar aroma smokey tetap terjaga.', 3),
('11111111-0000-0000-0000-000000000003', 'Packing Size', '350g, 500g', 4),
('11111111-0000-0000-0000-000000000003', 'Remark', 'Aroma Asap Kayu Alami, Cocok untuk Marinasi & Dip, Sertifikasi HALAL', 5);

-- Produk 4: AWANG All-Purpose Seasoning Powder
INSERT INTO public.product_specifications (product_id, spec_key, spec_value, sort_order) VALUES
('11111111-0000-0000-0000-000000000004', 'Ingredients', 'Garam laut alami, bawang putih bubuk, lada putih, ekstrak ragi, rempah nusantara pilihan', 1),
('11111111-0000-0000-0000-000000000004', 'Tips', 'Taburkan secukupnya pada tumisan sayur, sup, gorengan, atau keripik kentang.', 2),
('11111111-0000-0000-0000-000000000004', 'Storage', 'Pastikan kemasan tertutup rapat agar bumbu tabur tidak menggumpal.', 3),
('11111111-0000-0000-0000-000000000004', 'Packing Size', '150g, 250g', 4),
('11111111-0000-0000-0000-000000000004', 'Remark', 'Praktis Serbaguna, Bebas MSG Buatan Berlebih, HALAL Certified', 5);

-- Produk 5: AWANG Premium Soy Sauce
INSERT INTO public.product_specifications (product_id, spec_key, spec_value, sort_order) VALUES
('11111111-0000-0000-0000-000000000005', 'Ingredients', 'Kedelai hitam organik pilihan, gula aren murni, air, garam laut, rempah-rempah', 1),
('11111111-0000-0000-0000-000000000005', 'Tips', 'Sempurna untuk soto, bumbu tumis nasi goreng, semur daging, dan dipping sauce.', 2),
('11111111-0000-0000-0000-000000000005', 'Storage', 'Simpan pada suhu ruangan terhindar dari paparan sinar matahari langsung.', 3),
('11111111-0000-0000-0000-000000000005', 'Packing Size', '350ml, 600ml', 4),
('11111111-0000-0000-0000-000000000005', 'Remark', 'Fermentasi Kedelai Hitam Alami, Hitam Pekat & Kental Legit, HALAL', 5);
