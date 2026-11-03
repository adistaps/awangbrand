'use client'

import React from 'react'
import { motion } from 'framer-motion'
import type { Variants, Transition } from 'framer-motion'

export function MarqueeAbout() {
  const textPhrase = 'TASTE THE HERITAGE'
  const words = textPhrase.split(' ')

  // --- 1. KONFIGURASI WARNA (Background & Font) ---
  const colorCycleDuration = 6
  const sharedColorTransition: Transition = {
    duration: colorCycleDuration,
    repeat: Infinity,
    repeatType: 'loop',
    ease: 'easeInOut',
    times: [0, 0.25, 0.5, 0.75, 1],
  }

  // --- 2. KONFIGURASI GERAKAN (Memantul / Spring) ---
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
        delay: currentDelay, // Delay dihitung berurutan per karakter
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
        backgroundColor: ['#CC0000', '#540B26', '#FAF6ED', '#FAF6ED', '#CC0000'],
      }}
      transition={sharedColorTransition}
      className="relative z-10 w-full h-[140px] sm:h-[350px] md:h-[450px] flex items-center justify-center overflow-hidden border-0 border-none outline-none ring-0 shadow-none -my-px"
    >
      <div className="w-full max-w-[1600px] mx-auto flex items-center justify-center px-4 sm:px-8 md:px-12 gap-2 sm:gap-6 md:gap-8 flex-wrap text-center">
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
                  variants={letterVariants} // Menggunakan animasi Spring memantul
                  initial="initial"
                  animate="animate"
                  className="inline-block text-[10vw] sm:text-[9vw] md:text-[8.5vw] font-black uppercase leading-none tracking-tighter font-heinz select-none"
                >
                  <motion.span
                    // Animasi warna teks dipisah ke dalam child (warna putih saat background merah diganti warna #FAF6ED)
                    animate={{
                      color: ['#FAF6ED', '#FAF6ED', '#F1AAB2', '#CC0000', '#FAF6ED'],
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
      </div>
    </motion.section>
  )
}

// Export alias default
export default MarqueeAbout