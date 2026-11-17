# Cloudflare Worker Cache untuk Supabase Storage AWANG Brand

Worker ini berfungsi sebagai reverse proxy dan CDN cache di depan bucket publik Supabase Storage untuk menekan penggunaan egress bandwidth.

## Cara Deploy Worker

1. Masuk ke folder worker:
   ```bash
   cd tools/asset-cache-worker
   ```
2. Login ke Cloudflare:
   ```bash
   npx wrangler login
   ```
   (Browser akan otomatis terbuka untuk meminta konfirmasi otorisasi akun Cloudflare Anda).
3. Deploy Worker ke Cloudflare:
   ```bash
   npx wrangler deploy
   ```
4. Salin URL Worker yang dihasilkan (misal `https://awang-assets.<subdomain>.workers.dev`).
5. Uji cache dengan curl sebanyak dua kali:
   ```bash
   curl -I https://<worker-anda>/public/product-thumbnails/<nama-gambar>.webp
   curl -I https://<worker-anda>/public/product-thumbnails/<nama-gambar>.webp
   ```
   Pastikan pada request kedua terdapat header `cf-cache-status: HIT`.

## Catatan Penting:
- **Batas Paket Gratis Workers (±100.000 request/hari)**: Setiap request gambar tetap dihitung 1 request Worker walau statusnya HIT di cache Cloudflare. Jika trafik website tumbuh tinggi di masa depan, Anda dapat memindahkannya ke custom domain yang diproksi Cloudflare (misal `assets.awangbrand.com`), atau migrasi bucket ke Cloudflare R2.
- **Custom Domain vs workers.dev**: Jika domain `awangbrand.com` Anda sudah diatur menggunakan DNS Cloudflare, sangat disarankan memasang Worker pada custom route/domain (misal `assets.awangbrand.com`) daripada domain `*.workers.dev` untuk kestabilan akses dan menghindari isu blokir ISP di beberapa jaringan lokal.
