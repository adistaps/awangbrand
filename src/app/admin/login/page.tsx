'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Eye, EyeOff } from 'lucide-react'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError('Email atau password salah.')
      setLoading(false)
      return
    }

    router.push('/admin')
    router.refresh()
  }

  return (
    <div className="min-h-screen w-full flex bg-white font-sans">

      {/* SISI KIRI: Form Login */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 sm:px-12 lg:px-20 xl:px-24 py-10 sm:py-16">
        <div className="max-w-md w-full mx-auto">

          {/* Logo / Brand Mark */}
          <div className="mb-8 sm:mb-10">
            <div className="mb-6">
              <img src="/logo.webp" alt="AWANG Brand" className="h-10 w-auto object-contain" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900 leading-tight">
              Selamat Datang<br />
              <span className="text-[#CC0000]">Kembali 👋</span>
            </h1>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-600 block tracking-wide uppercase">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#CC0000]/30 focus:border-[#CC0000] transition-all placeholder:text-gray-400"
                placeholder="admin@awangbrand.com"
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-600 block tracking-wide uppercase">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3.5 pr-12 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#CC0000]/30 focus:border-[#CC0000] transition-all placeholder:text-gray-400"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg"
                  aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <p className="text-xs text-red-600 font-medium bg-red-50 border border-red-100 px-4 py-3 rounded-xl">
                ⚠️ {error}
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#CC0000] hover:bg-[#a00b22] active:scale-[0.99] text-white font-bold text-sm py-4 rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Memproses...
                </span>
              ) : 'Masuk ke Dashboard'}
            </button>
          </form>

          {/* Footer note */}
          <p className="text-[11px] text-gray-300 text-center mt-8">
            © {new Date().getFullYear()} AWANG Brand Malaysia. All rights reserved.
          </p>

        </div>
      </div>

      {/* SISI KANAN: Visual Panel — hanya tampil di desktop */}
      <div className="hidden lg:block lg:w-1/2 p-3 sm:p-4">
        <div className="relative w-full h-full overflow-hidden rounded-2xl">
          <img
            src="/time1time2.png"
            alt="AWANG Brand Login Visual"
            className="w-full h-full object-cover absolute inset-0"
          />
          {/* Overlay gradasi gelap bawah untuk kontras teks */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10" />
          {/* Teks Overlay */}
          <div className="absolute inset-0 p-10 xl:p-12 flex flex-col justify-between z-10 text-white">
            <div>
              <h2 className="text-3xl xl:text-4xl font-extrabold tracking-tight leading-snug drop-shadow-lg">
                Crafted with Love,<br />
                <span className="text-white/80">Served with Pride.</span>
              </h2>
            </div>

          </div>
        </div>
      </div>

    </div>
  )
}