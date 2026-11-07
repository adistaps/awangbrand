-- ==============================================================================
-- SQL MIGRATION / SEED DATA PRODUK AWANG BRAND
-- Jalankan skrip ini langsung di Supabase SQL Editor
-- File sumber gambar di folder: c:\Users\user\Downloads\AWANG\product\
-- (Foto dapat diunggah sendiri nantinya via Admin CMS atau Supabase Storage)
-- ==============================================================================

-- 1. AWANG Cili Kering Kisar Legend
INSERT INTO public.products (
  name,
  slug,
  short_description,
  description,
  main_image,
  sizes,
  ingredients,
  how_to_use,
  status,
  is_featured,
  nutritional_facts
) VALUES (
  'AWANG Cili Kering Kisar Legend',
  'awang-cili-kering-kisar-legend',
  'Cili kering kisar tulen berkualiti tinggi ramuan tradisi legasi masakan Malaysia.',
  'Dihasilkan daripada cili kering bermutu tinggi yang dikisar sempurna tanpa biji berlebihan. Asas masakan serbaguna wajib ada di setiap dapur untuk menaikkan warna merah asli dan kepedasan menyengat dalam pelbagai masakan seperti sambal, tumisan, dan kari.',
  NULL,
  ARRAY['180g', '500g', '1kg'],
  'Cili kering terpilih, air bertapis, minyak kelapa sawit, garam halus semulajadi.',
  'Gunakan terus 2-3 sudu besar ke dalam minyak panas untuk menumis asas sambal, gulai, atau rendang mengikut citarasa.',
  'published',
  false,
  '{"category_ids":["cat-product-categories","cat-cooking-occasion","cat-product-features"],"subcategory_ids":["sub-cili-kering","sub-everyday-meals","sub-ready-to-cook"]}'::jsonb
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  short_description = EXCLUDED.short_description,
  description = EXCLUDED.description,
  sizes = EXCLUDED.sizes,
  ingredients = EXCLUDED.ingredients,
  how_to_use = EXCLUDED.how_to_use,
  nutritional_facts = EXCLUDED.nutritional_facts;

-- 2. AWANG Daging Goreng Kicap Berempah
INSERT INTO public.products (
  name,
  slug,
  short_description,
  description,
  main_image,
  sizes,
  ingredients,
  how_to_use,
  status,
  is_featured,
  nutritional_facts
) VALUES (
  'AWANG Daging Goreng Kicap Berempah',
  'awang-daging-goreng-kicap-berempah',
  'Pes daging goreng kicap pekat berempah dengan aroma rempah ratus warisan Melayu.',
  'Gabungan kicap karamel pekat premium bersama rempah ratus terpilih menghasilkan hidangan daging goreng kicap yang berkilat, wangi, dan meresap ke dalam daging. Menjadikan masakan tengah hari keluarga lebih berselera dan mudah disediakan dalam 15 minit.',
  NULL,
  ARRAY['180g', '500g'],
  'Kicap soya pekat manis, bawang merah, bawang putih, halia, ketumbar, jintan manis, bunga lawang, kulit kayu manis, garam, minyak sayuran.',
  '1. Goreng daging yang telah dihiris nipis hingga separuh masak.\n2. Masukkan pes AWANG Daging Goreng Kicap Berempah dan gaul rata.\n3. Masukkan bawang holland dan cili merah hiris.\n4. Kacau selama 3-5 minit sehingga kuah pekat dan daging empuk.',
  'published',
  false,
  '{"category_ids":["cat-product-categories","cat-cooking-occasion","cat-product-features"],"subcategory_ids":["sub-paste","sub-everyday-meals","sub-quick-easy","sub-ready-to-cook"]}'::jsonb
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  short_description = EXCLUDED.short_description,
  description = EXCLUDED.description,
  sizes = EXCLUDED.sizes,
  ingredients = EXCLUDED.ingredients,
  how_to_use = EXCLUDED.how_to_use,
  nutritional_facts = EXCLUDED.nutritional_facts;

-- 3. AWANG Pedazz Limau Lestari Hijau
INSERT INTO public.products (
  name,
  slug,
  short_description,
  description,
  main_image,
  sizes,
  ingredients,
  how_to_use,
  status,
  is_featured,
  nutritional_facts
) VALUES (
  'AWANG Pedazz Limau Lestari Hijau',
  'awang-pedazz-limau-lestari-hijau',
  'Sambal hijau cili padi limau kasturi pedas masam menyengat membangkitkan selera.',
  'Sensasi pedas masam istimewa AWANG Pedazz dengan gabungan cili padi hijau kampung dan perahan limau nipis/kasturi segar. Sangat sesuai dijadikan sambal pencicah ayam bakar, ikan bakar, daging salai, atau ulam-ulaman segar.',
  NULL,
  ARRAY['180g', '350g'],
  'Cili padi hijau, cili hijau besar, jus limau kasturi asli, bawang merah, bawang putih, garam bukit, gula tebu, minyak masak.',
  'Sedia dimakan (Ready to Eat) terus sebagai pencicah, atau digaulkan bersama ikan goreng panas-panas.',
  'published',
  false,
  '{"category_ids":["cat-product-categories","cat-cooking-occasion","cat-product-features"],"subcategory_ids":["sub-pedazz","sub-quick-easy","sub-ready-to-eat"]}'::jsonb
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  short_description = EXCLUDED.short_description,
  description = EXCLUDED.description,
  sizes = EXCLUDED.sizes,
  ingredients = EXCLUDED.ingredients,
  how_to_use = EXCLUDED.how_to_use,
  nutritional_facts = EXCLUDED.nutritional_facts;

-- 4. AWANG Pedazz Limau Lestari Merah
INSERT INTO public.products (
  name,
  slug,
  short_description,
  description,
  main_image,
  sizes,
  ingredients,
  how_to_use,
  status,
  is_featured,
  nutritional_facts
) VALUES (
  'AWANG Pedazz Limau Lestari Merah',
  'awang-pedazz-limau-lestari-merah',
  'Sambal merah pedas membara dengan kesegaran aroma limau asli.',
  'Kombinasi klasik cili merah menyala dan aroma daun limau serta perahan jus limau segar. Memberikan kepedasan berapi yang beraroma wangi, sangat lazat dicicah dengan kuih muih pedas, cucur, mahupun dijadikan sos perapan makanan laut bakar.',
  NULL,
  ARRAY['180g', '350g'],
  'Cili merah segar, cili padi merah, jus limau kasturi, daun limau purut, bawang merah, bawang putih, garam, gula, minyak sawit.',
  'Boleh dimakan terus sebagai sambal meja atau ditumis ringkas bersama udang dan sotong.',
  'published',
  false,
  '{"category_ids":["cat-product-categories","cat-cooking-occasion","cat-product-features"],"subcategory_ids":["sub-pedazz","sub-quick-easy","sub-ready-to-eat"]}'::jsonb
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  short_description = EXCLUDED.short_description,
  description = EXCLUDED.description,
  sizes = EXCLUDED.sizes,
  ingredients = EXCLUDED.ingredients,
  how_to_use = EXCLUDED.how_to_use,
  nutritional_facts = EXCLUDED.nutritional_facts;

-- 5. AWANG Pedazz Sambal Seri Rasa
INSERT INTO public.products (
  name,
  slug,
  short_description,
  description,
  main_image,
  sizes,
  ingredients,
  how_to_use,
  status,
  is_featured,
  nutritional_facts
) VALUES (
  'AWANG Pedazz Sambal Seri Rasa',
  'awang-pedazz-sambal-seri-rasa',
  'Sambal serbaguna manis, pedas, dan masam seimbang citarasa tradisi Nusantara.',
  'Resipi adunan rempah sambal seimbang tiga rasa: manis gula Melaka, masam asam jawa asli, dan pedas cili merah. Menghasilkan rasa sambal yang mesra seisi keluarga, tidak terlalu menyengat namun kaya dengan kelazatan umami semulajadi.',
  NULL,
  ARRAY['180g', '350g'],
  'Cili merah, bawang merah, bawang putih, pes asam jawa, gula Melaka, garam, minyak sayuran.',
  'Sedia dimakan terus bersama nasi lemak, nasi putih, lontong, ataupun dicicah bersama lempeng kelapa.',
  'published',
  false,
  '{"category_ids":["cat-product-categories","cat-cooking-occasion","cat-product-features"],"subcategory_ids":["sub-pedazz","sub-everyday-meals","sub-ready-to-eat"]}'::jsonb
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  short_description = EXCLUDED.short_description,
  description = EXCLUDED.description,
  sizes = EXCLUDED.sizes,
  ingredients = EXCLUDED.ingredients,
  how_to_use = EXCLUDED.how_to_use,
  nutritional_facts = EXCLUDED.nutritional_facts;

-- 6. AWANG Pedazz Sambal Warisan Tok
INSERT INTO public.products (
  name,
  slug,
  short_description,
  description,
  main_image,
  sizes,
  ingredients,
  how_to_use,
  status,
  is_featured,
  nutritional_facts
) VALUES (
  'AWANG Pedazz Sambal Warisan Tok',
  'awang-pedazz-sambal-warisan-tok',
  'Sambal tumis kampung resepi turun temurun tok nenek beraroma bawang karamel.',
  'Dimasak perlahan secara tradisional selama berjam-jam sehingga bawang terkaramel sempurna dan minyak cili pecah cantik. Sambal Warisan Tok membawakan kenangan lauk kampung halaman ke meja makan moden anda dengan aroma yang memikat kalbu.',
  NULL,
  ARRAY['180g', '350g', '1kg'],
  'Bawang besar kampung, cili kering kisar, bawang putih, ikan bilis tumbuk, asam keping, garam, gula nisan, minyak masak.',
  'Boleh dihidang terus bersama nasi putih panas, telur mata, tempe goreng atau dijadikan pes nasi goreng kampung segera.',
  'published',
  false,
  '{"category_ids":["cat-product-categories","cat-cooking-occasion","cat-product-features"],"subcategory_ids":["sub-pedazz","sub-everyday-meals","sub-ready-to-eat"]}'::jsonb
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  short_description = EXCLUDED.short_description,
  description = EXCLUDED.description,
  sizes = EXCLUDED.sizes,
  ingredients = EXCLUDED.ingredients,
  how_to_use = EXCLUDED.how_to_use,
  nutritional_facts = EXCLUDED.nutritional_facts;

-- 7. AWANG Rendang Recipe Base Paste
INSERT INTO public.products (
  name,
  slug,
  short_description,
  description,
  main_image,
  sizes,
  ingredients,
  how_to_use,
  status,
  is_featured,
  nutritional_facts
) VALUES (
  'AWANG Rendang Recipe Base Paste',
  'awang-rendang-recipe-base-paste',
  'Pes asas rendang asli berkerisik harum dengan rempah ratus warisan Melayu.',
  'Pes masakan rendang lengkap dengan aroma kerisik kelapa sangai, daun kunyit, daun limau purut, serai, dan lengkuas. Memudahkan penyediaan rendang daging, ayam, atau kerang tanpa perlu menumis rempah dari awal selama berjam-jam.',
  NULL,
  ARRAY['180g', '500g', '1kg'],
  'Kerisik kelapa asli, bawang merah, cili kering, bawang putih, halia, lengkuas, serai, daun kunyit, daun limau purut, ketumbar, jintan, garam, minyak sayuran.',
  '1. Masukkan pes AWANG Rendang ke dalam periuk bersama 500g daging/ayam dan 200ml santan.\n2. Masak dengan api sederhana hingga daging empuk.\n3. Kacau perlahan sehingga kuah pekat dan pecah minyak cantik.',
  'published',
  false,
  '{"category_ids":["cat-product-categories","cat-cooking-occasion","cat-product-features"],"subcategory_ids":["sub-paste","sub-everyday-meals","sub-ready-to-cook"]}'::jsonb
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  short_description = EXCLUDED.short_description,
  description = EXCLUDED.description,
  sizes = EXCLUDED.sizes,
  ingredients = EXCLUDED.ingredients,
  how_to_use = EXCLUDED.how_to_use,
  nutritional_facts = EXCLUDED.nutritional_facts;

-- 8. AWANG Sambal Bites Ayam Sambal Lada Letop
INSERT INTO public.products (
  name,
  slug,
  short_description,
  description,
  main_image,
  sizes,
  ingredients,
  how_to_use,
  status,
  is_featured,
  nutritional_facts
) VALUES (
  'AWANG Sambal Bites Ayam Sambal Lada Letop',
  'sambal-bites-ayam-sambal-lada-letop',
  'Kepingan filet ayam empuk bersalut sambal lada hitam pedas menyengat ready-to-eat.',
  'Koleksi inovasi AWANG Sambal Bites sedia dimakan bila-bila masa. Hirisan daging ayam lembut yang dimasak bersama sambal lada hitam pedas meletop. Sesuai untuk bekalan travel, kerja luar, berkhemah, ataupun kudapan lazat bersama roti dan nasi.',
  NULL,
  ARRAY['150g', '200g'],
  'Daging ayam segar, lada hitam Sarawak, cili padi, cili merah, bawang merah, bawang putih, sos tiram, garam, gula, minyak masak.',
  'Sedia dimakan terus (Ready-to-Eat). Rendam pek pouch ke dalam air panas selama 2-3 minit untuk hidangan yang lebih panas dan memikat.',
  'published',
  false,
  '{"category_ids":["cat-product-categories","cat-cooking-occasion","cat-product-features"],"subcategory_ids":["sub-sambal-bites","sub-on-the-go","sub-ready-to-eat","sub-travel-friendly"]}'::jsonb
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  short_description = EXCLUDED.short_description,
  description = EXCLUDED.description,
  sizes = EXCLUDED.sizes,
  ingredients = EXCLUDED.ingredients,
  how_to_use = EXCLUDED.how_to_use,
  nutritional_facts = EXCLUDED.nutritional_facts;

-- 9. AWANG Sambal Bites Ayam Sambal Pedas Lemak Manis
INSERT INTO public.products (
  name,
  slug,
  short_description,
  description,
  main_image,
  sizes,
  ingredients,
  how_to_use,
  status,
  is_featured,
  nutritional_facts
) VALUES (
  'AWANG Sambal Bites Ayam Sambal Pedas Lemak Manis',
  'sambal-bites-ayam-sambal-pedas-lemak-manis',
  'Daging ayam empuk dalam limpahan sambal lemak manis pedas mesra keluarga.',
  'Pilihan kegemaran semua lapisan usia dengan gabungan rasa manis berkaramel, rasa lemak santan lembut, dan rempah sambal yang harum. Mudah dinikmati di mana jua tanpa perlu dimasak.',
  NULL,
  ARRAY['150g', '200g'],
  'Daging ayam, santan kelapa, cili merah, bawang merah, bawang putih, gula Melaka, pes asam jawa, garam.',
  'Koyak dan makan terus bersama nasi panas, pulut kuning, atau inti roti sandwic.',
  'published',
  false,
  '{"category_ids":["cat-product-categories","cat-cooking-occasion","cat-product-features"],"subcategory_ids":["sub-sambal-bites","sub-on-the-go","sub-ready-to-eat","sub-travel-friendly"]}'::jsonb
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  short_description = EXCLUDED.short_description,
  description = EXCLUDED.description,
  sizes = EXCLUDED.sizes,
  ingredients = EXCLUDED.ingredients,
  how_to_use = EXCLUDED.how_to_use,
  nutritional_facts = EXCLUDED.nutritional_facts;

-- 10. AWANG Sambal Bites Bebola Ayam Sambal
INSERT INTO public.products (
  name,
  slug,
  short_description,
  description,
  main_image,
  sizes,
  ingredients,
  how_to_use,
  status,
  is_featured,
  nutritional_facts
) VALUES (
  'AWANG Sambal Bites Bebola Ayam Sambal',
  'sambal-bites-bebola-ayam-sambal',
  'Bebola ayam pejal bersira sambal merah pekat pedas manis yang menyelerakan.',
  'Bebola ayam daging pejal berkualiti tinggi yang disira kemas dengan sambal pekat istimewa AWANG. Tekstur bebola yang kenyal bersatu dengan limpahan sambal pedas menjadikannya snek atau lauk segera yang mengenyangkan.',
  NULL,
  ARRAY['150g', '200g'],
  'Bebola ayam (isi ayam, tepung kanji, perasa), cili merah, bawang besar, bawang putih, gula, garam, minyak kelapa sawit.',
  'Boleh dimakan terus atau dipanaskan di dalam ketuhar gelombang mikro (microwave) selama 1 minit.',
  'published',
  false,
  '{"category_ids":["cat-product-categories","cat-cooking-occasion","cat-product-features"],"subcategory_ids":["sub-sambal-bites","sub-quick-easy","sub-on-the-go","sub-ready-to-eat","sub-travel-friendly"]}'::jsonb
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  short_description = EXCLUDED.short_description,
  description = EXCLUDED.description,
  sizes = EXCLUDED.sizes,
  ingredients = EXCLUDED.ingredients,
  how_to_use = EXCLUDED.how_to_use,
  nutritional_facts = EXCLUDED.nutritional_facts;

-- 11. AWANG Sambal Bites Bebola Daging Sambal
INSERT INTO public.products (
  name,
  slug,
  short_description,
  description,
  main_image,
  sizes,
  ingredients,
  how_to_use,
  status,
  is_featured,
  nutritional_facts
) VALUES (
  'AWANG Sambal Bites Bebola Daging Sambal',
  'sambal-bites-bebola-daging-sambal',
  'Bebola daging lembu empuk premium disaluti sambal pekat kaya aroma rempah.',
  'Kelezatan bebola daging lembu asli berpadu dengan sambal tumis pedas rempah istimewa. Pek makanan sedia saji yang praktikal dan berkhasiat tinggi untuk gaya hidup aktif dan moden.',
  NULL,
  ARRAY['150g', '200g'],
  'Bebola daging lembu, cili kisar, bawang merah, bawang putih, pes tomato, rempah ratus, garam, gula, minyak sawit.',
  'Sedia dimakan terus. Sesuai dinikmati bersama mi segera, spageti sambal, atau nasi putih.',
  'published',
  false,
  '{"category_ids":["cat-product-categories","cat-cooking-occasion","cat-product-features"],"subcategory_ids":["sub-sambal-bites","sub-quick-easy","sub-on-the-go","sub-ready-to-eat","sub-travel-friendly"]}'::jsonb
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  short_description = EXCLUDED.short_description,
  description = EXCLUDED.description,
  sizes = EXCLUDED.sizes,
  ingredients = EXCLUDED.ingredients,
  how_to_use = EXCLUDED.how_to_use,
  nutritional_facts = EXCLUDED.nutritional_facts;

-- 12. AWANG Sambal Bites Sotong Sambal Cili Kaw
INSERT INTO public.products (
  name,
  slug,
  short_description,
  description,
  main_image,
  sizes,
  ingredients,
  how_to_use,
  status,
  is_featured,
  nutritional_facts
) VALUES (
  'AWANG Sambal Bites Sotong Sambal Cili Kaw',
  'sambal-bites-sotong-sambal-cili-kaw',
  'Hirisan sotong kenyal bersalut sambal cili kaw pedas pekat membangkitkan selera.',
  'Peminat makanan laut kini boleh menikmati sambal sotong bila-bila masa! Sotong segar berkualiti yang dimasak bersama ramuan sambal cili kaw pekat berapi. Tiada bau hanyir, hanya rasa pedas manis memikat.',
  NULL,
  ARRAY['150g', '200g'],
  'Sotong segar pilihan, cili merah segar, cili padi, bawang merah, pes asam jawa, gula perang, garam, minyak sayuran.',
  'Boleh dimakan terus atau rendam pek tertutup ke dalam air panas selama 3 minit sebelum dibuka.',
  'published',
  false,
  '{"category_ids":["cat-product-categories","cat-cooking-occasion","cat-product-features"],"subcategory_ids":["sub-sambal-bites","sub-on-the-go","sub-ready-to-eat","sub-travel-friendly"]}'::jsonb
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  short_description = EXCLUDED.short_description,
  description = EXCLUDED.description,
  sizes = EXCLUDED.sizes,
  ingredients = EXCLUDED.ingredients,
  how_to_use = EXCLUDED.how_to_use,
  nutritional_facts = EXCLUDED.nutritional_facts;

-- 13. AWANG Sambal Bites Udang Sambal Berapi
INSERT INTO public.products (
  name,
  slug,
  short_description,
  description,
  main_image,
  sizes,
  ingredients,
  how_to_use,
  status,
  is_featured,
  nutritional_facts
) VALUES (
  'AWANG Sambal Bites Udang Sambal Berapi',
  'sambal-bites-udang-sambal-berapi',
  'Udang manis segar bersalut sambal cili padi berapi nikmat lazat tak terhingga.',
  'Pilihan hidangan mewah sedia dimakan dengan isi udang manis yang disalut sambal merah pedas berapi. Rasa manis alami udang berpadu mesra dengan kepedasan sambal, sempurna dijadikan hidangan segera premium.',
  NULL,
  ARRAY['150g', '200g'],
  'Udang segar, cili merah, cili api, bawang merah, bawang putih, jus limau nipis, garam, gula, minyak sawit.',
  'Sedia dimakan terus. Nikmati bersama nasi impit, roti canai, atau hidangan nasi putih.',
  'published',
  false,
  '{"category_ids":["cat-product-categories","cat-cooking-occasion","cat-product-features"],"subcategory_ids":["sub-sambal-bites","sub-on-the-go","sub-ready-to-eat","sub-travel-friendly"]}'::jsonb
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  short_description = EXCLUDED.short_description,
  description = EXCLUDED.description,
  sizes = EXCLUDED.sizes,
  ingredients = EXCLUDED.ingredients,
  how_to_use = EXCLUDED.how_to_use,
  nutritional_facts = EXCLUDED.nutritional_facts;

