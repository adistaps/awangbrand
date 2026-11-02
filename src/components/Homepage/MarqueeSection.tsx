'use client'

import React from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import type { Variants, Transition } from 'framer-motion'

export function MarqueeSection() {
  const textPhrase = "IT'S GOTTA BE"
  const words = textPhrase.split(" ")

  // --- 1. KONFIGURASI WARNA (Background & Font & Logo) ---
  const colorCycleDuration = 6
  const sharedColorTransition: Transition = {
    duration: colorCycleDuration,
    repeat: Infinity,
    repeatType: 'loop',
    ease: 'easeInOut',
    times: [0, 0.25, 0.5, 0.75, 1],
  }

  // --- 2. KONFIGURASI GERAKAN (Memantul / Spring - Persis seperti IntroSection) ---
  const letterVariants: Variants = {
    initial: {
      opacity: 0,
      y: -50,
      rotate: -8, // Miring ke kiri saat muncul
    },
    animate: (currentDelay: number) => ({
      opacity: 1,
      y: 0,
      rotate: 0,
      transition: {
        type: 'spring',
        damping: 12,
        stiffness: 150,
        delay: currentDelay, // Delay akan dihitung berurutan per karakter
        repeat: Infinity,
        repeatType: 'reverse', // Mundur otomatis
        repeatDelay: 2,
      },
    }),
  }

  let charCount = 0

  return (
    <motion.section
      // Animasi Background menggunakan object literal agar tidak bentrok dengan pergerakan
      animate={{
        backgroundColor: ['#CC0000', '#590014', '#FDFBF7', '#FDFBF7', '#CC0000']
      }}
      transition={sharedColorTransition}
      className="relative z-10 w-full h-[280px] sm:h-[350px] md:h-[450px] flex items-center justify-center overflow-hidden border-0 border-none outline-none ring-0 shadow-none -my-px"
    >
      <div className="w-full max-w-[1600px] mx-auto flex items-center justify-between px-4 sm:px-8 md:px-12 gap-2">

        {/* Teks: Dipecah menjadi per kata, lalu per huruf */}
        {words.map((word, wordIdx) => (
          <span key={wordIdx} className="flex whitespace-nowrap">
            {word.split('').map((char, charIdx) => {
              const currentDelay = charCount * 0.05
              charCount++

              return (
                <motion.span
                  key={charIdx}
                  custom={currentDelay}
                  variants={letterVariants} // Menggunakan animasi Spring
                  initial="initial"
                  animate="animate"
                  className="inline-block text-[11vw] sm:text-[10vw] md:text-[9.5vw] font-black uppercase leading-none tracking-tighter font-heinz"
                >
                  <motion.span
                    // Animasi warna teks dipisah ke dalam child
                    animate={{
                      color: ['#FFFFFF', '#FFFFFF', '#F1AAB2', '#CC0000', '#FFFFFF']
                    }}
                    transition={sharedColorTransition}
                    className="block"
                  >
                    {char}
                  </motion.span>
                </motion.span>
              )
            })}
          </span>
        ))}

        {/* LOGO (Sekarang pasti ikut bergerak karena strukturnya sudah diperbaiki) */}
        <motion.div
          custom={charCount * 0.05} // Meneruskan antrean delay dari huruf terakhir
          variants={letterVariants} // Memakai animasi memantul yang SAMA PERSIS dengan teks
          initial="initial"
          animate="animate"
          className="relative flex items-center justify-center shrink-0 origin-center"
          style={{ width: '22vw', height: '10vw', maxWidth: '350px', maxHeight: '140px' }}
        >
          <motion.div
            // Animasi inverse filter dipisah ke child agar logo bisa memantul dengan lancar
            animate={{
              filter: [
                'brightness(0) invert(1)', // Putih
                'brightness(0) invert(1)', // Putih
                'brightness(1) invert(0)', // Original
                'brightness(1) invert(0)', // Original
                'brightness(0) invert(1)', // Putih
              ]
            }}
            transition={sharedColorTransition}
            className="relative w-full h-full"
          >
            <Image
              src="/logo.webp"
              alt="Brand Logo"
              fill
              className="object-contain"
              priority
            />
          </motion.div>
        </motion.div>

      </div>
    </motion.section>
  )
}