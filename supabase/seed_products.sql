-- SQL Seed Script Valid: 8 Data Dummy Produk AWANG
-- Jalankan di Supabase SQL Editor

-- 1. Buat Kategori Dummy jika belum ada
INSERT INTO public.categories (id, name, slug, description)
VALUES 
  ('c1111111-0000-0000-0000-000000000001', 'Saus & Tomat', 'saus-tomat', 'Aneka saus pilihan keluarga dengan bahan berkualitas tinggi.'),
  ('c1111111-0000-0000-0000-000000000002', 'Bumbu Tabur & Rempah', 'bumbu-tabur', 'Bumbu dan rempah alami untuk menyempurnakan rasa hidangan.'),
  ('c1111111-0000-0000-0000-000000000003', 'Kecap & Dip', 'kecap-dip', 'Kecap manis gurih dan saus celupan istimewa.')
ON CONFLICT (slug) DO NOTHING;

-- 2. Insert 8 Produk Dummy AWANG dengan UUID Heksadesimal Valid
INSERT INTO public.products (
  id,
  name,
  slug,
  category_id,
  short_description,
  description,
  main_image,
  sizes,
  benefits,
  ingredients,
  is_featured,
  status
) VALUES 
(
  '11111111-0000-0000-0000-000000000001',
  'AWANG Tomato Ketchup Original',
  'awang-tomato-ketchup-original',
  'c1111111-0000-0000-0000-000000000001',
  'Saus tomat manis segar dari tomat pilihan alami.',
  'AWANG Tomato Ketchup diproses dari buah tomat matang segar pilihan tanpa pewarna buatan. Memberikan tekstur kental dan rasa asam manis seimbang yang sempurna untuk cocolan kentang, burger, dan hidangan keluarga.',
  'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?q=80&w=800&auto=format&fit=crop',
  '["300g", "500g", "1kg"]'::jsonb,
  '["100% Tomat Asli Alami", "Bebas Pewarna Buatan", "Halal & Alami"]'::jsonb,
  'Tomat segar, gula alami, cuka, garam, rempah-rempah pilihan.',
  true,
  'published'
),
(
  '11111111-0000-0000-0000-000000000002',
  'AWANG Chili Sauce Extra Hot',
  'awang-chili-sauce-extra-hot',
  'c1111111-0000-0000-0000-000000000001',
  'Saus cabai pedas mantap dari cabai merah segar.',
  'Saus cabai ekstra pedas dibuat khusus untuk pecinta pedas sejati. Menggabungkan sensasi pedas gurih dari cabai merah segar pilihan untuk melengkapi setiap gorengan dan camilan favorit.',
  'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=800&auto=format&fit=crop',
  '["300g", "500g"]'::jsonb,
  '["Pedas Alami dari Cabai Segar", "Tanpa Pengawet Berlebih", "Sertifikasi Halal"]'::jsonb,
  'Cabai merah segar, bawang putih, gula, garam, penstabil alami.',
  true,
  'published'
),
(
  '11111111-0000-0000-0000-000000000003',
  'AWANG Barbecue Sauce Smokey Grill',
  'awang-barbecue-sauce-smokey-grill',
  'c1111111-0000-0000-0000-000000000001',
  'Saus BBQ beraroma asap kental untuk marinasi dan olesan.',
  'Saus Barbecue dengan rasa smoky manis gurih khas pemanggangan kayu asli. Sangat cocok untuk marinasi daging sapi, ayam bakar, rusuk panggang, hingga sosis bakar.',
  'https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=800&auto=format&fit=crop',
  '["350g", "500g"]'::jsonb,
  '["Aroma Asap Alami", "Cocok untuk Marinasi & Dip", "Rasa Gurih Kaya Rempah"]'::jsonb,
  'Pasta tomat, gula merah, cuka, aroma asap alami, bawang merah, mustard, rempah.',
  true,
  'published'
),
(
  '11111111-0000-0000-0000-000000000004',
  'AWANG All-Purpose Seasoning Powder',
  'awang-all-purpose-seasoning-powder',
  'c1111111-0000-0000-0000-000000000002',
  'Bumbu tabur serbaguna penambah gurih segala hidangan.',
  'Racikan bumbu tabur serbaguna dari rempah nusantara pilihan. Cukup taburkan satu sendok pada sup, tumisan, atau gorengan untuk kelezatan istimewa seketika.',
  'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=800&auto=format&fit=crop',
  '["150g", "250g"]'::jsonb,
  '["Praktis & Ekonomis", "Rasa Gurih Alami", "Cocok untuk Semua Masakan"]'::jsonb,
  'Garam, bawang putih bubuk, merica, lada putih, ekstrak ragi, rempah alami.',
  true,
  'published'
),
(
  '11111111-0000-0000-0000-000000000005',
  'AWANG Premium Soy Sauce',
  'awang-premium-soy-sauce',
  'c1111111-0000-0000-0000-000000000003',
  'Kecap manis gurih fermentasi kedelai hitam pilihan.',
  'Dibuat dari fermentasi kedelai hitam berkualitas tinggi dan gula aren murni. Menghasilkan rasa manis legit beraroma wangi khas yang meresap sempurna.',
  'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=800&auto=format&fit=crop',
  '["350ml", "600ml"]'::jsonb,
  '["Kedelai Hitam Pilihan", "Kental & Legit", "Warna Hitam Pekat Alami"]'::jsonb,
  'Kedelai hitam, gula aren, air, garam, rempah-rempah.',
  true,
  'published'
),
(
  '11111111-0000-0000-0000-000000000006',
  'AWANG Sweet Chili Sauce Thai Style',
  'awang-sweet-chili-sauce-thai-style',
  'c1111111-0000-0000-0000-000000000001',
  'Saus asam manis pedas khas gaya Thailand.',
  'Kombinasi rasa manis legit, asam segar, dan sentuhan pedas lembut dengan bulir cabai asli. Pas sebagai saus celupan dimsum, lumpia, dan ayam goreng renyah.',
  'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?q=80&w=800&auto=format&fit=crop',
  '["300g", "500g"]'::jsonb,
  '["Rasa Asam Manis Segar", "Potongan Cabai Asli", "Cocok untuk Camilan & Dimsum"]'::jsonb,
  'Gula, air, cabai merah, asam jawa, garam, bawang putih.',
  true,
  'published'
),
(
  '11111111-0000-0000-0000-000000000007',
  'AWANG Garlic & Herb Seasoning',
  'awang-garlic-and-herb-seasoning',
  'c1111111-0000-0000-0000-000000000002',
  'Bumbu tabur racikan bawang putih & daun herba wangi.',
  'Perpaduan harum bawang putih gurih dan racikan oregano, parsley, serta rosemary. Cocok untuk pasta, garlic bread, kentang panggang, dan steak.',
  'https://images.unsplash.com/photo-1532336414038-cf19250c5757?q=80&w=800&auto=format&fit=crop',
  '["100g", "200g"]'::jsonb,
  '["Harum Herba Alami", "Tanpa MSG Tambahan", "Kemasan Botol Praktis"]'::jsonb,
  'Bawang putih bubuk, oregano, parsley, thyme, garam laut.',
  true,
  'published'
),
(
  '11111111-0000-0000-0000-000000000008',
  'AWANG Honey Mustard Dip',
  'awang-honey-mustard-dip',
  'c1111111-0000-0000-0000-000000000003',
  'Saus mustard krim manis madu murni istimewa.',
  'Perpaduan kelezatan biji mustard pilihan dan kemanisan madu asli. Memberikan cita rasa creamy manis gurih yang pas untuk salad dressing dan cocolan sosis.',
  'https://images.unsplash.com/photo-1514944298341-9880e65a852e?q=80&w=800&auto=format&fit=crop',
  '["250g", "450g"]'::jsonb,
  '["Madu Asli Murni", "Tekstur Creamy Lembut", "Rasa Manis Gurih Unik"]'::jsonb,
  'Biji mustard, madu murni, cuka apel, minyak nabati, garam.',
  true,
  'published'
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  category_id = EXCLUDED.category_id,
  short_description = EXCLUDED.short_description,
  description = EXCLUDED.description,
  main_image = EXCLUDED.main_image,
  sizes = EXCLUDED.sizes,
  benefits = EXCLUDED.benefits,
  ingredients = EXCLUDED.ingredients,
  is_featured = EXCLUDED.is_featured,
  status = EXCLUDED.status;
