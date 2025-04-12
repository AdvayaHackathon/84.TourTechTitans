// components/SuggestedSection.tsx

import Image from "next/image";
import Link from "next/link";

type Place = {
  name: string;
  location: string;
  description: string;
  image: string;
  slug: string;
};

type SuggestedSectionProps = {
  places?: Place[];
  showExploreLink?: boolean;
};

export default function SuggestedSection({
  places = [],
  showExploreLink = false,
}: SuggestedSectionProps) {
  return (
    <div className="container mx-auto px-4">
      <div className="flex flex-col md:flex-row items-center justify-between mb-12">
        <h2 className="text-3xl font-bold text-amber-900">Suggested for You</h2>
        {showExploreLink && (
          <Link
            href="/explore"
            className="text-amber-700 hover:text-amber-900 font-medium"
          >
            Explore All &rarr;
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {places.map((item, index) => (
          <div
            key={index}
            className="bg-amber-50 rounded-lg shadow-md overflow-hidden"
          >
            <div className="relative h-48">
              <Image
                src={item.image}
                alt={item.name}
                layout="fill"
                objectFit="cover"
              />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-amber-900 mb-2">
                {item.name}
              </h3>
              <p className="text-amber-700 mb-2">{item.location}</p>
              <p className="text-amber-700 mb-4">{item.description}</p>
              <Link
                href={`/places/${item.slug}`}
                className="text-amber-600 hover:text-amber-800 font-medium"
              >
                Discover &rarr;
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
