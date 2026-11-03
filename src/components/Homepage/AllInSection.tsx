import Link from 'next/link'
import Image from 'next/image'
import { ChevronRight } from 'lucide-react'

export function AllInSection() {
  return (
    <section className="w-full bg-[#540B26] py-14 sm:py-20 lg:py-24 px-4 sm:px-6 md:px-10 lg:px-12 font-sans overflow-hidden">
      <div className="max-w-[1360px] mx-auto">
        {/* Section Heading */}
        <div className="text-center mb-8 sm:mb-12 lg:mb-14">
          <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-[#FFF0DE] uppercase tracking-tight font-heinz">
            WE&apos;RE ALL-IN
          </h2>
        </div>

        {/* 2-Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-7 lg:gap-8 max-w-6xl mx-auto">

          {/* ========================================
              CARD KIRI: Menuju ke About Us
              people.webp di-anchor ke bawah kartu
          ======================================== */}
          <Link
            href="/about-us"
            className="group relative aspect-square w-full rounded-[26px] sm:rounded-[34px] overflow-hidden bg-[#FDF0DD] shadow-lg hover:shadow-2xl transition-all duration-300 block"
          >
            {/* Background pattern doodle brand AWANG (cream dengan opacity rendah) */}
            <div
              className="absolute inset-0 bg-cover bg-center pointer-events-none opacity-[0.18] mix-blend-multiply"
              style={{ backgroundImage: "url('/bgabout.webp')" }}
              aria-hidden="true"
            />

            {/* people.webp — di-anchor ke dasar kartu agar tidak terlihat terbang */}
            <Image
              src="/people.webp"
              alt="AWANG Brand — Cerita & Warisan Kami"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-contain object-bottom transition-transform duration-500 ease-out group-hover:scale-[1.03]"
              priority
            />

            {/* Gradient Overlay di bawah agar teks & tombol jelas */}
            <div className="absolute inset-x-0 bottom-0 h-36 sm:h-44 bg-gradient-to-t from-black/70 via-black/30 to-transparent pointer-events-none" />

            {/* Bottom Bar: Copywriting & Tombol Arrow */}
            <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7 flex items-end justify-between gap-4 z-10">
              <span className="text-white font-black text-sm sm:text-base md:text-lg lg:text-xl uppercase tracking-wider font-heinz leading-snug drop-shadow-md">
                THE ORIGINAL FLAVOR MAKER
              </span>

              <div className="flex-shrink-0 w-9 h-9 sm:w-11 sm:h-11 rounded-full border border-white/40 bg-black/30 backdrop-blur-sm flex items-center justify-center text-white transition-all duration-300 group-hover:bg-white group-hover:text-black group-hover:scale-105 group-hover:border-white shadow-sm">
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:translate-x-0.5" />
              </div>
            </div>
          </Link>

          {/* ========================================
              CARD KANAN: Menuju ke Products
              bgabout.webp — putih & samar di atas background merah
          ======================================== */}
          <Link
            href="/products"
            className="group relative aspect-square w-full rounded-[26px] sm:rounded-[34px] overflow-hidden bg-[#D6001C] shadow-lg hover:shadow-2xl transition-all duration-300 block"
          >
            {/* bgabout.webp — warna putih, samar, sebagai pola dekoratif di atas merah */}
            <div
              className="absolute inset-0 bg-cover bg-center pointer-events-none opacity-[0.13]"
              style={{
                backgroundImage: "url('/bgabout.webp')",
                filter: 'brightness(0) invert(1)',
              }}
              aria-hidden="true"
            />

            {/* Gambar produk — di-anchor ke dasar kartu */}
            <Image
              src="/product.webp"
              alt="AWANG Brand — Ramuan Asli & Produk Segar"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-contain object-bottom transition-transform duration-500 ease-out group-hover:scale-[1.03]"
              priority
            />

            {/* Gradient Overlay di bawah agar teks & tombol jelas */}
            <div className="absolute inset-x-0 bottom-0 h-36 sm:h-44 bg-gradient-to-t from-black/70 via-black/30 to-transparent pointer-events-none" />

            {/* Bottom Bar: Copywriting & Tombol Arrow */}
            <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7 flex items-end justify-between gap-4 z-10">
              <span className="text-white font-black text-sm sm:text-base md:text-lg lg:text-xl uppercase tracking-wider font-heinz leading-snug drop-shadow-md">
                ROOTED IN SUSTAINABILITY
              </span>

              <div className="flex-shrink-0 w-9 h-9 sm:w-11 sm:h-11 rounded-full border border-white/40 bg-black/30 backdrop-blur-sm flex items-center justify-center text-white transition-all duration-300 group-hover:bg-white group-hover:text-black group-hover:scale-105 group-hover:border-white shadow-sm">
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:translate-x-0.5" />
              </div>
            </div>
          </Link>

        </div>
      </div>
    </section>
  )
}
