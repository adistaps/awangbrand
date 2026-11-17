'use client'

import { useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

export function ProductViewTracker({ productId }: { productId: string }) {
  useEffect(() => {
    if (!productId) return

    try {
      const sessionKey = `viewed_product_${productId}`
      if (sessionStorage.getItem(sessionKey)) {
        return
      }
      sessionStorage.setItem(sessionKey, '1')

      const supabase = createClient()
      supabase.from('product_views').insert({ product_id: productId }).then()
    } catch {
      // Ignore sessionStorage errors (e.g. private mode restrictions)
    }
  }, [productId])

  return null
}
