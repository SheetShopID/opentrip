export const API_URL =
  process.env.NEXT_PUBLIC_API_URL!;

export async function getTrip(id: number) {

  const res = await fetch(

    `${API_URL}?action=trip&id=${id}`,

    {
      cache: "no-store"
    }

  );

  if (!res.ok) {

    throw new Error("Failed load trip");

  }

  const json = await res.json();

  if (!json.success) {

    throw new Error(json.message);

  }

  return json.trip;

}