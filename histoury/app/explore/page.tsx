// app/explore/page.tsx
import React from "react";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";

// Import the SearchBar component with no SSR
const SearchBar = dynamic(() => import("./SearchBar"));

interface SiteCardProps {
  name: string;
  location: string;
  description: string;
  imageSrc: string;
  slug: string;
}

const SiteCard: React.FC<SiteCardProps> = ({
  name,
  location,
  description,
  slug,
}) => {
  return (
    <Link href={`/places/${slug}`} className="block">
      <div className="bg-amber-50 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow hover:translate-y-[-2px]">
        <div className="relative h-48">
          <Image
            src={`/api/placeholder/400/300`}
            alt={name}
            fill
            className="object-cover"
          />
        </div>
        <div className="p-4">
          <h3 className="text-lg font-bold text-amber-900 mb-2">{name}</h3>
          <div className="flex items-center mb-2 text-amber-700">
            <svg
              className="h-4 w-4 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span className="text-sm">{location}</span>
          </div>
          <p className="text-amber-700 mb-3 text-sm line-clamp-2">{description}</p>
          <div className="text-amber-600 hover:text-amber-800 font-medium text-sm">
            Explore More →
          </div>
        </div>
      </div>
    </Link>
  );
};

const SuggestedSection = () => {
  const suggestedSites = [
    {
      name: "Ajanta Caves",
      location: "Aurangabad, Maharashtra",
      description: "Buddhist rock-cut cave monuments with paintings and sculptures dating from the 2nd century BCE.",
      imageSrc: "/images/ajanta_caves.jpg",
      slug: "ajanta-caves"
    },
    {
      name: "Ellora Caves",
      location: "Aurangabad, Maharashtra",
      description: "Remarkable cave temples featuring Buddhist, Hindu, and Jain monuments carved from a single rock face.",
      imageSrc: "/images/ellora_caves.jpg",
      slug: "ellora-caves"
    },
    {
      name: "Hawa Mahal",
      location: "Jaipur, Rajasthan",
      description: "The 'Palace of Winds' with its unique honeycomb facade featuring 953 small windows.",
      imageSrc: "/images/hawa_mahal.jpg",
      slug: "hawa-mahal"
    },
    {
      name: "Gateway of India",
      location: "Mumbai, Maharashtra",
      description: "Iconic monument built to commemorate the visit of King George V and Queen Mary to Mumbai.",
      imageSrc: "/images/gateway_of_india.jpg",
      slug: "gateway-of-india"
    },
    {
      name: "Khajuraho",
      location: "Madhya Pradesh",
      description: "Temple complexes renowned for their nagara-style architecture and intricate sculptures.",
      imageSrc: "/images/khajuraho.jpg",
      slug: "khajuraho"
    },
    {
      name: "Sun Temple Konark",
      location: "Puri, Odisha",
      description: "Massive temple designed as the chariot of the Sun God with elaborately carved stone wheels.",
      imageSrc: "/images/konark_sun_temple.jpg",
      slug: "sun-temple-konark"
    }
  ];

  return (
    <div className="container mx-auto px-4">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-amber-900">Must-Visit Heritage Sites</h2>
        <Link 
          href="/suggested" 
          className="text-amber-600 hover:text-amber-800 font-medium"
        >
          View All →
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
        {suggestedSites.map((site, index) => (
          <SiteCard key={index} {...site} />
        ))}
      </div>
    </div>
  );
};

const TrendingSection = () => {
  const trendingSites = [
    {
      name: "Charminar",
      location: "Hyderabad, Telangana",
      description: "Iconic landmark with four grand arches and minarets built in 1591 CE.",
      imageSrc: "/images/charminar.jpg",
      slug: "charminar"
    },
    {
      name: "Golden Temple",
      location: "Amritsar, Punjab",
      description: "Most sacred Sikh gurdwara with the spectacular Harmandir Sahib floating on a sacred pool.",
      imageSrc: "/images/golden_temple.jpg",
      slug: "golden-temple"
    },
    {
      name: "Lotus Temple",
      location: "New Delhi",
      description: "Architectural marvel shaped like a lotus flower, welcoming all faiths for meditation.",
      imageSrc: "/images/lotus_temple.jpg",
      slug: "lotus-temple"
    },
    {
      name: "Mysore Palace",
      location: "Mysore, Karnataka",
      description: "Indo-Saracenic masterpiece featuring stained glass, carved wooden doors, and mosaic floors.",
      imageSrc: "/images/mysore_palace.jpg",
      slug: "mysore-palace"
    },
    {
      name: "Qutub Minar",
      location: "New Delhi",
      description: "World's tallest brick minaret, adorned with intricate carvings and verses from the Quran.",
      imageSrc: "/images/qutub_minar.jpg",
      slug: "qutub-minar"
    },
    {
      name: "Victoria Memorial",
      location: "Kolkata, West Bengal",
      description: "Magnificent white marble monument blending British and Mughal elements.",
      imageSrc: "/images/victoria_memorial.jpg",
      slug: "victoria-memorial"
    }
  ];

  return (
    <div className="container mx-auto px-4">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-amber-900">Trending Destinations</h2>
        <Link 
          href="/trending" 
          className="text-amber-600 hover:text-amber-800 font-medium"
        >
          View All →
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
        {trendingSites.map((site, index) => (
          <SiteCard key={index} {...site} />
        ))}
      </div>
    </div>
  );
};

const ExplorePage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-amber-300 to-amber-100 py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold text-amber-900 mb-4">
            Explore India&apos;s Rich Heritage
          </h1>
          <p className="text-lg text-amber-800 mb-8 max-w-3xl mx-auto">
            Discover ancient wonders, architectural marvels, and cultural landmarks
            across the Indian subcontinent.
          </p>
          <div className="flex justify-center">
            <SearchBar />
          </div>
        </div>
      </section>

      {/* Suggested Section */}
      <section className="py-12 bg-white">
        <SuggestedSection />
      </section>

      {/* Trending Section */}
      <section className="py-12 bg-amber-50">
        <TrendingSection />
      </section>

      {/* Call to Action */}
      <section className="py-12 bg-amber-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to Explore India&apos;s History?</h2>
          <p className="mb-6 max-w-2xl mx-auto">
            Start planning your heritage journey today and discover the stories, architecture, and cultures that shaped the Indian subcontinent.
          </p>
          <Link 
            href="/itineraries" 
            className="bg-white text-amber-800 hover:bg-amber-100 font-bold py-2 px-6 rounded-md transition-colors"
          >
            Plan Your Trip
          </Link>
        </div>
      </section>
    </div>
  );
};

export default ExplorePage;