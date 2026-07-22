import type { Trip } from '@/components/TripCard'

export type { Trip }

// Set this in .env.local — the Apps Script Web App /exec URL from Code.gs
const API_URL = process.env.NEXT_PUBLIC_API_URL

export interface ItineraryDay {
  day: number
  title: string
  activities: string[]
}

export interface InfoCard {
  icon: string // lucide-react icon name, mapped in the UI — see TripDetailPage.tsx
  label: string
  value: string
}

export interface DepartureDate {
  date: string
  slots: number
  status: 'available' | 'limited' | 'full'
}

export interface Review {
  name: string
  avatar: string
  date: string
  rating: number
  text: string
  trip: string
}

export interface TripDetail extends Trip {
  description: string[]
  gallery: string[]
  itinerary: ItineraryDay[]
  inclusions: string[]
  exclusions: string[]
  departureDates: DepartureDate[]
  reviewList: Review[]

  infoCards: InfoCard[]
}

export interface Destination {
  id: number
  name: string
  province: string
  image: string
  tripCount: number
}

interface ApiError {
  error: string
}

// In-memory cache — cleared on full page reload. Avoids re-fetching the
// same trip/list repeatedly as the user navigates around in one session.
let tripsCache: Trip[] | null = null
let destinationsCache: Destination[] | null = null
const tripDetailCache = new Map<number, TripDetail>()

async function apiGet<T>(params: Record<string, string>): Promise<T> {
  if (!API_URL) {
    throw new Error(
      'NEXT_PUBLIC_API_URL is not set. Point it at your deployed Apps Script /exec URL (see Code.gs).'
    )
  }
  const url = `${API_URL}?${new URLSearchParams(params).toString()}`
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error(`Trips API request failed (${res.status})`)
  }
  const data = (await res.json()) as T | ApiError
  if (data && typeof data === 'object' && 'error' in data) {
    throw new Error((data as ApiError).error)
  }
  return data as T
}

/** Full trip list — used by the landing page, search results, and related trips. */
export async function fetchTrips(): Promise<Trip[]> {
  if (tripsCache) return tripsCache
  const data = await apiGet<Trip[]>({ action: 'trips' })
  tripsCache = data
  return data
}

/** Full detail for one trip, including itinerary/reviews/gallery/etc. */
export async function fetchTripDetail(id: number): Promise<TripDetail> {
  const cached = tripDetailCache.get(id)
  if (cached) return cached
  const data = await apiGet<TripDetail>({ action: 'trip', id: String(id) })
  tripDetailCache.set(id, data)
  return data
}

/** Destination grid on the landing page. */
export async function fetchDestinations(): Promise<Destination[]> {
  if (destinationsCache) return destinationsCache
  const data = await apiGet<Destination[]>({ action: 'destinations' })
  destinationsCache = data
  return data
}

/**
 * Single trip's card-level fields (title, image, price, ...) without the
 * full detail payload. Used by BookingPage and route generateMetadata,
 * where the itinerary/reviews/gallery aren't needed. Reuses fetchTrips'
 * cache, so this doesn't add an extra request once the list is loaded.
 */
export async function fetchTripById(id: number): Promise<Trip | undefined> {
  const trips = await fetchTrips()
  return trips.find((t) => t.id === id)
}
