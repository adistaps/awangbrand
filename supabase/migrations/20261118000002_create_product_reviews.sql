-- Migration: Create product_reviews table and storage bucket for review photos

-- 1. Create product_reviews table
CREATE TABLE IF NOT EXISTS public.product_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  reviewer_name TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  review_date DATE DEFAULT CURRENT_DATE,
  photos TEXT[] DEFAULT '{}',
  is_verified_buyer BOOLEAN DEFAULT true,
  is_featured_homepage BOOLEAN DEFAULT false,
  status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('published', 'draft')),
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexing for performance
CREATE INDEX IF NOT EXISTS idx_product_reviews_product_id ON public.product_reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_product_reviews_status ON public.product_reviews(status);
CREATE INDEX IF NOT EXISTS idx_product_reviews_homepage ON public.product_reviews(is_featured_homepage) WHERE is_featured_homepage = true;

-- 2. Create Storage Bucket for review photos if not exists
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'review-photos',
  'review-photos',
  true,
  5242880, -- 5MB limit
  ARRAY['image/webp', 'image/jpeg', 'image/png', 'image/avif']
)
ON CONFLICT (id) DO UPDATE
SET public = true;

-- 3. Storage Policies for review-photos
DROP POLICY IF EXISTS "Public Access Review Photos" ON storage.objects;
CREATE POLICY "Public Access Review Photos" ON storage.objects
  FOR SELECT TO public
  USING (bucket_id = 'review-photos');

DROP POLICY IF EXISTS "Admin Upload Review Photos" ON storage.objects;
CREATE POLICY "Admin Upload Review Photos" ON storage.objects
  FOR ALL TO public
  USING (bucket_id = 'review-photos')
  WITH CHECK (bucket_id = 'review-photos');

-- 4. Enable public read access for published reviews
ALTER TABLE public.product_reviews DISABLE ROW LEVEL SECURITY;
