'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function revalidatePublicSite() {
  try {
    const supabase = await createClient()
    const { data: isAdmin } = await supabase.rpc('is_admin')
    if (!isAdmin) return { ok: false }
    revalidatePath('/', 'layout')
    return { ok: true }
  } catch {
    return { ok: false }
  }
}
