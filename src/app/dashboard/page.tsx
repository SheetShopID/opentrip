'use client'

import { useEffect, useState } from 'react'
import {
  LayoutDashboard, BookOpen, Heart, Settings, Bell, LogOut,
  MapPin, Clock, Users, Star, ChevronRight, TrendingUp,
  CheckCircle2, XCircle, AlertCircle, Calendar, Download,
  Camera, Edit3, Globe
} from 'lucide-react'
import { fetchTrips, type Trip } from '@/data/trips'
import { useAppNavigate } from '@/hooks/useAppNavigate'

type DashboardTab = 'overview' | 'bookings' | 'wishlist' | 'settings'

// Mock booking history — references trips by id instead of embedding the
// trip object directly, since the trip list is now fetched at runtime.
const BOOKINGS = [
  {
    id: 'OT-2025-84321',
    tripId: 1,
    date: '14 Mar 2025',
    pax: 2,
    status: 'confirmed',
    paidAmount: 2_520_000,
    totalAmount: 8_500_000,
    bookingDate: '20 Jan 2025',
  },
  {
    id: 'OT-2025-71204',
    tripId: 2,
    date: '28 Feb 2025',
    pax: 1,
    status: 'pending',
    paidAmount: 930_000,
    totalAmount: 3_150_000,
    bookingDate: '15 Jan 2025',
  },
  {
    id: 'OT-2024-55891',
    tripId: 5,
    date: '22 Des 2024',
    pax: 3,
    status: 'completed',
    paidAmount: 2_850_000,
    totalAmount: 2_850_000,
    bookingDate: '1 Des 2024',
  },
  {
    id: 'OT-2024-43102',
    tripId: 3,
    date: '15 Nov 2024',
    pax: 2,
    status: 'completed',
    paidAmount: 3_700_000,
    totalAmount: 3_700_000,
    bookingDate: '1 Nov 2024',
  },
]

const WISHLIST_IDS = [1, 3, 5, 7]

const STATUS_CONFIG = {
  confirmed: { label: 'Dikonfirmasi', color: 'text-[#10B981]', bg: 'bg-[#ECFDF5]', icon: CheckCircle2 },
  pending: { label: 'Menunggu Pembayaran', color: 'text-[#F59E0B]', bg: 'bg-[#FFFBEB]', icon: AlertCircle },
  completed: { label: 'Selesai', color: 'text-[#6B7280]', bg: 'bg-[#F3F4F6]', icon: CheckCircle2 },
  cancelled: { label: 'Dibatalkan', color: 'text-[#EF4444]', bg: 'bg-[#FEF2F2]', icon: XCircle },
}

const STATS_CARDS = [
  { label: 'Total Trip', value: '4', icon: Globe, trend: '+2 tahun ini', color: 'bg-[#EFF6FF]', iconColor: 'text-[#1A56DB]' },
  { label: 'Destinasi Dikunjungi', value: '6', icon: MapPin, trend: '3 provinsi', color: 'bg-[#F0FDF4]', iconColor: 'text-[#10B981]' },
  { label: 'Total Pengeluaran', value: 'Rp 18,7jt', icon: TrendingUp, trend: 'Tahun 2024-2025', color: 'bg-[#FFFBEB]', iconColor: 'text-[#F59E0B]' },
  { label: 'Poin Reward', value: '1.870', icon: Star, trend: 'Rp 187.000 nilai', color: 'bg-[#FDF4FF]', iconColor: 'text-[#9333EA]' },
]

const NAV_ITEMS = [
  { id: 'overview' as DashboardTab, label: 'Overview', icon: LayoutDashboard },
  { id: 'bookings' as DashboardTab, label: 'Pemesanan', icon: BookOpen },
  { id: 'wishlist' as DashboardTab, label: 'Wishlist', icon: Heart },
  { id: 'settings' as DashboardTab, label: 'Pengaturan', icon: Settings },
]

export default function DashboardPage() {
  const onNavigate = useAppNavigate()
  const [activeTab, setActiveTab] = useState<DashboardTab>('overview')
  const [filterStatus, setFilterStatus] = useState<string>('all')

  const [trips, setTrips] = useState<Trip[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    fetchTrips()
      .then((data) => { if (!cancelled) setTrips(data) })
      .catch((err) => { if (!cancelled) setError(err instanceof Error ? err.message : 'Gagal memuat trip.') })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [])

  if (loading) {
    return (
      <div className="bg-[#F8FAFF] min-h-screen flex items-center justify-center">
        <p className="text-sm text-[#6B7280]">Memuat dashboard...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-[#F8FAFF] min-h-screen flex items-center justify-center">
        <p className="text-sm text-red-500">{error}</p>
      </div>
    )
  }

  const tripsById = new Map(trips.map((t) => [t.id, t]))
  const wishlistTrips = trips.filter((t) => WISHLIST_IDS.includes(t.id))
  // Bookings whose trip is still in the fetched list (guards against a
  // stale tripId if a trip is ever removed from the sheet).
  const bookingsWithTrip = BOOKINGS
    .map((b) => ({ ...b, trip: tripsById.get(b.tripId) }))
    .filter((b): b is typeof b & { trip: Trip } => Boolean(b.trip))
  const filteredBookings = bookingsWithTrip.filter((b) => filterStatus === 'all' || b.status === filterStatus)

  return (
    <div className="bg-[#F8FAFF] min-h-screen">
      <div className="max-w-[1440px] mx-auto px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8">
          {/* Sidebar */}
          <aside>
            {/* Profile card */}
            <div
              className="bg-white rounded-3xl p-6 border border-[#E5EEFF] mb-4"
              style={{ boxShadow: '0 2px 16px rgba(10,31,68,0.06)' }}
            >
              <div className="text-center mb-5">
                <div className="relative inline-block">
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&auto=format"
                    alt="Profile"
                    className="w-20 h-20 rounded-full object-cover border-4 border-white"
                    style={{ boxShadow: '0 4px 16px rgba(26,86,219,0.20)' }}
                  />
                  <button className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-[#1A56DB] border-2 border-white flex items-center justify-center">
                    <Camera size={11} className="text-white" />
                  </button>
                </div>
                <h2 className="font-bold text-[#0A1F44] mt-3 text-lg">Andi Santoso</h2>
                <p className="text-sm text-[#6B7280]">andi.santoso@email.com</p>
                <div className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full bg-[#EFF6FF] border border-[#BFDBFE]">
                  <Star size={11} className="fill-[#1A56DB] text-[#1A56DB]" />
                  <span className="text-xs font-semibold text-[#1A56DB]">Traveler Premium</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-center pt-4 border-t border-[#E5EEFF]">
                <div>
                  <p className="text-xl font-bold text-[#0A1F44]">4</p>
                  <p className="text-xs text-[#6B7280]">Trip Selesai</p>
                </div>
                <div>
                  <p className="text-xl font-bold text-[#0A1F44]">1.870</p>
                  <p className="text-xs text-[#6B7280]">Poin Reward</p>
                </div>
              </div>
            </div>

            {/* Nav */}
            <div
              className="bg-white rounded-3xl p-3 border border-[#E5EEFF]"
              style={{ boxShadow: '0 2px 16px rgba(10,31,68,0.06)' }}
            >
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all mb-1 last:mb-0 ${
                    activeTab === item.id
                      ? 'bg-[#1A56DB] text-white shadow-sm'
                      : 'text-[#374151] hover:bg-[#F8FAFF]'
                  }`}
                >
                  <item.icon size={16} />
                  {item.label}
                </button>
              ))}
              <div className="border-t border-[#E5EEFF] mt-2 pt-2">
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium text-[#EF4444] hover:bg-red-50 transition-colors">
                  <LogOut size={16} />
                  Keluar
                </button>
              </div>
            </div>
          </aside>

          {/* Main content */}
          <main>
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Welcome */}
                <div
                  className="relative overflow-hidden rounded-3xl p-8 text-white"
                  style={{ background: 'linear-gradient(135deg, #0A1F44 0%, #1A56DB 70%, #0EA5E9 100%)' }}
                >
                  <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/4" />
                  <div className="relative">
                    <p className="text-white/60 text-sm mb-1">Selamat datang kembali,</p>
                    <h1 className="font-display text-2xl font-bold mb-4">Andi Santoso 👋</h1>
                    <p className="text-white/70 text-sm mb-5 max-w-md">
                      Anda memiliki 1 trip yang akan datang. Jangan lupa selesaikan pembayaran untuk trip Labuan Bajo.
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={() => setActiveTab('bookings')}
                        className="flex items-center gap-2 px-4 py-2.5 bg-white text-[#1A56DB] rounded-xl text-sm font-semibold hover:shadow-lg transition-all"
                      >
                        <BookOpen size={15} /> Lihat Pesanan
                      </button>
                      <button
                        onClick={() => onNavigate('search')}
                        className="flex items-center gap-2 px-4 py-2.5 bg-white/15 border border-white/25 text-white rounded-xl text-sm font-semibold hover:bg-white/25 transition-colors"
                      >
                        Cari Trip Baru
                      </button>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {STATS_CARDS.map((s) => (
                    <div
                      key={s.label}
                      className="bg-white rounded-2xl p-5 border border-[#E5EEFF]"
                      style={{ boxShadow: '0 2px 8px rgba(10,31,68,0.06)' }}
                    >
                      <div className={`w-10 h-10 rounded-xl ${s.color} flex items-center justify-center mb-3`}>
                        <s.icon size={18} className={s.iconColor} />
                      </div>
                      <p className="text-xl font-bold text-[#0A1F44]">{s.value}</p>
                      <p className="text-xs text-[#6B7280] mt-0.5">{s.label}</p>
                      <p className="text-xs text-[#9CA3AF] mt-1">{s.trend}</p>
                    </div>
                  ))}
                </div>

                {/* Upcoming trip */}
                <div>
                  <h2 className="font-semibold text-[#0A1F44] mb-4">Trip Mendatang</h2>
                  {bookingsWithTrip.filter((b) => b.status === 'confirmed' || b.status === 'pending').map((booking) => {
                    const StatusIcon = STATUS_CONFIG[booking.status as keyof typeof STATUS_CONFIG].icon
                    return (
                      <div
                        key={booking.id}
                        className="bg-white rounded-2xl border border-[#E5EEFF] overflow-hidden flex mb-4"
                        style={{ boxShadow: '0 2px 16px rgba(10,31,68,0.06)' }}
                      >
                        <div className="w-32 shrink-0">
                          <img src={booking.trip.image} alt={booking.trip.title} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 p-5 flex flex-col justify-between">
                          <div>
                            <div className="flex items-start justify-between mb-2">
                              <h3 className="font-semibold text-[#0A1F44] text-sm line-clamp-1 flex-1 mr-3">{booking.trip.title}</h3>
                              <span className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold shrink-0 ${STATUS_CONFIG[booking.status as keyof typeof STATUS_CONFIG].bg} ${STATUS_CONFIG[booking.status as keyof typeof STATUS_CONFIG].color}`}>
                                <StatusIcon size={12} />
                                {STATUS_CONFIG[booking.status as keyof typeof STATUS_CONFIG].label}
                              </span>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-[#6B7280]">
                              <span className="flex items-center gap-1"><Calendar size={11} />{booking.date}</span>
                              <span className="flex items-center gap-1"><Users size={11} />{booking.pax} orang</span>
                              <span className="flex items-center gap-1"><MapPin size={11} />{booking.trip.location}</span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between pt-3 border-t border-[#E5EEFF]">
                            <div>
                              <p className="text-xs text-[#6B7280]">
                                Dibayar: Rp {booking.paidAmount.toLocaleString('id-ID')} dari Rp {booking.totalAmount.toLocaleString('id-ID')}
                              </p>
                              {booking.status === 'pending' && (
                                <p className="text-xs text-[#F59E0B] font-medium mt-0.5">Sisa: Rp {(booking.totalAmount - booking.paidAmount).toLocaleString('id-ID')}</p>
                              )}
                            </div>
                            {booking.status === 'pending' && (
                              <button
                                onClick={() => onNavigate('booking', booking.trip.id)}
                                className="px-4 py-2 bg-[#1A56DB] text-white rounded-xl text-xs font-semibold hover:bg-[#1343B8] transition-colors"
                              >
                                Bayar Sekarang
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Recent activity */}
                <div className="bg-white rounded-2xl border border-[#E5EEFF] p-6" style={{ boxShadow: '0 2px 16px rgba(10,31,68,0.06)' }}>
                  <h2 className="font-semibold text-[#0A1F44] mb-4">Riwayat Aktivitas</h2>
                  <div className="space-y-4">
                    {[
                      { icon: CheckCircle2, color: 'text-[#10B981]', bg: 'bg-[#ECFDF5]', text: 'Pembayaran DP Raja Ampat berhasil dikonfirmasi', time: '2 jam lalu' },
                      { icon: BookOpen, color: 'text-[#1A56DB]', bg: 'bg-[#EFF6FF]', text: 'Pesanan Labuan Bajo menunggu pelunasan', time: '3 hari lalu' },
                      { icon: Star, color: 'text-[#F59E0B]', bg: 'bg-[#FFFBEB]', text: 'Anda mendapatkan 285 poin dari trip Yogyakarta', time: '1 bln lalu' },
                      { icon: Heart, color: 'text-red-400', bg: 'bg-red-50', text: 'Ditambahkan ke wishlist: Derawan Islands Trip', time: '2 bln lalu' },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-xl ${item.bg} flex items-center justify-center shrink-0`}>
                          <item.icon size={15} className={item.color} />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-[#374151]">{item.text}</p>
                          <p className="text-xs text-[#9CA3AF]">{item.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'bookings' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-bold text-[#0A1F44] text-xl">Riwayat Pemesanan</h2>
                  <div className="flex items-center gap-2">
                    {(['all', 'confirmed', 'pending', 'completed'] as const).map((s) => (
                      <button
                        key={s}
                        onClick={() => setFilterStatus(s)}
                        className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${
                          filterStatus === s
                            ? 'bg-[#1A56DB] text-white'
                            : 'bg-white border border-[#E5EEFF] text-[#374151] hover:border-[#1A56DB]/40'
                        }`}
                      >
                        {s === 'all' ? 'Semua' : STATUS_CONFIG[s].label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  {filteredBookings.map((booking) => {
                    const status = STATUS_CONFIG[booking.status as keyof typeof STATUS_CONFIG]
                    const progress = Math.round((booking.paidAmount / booking.totalAmount) * 100)

                    return (
                      <div
                        key={booking.id}
                        className="bg-white rounded-2xl border border-[#E5EEFF] overflow-hidden"
                        style={{ boxShadow: '0 2px 16px rgba(10,31,68,0.06)' }}
                      >
                        <div className="flex items-center justify-between px-5 py-3 border-b border-[#E5EEFF] bg-[#F8FAFF]">
                          <div className="flex items-center gap-3">
                            <span className="text-xs font-mono font-bold text-[#6B7280]">{booking.id}</span>
                            <span className="text-xs text-[#9CA3AF]">Dipesan {booking.bookingDate}</span>
                          </div>
                          <span className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold ${status.bg} ${status.color}`}>
                            <status.icon size={12} />
                            {status.label}
                          </span>
                        </div>

                        <div className="flex gap-5 p-5">
                          <div className="w-24 h-20 rounded-xl overflow-hidden bg-[#E0F2FE] shrink-0">
                            <img src={booking.trip.image} alt={booking.trip.title} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-[#0A1F44] text-sm mb-1.5 line-clamp-1">{booking.trip.title}</h3>
                            <div className="flex flex-wrap gap-3 text-xs text-[#6B7280] mb-3">
                              <span className="flex items-center gap-1"><Calendar size={11} />{booking.date}</span>
                              <span className="flex items-center gap-1"><Users size={11} />{booking.pax} orang</span>
                              <span className="flex items-center gap-1"><Clock size={11} />{booking.trip.duration}</span>
                            </div>

                            {/* Payment progress */}
                            <div className="mb-2">
                              <div className="flex justify-between text-xs mb-1">
                                <span className="text-[#6B7280]">Pembayaran</span>
                                <span className="font-semibold text-[#0A1F44]">{progress}%</span>
                              </div>
                              <div className="w-full h-1.5 bg-[#E5EEFF] rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-[#1A56DB] rounded-full transition-all"
                                  style={{ width: `${progress}%` }}
                                />
                              </div>
                            </div>

                            <div className="flex justify-between text-xs text-[#6B7280]">
                              <span>Dibayar: Rp {booking.paidAmount.toLocaleString('id-ID')}</span>
                              <span>Total: Rp {booking.totalAmount.toLocaleString('id-ID')}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between px-5 py-3 border-t border-[#E5EEFF]">
                          <button className="flex items-center gap-1.5 text-xs text-[#6B7280] hover:text-[#1A56DB] transition-colors">
                            <Download size={13} /> Unduh Voucher
                          </button>
                          <div className="flex items-center gap-2">
                            {booking.status === 'pending' && (
                              <button
                                onClick={() => onNavigate('booking', booking.trip.id)}
                                className="px-4 py-2 bg-[#1A56DB] text-white rounded-xl text-xs font-semibold hover:bg-[#1343B8] transition-colors"
                              >
                                Bayar Sekarang
                              </button>
                            )}
                            {booking.status === 'completed' && (
                              <button className="px-4 py-2 bg-[#EFF6FF] text-[#1A56DB] rounded-xl text-xs font-semibold hover:bg-[#DBEAFE] transition-colors">
                                Tulis Ulasan
                              </button>
                            )}
                            <button
                              onClick={() => onNavigate('detail', booking.trip.id)}
                              className="flex items-center gap-1 text-xs text-[#1A56DB] font-medium hover:gap-1.5 transition-all"
                            >
                              Detail Trip <ChevronRight size={13} />
                            </button>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {activeTab === 'wishlist' && (
              <div>
                <h2 className="font-bold text-[#0A1F44] text-xl mb-6">
                  Wishlist Trip ({wishlistTrips.length})
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {wishlistTrips.map((trip) => (
                    <div
                      key={trip.id}
                      className="bg-white rounded-2xl border border-[#E5EEFF] overflow-hidden group cursor-pointer"
                      style={{ boxShadow: '0 2px 16px rgba(10,31,68,0.06)' }}
                      onClick={() => onNavigate('detail', trip.id)}
                    >
                      <div className="relative h-44 overflow-hidden bg-[#E0F2FE]">
                        <img src={trip.image} alt={trip.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                        <button className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center">
                          <Heart size={14} className="fill-red-500 text-red-500" />
                        </button>
                      </div>
                      <div className="p-4">
                        <p className="text-xs font-semibold text-[#1A56DB] mb-1">{trip.category}</p>
                        <h3 className="font-semibold text-[#0A1F44] text-sm mb-2 line-clamp-1">{trip.title}</h3>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-[#6B7280] flex items-center gap-1"><MapPin size={11} />{trip.location}</span>
                          <span className="font-bold text-[#0A1F44] text-sm">Rp {(trip.price / 1_000_000).toFixed(1)}jt</span>
                        </div>
                        <button
                          onClick={(e) => { e.stopPropagation(); onNavigate('booking', trip.id) }}
                          className="w-full mt-3 py-2 bg-[#1A56DB] text-white rounded-xl text-xs font-semibold hover:bg-[#1343B8] transition-colors"
                        >
                          Pesan Sekarang
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="space-y-4">
                <div className="bg-white rounded-2xl border border-[#E5EEFF] p-6" style={{ boxShadow: '0 2px 16px rgba(10,31,68,0.06)' }}>
                  <h2 className="font-semibold text-[#0A1F44] mb-5 flex items-center gap-2">
                    <Edit3 size={16} className="text-[#1A56DB]" /> Edit Profil
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { label: 'Nama Depan', value: 'Andi' },
                      { label: 'Nama Belakang', value: 'Santoso' },
                      { label: 'Email', value: 'andi.santoso@email.com' },
                      { label: 'Nomor HP', value: '081234567890' },
                      { label: 'Kota', value: 'Jakarta Selatan' },
                      { label: 'Tanggal Lahir', value: '15 Mei 1992' },
                    ].map((field) => (
                      <div key={field.label}>
                        <label className="text-xs font-semibold text-[#6B7280] uppercase tracking-wide block mb-2">{field.label}</label>
                        <input
                          defaultValue={field.value}
                          className="w-full px-4 py-3 bg-[#F8FAFF] border border-[#E5EEFF] rounded-xl text-sm text-[#0A1F44] outline-none focus:border-[#1A56DB] transition-colors"
                        />
                      </div>
                    ))}
                  </div>
                  <button className="mt-5 px-6 py-3 bg-[#1A56DB] text-white rounded-xl text-sm font-semibold hover:bg-[#1343B8] transition-colors">
                    Simpan Perubahan
                  </button>
                </div>

                <div className="bg-white rounded-2xl border border-[#E5EEFF] p-6" style={{ boxShadow: '0 2px 16px rgba(10,31,68,0.06)' }}>
                  <h2 className="font-semibold text-[#0A1F44] mb-5 flex items-center gap-2">
                    <Bell size={16} className="text-[#1A56DB]" /> Notifikasi
                  </h2>
                  <div className="space-y-4">
                    {[
                      { label: 'Konfirmasi Booking', desc: 'Notifikasi saat booking dikonfirmasi', default: true },
                      { label: 'Pengingat Pembayaran', desc: 'Ingatkan saya 3 hari sebelum jatuh tempo', default: true },
                      { label: 'Promo & Penawaran', desc: 'Dapatkan penawaran eksklusif dan promo trip', default: false },
                      { label: 'Trip Reminder', desc: 'Ingatkan saya 1 minggu sebelum keberangkatan', default: true },
                    ].map((notif) => (
                      <div key={notif.label} className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-[#0A1F44]">{notif.label}</p>
                          <p className="text-xs text-[#6B7280]">{notif.desc}</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" defaultChecked={notif.default} className="sr-only peer" />
                          <div className="w-10 h-5 bg-[#E5EEFF] peer-focus:ring-0 rounded-full peer peer-checked:after:translate-x-5 peer-checked:bg-[#1A56DB] after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all" />
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
