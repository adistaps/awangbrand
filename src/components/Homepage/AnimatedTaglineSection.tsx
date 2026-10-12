'use client'

import { motion, Variants } from 'framer-motion'
import Image from 'next/image'

interface AnimatedTextProps {
  text: string
  className?: string
  baseDelay?: number
}

function AnimatedFallingText({ text, className, baseDelay = 0 }: AnimatedTextProps) {
  const words = text.split(' ')

  // Hitung akumulasi delay huruf agar stagger berjalan mulus
  let charCount = 0

  return (
    <div className={`flex flex-wrap justify-start gap-x-[0.25em] ${className}`}>
      {words.map((word, wordIdx) => (
        <span key={wordIdx} className="inline-block whitespace-nowrap">
          {word.split('').map((char) => {
            const currentDelay = baseDelay + charCount * 0.05
            charCount++

            const letterVariants: Variants = {
              initial: {
                opacity: 0,
                y: -50,
                rotate: -8,
              },
              animate: {
                opacity: 1,
                y: 0,
                rotate: 0,
                transition: {
                  type: 'spring',
                  damping: 12,
                  stiffness: 150,
                  delay: currentDelay,
                  repeat: Infinity,
                  repeatType: 'reverse',
                  repeatDelay: 2.5,
                },
              },
            }

            return (
              <motion.span
                key={charCount}
                variants={letterVariants}
                initial="initial"
                animate="animate"
                className="inline-block"
              >
                {char}
              </motion.span>
            )
          })}
        </span>
      ))}
    </div>
  )
}

export function AnimatedTaglineSection() {
  return (
    <section className="relative w-full bg-[#C8102E] pt-12 sm:pt-16 md:pt-20 pb-0 px-4 sm:px-6 lg:px-12 flex items-end justify-center overflow-hidden">
      <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row items-end justify-between gap-8 lg:gap-6 relative w-full">
        {/* Sisi Kiri: Teks Tagline (Rata Kiri) */}
        <div className="w-full lg:w-[55%] text-left flex flex-col items-start justify-center pb-12 sm:pb-16 md:pb-20 gap-1 sm:gap-2 z-10">
          {/* Baris 1 - KHUSUS MOBILE: Memperbesar ukuran dari text-4xl ke text-6xl */}
          <AnimatedFallingText
            text="SIZZLE"
            baseDelay={0}
            className="text-6xl sm:text-6xl md:text-7xl lg:text-[6rem] xl:text-[7.5rem] font-black uppercase tracking-tighter leading-[0.9] text-[#4A0D18]"
          />

          {/* Baris 2 - KHUSUS MOBILE: Memperbesar ukuran dari text-5xl ke text-7xl */}
          <AnimatedFallingText
            text="SLURP"
            baseDelay={0.4}
            className="text-7xl sm:text-7xl md:text-8xl lg:text-[7rem] xl:text-[9rem] font-black uppercase tracking-tighter leading-[0.9] text-white my-1"
          />

          {/* Baris 3 - KHUSUS MOBILE: Memperbesar ukuran dari text-4xl ke text-6xl */}
          <AnimatedFallingText
            text="REPEAT"
            baseDelay={0.8}
            className="text-6xl sm:text-6xl md:text-7xl lg:text-[6rem] xl:text-[7.5rem] font-black uppercase tracking-tighter leading-[0.9] text-[#4A0D18]"
          />
        </div>

        {/* Sisi Kanan: Gambar Orang (people.webp) menyatu rapat ke dasar section */}
        <div className="w-full lg:w-[45%] flex justify-center lg:justify-end items-end relative self-end">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="relative w-full max-w-[500px] sm:max-w-[600px] lg:max-w-[700px] xl:max-w-[780px] h-[380px] sm:h-[480px] md:h-[550px] lg:h-[620px] xl:h-[680px] -mb-1"
          >
            <Image
              src="/people.webp"
              alt="People AWANG"
              fill
              className="object-contain object-bottom"
              sizes="(max-width: 1024px) 100vw, 45vw"
              priority
            />
          </motion.div>
        </div>
      </div>
    </section>
  )
}