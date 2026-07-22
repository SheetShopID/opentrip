'use client'

import { useEffect, useState } from 'react'
import {
  Heart, Share2, Star, MapPin, Clock, Users, CheckCircle2,
  ChevronDown, ChevronUp, Camera, Utensils, Shield, Info,
  ChevronLeft, ChevronRight, Calendar, type LucideIcon,
} from 'lucide-react'
import { fetchTrips, fetchTripDetail, type Trip, type TripDetail } from '@/data/trips'
import TripCard from '@/components/TripCard'
import { useAppNavigate } from '@/hooks/useAppNavigate'

interface TripDetailPageProps {
  tripId: number
}

// Maps the icon *name* stored in the TripInfoCards sheet to an actual
// lucide-react component. Add to this map if new icon names are used.
const ICON_MAP: Record<string, LucideIcon> = {
  Utensils, Shield, Camera, Users,
}

export default function TripDetailPage({ tripId }: TripDetailPageProps) {
  const onNavigate = useAppNavigate()

  const [trip, setTrip] = useState<TripDetail | null>(null)
  const [allTrips, setAllTrips] = useState<Trip[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [liked, setLiked] = useState(false)
  const [expandedDay, setExpandedDay] = useState<number | null>(1)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [galleryIdx, setGalleryIdx] = useState(0)
  const [activeTab, setActiveTab] = useState<'overview' | 'itinerary' | 'include' | 'reviews'>('overview')
  const [pax, setPax] = useState(1)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    setGalleryIdx(0)
    setExpandedDay(1)
    setSelectedDate(null)
    setActiveTab('overview')

    Promise.all([fetchTripDetail(tripId), fetchTrips()])
      .then(([detail, trips]) => {
        if (cancelled) return
        setTrip(detail)
        setAllTrips(trips)
      })
      .catch((err) => {
        if (cancelled) return
        setError(err instanceof Error ? err.message : 'Gagal memuat data trip.')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => { cancelled = true }
  }, [tripId])

  if (loading) {
    return (
      <div className="bg-[#F8FAFF] min-h-screen flex items-center justify-center">
        <p className="text-sm text-[#6B7280]">Memuat trip...</p>
      </div>
    )
  }

  if (error || !trip) {
    return (
      <div className="bg-[#F8FAFF] min-h-screen flex items-center justify-center">
        <p className="text-sm text-red-500">{error || 'Trip tidak ditemukan.'}</p>
      </div>
    )
  }

  const gallery = trip.gallery.length ? trip.gallery : [trip.image]
  const relatedTrips = allTrips.filter((t) => t.id !== tripId).slice(0, 4)

  return (
    <div className="bg-[#F8FAFF] min-h-screen">
      {/* ─── Breadcrumb ─── */}
      <div className="bg-white border-b border-[#E5EEFF]">
        <div className="max-w-[1440px] mx-auto px-8 py-3 flex items-center gap-2 text-sm">
          <button onClick={() => onNavigate('landing')} className="text-[#6B7280] hover:text-[#1A56DB] transition-colors">Beranda</button>
          <span className="text-[#D1D5DB]">/</span>
          <button onClick={() => onNavigate('search')} className="text-[#6B7280] hover:text-[#1A56DB] transition-colors">Open Trip</button>
          <span className="text-[#D1D5DB]">/</span>
          <span className="text-[#0A1F44] font-medium truncate max-w-xs">{trip.title}</span>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">
          {/* ─── Left column ─── */}
          <div>
            {/* Gallery */}
            <div className="relative rounded-3xl overflow-hidden bg-[#0A1F44] mb-6 group">
              <div className="relative h-[460px]">
                <img
                  src={gallery[galleryIdx]}
                  alt={trip.title}
                  className="w-full h-full object-cover transition-opacity duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

                {/* Controls */}
                <button
                  onClick={() => setGalleryIdx((i) => (i - 1 + gallery.length) % gallery.length)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110"
                >
                  <ChevronLeft size={18} className="text-[#0A1F44]" />
                </button>
                <button
                  onClick={() => setGalleryIdx((i) => (i + 1) % gallery.length)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110"
                >
                  <ChevronRight size={18} className="text-[#0A1F44]" />
                </button>

                {/* Photo count */}
                <div className="absolute bottom-4 right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/50 backdrop-blur-sm text-white text-xs font-medium">
                  <Camera size={12} />
                  {galleryIdx + 1} / {gallery.length}
                </div>
              </div>

              {/* Thumbnails */}
              <div className="flex gap-2 p-3">
                {gallery.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setGalleryIdx(i)}
                    className={`w-20 h-14 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${i === galleryIdx ? 'border-[#1A56DB]' : 'border-transparent opacity-60 hover:opacity-90'}`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Title & meta */}
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-[#EFF6FF] text-[#1A56DB]">{trip.category}</span>
                  {trip.badge && (
                    <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-[#1A56DB] text-white">{trip.badge}</span>
                  )}
                </div>
                <h1 className="font-display text-2xl lg:text-3xl font-bold text-[#0A1F44] leading-tight mb-3">
                  {trip.title}
                </h1>
                <div className="flex items-center gap-4 text-sm text-[#6B7280] flex-wrap">
                  <span className="flex items-center gap-1.5"><MapPin size={14} className="text-[#1A56DB]" />{trip.location}</span>
                  <span className="flex items-center gap-1.5"><Clock size={14} className="text-[#1A56DB]" />{trip.duration}</span>
                  <span className="flex items-center gap-1.5"><Users size={14} className="text-[#1A56DB]" />{trip.groupSize}</span>
                  <span className="flex items-center gap-1">
                    <Star size={14} className="fill-[#F59E0B] text-[#F59E0B]" />
                    <strong className="text-[#0A1F44]">{trip.rating}</strong>
                    <span>({trip.reviews} ulasan)</span>
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button className="w-10 h-10 rounded-xl border border-[#E5EEFF] bg-white flex items-center justify-center hover:border-[#1A56DB]/40 transition-colors">
                  <Share2 size={16} className="text-[#6B7280]" />
                </button>
                <button
                  onClick={() => setLiked((v) => !v)}
                  className="w-10 h-10 rounded-xl border border-[#E5EEFF] bg-white flex items-center justify-center hover:border-red-200 transition-colors"
                >
                  <Heart size={16} className={liked ? 'fill-red-500 text-red-500' : 'text-[#6B7280]'} />
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 p-1 bg-white border border-[#E5EEFF] rounded-2xl mb-6">
              {([
                { key: 'overview', label: 'Overview' },
                { key: 'itinerary', label: 'Itinerary' },
                { key: 'include', label: 'Termasuk' },
                { key: 'reviews', label: `Ulasan (${trip.reviews})` },
              ] as const).map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    activeTab === tab.key
                      ? 'bg-[#1A56DB] text-white shadow-sm'
                      : 'text-[#6B7280] hover:text-[#374151]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab content */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl p-6 border border-[#E5EEFF]">
                  <h3 className="font-semibold text-[#0A1F44] mb-3 flex items-center gap-2">
                    <Info size={16} className="text-[#1A56DB]" /> Tentang Trip Ini
                  </h3>
                  {trip.description.map((paragraph, i) => (
                    <p key={i} className={`text-sm text-[#374151] leading-relaxed ${i > 0 ? 'mt-3' : ''}`}>
                      {paragraph}
                    </p>
                  ))}
                </div>

                {/* Highlights */}
                {trip.highlights && trip.highlights.length > 0 && (
                  <div className="bg-white rounded-2xl p-6 border border-[#E5EEFF]">
                    <h3 className="font-semibold text-[#0A1F44] mb-4 flex items-center gap-2">
                      <Star size={16} className="text-[#1A56DB]" /> Trip Highlights
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {trip.highlights.map((h) => (
                        <div key={h} className="flex items-center gap-2.5">
                          <div className="w-5 h-5 rounded-full bg-[#EFF6FF] flex items-center justify-center shrink-0">
                            <CheckCircle2 size={12} className="text-[#1A56DB]" />
                          </div>
                          <span className="text-sm text-[#374151]">{h}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Info cards */}
                {trip.infoCards.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {trip.infoCards.map((item) => {
                      const Icon = ICON_MAP[item.icon] ?? Info
                      return (
                        <div key={item.label} className="bg-white rounded-2xl p-4 border border-[#E5EEFF] text-center">
                          <div className="w-9 h-9 rounded-xl bg-[#EFF6FF] flex items-center justify-center mx-auto mb-2">
                            <Icon size={16} className="text-[#1A56DB]" />
                          </div>
                          <p className="text-xs text-[#6B7280] mb-0.5">{item.label}</p>
                          <p className="text-sm font-semibold text-[#0A1F44]">{item.value}</p>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'itinerary' && (
              <div className="space-y-3">
                {trip.itinerary.map((day) => (
                  <div key={day.day} className="bg-white rounded-2xl border border-[#E5EEFF] overflow-hidden">
                    <button
                      onClick={() => setExpandedDay(expandedDay === day.day ? null : day.day)}
                      className="w-full flex items-center justify-between p-5 text-left"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-[#1A56DB] flex items-center justify-center shrink-0">
                          <span className="text-white text-sm font-bold">{day.day}</span>
                        </div>
                        <div>
                          <p className="text-xs text-[#1A56DB] font-semibold mb-0.5">Hari {day.day}</p>
                          <p className="font-semibold text-[#0A1F44] text-sm">{day.title}</p>
                        </div>
                      </div>
                      {expandedDay === day.day ? (
                        <ChevronUp size={18} className="text-[#6B7280] shrink-0" />
                      ) : (
                        <ChevronDown size={18} className="text-[#6B7280] shrink-0" />
                      )}
                    </button>
                    {expandedDay === day.day && (
                      <div className="px-5 pb-5 border-t border-[#E5EEFF]">
                        <div className="pl-12 pt-4 space-y-2.5">
                          {day.activities.map((act, i) => (
                            <div key={i} className="flex items-start gap-2.5">
                              <div className="w-1.5 h-1.5 rounded-full bg-[#1A56DB] mt-1.5 shrink-0" />
                              <p className="text-sm text-[#374151]">{act}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'include' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-2xl p-6 border border-[#E5EEFF]">
                  <h3 className="font-semibold text-[#0A1F44] mb-4 flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-[#10B981]" /> Termasuk
                  </h3>
                  <div className="space-y-3">
                    {trip.inclusions.map((item) => (
                      <div key={item} className="flex items-start gap-2.5">
                        <CheckCircle2 size={15} className="text-[#10B981] shrink-0 mt-0.5" />
                        <p className="text-sm text-[#374151]">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-white rounded-2xl p-6 border border-[#E5EEFF]">
                  <h3 className="font-semibold text-[#0A1F44] mb-4 flex items-center gap-2">
                    <Info size={16} className="text-[#F59E0B]" /> Tidak Termasuk
                  </h3>
                  <div className="space-y-3">
                    {trip.exclusions.map((item) => (
                      <div key={item} className="flex items-start gap-2.5">
                        <div className="w-4 h-4 rounded-full border-2 border-[#D1D5DB] shrink-0 mt-0.5 flex items-center justify-center">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#9CA3AF]" />
                        </div>
                        <p className="text-sm text-[#374151]">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-4">
                {/* Summary */}
                <div className="bg-white rounded-2xl p-6 border border-[#E5EEFF] flex items-center gap-8">
                  <div className="text-center">
                    <p className="text-5xl font-bold text-[#0A1F44] font-display">{trip.rating}</p>
                    <div className="flex gap-0.5 justify-center my-1.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} size={16} className={i < Math.floor(trip.rating) ? 'fill-[#F59E0B] text-[#F59E0B]' : 'text-[#D1D5DB]'} />
                      ))}
                    </div>
                    <p className="text-xs text-[#6B7280]">{trip.reviews} ulasan</p>
                  </div>
                  <div className="flex-1 space-y-1.5">
                    {[5, 4, 3, 2, 1].map((n) => (
                      <div key={n} className="flex items-center gap-2">
                        <span className="text-xs text-[#6B7280] w-3">{n}</span>
                        <div className="flex-1 h-1.5 bg-[#F3F4F6] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#F59E0B] rounded-full"
                            style={{ width: n === 5 ? '78%' : n === 4 ? '15%' : n === 3 ? '5%' : '1%' }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {trip.reviews.map((r) => (
                  <div key={r.name} className="bg-white rounded-2xl p-5 border border-[#E5EEFF]">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <img src={r.avatar} alt={r.name} className="w-10 h-10 rounded-full object-cover" />
                        <div>
                          <p className="font-semibold text-sm text-[#0A1F44]">{r.name}</p>
                          <p className="text-xs text-[#9CA3AF]">{r.trip} · {r.date}</p>
                        </div>
                      </div>
                      <div className="flex gap-0.5">
                        {Array.from({ length: r.rating }).map((_, i) => (
                          <Star key={i} size={13} className="fill-[#F59E0B] text-[#F59E0B]" />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-[#374151] leading-relaxed">{r.text}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Related trips */}
            {relatedTrips.length > 0 && (
              <div className="mt-12">
                <h2 className="font-display text-2xl font-bold text-[#0A1F44] mb-6">Trip Serupa</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {relatedTrips.map((t) => (
                    <TripCard key={t.id} trip={t} onClick={() => onNavigate('detail', t.id)} size="sm" />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ─── Right sticky column — Booking card ─── */}
          <div>
            <div
              className="bg-white rounded-3xl border border-[#E5EEFF] overflow-hidden sticky top-24"
              style={{ boxShadow: '0 8px 40px rgba(10,31,68,0.10)' }}
            >
              {/* Price */}
              <div className="p-6 border-b border-[#E5EEFF]">
                <div className="flex items-end gap-2 mb-1">
                  {trip.originalPrice && (
                    <p className="text-sm text-[#9CA3AF] line-through">
                      Rp {trip.originalPrice.toLocaleString('id-ID')}
                    </p>
                  )}
                  {trip.originalPrice && (
                    <span className="px-2 py-0.5 rounded-md bg-red-50 text-red-500 text-xs font-semibold">
                      -{Math.round((1 - trip.price / trip.originalPrice) * 100)}%
                    </span>
                  )}
                </div>
                <p className="text-3xl font-bold text-[#0A1F44]">
                  Rp {trip.price.toLocaleString('id-ID')}
                  <span className="text-base font-normal text-[#6B7280]"> /orang</span>
                </p>
                <div className="flex items-center gap-1 mt-2">
                  <Star size={14} className="fill-[#F59E0B] text-[#F59E0B]" />
                  <span className="text-sm font-semibold text-[#0A1F44]">{trip.rating}</span>
                  <span className="text-sm text-[#9CA3AF]">({trip.reviews} ulasan)</span>
                </div>
              </div>

              <div className="p-6 space-y-4">
                {/* Date selection */}
                <div>
                  <p className="text-xs font-semibold text-[#6B7280] uppercase tracking-wide mb-3 flex items-center gap-1.5">
                    <Calendar size={12} /> Pilih Tanggal Keberangkatan
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {trip.departureDates.map((d) => (
                      <button
                        key={d.date}
                        disabled={d.status === 'full'}
                        onClick={() => setSelectedDate(d.date)}
                        className={`p-2.5 rounded-xl border text-left transition-all text-xs ${
                          d.status === 'full'
                            ? 'border-[#E5EEFF] bg-[#F3F4F6] text-[#9CA3AF] cursor-not-allowed'
                            : selectedDate === d.date
                            ? 'border-[#1A56DB] bg-[#EFF6FF]'
                            : 'border-[#E5EEFF] hover:border-[#1A56DB]/40'
                        }`}
                      >
                        <p className={`font-semibold mb-0.5 ${selectedDate === d.date ? 'text-[#1A56DB]' : 'text-[#0A1F44]'}`}>
                          {d.date}
                        </p>
                        <p className={`text-[10px] ${
                          d.status === 'full' ? 'text-red-400' :
                          d.status === 'limited' ? 'text-[#F59E0B]' : 'text-[#10B981]'
                        }`}>
                          {d.status === 'full' ? 'Penuh' : d.status === 'limited' ? `${d.slots} slot tersisa` : `${d.slots} slot`}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Pax selector */}
                <div>
                  <p className="text-xs font-semibold text-[#6B7280] uppercase tracking-wide mb-2">
                    Jumlah Peserta
                  </p>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setPax((p) => Math.max(1, p - 1))}
                      className="w-9 h-9 rounded-xl border border-[#E5EEFF] flex items-center justify-center hover:border-[#1A56DB]/40 font-bold text-[#374151] transition-colors"
                    >
                      −
                    </button>
                    <span className="text-base font-semibold text-[#0A1F44] w-8 text-center">{pax}</span>
                    <button
                      onClick={() => setPax((p) => Math.min(12, p + 1))}
                      className="w-9 h-9 rounded-xl border border-[#E5EEFF] flex items-center justify-center hover:border-[#1A56DB]/40 font-bold text-[#374151] transition-colors"
                    >
                      +
                    </button>
                    <span className="text-sm text-[#6B7280]">orang</span>
                  </div>
                </div>

                {/* Price breakdown */}
                <div className="bg-[#F8FAFF] rounded-2xl p-4 border border-[#E5EEFF] space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#6B7280]">Rp {trip.price.toLocaleString('id-ID')} × {pax} orang</span>
                    <span className="font-medium text-[#0A1F44]">Rp {(trip.price * pax).toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#6B7280]">Biaya layanan</span>
                    <span className="font-medium text-[#0A1F44]">Rp {(50_000 * pax).toLocaleString('id-ID')}</span>
                  </div>
                  <div className="border-t border-[#E5EEFF] pt-2 flex justify-between">
                    <span className="font-semibold text-[#0A1F44]">Total</span>
                    <span className="font-bold text-[#1A56DB] text-lg">
                      Rp {((trip.price + 50_000) * pax).toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => onNavigate('booking', trip.id)}
                  disabled={!selectedDate}
                  className={`w-full py-4 rounded-2xl font-semibold text-sm transition-all duration-150 ${
                    selectedDate
                      ? 'bg-[#1A56DB] text-white hover:bg-[#1343B8] hover:shadow-lg active:scale-98'
                      : 'bg-[#E5EEFF] text-[#9CA3AF] cursor-not-allowed'
                  }`}
                  style={selectedDate ? { boxShadow: '0 4px 16px rgba(26,86,219,0.30)' } : {}}
                >
                  {selectedDate ? 'Pesan Sekarang' : 'Pilih Tanggal Terlebih Dahulu'}
                </button>

                <p className="text-xs text-center text-[#9CA3AF]">
                  Tidak perlu bayar penuh sekarang · Gratis cancel 7 hari sebelum trip
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
