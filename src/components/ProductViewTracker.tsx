'use client'

import { useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

export function ProductViewTracker({ productId }: { productId: string }) {
  useEffect(() => {
    const supabase = createClient()
    supabase.from('product_views').insert({ product_id: productId }).then()
  }, [productId])

  return null
}
