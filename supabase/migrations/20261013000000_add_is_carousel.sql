-- Migration: Add is_carousel column to products table
-- is_featured  -> tampil di section ""TASTE THE HEAT"" (Featured Grid merah)
-- is_carousel  -> tampil di section ""TEMUKAN PILIHANMU"" (Product Carousel Pop-out krem)

ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS is_carousel BOOLEAN DEFAULT false;

CREATE INDEX IF NOT EXISTS idx_products_is_carousel ON public.products(is_carousel);
