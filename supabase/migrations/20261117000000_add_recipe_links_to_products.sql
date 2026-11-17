-- Tambahkan kolom recipe_links bertipe JSONB pada tabel products
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS recipe_links JSONB DEFAULT '[]'::jsonb;

-- Komentar kolom
COMMENT ON COLUMN products.recipe_links IS 'Array of video recipe links (title, url, platform)';
