-- Bulk Seed Reviews untuk AWANG Brand
-- Jalankan query ini di SQL Editor Supabase

INSERT INTO public.product_reviews (
  product_id,
  reviewer_name,
  rating,
  title,
  content,
  review_date,
  photos,
  is_featured_homepage,
  status
) VALUES
-- 1. Review untuk Sambal Bites Bebola Ayam
(
  '3868f877-9f4e-4877-a7ab-f1a74b5c7abd',
  'Farah N.',
  5,
  'Sedap gila bebola ayam berkeju ni!',
  'Bebola ayam dia lembut sangat, cheese kat dalam cair bila gigit panas-panas. Sambal pedas manis memang kena sangat dengan selera kami sekeluarga. Masuk microwave 2 minit dah siap boleh makan. Repeat order lagi nanti!',
  '2026-11-12',
  ARRAY[
    'https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=600&q=80'
  ],
  true,
  'published'
),
(
  '3868f877-9f4e-4877-a7ab-f1a74b5c7abd',
  'Azman Shah',
  5,
  'Pedas kick yang padu dan praktikal',
  'Sangat membantu bila balik kerja lewat malam lapar nak makan laju-laju. Sambal dia pekat dan pedasnya mantap. Bebola isi ayam penuh tak rasa tepung langsung.',
  '2026-11-05',
  ARRAY[]::TEXT[],
  false,
  'published'
),
(
  '3868f877-9f4e-4877-a7ab-f1a74b5c7abd',
  'Noraini Hashim',
  4,
  'Anak-anak suka sangat, cuma agak pedas sikit',
  'Rasa sedap, cheese dalam meatball tu budak-budak suka. Untuk saya pedasnya ngam, anak kecil kena minum air banyak sikit tapi tetap habiskan licin.',
  '2026-10-28',
  ARRAY[]::TEXT[],
  false,
  'published'
),

-- 2. Review untuk Asam Pedas Recipe Base Paste
(
  '11111111-0000-0000-0000-000000000001',
  'Datin Salmah',
  5,
  'Rasa asli Asam Pedas Melaka!',
  'Dah cuba macam-macam jenama pes, pes AWANG ni paling autentik. Wangi daun kesum dan bunga kantan semulajadi, tak rasa serbuk perasa tiruan. Masak dengan ikan kembung & bendi memang terus terangkat selera!',
  '2026-11-14',
  ARRAY[
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80'
  ],
  true,
  'published'
),
(
  '11111111-0000-0000-0000-000000000001',
  'Khairul Amri',
  5,
  'Jimat masa memasak, rasa taraf hotel',
  'Tak payah tumis lada berpeluh-peluh kat dapur lagi. Masuk pes, tambah air, letak ikan jenahak sekejap je siap makan malam lazat. Terbaik AWANG!',
  '2026-11-01',
  ARRAY[]::TEXT[],
  true,
  'published'
),

-- 3. Review untuk Rendang Recipe Base Paste
(
  'bd2c8401-8755-4aa8-a3fa-64437524aa27',
  'Hajah Rohani',
  5,
  'Rendang Daging Raya rasa sempurna',
  'Rempah ratusnya cukup pekat dan wangi kerisik semulajadi. Daging cepat empuk dan serap bumbu elok. Rasa macam rendang nenek masak dulu-dulu.',
  '2026-11-10',
  ARRAY[
    'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80'
  ],
  true,
  'published'
),

-- 4. Review untuk Sambal Balado Hijau Recipe Base Paste
(
  '5e849d3a-3f79-4fea-b7e9-e265be8ae4fb',
  'Siti Nurhaliza M.',
  5,
  'Sambal hijau paling sedap & wangi',
  'Warna hijau asli tak ada pewarna. Rasa pedas-pedas masam limau nipisnya segar sangat. Saya goreng ikan keli lepas tu siram pes ni atas ikan, suami puji sedap sangat!',
  '2026-11-15',
  ARRAY[
    'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=600&q=80'
  ],
  true,
  'published'
),
(
  '5e849d3a-3f79-4fea-b7e9-e265be8ae4fb',
  'Rizal Ahmad',
  5,
  'Must have staple kat rumah bujang',
  'Gaul dengan nasi panas dan telur mata pun dah cukup nikmat. Packaging kemas dan kualiti terjamin Halal.',
  '2026-11-08',
  ARRAY[]::TEXT[],
  false,
  'published'
),

-- 5. Review untuk Lemak Cili Padi Recipe Base Paste
(
  '11111111-0000-0000-0000-000000000008',
  'Mak Cik Rokiah',
  5,
  'Asli Negeri Sembilan, pedas terangkat!',
  'Warna kunyit hidup cantik dan cili padi kampung asli. Masak dengan ketam & nenas kuah pekat melekat. Puas hati sangat!',
  '2026-11-16',
  ARRAY[
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80'
  ],
  true,
  'published'
),

-- 6. Review untuk Sambal Bites Udang Berapi
(
  'd1199b34-74d0-4e75-bfb5-9c5eabb0194b',
  'Bella Thorne K.',
  5,
  'Udang manis dan sambal berapi padu!',
  'Udang banyak dan fresh, tak hanyir langsung. Sambal berapi dia betul-betul membakar selera. Sangat rekomen untuk peminat pedas tegar.',
  '2026-11-13',
  ARRAY[]::TEXT[],
  true,
  'published'
);
