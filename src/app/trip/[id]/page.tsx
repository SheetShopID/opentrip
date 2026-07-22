import { notFound } from 'next/navigation'
import TripDetailPage from '@/components/pages/TripDetailPage'
import { fetchTrips, fetchTripById } from '@/data/trips'
import type { Metadata } from 'next'

interface PageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  const trip = await fetchTripById(Number(id))
  return {
    title: trip ? `${trip.title} — OpenTrip` : 'Trip — OpenTrip',
    description: trip?.title,
  }
}

export async function generateStaticParams() {
  const trips = await fetchTrips()
  return trips.map((trip) => ({ id: String(trip.id) }))
}

export default async function Page({ params }: PageProps) {
  const { id } = await params
  const tripId = Number(id)

  if (Number.isNaN(tripId)) {
    notFound()
  }

  return <TripDetailPage tripId={tripId} />
}
