import Link from 'next/link'
import { Compass } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="bg-[#F8FAFF] min-h-screen flex items-center justify-center px-8">
      <div className="max-w-md w-full text-center">
        <div className="w-20 h-20 rounded-full bg-[#EFF6FF] flex items-center justify-center mx-auto mb-6">
          <Compass size={32} className="text-[#1A56DB]" />
        </div>
        <h1 className="font-display text-2xl font-bold text-[#0A1F44] mb-2">
          Halaman Tidak Ditemukan
        </h1>
        <p className="text-sm text-[#6B7280] mb-8">
          Sepertinya trip yang Anda cari sudah tidak tersedia atau alamatnya salah.
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center px-6 py-3 bg-[#1A56DB] text-white rounded-xl font-semibold text-sm hover:bg-[#1343B8] transition-colors"
        >
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  )
}
