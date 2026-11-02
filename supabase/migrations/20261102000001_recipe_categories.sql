-- Migration: Add recipe category & subcategory support
-- 1. Tambah kolom category_ids dan subcategory_ids ke tabel recipes (array text)
ALTER TABLE recipes
  ADD COLUMN IF NOT EXISTS category_ids TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS subcategory_ids TEXT[] DEFAULT '{}';

-- 2. Seed default Recipe Categories Hierarchy ke site_settings
INSERT INTO site_settings (key, value, updated_at)
VALUES (
  'recipe_categories_hierarchy',
  '[
    {
      "id": "rcat-what-are-you-cooking",
      "name": "What are you cooking?",
      "slug": "what-are-you-cooking",
      "subcategories": [
        {"id": "rsub-chicken", "name": "Chicken", "slug": "chicken", "image_url": "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?auto=format&fit=crop&w=400&q=80"},
        {"id": "rsub-seafood", "name": "Seafood", "slug": "seafood", "image_url": "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=400&q=80"},
        {"id": "rsub-beef", "name": "Beef", "slug": "beef", "image_url": "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=400&q=80"},
        {"id": "rsub-vegetables", "name": "Vegetables", "slug": "vegetables", "image_url": "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=400&q=80"},
        {"id": "rsub-rice-noodles", "name": "Rice & Noodles", "slug": "rice-noodles", "image_url": "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=400&q=80"}
      ]
    },
    {
      "id": "rcat-flavour-taste",
      "name": "Flavour & Taste",
      "slug": "flavour-taste",
      "subcategories": [
        {"id": "rsub-spicy-fiery", "name": "Spicy & Fiery", "slug": "spicy-fiery", "image_url": "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?auto=format&fit=crop&w=400&q=80"},
        {"id": "rsub-rich-savoury", "name": "Rich & Savoury", "slug": "rich-savoury", "image_url": "https://images.unsplash.com/photo-1547496502-affa22d38842?auto=format&fit=crop&w=400&q=80"},
        {"id": "rsub-tangy-zesty", "name": "Tangy & Zesty", "slug": "tangy-zesty", "image_url": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80"},
        {"id": "rsub-creamy-aromatic", "name": "Creamy & Aromatic", "slug": "creamy-aromatic", "image_url": "https://images.unsplash.com/photo-1505253758473-96b3015f240a?auto=format&fit=crop&w=400&q=80"},
        {"id": "rsub-traditional-sambal", "name": "Traditional Sambal", "slug": "traditional-sambal", "image_url": "https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=400&q=80"}
      ]
    },
    {
      "id": "rcat-meal-inspiration",
      "name": "Meal Inspiration",
      "slug": "meal-inspiration",
      "subcategories": [
        {"id": "rsub-main-dishes", "name": "Main Dishes", "slug": "main-dishes", "image_url": "https://images.unsplash.com/photo-1527477396000-e27163b481c2?auto=format&fit=crop&w=400&q=80"},
        {"id": "rsub-sambal-sides", "name": "Sambal & Sides", "slug": "sambal-sides", "image_url": "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=400&q=80"},
        {"id": "rsub-ready-to-eat", "name": "Ready to Eat", "slug": "ready-to-eat", "image_url": "https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=400&q=80"},
        {"id": "rsub-one-pot-meals", "name": "One Pot Meals", "slug": "one-pot-meals", "image_url": "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=400&q=80"},
        {"id": "rsub-sharing-gatherings", "name": "Sharing & Gatherings", "slug": "sharing-gatherings", "image_url": "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=400&q=80"}
      ]
    }
  ]',
  NOW()
)
ON CONFLICT (key) DO UPDATE
SET value = EXCLUDED.value, updated_at = NOW();
