export interface Category {
  id: string
  name: string
  slug: string
  description?: string | null
  image_url?: string | null
  created_at: string
}

export interface Product {
  id: string
  name: string
  slug: string
  category_id: string | null
  brand_id?: string | null
  short_description?: string | null
  description: string | null
  main_image: string | null
  sizes?: string[] | null
  benefits?: string[] | null
  nutritional_facts?: Record<string, string> | null
  ingredients?: string | null
  allergen_info?: string | null
  how_to_use?: string | null
  is_featured: boolean
  is_carousel?: boolean
  status: 'draft' | 'published'
  sort_order?: number
  created_at: string
  updated_at: string
  category?: Category | null
  product_images?: ProductImage[]
  product_specifications?: ProductSpecification[]
}

export interface ProductImage {
  id: string
  product_id: string
  image_url: string
  sort_order: number
  created_at: string
}

export interface ProductSpecification {
  id: string
  product_id: string
  spec_key: string
  spec_value: string
  sort_order: number
}

export interface Recipe {
  id: string
  title: string
  slug: string
  category: string
  prep_time: string | null
  cook_time: string | null
  servings: string | null
  difficulty: 'Easy' | 'Medium' | 'Hard'
  calories?: string | null
  description: string | null
  main_image: string | null
  ingredients: string[]
  instructions: string[]
  tips?: string | null
  featured_product_id?: string | null
  is_featured: boolean
  status: 'draft' | 'published'
  created_at: string
  updated_at: string
  featured_product?: Product | null
}

export interface Testimonial {
  id: string
  image_url?: string | null
  quote?: string
  author?: string
  name?: string
  content?: string
  role: string | null
  company?: string | null
  rating?: number
  avatar_url?: string | null
  sort_order: number
  is_active: boolean
  created_at: string
}

export interface Brand {
  id: string
  name: string
  logo_url: string | null
  sort_order: number
  is_active: boolean
  created_at: string
}

export interface QuoteSubmission {
  id: string
  name: string
  email: string
  phone?: string | null
  company?: string | null
  category?: string | null
  message: string | null
  status: 'new' | 'contacted' | 'closed' | 'read'
  created_at: string
}

export interface ContactSubmission {
  id: string
  name?: string
  email: string
  subject?: string | null
  website?: string | null
  comment?: string
  message?: string
  status: 'new' | 'contacted' | 'closed'
  created_at: string
}

export interface SiteSetting {
  key: string
  value: string | null
}

export type CashflowType = 'income' | 'expense'
export type CashflowChannel = 'offline_store' | 'distributor' | 'supermarket' | 'online_shopee' | 'online_tokopedia' | 'online_lazada' | 'event_bazaar' | 'other'

export interface CashflowTransaction {
  id: string
  transaction_date: string
  type: CashflowType
  amount: number
  channel: CashflowChannel
  brand_id?: string | null
  store_name?: string | null
  description: string
  reference_no?: string | null
  payment_method?: string | null
  notes?: string | null
  created_at: string
  brand?: Brand | null
}
