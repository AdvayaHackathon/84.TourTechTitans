"use client";

import { useRouter } from "next/navigation";

type Place = {
  name: string;
  location: string;
  period: string;
  description: string;
  fullDescription: string[];
  images: string[];
  facts: string[];
  visitorInfo: {
    timings: string;
    entryFee: string;
    bestTimeToVisit: string;
    nearestAirport: string;
    nearestRailway: string;
  };
  coordinates: {
    latitude: string;
    longitude: string;
  };
  nearbyAttractions: Array<{
    name: string;
    distance: string;
    slug: string;
  }>;
  slug: string;
};

const ButtonAddTrip = ({ place }: { place: Place }) => {
  const router = useRouter();

  const handleAddTrip = () => {
    // Navigate to the add trip page with place information
    router.push(
      `/trips/add?name=${encodeURIComponent(
        place.name
      )}&lat=${encodeURIComponent(
        place.coordinates.latitude
      )}&lng=${encodeURIComponent(
        place.coordinates.longitude
      )}&slug=${encodeURIComponent(place.slug)}`
    );
  };

  return (
    <button
      className="block w-full bg-amber-600 hover:bg-amber-700 text-white font-medium py-2 px-4 rounded-md text-center transition-colors"
      onClick={handleAddTrip}
    >
      Add to Plan
    </button>
  );
};

export default ButtonAddTrip;
