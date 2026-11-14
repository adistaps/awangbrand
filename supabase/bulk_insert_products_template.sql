-- ==============================================================================
-- TEMPLATE BULK INSERT / UPDATE PRODUK AWANG LENGKAP (SUPABASE SQL)
-- Disertai Remark & Card "Tips!" di bawah Remark
-- ==============================================================================
-- Petunjuk Penggunaan:
-- 1. Buka Supabase Dashboard -> SQL Editor -> Klik "New query".
-- 2. Salin seluruh isi file ini atau sesuaikan data produk & tips Anda.
-- 3. Klik "Run".
-- 4. Script ini otomatis:
--    - Meng-upsert data produk ke tabel public.products
--    - Meng-upsert spesifikasi "Remark" (accordion) dan "Tips" (box oranye di bawah Remark)
--      ke tabel public.product_specifications
-- ==============================================================================

-- ==============================================================================
-- BAGIAN 1: INSERT / UPDATE DATA UTAMA PRODUK
-- ==============================================================================
INSERT INTO public.products (
  name,
  slug,
  short_description,
  description,
  sizes,
  ingredients,
  how_to_use,
  main_image,
  shopee_url,
  tokopedia_url,
  lazada_url,
  is_featured,
  is_carousel,
  status,
  nutritional_facts
) VALUES
-- ==============================================================================
-- PRODUK 1: Base Paste (Sambal Ayam Penyet)
-- ==============================================================================
(
  'Sambal Ayam Penyet Base Paste',
  'sambal-ayam-penyet-base-paste',
  'Pes asas masakan Sambal Ayam Penyet autentik dengan ramuan asli segar.',
  'Nikmati keenakan sambal ayam penyet asli khas AWANG Brand yang pedas, beraroma dan menyelerakan. Dihasilkan daripada adunan cili segar dan rempah terpilih.',
  ARRAY['180g', '1kg'],
  'Cili merah segar, cili padi, bawang merah, bawang putih, tomato, belacan, garam, gula, dan minyak sayuran.',
  '1. Panaskan sedikit minyak dalam kuali.
2. Tumis pes sehingga naik bau dan pecah minyak.
3. Gaul bersama ayam goreng atau makanan laut pilihan anda.
4. Sedia untuk dihidangkan panas bersama ulam-ulaman.',
  'https://nvigwjlejzggkfqjqnxs.supabase.co/storage/v1/object/public/product-thumbnails/1794054601006-nwd99pscfpg.webp',
  'https://shopee.com.my',
  'https://tokopedia.com',
  'https://lazada.com.my',
  false,
  true,
  'published',
  jsonb_build_object(
    'category_ids', jsonb_build_array('cat-product-categories', 'cat-cooking-occasion', 'cat-product-features'),
    'subcategory_ids', jsonb_build_array('sub-paste', 'sub-everyday-meals', 'sub-ready-to-cook')
  )
),

-- ==============================================================================
-- PRODUK 2: Base Paste (Lemak Cili Padi)
-- ==============================================================================
(
  'Lemak Cili Padi Recipe Base Paste',
  'lemak-cili-padi-recipe-base-paste',
  'Pes ramuan asas Lemak Cili Padi pekat berlemak dan pedas memikat.',
  'Pes Lemak Cili Padi AWANG Brand menggabungkan kepekatan santan dengan kepedasan cili padi yang istimewa. Menghasilkan masakan lemak berkrim yang kaya rasa, sesuai untuk nangka muda, ikan, ayam, atau udang.',
  ARRAY['180g', '1kg'],
  'Cili padi segar, cili merah, bawang merah, bawang putih, serai, kunyit hidup, lengkuas, daun limau purut, garam, santan pekat, minyak sayuran.',
  '1. Tumis pes AWANG Lemak Cili Padi sehingga wangi.
2. Tuangkan 200ml santan dan kacau rata.
3. Masukkan bahan utama (ayam/daging/ikan/nangka muda).
4. Masak atas api perlahan sehingga kuah pekat menyelerakan.
5. Hidang bersama nasi panas.',
  'https://nvigwjlejzggkfqjqnxs.supabase.co/storage/v1/object/public/product-thumbnails/1794054644623-107aotv0r8om.webp',
  'https://shopee.com.my',
  NULL,
  'https://lazada.com.my',
  true,
  true,
  'published',
  jsonb_build_object(
    'category_ids', jsonb_build_array('cat-product-categories', 'cat-cooking-occasion', 'cat-product-features'),
    'subcategory_ids', jsonb_build_array('sub-paste', 'sub-everyday-meals', 'sub-ready-to-cook')
  )
)
ON CONFLICT (slug) DO UPDATE
SET
  name = EXCLUDED.name,
  short_description = EXCLUDED.short_description,
  description = EXCLUDED.description,
  sizes = EXCLUDED.sizes,
  ingredients = EXCLUDED.ingredients,
  how_to_use = EXCLUDED.how_to_use,
  main_image = COALESCE(EXCLUDED.main_image, public.products.main_image),
  shopee_url = EXCLUDED.shopee_url,
  tokopedia_url = EXCLUDED.tokopedia_url,
  lazada_url = EXCLUDED.lazada_url,
  is_featured = EXCLUDED.is_featured,
  is_carousel = EXCLUDED.is_carousel,
  status = EXCLUDED.status,
  nutritional_facts = EXCLUDED.nutritional_facts,
  updated_at = NOW();


-- ==============================================================================
-- BAGIAN 2: INSERT / UPDATE REMARK & TIPS (Tabel product_specifications)
-- ==============================================================================
-- Keterangan:
-- - spec_key = 'Remark' -> Muncul di accordion "Remark"
-- - spec_key = 'Tips'   -> Muncul di accordion "Tips!" di bawah Remark
-- ==============================================================================

-- 1. Hapus entri Remark & Tips lama untuk produk di atas agar tidak terjadi duplikasi
DELETE FROM public.product_specifications
WHERE product_id IN (
  SELECT id FROM public.products WHERE slug IN ('sambal-ayam-penyet-base-paste', 'lemak-cili-padi-recipe-base-paste')
)
AND spec_key IN ('Remark', 'Tips');

-- 2. Masukkan Remark & Tips terbaru
INSERT INTO public.product_specifications (product_id, spec_key, spec_value, sort_order)
VALUES
-- Tips & Remark untuk 'Sambal Ayam Penyet Base Paste'
(
  (SELECT id FROM public.products WHERE slug = 'sambal-ayam-penyet-base-paste'),
  'Remark',
  '100% Bahan Semulajadi | Tanpa Pengawet Tiruan | Halal JAKIM Certified',
  0
),
(
  (SELECT id FROM public.products WHERE slug = 'sambal-ayam-penyet-base-paste'),
  'Tips',
  'Pes Ramuan Asas Sambal Ayam Penyet Awang Brand boleh juga digunakan untuk makanan laut, daging, telur dan sayuran.

Awang Brand Sambal Ayam Penyet Base Paste can be used for seafood, meat, egg and vegetables.',
  1
),

-- Tips & Remark untuk 'Lemak Cili Padi Recipe Base Paste'
(
  (SELECT id FROM public.products WHERE slug = 'lemak-cili-padi-recipe-base-paste'),
  'Remark',
  '100% Bahan Semulajadi | Tanpa Pengawet Tiruan | Halal JAKIM Certified',
  0
),
(
  (SELECT id FROM public.products WHERE slug = 'lemak-cili-padi-recipe-base-paste'),
  'Tips',
  'Untuk kuah lemak yang lebih pekat dan beraroma, tambahkan sedikit daun kunyit yang dicarik halus semasa mereneh.

For a richer and more aromatic gravy, add finely sliced turmeric leaves while simmering.',
  1
);
