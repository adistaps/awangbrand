-- Tambahkan kolom recipe_links bertipe JSONB pada tabel recipes
ALTER TABLE recipes 
ADD COLUMN IF NOT EXISTS recipe_links JSONB DEFAULT '[]'::jsonb;

-- Komentar kolom
COMMENT ON COLUMN recipes.recipe_links IS 'Array of video recipe links (title, url, platform)';

-- (Opsional) Tambahkan juga pada tabel products jika sebelumnya ingin dipakai juga
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS recipe_links JSONB DEFAULT '[]'::jsonb;
