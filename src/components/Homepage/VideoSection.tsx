'use client'

import Image from 'next/image'

export function VideoSection() {
  return (
    <section className="relative w-full min-h-[560px] h-[85svh] sm:h-[100svh] lg:h-[110svh] overflow-hidden bg-black">
      {/* Background foto dengan zoom in/out looping (pelan) */}
      <div className="absolute inset-0 animate-zoom-loop">
        <Image
          src="/hero5time2.png"
          alt="AWANG Brand background"
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
      </div>

      {/* Overlay gelap supaya icon tetap terbaca */}
      <div className="absolute inset-0 bg-black/0" />

      {/* Icon.webp di tengah atas foto */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-44 h-44 sm:w-60 sm:h-60 md:w-72 md:h-72 lg:w-96 lg:h-96 drop-shadow-2xl">
          <Image
            src="/logo.webp"
            alt="AWANG Brand Icon"
            fill
            className="object-contain"
            priority
          />
        </div>
      </div>
    </section>
  )
}