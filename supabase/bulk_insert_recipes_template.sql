-- ==============================================================================
-- TEMPLATE BULK INSERT RESEP KE SUPABASE (AWANG BRAND)
-- ==============================================================================
-- Petunjuk Penggunaan:
-- 1. Buka Supabase Dashboard -> SQL Editor -> Klik "New query".
-- 2. Salin seluruh isi query di bawah ini, atau modifikasi daftar resep sesuai kebutuhan.
-- 3. Klik tombol "Run" di Supabase.
-- ==============================================================================

-- DAFTAR REFERENSI ID KATEGORI & SUBKATEGORI (Bisa dipilih untuk category_ids & subcategory_ids):
-- ------------------------------------------------------------------------------
-- 1. Tab "What are you cooking?" (ID: 'rcat-what-are-you-cooking')
--    - 'rsub-chicken'       : Chicken
--    - 'rsub-seafood'       : Seafood
--    - 'rsub-beef'          : Beef
--    - 'rsub-vegetables'    : Vegetables
--    - 'rsub-rice-noodles'  : Rice & Noodles
--
-- 2. Tab "Flavour & Taste" (ID: 'rcat-flavour-taste')
--    - 'rsub-spicy-fiery'        : Spicy & Fiery
--    - 'rsub-rich-savoury'       : Rich & Savoury
--    - 'rsub-tangy-zesty'        : Tangy & Zesty
--    - 'rsub-creamy-aromatic'    : Creamy & Aromatic
--    - 'rsub-traditional-sambal' : Traditional Sambal
--
-- 3. Tab "Meal Inspiration" (ID: 'rcat-meal-inspiration')
--    - 'rsub-main-dishes'        : Main Dishes
--    - 'rsub-sambal-sides'       : Sambal & Sides
--    - 'rsub-ready-to-eat'       : Ready to Eat
--    - 'rsub-one-pot-meals'      : One Pot Meals
--    - 'rsub-sharing-gatherings' : Sharing & Gatherings
--
-- DAFTAR REFERENSI PRODUK AWANG (Untuk featured_product_id):
-- ------------------------------------------------------------------------------
-- '11111111-0000-0000-0000-000000000001' : Asam Pedas Recipe Base Paste
-- 'a053f61c-7b85-4ec2-ac19-12395a18fe17' : Ayam Bali Recipe Base Paste
-- 'edacdb2e-cce2-49cb-89e2-004f1eb7310f' : Ayam Bawang Recipe Base Paste
-- '11111111-0000-0000-0000-000000000008' : Lemak Cili Padi Recipe Base Paste
-- 'bd2c8401-8755-4aa8-a3fa-64437524aa27' : Rendang Recipe Base Paste
-- '5e849d3a-3f79-4fea-b7e9-e265be8ae4fb' : Sambal Balado Hijau Recipe Base Paste
-- '11111111-0000-0000-0000-000000000002' : Sambal Balado Merah Recipe Base Paste
-- '97e2f6ca-1ca8-4cb9-b02f-ccdf23eb5464' : Sambal Padang Recipe Base Paste
-- '11111111-0000-0000-0000-000000000007' : Sambal Tumis Recipe Base Paste
-- '5224900a-4035-4629-bdfa-9d34bd65e157' : Cili Kering Kisar Legend
-- '661cb22c-7047-4203-b858-ed38957de1bb' : Daging Goreng Kicap Berempah
-- '11665864-f3ea-4a91-ad48-34273dc69786' : Bites Ayam Sambal Lada Letop
-- '30fab684-2631-45a3-aac9-baaf45850453' : Bites Ayam Sambal Pedas Lemak Manis
-- '3868f877-9f4e-4877-a7ab-f1a74b5c7abd' : Bites Bebola Ayam Sambal
-- '0fa0ac48-41bf-41a3-a955-7d194c9e6cdf' : Bites Bebola Daging Sambal
-- 'cd91b50d-feba-4bd5-9524-84268b734411' : Bites Sotong Sambal Cili Kaw
-- 'd1199b34-74d0-4e75-bfb5-9c5eabb0194b' : Bites Udang Sambal Berapi
-- '5725f68b-c295-4b8a-9506-0e9787786488' : Pedazz Limau Lestari Hijau
-- '8e66d44b-c2e0-4cca-8f6a-b674c45d0cb2' : Pedazz Limau Lestari Merah
-- 'c3096ca2-7e90-4003-805b-83265f10a60e' : Pedazz Sambal Seri Rasa
-- '6f1409b9-ec70-40f2-9412-79e704c26c12' : Pedazz Sambal Warisan Tok
-- ==============================================================================

INSERT INTO public.recipes (
  title,
  slug,
  category,
  prep_time,
  cook_time,
  servings,
  difficulty,
  calories,
  description,
  main_image,
  ingredients,
  instructions,
  tips,
  featured_product_id,
  is_featured,
  status,
  category_ids,
  subcategory_ids
) VALUES
-- ==============================================================================
-- CONTOH RESEP 1
-- ==============================================================================
(
  'Ayam Masak Lemak Cili Padi AWANG',                                 -- title
  'ayam-masak-lemak-cili-padi-awang',                                 -- slug (unik, huruf kecil & tanda hubung)
  'Main Course',                                                      -- category
  '15 MIN',                                                           -- prep_time
  '25 MIN',                                                           -- cook_time
  '4 Servings',                                                       -- servings
  'Easy',                                                             -- difficulty ('Easy', 'Medium', 'Hard')
  '420 Calories',                                                     -- calories
  'Hidangan autentik Negeri Sembilan dengan kuah pekat berlemak dan kepedasan cili padi yang mantap.', -- description
  'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?auto=format&fit=crop&w=800&q=80',  -- main_image
  ARRAY[                                                              -- ingredients (text[])
    '1 pek Pes Lemak Cili Padi AWANG (180g)',
    '1/2 ekor ayam (dipotong sederhana)',
    '200ml santan pekat',
    '1 cawan air',
    '1 batang serai (dititik)',
    '1 helai daun kunyit (disiat)'
  ],
  ARRAY[                                                              -- instructions (text[])
    'Panaskan kuali, masukkan Pes Lemak Cili Padi AWANG bersama ayam dan serai.',
    'Gaul rata atas api sederhana sehingga ayam kecut dan mengeluarkan jusnya.',
    'Masukkan air dan biarkan mendidih sehingga ayam separuh empuk.',
    'Kecilkan api, tuangkan santan pekat perlahan-lahan sambil dikacau berterusan agar kuah tidak pecah minyak.',
    'Taburkan hirisan daun kunyit dan renehkan selama 5 minit sehingga kuah pekat menyelerakan. Sedia dihidang bersama nasi panas.'
  ],
  'Gunakan api perlahan selepas santan dimasukkan sambil sentiasa dikacau supaya kuah santan cantik dan berkrim.', -- tips
  '11111111-0000-0000-0000-000000000008',                             -- featured_product_id (Lemak Cili Padi)
  true,                                                               -- is_featured (tampil di seksi unggulan)
  'published',                                                        -- status ('published' atau 'draft')
  ARRAY['rcat-what-are-you-cooking', 'rcat-flavour-taste', 'rcat-meal-inspiration'], -- category_ids
  ARRAY['rsub-chicken', 'rsub-creamy-aromatic', 'rsub-main-dishes']   -- subcategory_ids
),

-- ==============================================================================
-- CONTOH RESEP 2
-- ==============================================================================
(
  'Ikan Pari Asam Pedas Melaka AWANG',
  'ikan-pari-asam-pedas-melaka-awang',
  'Main Course',
  '10 MIN',
  '20 MIN',
  '3-4 Servings',
  'Easy',
  '340 Calories',
  'Resipi Asam Pedas Melaka turun-temurun dengan rasa masam, pedas dan haruman daun kesum yang membuka selera.',
  'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80',
  ARRAY[
    '1 pek Pes Asam Pedas AWANG (180g)',
    '500g ikan pari (dibersihkan dengan asam jawa)',
    '4 batang bendi',
    '1 kuntum bunga kantan (dibelah dua)',
    '1 ikat daun kesum',
    '2 cawan air'
  ],
  ARRAY[
    'Panaskan periuk, tumis Pes Asam Pedas AWANG selama 1-2 minit sehingga wangi.',
    'Tuangkan air dan masukkan bunga kantan serta daun kesum. Biarkan kuah mendidih.',
    'Masukkan potongan ikan pari dan bendi. Renihkan dengan api sederhana selama 10 minit.',
    'Bila ikan masak empuk dan bendi lembut, padamkan api dan hidangkan.'
  ],
  'Bilas ikan dengan air perahan asam jawa atau limau nipis terlebih dahulu untuk menghilangkan bau hanyir ikan pari.',
  '11111111-0000-0000-0000-000000000001', -- featured_product_id (Asam Pedas)
  false,
  'published',
  ARRAY['rcat-what-are-you-cooking', 'rcat-flavour-taste', 'rcat-meal-inspiration'],
  ARRAY['rsub-seafood', 'rsub-tangy-zesty', 'rsub-one-pot-meals']
),

-- ==============================================================================
-- CONTOH RESEP 3
-- ==============================================================================
(
  'Rendang Daging Tok Warisan AWANG',
  'rendang-daging-tok-warisan-awang',
  'Main Course',
  '20 MIN',
  '45 MIN',
  '5-6 Servings',
  'Medium',
  '480 Calories',
  'Rendang daging pekat berkerisik dengan ramuan rempah asli AWANG yang meresap sempurna ke serat daging.',
  'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
  ARRAY[
    '1 pek Pes Rendang AWANG (180g)',
    '600g daging batang pinang (dihiris)',
    '150ml santan pekat',
    '2 sudu besar kerisik kelapa',
    '1 helai daun kunyit (dihiris halus)',
    '1 cawan air'
  ],
  ARRAY[
    'Masukkan Pes Rendang AWANG dan hirisan daging ke dalam kuali.',
    'Masak sehingga daging mengeluarkan jus dan empuk.',
    'Masukkan santan, air, dan kerisik. Kacau rata dan masak atas api perlahan.',
    'Biarkan kuah mereneh sehingga pekat, berminyak, dan bertukar warna gelap.',
    'Taburkan daun kunyit sebelum diangkat.'
  ],
  'Untuk daging yang lebih empuk dalam waktu singkat, gunakan potongan daging batang pinang (tenderloin).',
  'bd2c8401-8755-4aa8-a3fa-64437524aa27', -- featured_product_id (Rendang Recipe Base Paste)
  true,
  'published',
  ARRAY['rcat-what-are-you-cooking', 'rcat-flavour-taste', 'rcat-meal-inspiration'],
  ARRAY['rsub-beef', 'rsub-rich-savoury', 'rsub-main-dishes']
)
ON CONFLICT (slug) DO UPDATE 
SET
  title = EXCLUDED.title,
  category = EXCLUDED.category,
  prep_time = EXCLUDED.prep_time,
  cook_time = EXCLUDED.cook_time,
  servings = EXCLUDED.servings,
  difficulty = EXCLUDED.difficulty,
  calories = EXCLUDED.calories,
  description = EXCLUDED.description,
  main_image = EXCLUDED.main_image,
  ingredients = EXCLUDED.ingredients,
  instructions = EXCLUDED.instructions,
  tips = EXCLUDED.tips,
  featured_product_id = EXCLUDED.featured_product_id,
  is_featured = EXCLUDED.is_featured,
  status = EXCLUDED.status,
  category_ids = EXCLUDED.category_ids,
  subcategory_ids = EXCLUDED.subcategory_ids,
  updated_at = NOW();

