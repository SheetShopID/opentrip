'use client'

import { useState } from 'react'
import {
  Search, Calendar, Users, ArrowRight,
  Star, Shield, Headphones, Award, MapPin, TrendingUp,
  Play
} from 'lucide-react'
import TripCard from '@/components/TripCard'
import { TRIPS, DESTINATIONS } from '@/data/trips'
import { useAppNavigate } from '@/hooks/useAppNavigate'

const CATEGORIES = ['Semua', 'Open Trip', 'Private Tour', 'Diving', 'Trekking', 'Budaya', 'Honeymoon']

const STATS = [
  { value: '50K+', label: 'Traveler Puas' },
  { value: '200+', label: 'Destinasi' },
  { value: '4.9★', label: 'Rating Rata-rata' },
  { value: '8 Th', label: 'Pengalaman' },
]

const FEATURES = [
  {
    icon: Shield,
    title: 'Terpercaya & Berlisensi',
    desc: 'Semua trip operator telah terverifikasi dan berlisensi resmi dari Kemenparekraf.',
  },
  {
    icon: Headphones,
    title: '24/7 Customer Support',
    desc: 'Tim kami siap membantu kapanpun Anda membutuhkan, sebelum dan selama perjalanan.',
  },
  {
    icon: Award,
    title: 'Best Price Guarantee',
    desc: 'Kami menjamin harga terbaik. Temukan lebih murah, kami refund selisihnya.',
  },
  {
    icon: TrendingUp,
    title: 'Kurator Perjalanan Expert',
    desc: 'Setiap itinerary dirancang oleh travel expert lokal dengan pengalaman bertahun-tahun.',
  },
]

const TESTIMONIALS = [
  {
    name: 'Sari Dewi',
    location: 'Jakarta',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&auto=format',
    text: 'Open trip Raja Ampat bersama OpenTrip adalah pengalaman terbaik dalam hidup saya. Organisasinya sangat rapi, pemandunya ramah dan profesional.',
    trip: 'Raja Ampat Open Trip',
    rating: 5,
  },
  {
    name: 'Budi Santoso',
    location: 'Surabaya',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&auto=format',
    text: 'Booking mudah, harga transparan, tidak ada biaya tersembunyi. Trip ke Labuan Bajo benar-benar melebihi ekspektasi saya.',
    trip: 'Labuan Bajo & Komodo',
    rating: 5,
  },
  {
    name: 'Maya Putri',
    location: 'Bandung',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&auto=format',
    text: 'Sudah 3x booking di OpenTrip dan selalu memuaskan. Customer servicenya responsif, itinerary selalu sesuai yang dijanjikan.',
    trip: 'Bali Spiritual Journey',
    rating: 5,
  },
]

export default function LandingPage() {
  const onNavigate = useAppNavigate()
  const [activeCategory, setActiveCategory] = useState('Semua')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredTrips = TRIPS.slice(0, 8).filter((t) => {
    const catMatch = activeCategory === 'Semua' || t.category === activeCategory
    const qMatch = !searchQuery || t.title.toLowerCase().includes(searchQuery.toLowerCase())
    return catMatch && qMatch
  })

  return (
    <div className="bg-[#F8FAFF] min-h-screen">
      {/* ─── HERO ─── */}
      <section className="relative min-h-[620px] flex items-center overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0 bg-[#0A1F44]">
          <img
            src="https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1600&h=900&fit=crop&auto=format"
            alt="Raja Ampat Indonesia"
            className="w-full h-full object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A1F44]/80 via-[#0A1F44]/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A1F44]/60 via-transparent to-transparent" />
        </div>

        {/* Play button (decorative) */}
        <button className="absolute right-[10%] top-1/2 -translate-y-1/2 hidden lg:flex flex-col items-center gap-3 group">
          <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Play size={20} className="text-white fill-white ml-1" />
          </div>
          <span className="text-white/70 text-xs font-medium">Tonton Video</span>
        </button>

        <div className="relative max-w-[1440px] mx-auto px-8 w-full py-20">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 mb-6">
              <div className="w-1.5 h-1.5 rounded-full bg-[#0EA5E9] animate-pulse" />
              <span className="text-white/90 text-sm font-medium">17.000+ Pulau Menunggu Anda</span>
            </div>

            <h1 className="font-display text-5xl lg:text-6xl font-bold text-white leading-tight mb-5">
              Jelajahi Keajaiban<br />
              <span className="text-[#60A5FA] italic">Nusantara</span>{' '}
              Bersama
            </h1>
            <p className="text-white/75 text-lg leading-relaxed mb-8 max-w-lg">
              Platform open trip terpercaya untuk destinasi eksotis Indonesia. Bergabung dengan ribuan traveler dari seluruh penjuru nusantara.
            </p>

            {/* Search card */}
            <div
              className="bg-white/95 backdrop-blur-xl rounded-2xl p-2 flex flex-col md:flex-row gap-2"
              style={{ boxShadow: '0 16px 48px rgba(10,31,68,0.24)' }}
            >
              <div className="flex-1 flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#F8FAFF] transition-colors cursor-text">
                <Search size={18} className="text-[#1A56DB] shrink-0" />
                <div>
                  <p className="text-xs font-medium text-[#6B7280] mb-0.5">Destinasi</p>
                  <input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Raja Ampat, Bali, Lombok..."
                    className="text-sm font-medium text-[#0A1F44] placeholder:text-[#9CA3AF] bg-transparent outline-none w-full"
                  />
                </div>
              </div>
              <div className="w-px bg-[#E5EEFF] hidden md:block my-2" />
              <div className="flex-1 flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#F8FAFF] transition-colors cursor-pointer">
                <Calendar size={18} className="text-[#1A56DB] shrink-0" />
                <div>
                  <p className="text-xs font-medium text-[#6B7280] mb-0.5">Tanggal</p>
                  <p className="text-sm font-medium text-[#9CA3AF]">Pilih tanggal</p>
                </div>
              </div>
              <div className="w-px bg-[#E5EEFF] hidden md:block my-2" />
              <div className="flex-1 flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#F8FAFF] transition-colors cursor-pointer">
                <Users size={18} className="text-[#1A56DB] shrink-0" />
                <div>
                  <p className="text-xs font-medium text-[#6B7280] mb-0.5">Jumlah Orang</p>
                  <p className="text-sm font-medium text-[#9CA3AF]">2 orang</p>
                </div>
              </div>
              <button
                onClick={() => onNavigate('search')}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-[#1A56DB] text-white rounded-xl font-semibold text-sm hover:bg-[#1343B8] active:scale-95 transition-all duration-150 shrink-0"
                style={{ boxShadow: '0 4px 16px rgba(26,86,219,0.35)' }}
              >
                <Search size={16} />
                Cari Trip
              </button>
            </div>

            {/* Popular searches */}
            <div className="flex items-center gap-2 mt-4 flex-wrap">
              <span className="text-white/50 text-xs">Populer:</span>
              {['Raja Ampat', 'Labuan Bajo', 'Bali 3D2N', 'Komodo Trip'].map((s) => (
                <button
                  key={s}
                  onClick={() => onNavigate('search')}
                  className="px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white/75 text-xs hover:bg-white/20 transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── STATS ─── */}
      <section className="bg-white border-y border-[#E5EEFF]">
        <div className="max-w-[1440px] mx-auto px-8 py-8 grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-3xl font-bold text-[#1A56DB] font-display mb-1">{s.value}</p>
              <p className="text-sm text-[#6B7280]">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── DESTINATIONS ─── */}
      <section className="max-w-[1440px] mx-auto px-8 py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-xs font-semibold text-[#1A56DB] uppercase tracking-widest mb-2">Destinasi Pilihan</p>
            <h2 className="font-display text-3xl font-bold text-[#0A1F44]">
              Jelajahi Destinasi<br />Terpopuler di Indonesia
            </h2>
          </div>
          <button
            onClick={() => onNavigate('search')}
            className="hidden md:flex items-center gap-1.5 text-sm font-semibold text-[#1A56DB] hover:gap-2.5 transition-all"
          >
            Lihat Semua <ArrowRight size={15} />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {DESTINATIONS.map((dest, i) => (
            <button
              key={dest.id}
              onClick={() => onNavigate('search')}
              className={`group relative overflow-hidden rounded-2xl cursor-pointer ${i === 0 ? 'col-span-2 row-span-2' : ''}`}
              style={{ aspectRatio: i === 0 ? '1' : '3/4' }}
            >
              <img
                src={dest.image}
                alt={dest.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-108"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <p className="text-white font-semibold text-sm leading-tight">{dest.name}</p>
                <p className="text-white/70 text-xs mt-0.5">{dest.tripCount} trip tersedia</p>
              </div>
              <div className="absolute inset-0 border-2 border-white/0 group-hover:border-white/30 rounded-2xl transition-colors duration-300" />
            </button>
          ))}
        </div>
      </section>

      {/* ─── TRIPS ─── */}
      <section className="max-w-[1440px] mx-auto px-8 pb-16">
        <div className="flex items-end justify-between mb-6">
          <div>
            <p className="text-xs font-semibold text-[#1A56DB] uppercase tracking-widest mb-2">Trip Tersedia</p>
            <h2 className="font-display text-3xl font-bold text-[#0A1F44]">Open Trip Terpilih</h2>
          </div>
          <button
            onClick={() => onNavigate('search')}
            className="hidden md:flex items-center gap-1.5 text-sm font-semibold text-[#1A56DB] hover:gap-2.5 transition-all"
          >
            Lihat Semua <ArrowRight size={15} />
          </button>
        </div>

        {/* Category pills */}
        <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-150 ${
                activeCategory === cat
                  ? 'bg-[#1A56DB] text-white shadow-sm'
                  : 'bg-white border border-[#E5EEFF] text-[#374151] hover:border-[#1A56DB] hover:text-[#1A56DB]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {filteredTrips.map((trip) => (
            <TripCard
              key={trip.id}
              trip={trip}
              onClick={() => onNavigate('detail', trip.id)}
            />
          ))}
        </div>
      </section>

      {/* ─── FEATURES ─── */}
      <section className="bg-white border-y border-[#E5EEFF]">
        <div className="max-w-[1440px] mx-auto px-8 py-16">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold text-[#1A56DB] uppercase tracking-widest mb-2">Mengapa OpenTrip?</p>
            <h2 className="font-display text-3xl font-bold text-[#0A1F44]">Perjalanan Terbaik Dimulai di Sini</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="p-6 rounded-2xl bg-[#F8FAFF] border border-[#E5EEFF] hover:border-[#1A56DB]/30 hover:-translate-y-1 transition-all duration-200"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#EFF6FF] flex items-center justify-center mb-4">
                  <f.icon size={22} className="text-[#1A56DB]" />
                </div>
                <h3 className="font-semibold text-[#0A1F44] mb-2">{f.title}</h3>
                <p className="text-sm text-[#6B7280] leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ─── */}
      <section className="max-w-[1440px] mx-auto px-8 py-16">
        <div className="text-center mb-12">
          <p className="text-xs font-semibold text-[#1A56DB] uppercase tracking-widest mb-2">Testimoni</p>
          <h2 className="font-display text-3xl font-bold text-[#0A1F44]">Kata Mereka yang Sudah Jalan</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.name}
              className="bg-white rounded-2xl p-6 border border-[#E5EEFF]"
              style={{ boxShadow: '0 2px 16px rgba(10,31,68,0.06)' }}
            >
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} size={14} className="fill-[#F59E0B] text-[#F59E0B]" />
                ))}
              </div>
              <p className="text-[#374151] text-sm leading-relaxed mb-5">&quot;{t.text}&quot;</p>
              <div className="flex items-center gap-3 pt-4 border-t border-[#E5EEFF]">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold text-sm text-[#0A1F44]">{t.name}</p>
                  <p className="text-xs text-[#6B7280]">{t.location} · {t.trip}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── CTA BANNER ─── */}
      <section className="max-w-[1440px] mx-auto px-8 pb-16">
        <div
          className="relative overflow-hidden rounded-3xl p-12 lg:p-16 flex flex-col lg:flex-row items-center justify-between gap-8"
          style={{ background: 'linear-gradient(135deg, #0A1F44 0%, #1A56DB 60%, #0EA5E9 100%)' }}
        >
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-white rounded-full translate-y-1/2" />
          </div>
          <div className="relative text-center lg:text-left">
            <p className="text-[#93C5FD] text-sm font-semibold uppercase tracking-widest mb-3">Mulai Petualangan Anda</p>
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-white mb-3">
              Ribuan Trip Menunggu.<br />Kapan Anda Siap?
            </h2>
            <p className="text-white/70 max-w-md">
              Bergabunglah dengan 50.000+ traveler yang telah menjelajah Indonesia bersama OpenTrip.
            </p>
          </div>
          <div className="relative flex flex-col sm:flex-row gap-3 shrink-0">
            <button
              onClick={() => onNavigate('search')}
              className="px-8 py-4 bg-white text-[#1A56DB] font-semibold rounded-2xl hover:shadow-lg hover:-translate-y-0.5 transition-all duration-150"
            >
              Jelajahi Sekarang
            </button>
            <button className="px-8 py-4 bg-white/15 backdrop-blur-sm border border-white/25 text-white font-semibold rounded-2xl hover:bg-white/25 transition-colors">
              Pelajari Lebih
            </button>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="bg-[#0A1F44] text-white">
        <div className="max-w-[1440px] mx-auto px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pb-8 border-b border-white/10">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-[#1A56DB] flex items-center justify-center">
                  <MapPin size={14} className="text-white" />
                </div>
                <span className="font-semibold text-white text-lg">Open<span className="text-[#60A5FA]">Trip</span></span>
              </div>
              <p className="text-white/50 text-sm leading-relaxed mb-4">
                Platform open trip terpercaya untuk petualangan terbaik di Nusantara.
              </p>
              <div className="flex gap-2">
                {['App Store', 'Google Play'].map((s) => (
                  <div key={s} className="px-3 py-1.5 rounded-lg border border-white/20 text-xs text-white/60">{s}</div>
                ))}
              </div>
            </div>
            {[
              { title: 'Destinasi', items: ['Raja Ampat', 'Labuan Bajo', 'Bali', 'Lombok', 'Yogyakarta'] },
              { title: 'Perusahaan', items: ['Tentang Kami', 'Karir', 'Blog Travel', 'Press Kit', 'Mitra'] },
              { title: 'Bantuan', items: ['Pusat Bantuan', 'Kebijakan Refund', 'Syarat & Ketentuan', 'Privasi', 'Kontak'] },
            ].map((col) => (
              <div key={col.title}>
                <p className="font-semibold text-white/90 text-sm mb-4">{col.title}</p>
                <div className="flex flex-col gap-2.5">
                  {col.items.map((item) => (
                    <a key={item} href="#" className="text-sm text-white/50 hover:text-white/90 transition-colors">
                      {item}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-white/40 text-xs">© 2025 OpenTrip Indonesia. Hak cipta dilindungi undang-undang.</p>
            <div className="flex items-center gap-3">
              <span className="text-white/40 text-xs">Ikuti kami:</span>
              {['Instagram', 'TikTok', 'YouTube', 'Facebook'].map((s) => (
                <a key={s} href="#" className="text-white/50 hover:text-white text-xs transition-colors">{s}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
