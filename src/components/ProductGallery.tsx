'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'

export function ProductGallery({
  images,
  productName,
}: {
  images: { id: string; image_url: string }[]
  productName: string
}) {
  const [active, setActive] = useState(0)
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Memastikan portal hanya dieksekusi setelah komponen terpasang di browser (Client-Side)
  useEffect(() => {
    setMounted(true)
  }, [])

  // Mengunci scroll layar & menambahkan fitur keyboard ESC untuk menutup popup
  useEffect(() => {
    if (!isOpen) return

    document.body.style.overflow = 'hidden'

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  if (images.length === 0) {
    return (
      <div className="w-full aspect-square bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 text-sm">
        Belum ada foto
      </div>
    )
  }

  return (
    <div>
      {/* Gambar Utama (Tanpa Card Pembungkus) */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="relative w-full aspect-square bg-transparent rounded-2xl overflow-hidden mb-4 cursor-pointer group text-left block focus:outline-none flex items-center justify-center"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={images[active].image_url}
          alt={productName}
          className="w-full h-full object-contain p-0 drop-shadow-md group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute bottom-3 right-3 bg-black/70 text-white text-xs px-3 py-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          🔍 Klik untuk memperbesar
        </div>
      </button>

      {/* Grid Thumbnail */}
      {images.length > 1 && (
        <div className="grid grid-cols-5 gap-2">
          {images.map((img, i) => (
            <button
              key={img.id}
              type="button"
              onClick={() => setActive(i)}
              className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${active === i ? 'border-[#F5A200]' : 'border-transparent opacity-70 hover:opacity-100'
                }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.image_url} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* Popup Lightbox Fullscreen via React Portal */}
      {isOpen &&
        mounted &&
        createPortal(
          <div
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-[999999] w-screen h-screen bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 cursor-zoom-out overflow-hidden"
          >
            {/* Tombol Close Mengambang di Pojok Kanan Atas Layar */}
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="fixed top-5 right-5 sm:top-6 sm:right-6 z-[1000000] w-12 h-12 bg-white/20 hover:bg-white/40 text-white hover:text-black rounded-full flex items-center justify-center backdrop-blur-md transition-all shadow-xl focus:outline-none border border-white/30 cursor-pointer"
              aria-label="Tutup"
            >
              <svg
                className="w-6 h-6 stroke-current"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth="2.5"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Wrapper Gambar (Klik di area gambar tidak akan menutup modal) */}
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-5xl max-h-[85vh] w-full h-full flex items-center justify-center cursor-default"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={images[active].image_url}
                alt={productName}
                className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl bg-white p-2"
              />
            </div>
          </div>,
          document.body
        )}
    </div>
  )
}