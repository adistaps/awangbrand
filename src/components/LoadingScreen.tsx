'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'

export function LoadingScreen() {
  const pathname = usePathname()
  const isAdmin = pathname?.startsWith('/admin')

  const [visible, setVisible] = useState(true)
  const [startAnimation, setStartAnimation] = useState(false)

  // Durasi sapuan logo (dalam detik)
  const SWEEP_DURATION = 3.5
  const START_DELAY = 300 // Delay layar putih awal (ms)

  useEffect(() => {
    if (isAdmin) {
      setVisible(false)
      return
    }

    // Mulai animasi sapuan logo
    const maskTimer = setTimeout(() => setStartAnimation(true), START_DELAY)

    // Tepat ketika sapuan selesai, langsung slide-up tanpa jeda
    const timer = setTimeout(() => {
      setVisible(false)
    }, START_DELAY + SWEEP_DURATION * 1000)

    return () => {
      clearTimeout(maskTimer)
      clearTimeout(timer)
    }
  }, [isAdmin, SWEEP_DURATION, START_DELAY])

  if (isAdmin || !visible) return null

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          // Layar putih ditarik ke atas di akhir
          initial={{ y: 0 }}
          exit={{ y: '-100%' }}
          transition={{
            duration: 0.8,
            ease: [0.76, 0, 0.24, 1],
          }}
          className="fixed inset-0 z-[9999] bg-white flex items-center justify-center overflow-hidden px-4"
        >
          {/* Container Logo di Tengah */}
          <div className="flex items-center justify-center w-full">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.webp"
              alt="AWANG Brand"
              style={{
                WebkitMaskImage:
                  'linear-gradient(90deg, #000 0%, #000 40%, transparent 60%, transparent 100%)',
                maskImage:
                  'linear-gradient(90deg, #000 0%, #000 40%, transparent 60%, transparent 100%)',
                WebkitMaskSize: '250% 100%',
                maskSize: '250% 100%',
                WebkitMaskPosition: startAnimation ? '0% 0' : '100% 0',
                maskPosition: startAnimation ? '0% 0' : '100% 0',
                transition: `mask-position ${SWEEP_DURATION}s cubic-bezier(0.4, 0, 0.2, 1), -webkit-mask-position ${SWEEP_DURATION}s cubic-bezier(0.4, 0, 0.2, 1)`,
              }}
              className="w-[90vw] max-w-[360px] sm:w-96 md:w-[450px] object-contain select-none"
              draggable={false}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
