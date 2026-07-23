'use client'

import { useEffect, useRef, useState } from 'react'
import {
  Search, Calendar, Users, ArrowRight,
  Star, Shield, Headphones, Award, MapPin, TrendingUp,
  Play, ChevronLeft, ChevronRight, Minus, Plus
} from 'lucide-react'
import TripCard from '@/components/TripCard'
import { fetchTrips, fetchDestinations, type Trip, type Destination } from '@/data/trips'
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

const MONTHS_ID = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
]

const WEEKDAYS_ID = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab']

function getCalendarDays(viewDate: Date): (Date | null)[] {
  const year = viewDate.getFullYear()
  const month = viewDate.getMonth()
  const firstWeekday = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const days: (Date | null)[] = []
  for (let i = 0; i < firstWeekday; i++) days.push(null)
  for (let d = 1; d <= daysInMonth; d++) days.push(new Date(year, month, d))
  return days
}

function isSameDay(a: Date | null, b: Date | null) {
  if (!a || !b) return false
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

function isBeforeToday(date: Date) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return date.getTime() < today.getTime()
}

function Reveal({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out motion-reduce:transition-none motion-reduce:!translate-y-0 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
      } ${className}`}
    >
      {children}
    </div>
  )
}

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

  const [trips, setTrips] = useState<Trip[]>([])
  const [destinations, setDestinations] = useState<Destination[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Search card: date picker
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [calendarView, setCalendarView] = useState(() => new Date())
  const [showDatePicker, setShowDatePicker] = useState(false)
  const dateWrapperRef = useRef<HTMLDivElement>(null)

  // Search card: number of people
  const [peopleCount, setPeopleCount] = useState(2)
  const [showPeoplePicker, setShowPeoplePicker] = useState(false)
  const peopleWrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dateWrapperRef.current && !dateWrapperRef.current.contains(e.target as Node)) {
        setShowDatePicker(false)
      }
      if (peopleWrapperRef.current && !peopleWrapperRef.current.contains(e.target as Node)) {
        setShowPeoplePicker(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const formattedDate = selectedDate
    ? `${selectedDate.getDate()} ${MONTHS_ID[selectedDate.getMonth()]} ${selectedDate.getFullYear()}`
    : null

  useEffect(() => {
    let cancelled = false
    Promise.all([fetchTrips(), fetchDestinations()])
      .then(([tripsData, destData]) => {
        if (cancelled) return
        setTrips(tripsData)
        setDestinations(destData)
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Gagal memuat data.')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [])

  const filteredTrips = trips.slice(0, 8).filter((t) => {
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

        <div className="relative max-w-[1440px] mx-auto px-4 sm:px-8 w-full py-14 sm:py-20">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 mb-6">
              <div className="w-1.5 h-1.5 rounded-full bg-[#0EA5E9] animate-pulse" />
              <span className="text-white/90 text-sm font-medium">17.000+ Pulau Menunggu Anda</span>
            </div>

            <h1 className="font-display text-3xl sm:text-4xl lg:text-6xl font-bold text-white leading-tight mb-5">
              Jelajahi Keajaiban<br />
              <span className="text-[#60A5FA] italic">Nusantara</span>{' '}
              Bersama
            </h1>
            <p className="text-white/75 text-base sm:text-lg leading-relaxed mb-8 max-w-lg">
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

              {/* Date picker */}
              <div ref={dateWrapperRef} className="relative flex-1">
                <button
                  type="button"
                  onClick={() => {
                    setShowDatePicker((v) => !v)
                    setShowPeoplePicker(false)
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#F8FAFF] transition-colors cursor-pointer text-left"
                >
                  <Calendar size={18} className="text-[#1A56DB] shrink-0" />
                  <div>
                    <p className="text-xs font-medium text-[#6B7280] mb-0.5">Tanggal</p>
                    <p className={`text-sm font-medium ${formattedDate ? 'text-[#0A1F44]' : 'text-[#9CA3AF]'}`}>
                      {formattedDate ?? 'Pilih tanggal'}
                    </p>
                  </div>
                </button>

                {showDatePicker && (
                  <div
                    className="absolute z-20 top-full left-0 mt-2 w-[calc(100vw-2rem)] max-w-[300px] bg-white rounded-2xl border border-[#E5EEFF] p-4"
                    style={{ boxShadow: '0 16px 48px rgba(10,31,68,0.18)' }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <button
                        type="button"
                        onClick={() =>
                          setCalendarView((v) => new Date(v.getFullYear(), v.getMonth() - 1, 1))
                        }
                        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F8FAFF] text-[#374151] transition-colors"
                        aria-label="Bulan sebelumnya"
                      >
                        <ChevronLeft size={16} />
                      </button>
                      <p className="text-sm font-semibold text-[#0A1F44]">
                        {MONTHS_ID[calendarView.getMonth()]} {calendarView.getFullYear()}
                      </p>
                      <button
                        type="button"
                        onClick={() =>
                          setCalendarView((v) => new Date(v.getFullYear(), v.getMonth() + 1, 1))
                        }
                        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F8FAFF] text-[#374151] transition-colors"
                        aria-label="Bulan berikutnya"
                      >
                        <ChevronRight size={16} />
                      </button>
                    </div>

                    <div className="grid grid-cols-7 gap-1 mb-1">
                      {WEEKDAYS_ID.map((w) => (
                        <div key={w} className="text-center text-[11px] font-medium text-[#9CA3AF] py-1">
                          {w}
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-7 gap-1">
                      {getCalendarDays(calendarView).map((day, i) => {
                        if (!day) return <div key={`empty-${i}`} />
                        const disabled = isBeforeToday(day)
                        const selected = isSameDay(day, selectedDate)
                        const today = isSameDay(day, new Date())
                        return (
                          <button
                            key={day.toISOString()}
                            type="button"
                            disabled={disabled}
                            onClick={() => {
                              setSelectedDate(day)
                              setShowDatePicker(false)
                            }}
                            className={`h-9 rounded-lg text-sm font-medium transition-colors ${
                              disabled
                                ? 'text-[#D1D5DB] cursor-not-allowed'
                                : selected
                                ? 'bg-[#1A56DB] text-white'
                                : today
                                ? 'bg-[#EFF6FF] text-[#1A56DB]'
                                : 'text-[#374151] hover:bg-[#F8FAFF]'
                            }`}
                          >
                            {day.getDate()}
                          </button>
                        )
                      })}
                    </div>

                    {selectedDate && (
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedDate(null)
                          setShowDatePicker(false)
                        }}
                        className="mt-3 text-xs font-medium text-[#6B7280] hover:text-[#1A56DB] transition-colors"
                      >
                        Hapus tanggal
                      </button>
                    )}
                  </div>
                )}
              </div>

              <div className="w-px bg-[#E5EEFF] hidden md:block my-2" />

              {/* Number of people */}
              <div ref={peopleWrapperRef} className="relative flex-1">
                <button
                  type="button"
                  onClick={() => {
                    setShowPeoplePicker((v) => !v)
                    setShowDatePicker(false)
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#F8FAFF] transition-colors cursor-pointer text-left"
                >
                  <Users size={18} className="text-[#1A56DB] shrink-0" />
                  <div>
                    <p className="text-xs font-medium text-[#6B7280] mb-0.5">Jumlah Orang</p>
                    <p className="text-sm font-medium text-[#0A1F44]">
                      {peopleCount} orang
                    </p>
                  </div>
                </button>

                {showPeoplePicker && (
                  <div
                    className="absolute z-20 top-full left-0 mt-2 w-[calc(100vw-2rem)] max-w-[240px] bg-white rounded-2xl border border-[#E5EEFF] p-4"
                    style={{ boxShadow: '0 16px 48px rgba(10,31,68,0.18)' }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-[#0A1F44]">Jumlah Orang</p>
                        <p className="text-xs text-[#6B7280]">Termasuk dewasa &amp; anak</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => setPeopleCount((n) => Math.max(1, n - 1))}
                          disabled={peopleCount <= 1}
                          className="w-8 h-8 flex items-center justify-center rounded-full border border-[#E5EEFF] text-[#1A56DB] hover:bg-[#F8FAFF] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                          aria-label="Kurangi jumlah orang"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-5 text-center text-sm font-semibold text-[#0A1F44]">
                          {peopleCount}
                        </span>
                        <button
                          type="button"
                          onClick={() => setPeopleCount((n) => Math.min(20, n + 1))}
                          disabled={peopleCount >= 20}
                          className="w-8 h-8 flex items-center justify-center rounded-full border border-[#E5EEFF] text-[#1A56DB] hover:bg-[#F8FAFF] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                          aria-label="Tambah jumlah orang"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <button
                onClick={() => onNavigate('search')}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-[#1A56DB] text-white rounded-xl font-semibold text-sm hover:bg-[#1343B8] active:scale-95 transition-all duration-150 md:shrink-0"
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
        <Reveal>
          <div className="max-w-[1440px] mx-auto px-4 sm:px-8 py-6 sm:py-8 grid grid-cols-2 md:grid-cols-4 gap-5 sm:gap-8">
            {STATS.map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-2xl sm:text-3xl font-bold text-[#1A56DB] font-display mb-1">{s.value}</p>
                <p className="text-xs sm:text-sm text-[#6B7280]">{s.label}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* ─── DESTINATIONS ─── */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-8 py-10 sm:py-16">
        <Reveal>
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5 mb-6 sm:mb-8">
          <div>
            <p className="text-xs font-semibold text-[#1A56DB] uppercase tracking-widest mb-2">Destinasi Pilihan</p>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#0A1F44]">
              Jelajahi Destinasi<br />Terpopuler di Indonesia
            </h2>
          </div>

          {/* Trending destination preview — fills the space with something worth looking at,
              doubles as the "lihat semua" entry point on every screen size */}
          {!loading && !error && destinations.length > 0 && (
            <button
              onClick={() => onNavigate('search')}
              className="group flex items-center gap-4 p-3 pr-5 bg-white rounded-2xl border border-[#E5EEFF] hover:border-[#1A56DB]/40 hover:shadow-lg transition-all duration-200 text-left w-full lg:w-auto lg:max-w-sm shrink-0"
              style={{ boxShadow: '0 2px 16px rgba(10,31,68,0.06)' }}
            >
              <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0">
                <img
                  src={destinations[0].image}
                  alt={destinations[0].name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse shrink-0" />
                  <span className="text-[10px] font-semibold text-[#10B981] uppercase tracking-wide">Paling Dicari</span>
                </div>
                <p className="font-semibold text-[#0A1F44] text-sm truncate">{destinations[0].name}</p>
                <p className="text-xs text-[#6B7280]">{destinations[0].tripCount} trip tersedia</p>
              </div>
              <ArrowRight size={16} className="text-[#1A56DB] shrink-0 group-hover:translate-x-1 transition-transform" />
            </button>
          )}
        </div>
        </Reveal>

        {loading ? (
          <div className="py-12 text-center text-sm text-[#6B7280]">Memuat destinasi...</div>
        ) : error ? (
          <div className="py-12 text-center text-sm text-red-500">{error}</div>
        ) : (
          <Reveal>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {destinations.map((dest, i) => (
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
          </Reveal>
        )}
      </section>

      {/* ─── TRIPS ─── */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-8 pb-10 sm:pb-16">
        <div className="flex items-center justify-between mb-5 sm:mb-6 gap-4">
          <div>
            <p className="text-xs font-semibold text-[#1A56DB] uppercase tracking-widest mb-2">Trip Tersedia</p>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#0A1F44]">Open Trip Terpilih</h2>
          </div>
          <button
            onClick={() => onNavigate('search')}
            className="flex items-center gap-1 sm:gap-1.5 text-xs sm:text-sm font-semibold text-[#1A56DB] hover:gap-2.5 transition-all shrink-0"
          >
            Lihat Semua <ArrowRight size={15} />
          </button>
        </div>

        {/* Category pills */}
        <div className="flex items-center gap-2 mb-6 sm:mb-8 overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: 'none' }}>
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

        {loading ? (
          <div className="py-12 text-center text-sm text-[#6B7280]">Memuat trip...</div>
        ) : error ? (
          <div className="py-12 text-center text-sm text-red-500">{error}</div>
        ) : (
          <Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {filteredTrips.map((trip) => (
              <TripCard
                key={trip.id}
                trip={trip}
                onClick={() => onNavigate('detail', trip.id)}
              />
            ))}
          </div>
          </Reveal>
        )}
      </section>

      {/* ─── FEATURES ─── */}
      <section className="bg-white border-y border-[#E5EEFF]">
        <Reveal>
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 py-10 sm:py-16">
          <div className="text-center mb-8 sm:mb-12">
            <p className="text-xs font-semibold text-[#1A56DB] uppercase tracking-widest mb-2">Mengapa OpenTrip?</p>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#0A1F44]">Perjalanan Terbaik Dimulai di Sini</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="p-5 sm:p-6 rounded-2xl bg-[#F8FAFF] border border-[#E5EEFF] hover:border-[#1A56DB]/30 hover:-translate-y-1 transition-all duration-200"
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
        </Reveal>
      </section>

      {/* ─── TESTIMONIALS ─── */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-8 py-10 sm:py-16">
        <Reveal>
        <div className="text-center mb-8 sm:mb-12">
          <p className="text-xs font-semibold text-[#1A56DB] uppercase tracking-widest mb-2">Testimoni</p>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#0A1F44]">Kata Mereka yang Sudah Jalan</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.name}
              className="bg-white rounded-2xl p-5 sm:p-6 border border-[#E5EEFF]"
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
        </Reveal>
      </section>

      {/* ─── CTA BANNER ─── */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-8 pb-10 sm:pb-16">
        <Reveal>
        <div
          className="relative overflow-hidden rounded-3xl p-6 sm:p-12 lg:p-16 flex flex-col lg:flex-row items-center justify-between gap-6 sm:gap-8"
          style={{ background: 'linear-gradient(135deg, #0A1F44 0%, #1A56DB 60%, #0EA5E9 100%)' }}
        >
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-white rounded-full translate-y-1/2" />
          </div>
          <div className="relative text-center lg:text-left">
            <p className="text-[#93C5FD] text-sm font-semibold uppercase tracking-widest mb-3">Mulai Petualangan Anda</p>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3">
              Ribuan Trip Menunggu.<br />Kapan Anda Siap?
            </h2>
            <p className="text-white/70 max-w-md">
              Bergabunglah dengan 50.000+ traveler yang telah menjelajah Indonesia bersama OpenTrip.
            </p>
          </div>
          <div className="relative flex flex-col sm:flex-row gap-3 w-full sm:w-auto shrink-0">
            <button
              onClick={() => onNavigate('search')}
              className="w-full sm:w-auto px-8 py-4 bg-white text-[#1A56DB] font-semibold rounded-2xl hover:shadow-lg hover:-translate-y-0.5 transition-all duration-150"
            >
              Jelajahi Sekarang
            </button>
            <button className="w-full sm:w-auto px-8 py-4 bg-white/15 backdrop-blur-sm border border-white/25 text-white font-semibold rounded-2xl hover:bg-white/25 transition-colors">
              Pelajari Lebih
            </button>
          </div>
        </div>
        </Reveal>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="bg-[#0A1F44] text-white">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 py-10 sm:py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 pb-8 border-b border-white/10">
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
