import { notFound } from 'next/navigation'
import BookingPage from '@/components/pages/BookingPage'
import { TRIPS } from '@/data/trips'
import type { Metadata } from 'next'

interface PageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  const trip = TRIPS.find((t) => t.id === Number(id))
  return {
    title: trip ? `Pesan ${trip.title} — OpenTrip` : 'Pemesanan — OpenTrip',
  }
}

export async function generateStaticParams() {
  return TRIPS.map((trip) => ({ id: String(trip.id) }))
}

export default async function Page({ params }: PageProps) {
  const { id } = await params
  const tripId = Number(id)

  if (Number.isNaN(tripId)) {
    notFound()
  }

  return <BookingPage tripId={tripId} />
}
