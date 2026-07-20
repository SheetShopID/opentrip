'use client'

import { Heart, Star, MapPin, Clock, Users } from 'lucide-react'
import { useState } from 'react'

export interface Trip {
  id: number
  title: string
  location: string
  image: string
  price: number
  originalPrice?: number
  rating: number
  reviews: number
  duration: string
  groupSize: string
  category: string
  badge?: string
  highlights?: string[]
}

interface TripCardProps {
  trip: Trip
  onClick?: () => void
  size?: 'sm' | 'md' | 'lg'
}

export default function TripCard({ trip, onClick, size = 'md' }: TripCardProps) {
  const [liked, setLiked] = useState(false)

  const imageH = size === 'lg' ? 'h-72' : size === 'sm' ? 'h-44' : 'h-56'

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-[20px] overflow-hidden cursor-pointer group transition-all duration-300 hover:-translate-y-1"
      style={{
        boxShadow: '0 2px 16px 0 rgba(10,31,68,0.08)',
        border: '1px solid #E5EEFF',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow =
          '0 8px 32px 0 rgba(26,86,219,0.14)'
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow =
          '0 2px 16px 0 rgba(10,31,68,0.08)'
      }}
    >
      {/* Image */}
      <div className={`relative ${imageH} overflow-hidden bg-[#E0F2FE]`}>
        <img
          src={trip.image}
          alt={trip.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

        {/* Badge */}
        {trip.badge && (
          <div className="absolute top-3 left-3">
            <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-[#1A56DB] text-white">
              {trip.badge}
            </span>
          </div>
        )}

        {/* Like button */}
        <button
          onClick={(e) => { e.stopPropagation(); setLiked((v) => !v) }}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center transition-all hover:scale-110"
        >
          <Heart
            size={15}
            className={liked ? 'fill-red-500 text-red-500' : 'text-[#6B7280]'}
          />
        </button>

        {/* Duration badge */}
        <div className="absolute bottom-3 left-3">
          <span className="flex items-center gap-1 px-2 py-1 rounded-lg bg-black/40 backdrop-blur-sm text-white text-xs font-medium">
            <Clock size={11} />
            {trip.duration}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <p className="text-xs font-medium text-[#1A56DB] uppercase tracking-wide">{trip.category}</p>
          <div className="flex items-center gap-1 shrink-0">
            <Star size={12} className="fill-[#F59E0B] text-[#F59E0B]" />
            <span className="text-xs font-semibold text-[#0A1F44]">{trip.rating}</span>
            <span className="text-xs text-[#9CA3AF]">({trip.reviews})</span>
          </div>
        </div>

        <h3 className="font-semibold text-[#0A1F44] text-[15px] leading-snug mb-2 line-clamp-2">
          {trip.title}
        </h3>

        <div className="flex items-center gap-1 mb-3">
          <MapPin size={12} className="text-[#9CA3AF] shrink-0" />
          <span className="text-xs text-[#6B7280]">{trip.location}</span>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-[#E5EEFF]">
          <div className="flex items-center gap-1">
            <Users size={12} className="text-[#9CA3AF]" />
            <span className="text-xs text-[#6B7280]">{trip.groupSize}</span>
          </div>
          <div className="text-right">
            {trip.originalPrice && (
              <p className="text-xs text-[#9CA3AF] line-through">
                Rp {trip.originalPrice.toLocaleString('id-ID')}
              </p>
            )}
            <p className="text-base font-bold text-[#0A1F44]">
              Rp {trip.price.toLocaleString('id-ID')}
              <span className="text-xs font-normal text-[#6B7280]">/orang</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
