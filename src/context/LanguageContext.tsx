'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { translations, TranslationKey } from '@/lib/dictionaries'


export type Language = 'id' | 'en'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: TranslationKey | string, fallback?: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('id')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const savedLang = localStorage.getItem('keywell_lang') as Language
    if (savedLang === 'id' || savedLang === 'en') {
      setLanguageState(savedLang)
    }
    setMounted(true)
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem('keywell_lang', lang)
  }

  const t = (key: TranslationKey | string, fallback?: string): string => {
    const langDict = translations[language] as Record<string, string>
    if (langDict && langDict[key]) {
      return langDict[key]
    }
    const fallbackDict = translations.id as Record<string, string>
    if (fallbackDict && fallbackDict[key]) {
      return fallbackDict[key]
    }
    return fallback || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

