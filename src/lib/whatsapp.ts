export function buildWhatsAppLink(message: string) {
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '6287865964604'
  const encoded = encodeURIComponent(message)
  return `https://wa.me/${number}?text=${encoded}`
}

export function buildQuoteWhatsAppMessage(data: {
  name: string
  email: string
  category?: string
  message?: string
}) {
  return `Halo Keywell Arshaka Innovation, saya ingin request quote:\n\nNama: ${data.name}\nEmail: ${data.email}\nKategori: ${data.category || '-'}\nDetail: ${data.message || '-'}`
}

export function buildContactWhatsAppMessage(data: {
  email: string
  website?: string
  comment: string
}) {
  return `Halo Keywell Arshaka Innovation, saya ingin menghubungi tim Anda:\n\nEmail: ${data.email}\nWebsite: ${data.website || '-'}\nPesan: ${data.comment}`
}
