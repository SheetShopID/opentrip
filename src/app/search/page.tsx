'use client'

import { useEffect, useState } from 'react'
import {
  Search, SlidersHorizontal, ChevronDown, X, MapPin,
  Grid3X3, List, ArrowUpDown
} from 'lucide-react'
import TripCard from '@/components/TripCard'
import { fetchTrips, type Trip } from '@/data/trips'
import { useAppNavigate } from '@/hooks/useAppNavigate'

const DURATIONS = ['Semua', '1-2 Hari', '3-4 Hari', '5-7 Hari', '7+ Hari']
const CATEGORIES_LIST = ['Open Trip', 'Private Tour', 'Diving', 'Trekking', 'Budaya', 'Honeymoon', 'Adventure']
const SORT_OPTIONS = ['Paling Populer', 'Harga Terendah', 'Harga Tertinggi', 'Rating Tertinggi', 'Terbaru']

export default function SearchPage() {
  const onNavigate = useAppNavigate()

  const [trips, setTrips] = useState<Trip[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [query, setQuery] = useState('')
  const [selectedDest] = useState('Semua Destinasi')
  const [selectedDuration, setSelectedDuration] = useState('Semua')
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState([0, 10_000_000])
  const [sortBy, setSortBy] = useState('Paling Populer')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    let cancelled = false
    fetchTrips()
      .then((data) => { if (!cancelled) setTrips(data) })
      .catch((err) => { if (!cancelled) setError(err instanceof Error ? err.message : 'Gagal memuat trip.') })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [])

  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    )
  }

  const filteredTrips = trips.filter((t) => {
    const qMatch = !query || t.title.toLowerCase().includes(query.toLowerCase()) || t.location.toLowerCase().includes(query.toLowerCase())
    const catMatch = selectedCategories.length === 0 || selectedCategories.includes(t.category)
    const priceMatch = t.price >= priceRange[0] && t.price <= priceRange[1]
    return qMatch && catMatch && priceMatch
  })

  return (
    <div className="bg-[#F8FAFF] min-h-screen">
      {/* ─── Search header ─── */}
      <div className="bg-white border-b border-[#E5EEFF] sticky top-16 z-40">
        <div className="max-w-[1440px] mx-auto px-8 py-4">
          <div className="flex items-center gap-3">
            {/* Search input */}
            <div className="flex-1 flex items-center gap-3 px-4 py-2.5 bg-[#F8FAFF] border border-[#E5EEFF] rounded-xl hover:border-[#1A56DB]/40 focus-within:border-[#1A56DB] transition-colors">
              <Search size={16} className="text-[#9CA3AF] shrink-0" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cari destinasi, aktivitas, atau nama trip..."
                className="flex-1 text-sm text-[#0A1F44] placeholder:text-[#9CA3AF] bg-transparent outline-none"
              />
              {query && (
                <button onClick={() => setQuery('')} className="text-[#9CA3AF] hover:text-[#374151]">
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Destination dropdown */}
            <div className="relative hidden lg:block">
              <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[#E5EEFF] rounded-xl text-sm font-medium text-[#374151] hover:border-[#1A56DB]/40 transition-colors">
                <MapPin size={15} className="text-[#1A56DB]" />
                {selectedDest}
                <ChevronDown size={14} className="text-[#9CA3AF]" />
              </button>
            </div>

            {/* Duration dropdown */}
            <div className="relative hidden lg:block">
              <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[#E5EEFF] rounded-xl text-sm font-medium text-[#374151] hover:border-[#1A56DB]/40 transition-colors">
                {selectedDuration === 'Semua' ? 'Durasi' : selectedDuration}
                <ChevronDown size={14} className="text-[#9CA3AF]" />
              </button>
            </div>

            {/* Filter toggle */}
            <button
              onClick={() => setShowFilters((v) => !v)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border transition-all ${
                showFilters
                  ? 'bg-[#1A56DB] text-white border-[#1A56DB]'
                  : 'bg-white text-[#374151] border-[#E5EEFF] hover:border-[#1A56DB]/40'
              }`}
            >
              <SlidersHorizontal size={15} />
              Filter
              {selectedCategories.length > 0 && (
                <span className={`w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center ${showFilters ? 'bg-white text-[#1A56DB]' : 'bg-[#1A56DB] text-white'}`}>
                  {selectedCategories.length}
                </span>
              )}
            </button>
          </div>

          {/* Expanded filter panel */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-[#E5EEFF] grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Categories */}
              <div>
                <p className="text-xs font-semibold text-[#6B7280] uppercase tracking-wide mb-3">Kategori Trip</p>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES_LIST.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => toggleCategory(cat)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        selectedCategories.includes(cat)
                          ? 'bg-[#1A56DB] text-white'
                          : 'bg-[#F8FAFF] border border-[#E5EEFF] text-[#374151] hover:border-[#1A56DB]/40'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Duration */}
              <div>
                <p className="text-xs font-semibold text-[#6B7280] uppercase tracking-wide mb-3">Durasi Perjalanan</p>
                <div className="flex flex-wrap gap-2">
                  {DURATIONS.map((d) => (
                    <button
                      key={d}
                      onClick={() => setSelectedDuration(d)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        selectedDuration === d
                          ? 'bg-[#1A56DB] text-white'
                          : 'bg-[#F8FAFF] border border-[#E5EEFF] text-[#374151] hover:border-[#1A56DB]/40'
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price range */}
              <div>
                <p className="text-xs font-semibold text-[#6B7280] uppercase tracking-wide mb-3">
                  Rentang Harga: Rp {(priceRange[1] / 1_000_000).toFixed(1)}jt
                </p>
                <input
                  type="range"
                  min={500_000}
                  max={10_000_000}
                  step={100_000}
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([0, +e.target.value])}
                  className="w-full accent-[#1A56DB]"
                />
                <div className="flex justify-between text-xs text-[#9CA3AF] mt-1">
                  <span>Rp 500K</span>
                  <span>Rp 10jt</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-8 py-8">
        {loading ? (
          <div className="py-24 text-center text-sm text-[#6B7280]">Memuat trip...</div>
        ) : error ? (
          <div className="py-24 text-center text-sm text-red-500">{error}</div>
        ) : (
          <>
            {/* Results header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-xl font-bold text-[#0A1F44]">
                  {filteredTrips.length} Trip Ditemukan
                </h1>
                <p className="text-sm text-[#6B7280] mt-0.5">
                  {query ? `Hasil pencarian untuk "${query}"` : 'Semua open trip tersedia'}
                </p>
              </div>
              <div className="flex items-center gap-3">
                {/* Sort */}
                <div className="flex items-center gap-2 px-3 py-2 bg-white border border-[#E5EEFF] rounded-xl">
                  <ArrowUpDown size={14} className="text-[#9CA3AF]" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="text-sm text-[#374151] bg-transparent outline-none cursor-pointer"
                  >
                    {SORT_OPTIONS.map((o) => <option key={o}>{o}</option>)}
                  </select>
                </div>

                {/* View mode */}
                <div className="flex items-center gap-1 p-1 bg-white border border-[#E5EEFF] rounded-xl">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-[#1A56DB] text-white' : 'text-[#9CA3AF] hover:text-[#374151]'}`}
                  >
                    <Grid3X3 size={15} />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-1.5 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-[#1A56DB] text-white' : 'text-[#9CA3AF] hover:text-[#374151]'}`}
                  >
                    <List size={15} />
                  </button>
                </div>
              </div>
            </div>

            {/* Active filter chips */}
            {selectedCategories.length > 0 && (
              <div className="flex items-center gap-2 mb-6 flex-wrap">
                <span className="text-xs text-[#6B7280]">Filter aktif:</span>
                {selectedCategories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => toggleCategory(cat)}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EFF6FF] border border-[#BFDBFE] text-xs font-medium text-[#1A56DB] hover:bg-[#DBEAFE] transition-colors"
                  >
                    {cat}
                    <X size={11} />
                  </button>
                ))}
                <button
                  onClick={() => setSelectedCategories([])}
                  className="text-xs text-[#9CA3AF] hover:text-[#374151] transition-colors"
                >
                  Hapus semua
                </button>
              </div>
            )}

            {/* Trip grid */}
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {filteredTrips.map((trip) => (
                  <TripCard
                    key={trip.id}
                    trip={trip}
                    onClick={() => onNavigate('detail', trip.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {filteredTrips.map((trip) => (
                  <div
                    key={trip.id}
                    onClick={() => onNavigate('detail', trip.id)}
                    className="bg-white border border-[#E5EEFF] rounded-2xl overflow-hidden flex cursor-pointer hover:border-[#1A56DB]/30 hover:shadow-lg transition-all duration-200 group"
                  >
                    <div className="w-64 h-44 shrink-0 overflow-hidden bg-[#E0F2FE]">
                      <img
                        src={trip.image}
                        alt={trip.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="flex-1 p-5 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="text-xs font-semibold text-[#1A56DB]">{trip.category}</span>
                          {trip.badge && (
                            <span className="px-2 py-0.5 rounded-md text-xs font-semibold bg-[#EFF6FF] text-[#1A56DB]">
                              {trip.badge}
                            </span>
                          )}
                        </div>
                        <h3 className="font-semibold text-[#0A1F44] text-base mb-2">{trip.title}</h3>
                        <div className="flex items-center gap-1 text-xs text-[#6B7280]">
                          <MapPin size={12} />
                          {trip.location}
                        </div>
                      </div>
                      <div className="flex items-center justify-between pt-3 border-t border-[#E5EEFF]">
                        <div className="flex items-center gap-4 text-xs text-[#6B7280]">
                          <span>⏱ {trip.duration}</span>
                          <span>👥 {trip.groupSize}</span>
                          <span>⭐ {trip.rating} ({trip.reviews})</span>
                        </div>
                        <div className="text-right">
                          {trip.originalPrice && (
                            <p className="text-xs text-[#9CA3AF] line-through">Rp {trip.originalPrice.toLocaleString('id-ID')}</p>
                          )}
                          <p className="font-bold text-[#0A1F44]">
                            Rp {trip.price.toLocaleString('id-ID')}
                            <span className="text-xs font-normal text-[#6B7280]">/orang</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {filteredTrips.length === 0 && (
              <div className="text-center py-24">
                <div className="w-20 h-20 rounded-full bg-[#EFF6FF] flex items-center justify-center mx-auto mb-4">
                  <Search size={32} className="text-[#1A56DB]" />
                </div>
                <h3 className="font-semibold text-[#0A1F44] text-lg mb-2">Trip tidak ditemukan</h3>
                <p className="text-sm text-[#6B7280]">Coba kata kunci atau filter yang berbeda</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
