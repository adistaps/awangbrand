import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { DM_Sans } from 'next/font/google'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { LoadingScreen } from '@/components/LoadingScreen'
import { LanguageProvider } from '@/context/LanguageContext'
import './globals.css'

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-dm-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://awangbrand.com'),
  title: {
    default: 'AWANG Brand — Authentic Asian Culinary Pastes & Products',
    template: '%s | AWANG Brand',
  },
  description:
    'AWANG Brand — Authentic Asian cooking pastes, sauces, 100% natural ingredients, certified HALAL products, and easy home recipes.',
  keywords: [
    'AWANG Brand',
    'cooking paste',
    'bumbu instan',
    'bumbu masakan',
    'HALAL certified',
    '100% natural ingredients',
    'Malay cuisine',
    'Asian paste',
    'sambal',
    'curry paste',
  ],
  authors: [{ name: 'AWANG Brand', url: 'https://awangbrand.com' }],
  creator: 'AWANG Brand',
  publisher: 'AWANG Brand',
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://awangbrand.com',
    siteName: 'AWANG Brand',
    title: 'AWANG Brand — Authentic Asian Culinary Pastes & Products',
    description:
      'Authentic Asian cooking pastes, sauces, 100% natural ingredients, certified HALAL products, and easy home recipes.',
    images: [
      {
        url: '/og-image.webp',
        width: 1200,
        height: 630,
        alt: 'AWANG Brand — Authentic Asian Pastes',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AWANG Brand — Authentic Asian Culinary Pastes & Products',
    description:
      'Authentic Asian cooking pastes, sauces, 100% natural ingredients, certified HALAL products, and easy home recipes.',
    images: ['/og-image.webp'],
  },
  icons: {
    icon: '/icon.webp',
    apple: '/icon.webp',
    shortcut: '/icon.webp',
  },
  alternates: {
    canonical: 'https://awangbrand.com',
    languages: { 'en-US': 'https://awangbrand.com' },
  },
}

export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="id" className={`bg-background ${dmSans.variable}`}>
      <body className="antialiased">
        <LanguageProvider>
          <LoadingScreen />
          <Navbar />
          {children}
          <Footer />
        </LanguageProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}