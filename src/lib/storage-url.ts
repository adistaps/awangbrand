/**
 * Ubah URL publik Supabase Storage menjadi URL lewat Cloudflare Worker cache.
 * Aktif hanya jika NEXT_PUBLIC_ASSETS_BASE_URL diisi; kalau kosong, URL dikembalikan apa adanya.
 * Idempotent: URL yang sudah lewat Worker tidak diubah lagi.
 *
 *   https://<ref>.supabase.co/storage/v1/object/public/<bucket>/<file>
 *   -> <ASSETS_BASE_URL>/public/<bucket>/<file>
 */
const SUPABASE_PUBLIC_PREFIX =
  /^https:\/\/[a-z0-9-]+\.supabase\.co\/storage\/v1\/object\/public\//i;

export function toAssetUrl(url: string): string {
  const base = process.env.NEXT_PUBLIC_ASSETS_BASE_URL?.replace(/\/+$/, '');
  if (!base) return url;
  return url.replace(SUPABASE_PUBLIC_PREFIX, `${base}/public/`);
}
