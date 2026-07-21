import { notFound } from "next/navigation";
import TripDetailPage from "@/components/pages/TripDetailPage";
import { getTrip } from "@/services/tripService";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {

  const { id } = await params;

  try {

    const trip = await getTrip(Number(id));

    return {

      title: `${trip.title} — OpenTrip`,

      description: trip.description,

    };

  } catch {

    return {

      title: "Trip",

    };

  }

}

export default async function Page({
  params,
}: PageProps) {

  const { id } = await params;

  const tripId = Number(id);

  if (Number.isNaN(tripId)) {

    notFound();

  }

  try {

    const trip = await getTrip(tripId);

    return (

      <TripDetailPage trip={trip} />

    );

  } catch {

    notFound();

  }

}
