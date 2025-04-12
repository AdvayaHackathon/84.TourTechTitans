import { readFile } from "fs/promises";
import path from "path";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Clock, Calendar, Ticket, View } from "lucide-react";
import GLBViewerWrapper from "../../../components/GLBViewerWrapper";
import ButtonAddTrip from "@/components/ButtonAddTrip";

type Place = {
  name: string;
  location: string;
  period: string;
  description: string;
  fullDescription: string[];
  imageSrc: string;
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

async function getPlaceData(slug: string): Promise<Place | null> {
  try {
    const filePath = path.join(process.cwd(), "public", "data", "places.json");
    const fileContents = await readFile(filePath, "utf8");
    const data = JSON.parse(fileContents);
    return data.places[slug] || null;
  } catch (error) {
    console.error("Error fetching place data:", error);
    return null;
  }
}

export default async function PlaceDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const place = await getPlaceData(params.slug);

  if (!place) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-amber-50 p-6">
        <div className="text-center max-w-lg">
          <h1 className="text-3xl font-bold text-amber-900 mb-4">
            Place Not Found
          </h1>
          <p className="text-gray-700 mb-6">
            Sorry, we couldn&apos;t find the heritage site you&apos;re looking
            for.
          </p>
          <Link
            href="/"
            className="bg-amber-600 hover:bg-amber-700 text-white font-medium py-3 px-6 rounded-md inline-block transition-colors"
          >
            Back to Explore Page
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-amber-50">
      {/* Hero Section */}
      <section className="relative h-30 lg:h-35">
        {/* <Image
          src={`/api/placeholder/1920/1080`}
          alt={place.name}
          fill
          className="object-cover"
        /> */}
        <div className="absolute inset-0  opacity-70"></div>
        <div className="absolute bottom-0 left-0 right-0 p-6 text-black">
          <div className="container mx-auto">
            <h1 className="text-4xl font-bold mb-2">{place.name}</h1>
            <div className="flex items-center mb-2">
              <MapPin size={18} className="mr-1" />
              <span>{place.location}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Column - Main Content */}
            <div className="lg:w-2/3">
              {/* 3D Viewer */}
              <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-amber-900">
                    3D Experience
                  </h2>
                  <div className="flex items-center text-amber-700">
                    <View size={20} className="mr-1" />
                    <span>Interactive 3D Model</span>
                  </div>
                </div>
                <p className="text-gray-700 mb-4">
                  Explore {place.name} in immersive 3D. Rotate, zoom, and
                  examine this historical landmark from every angle.
                </p>
                <GLBViewerWrapper placeSlug={place.slug} height="450px" />
              </div>

              {/* Overview */}
              <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <h2 className="text-2xl font-bold text-amber-900 mb-4">
                  Overview
                </h2>
                <p className="text-gray-700 mb-4">{place.description}</p>
                {place.fullDescription.map((paragraph, index) => (
                  <p key={index} className="text-gray-700 mb-4">
                    {paragraph}
                  </p>
                ))}
              </div>

              {/* Gallery */}
              <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <h2 className="text-2xl font-bold text-amber-900 mb-4">
                  Gallery
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  {place.images.map((image, index) => (
                    <div
                      key={index}
                      className="relative h-40 md:h-56 rounded-lg overflow-hidden"
                    >
                      <Image
                        src={image}
                        alt={`${place.name} image ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Historical Significance */}
              <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <h2 className="text-2xl font-bold text-amber-900 mb-4">
                  Historical Significance
                </h2>
                <div className="flex items-center mb-4">
                  <Calendar size={20} className="text-amber-700 mr-2" />
                  <span className="font-medium">Period: {place.period}</span>
                </div>
                <h3 className="text-lg font-semibold text-amber-800 mb-2">
                  Interesting Facts
                </h3>
                <ul className="list-disc pl-5 space-y-2 text-gray-700">
                  {place.facts.map((fact, index) => (
                    <li key={index}>{fact}</li>
                  ))}
                </ul>
              </div>

              {/* Map */}
              <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <h2 className="text-2xl font-bold text-amber-900 mb-4">
                  Location
                </h2>
                <div className="relative h-64 rounded-lg overflow-hidden bg-gray-200">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-gray-600 font-medium">
                      Map Location: {place.coordinates.latitude},{" "}
                      {place.coordinates.longitude}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Sidebar */}
            <div className="lg:w-1/3">
              {/* Visitor Information */}
              <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <h2 className="text-xl font-bold text-amber-900 mb-4">
                  Visitor Information
                </h2>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <Clock
                      size={20}
                      className="text-amber-700 mr-3 mt-1 flex-shrink-0"
                    />
                    <div>
                      <h3 className="font-medium text-gray-800">
                        Opening Hours
                      </h3>
                      <p className="text-gray-600">
                        {place.visitorInfo.timings}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Ticket
                      size={20}
                      className="text-amber-700 mr-3 mt-1 flex-shrink-0"
                    />
                    <div>
                      <h3 className="font-medium text-gray-800">Entry Fee</h3>
                      <p className="text-gray-600">
                        {place.visitorInfo.entryFee}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Calendar
                      size={20}
                      className="text-amber-700 mr-3 mt-1 flex-shrink-0"
                    />
                    <div>
                      <h3 className="font-medium text-gray-800">
                        Best Time to Visit
                      </h3>
                      <p className="text-gray-600">
                        {place.visitorInfo.bestTimeToVisit}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <MapPin
                      size={20}
                      className="text-amber-700 mr-3 mt-1 flex-shrink-0"
                    />
                    <div>
                      <h3 className="font-medium text-gray-800">
                        How to Reach
                      </h3>
                      <p className="text-gray-600">
                        <strong>Nearest Airport:</strong>{" "}
                        {place.visitorInfo.nearestAirport}
                      </p>
                      <p className="text-gray-600">
                        <strong>Nearest Railway:</strong>{" "}
                        {place.visitorInfo.nearestRailway}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Experience in VR/AR CTA */}
              <div className="bg-gradient-to-r from-amber-700 to-amber-900 rounded-lg shadow-md p-6 mb-8 text-white">
                <h2 className="text-xl font-bold mb-3">
                  Experience in Virtual Reality
                </h2>
                <p className="mb-4">
                  Download our mobile app to experience {place.name} in VR mode
                  using your phone and a VR headset.
                </p>
                <Link
                  href="/download-app"
                  className="block w-full bg-white text-amber-800 font-medium py-2 px-4 rounded-md text-center transition-colors hover:bg-amber-100"
                >
                  Get the App
                </Link>
              </div>

              {/* Nearby Attractions */}
              <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <h2 className="text-xl font-bold text-amber-900 mb-4">
                  Nearby Attractions
                </h2>
                <div className="space-y-4">
                  {place.nearbyAttractions.map((attraction, index) => (
                    <div key={index} className="flex items-center">
                      <div className="w-12 h-12 relative rounded-md overflow-hidden mr-3">
                        <Image
                          src={`/api/placeholder/100/100`}
                          alt={attraction.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-800">
                          {attraction.name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {attraction.distance} away
                        </p>
                        <Link
                          href={`/places/${attraction.slug}`}
                          className="text-sm text-amber-600 hover:text-amber-800"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tour Booking CTA */}
              <div className="bg-amber-50 rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-amber-900 mb-4">
                  Plan Your Visit
                </h2>
                <p className="text-gray-700 mb-4">
                  Experience {place.name} with our expert guided tours.
                </p>
                <ButtonAddTrip place={place} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Destinations */}
      <section className="py-8 bg-amber-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-amber-900 mb-6">
            You May Also Like
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {place.nearbyAttractions.map((attraction, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="relative h-40">
                  <Image
                    src={`/api/placeholder/300/200`}
                    alt={attraction.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-amber-900 mb-1">
                    {attraction.name}
                  </h3>
                  <p className="text-amber-700 text-sm mb-2">
                    {attraction.distance} from here
                  </p>
                  <Link
                    href={`/places/${attraction.slug}`}
                    className="text-amber-600 hover:text-amber-800 text-sm font-medium"
                  >
                    Explore →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
