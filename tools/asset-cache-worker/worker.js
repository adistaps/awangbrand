/**
 * Cloudflare Worker: cache di depan Supabase Storage (bucket publik) untuk AWANG Brand.
 * URL Worker:    https://<worker>/public/<bucket>/<path>
 * Diteruskan ke: <SUPABASE_URL>/storage/v1/object/public/<bucket>/<path>
 *
 * Aman di-cache "immutable" karena uploader memakai nama file unik (timestamp + acak, upsert: false).
 * Origin dibangun HANYA dari pathname, jadi query string diabaikan dan tidak bisa dipakai
 * untuk menembus cache.
 */
const ALLOWED =
  /^\/public\/(product-images|product-thumbnails|product-gallery|brand-logos)\/[^?#]+$/;

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
        },
      });
    }
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      return new Response('Method not allowed', { status: 405 });
    }

    const { pathname } = new URL(request.url);
    if (!ALLOWED.test(pathname) || pathname.includes('..')) {
      return new Response('Not found', { status: 404 });
    }

    const origin = `${env.SUPABASE_URL}/storage/v1/object${pathname}`;
    const upstream = await fetch(origin, {
      method: request.method,
      headers: request.headers.has('range') ? { range: request.headers.get('range') } : {},
      cf: {
        cacheEverything: true,
        cacheTtlByStatus: { '200-299': 31536000, 404: 60, '500-599': 0 },
      },
    });

    const res = new Response(upstream.body, upstream);
    if (upstream.ok) {
      res.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
    }
    res.headers.set('Access-Control-Allow-Origin', '*');
    res.headers.delete('set-cookie');
    return res;
  },
};
