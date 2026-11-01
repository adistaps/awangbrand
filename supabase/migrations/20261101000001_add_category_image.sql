-- ================================================================
-- MIGRATION: Add image_url to categories table
-- Tanggal: 2026-11-01
-- ================================================================

-- 1. Tambah kolom image_url ke tabel categories jika belum ada
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'categories'
      AND column_name = 'image_url'
      AND table_schema = 'public'
  ) THEN
    ALTER TABLE public.categories ADD COLUMN image_url TEXT;
    RAISE NOTICE 'Kolom image_url ditambahkan ke tabel categories.';
  ELSE
    RAISE NOTICE 'Kolom image_url sudah ada di tabel categories.';
  END IF;
END
$$;
