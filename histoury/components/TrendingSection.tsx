import Image from "next/image";
import Link from "next/link";

export default function TrendingSection() {
  return (
    <div className="container mx-auto px-4">
      <h2 className="text-3xl font-bold text-amber-900 mb-12 text-center">
        Trending Places
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-amber-50 rounded-lg shadow-md overflow-hidden">
          <div className="relative h-48">
            <Image
              src="/images/trending1.jpg"
              alt="Hampi"
              layout="fill"
              objectFit="cover"
            />
          </div>
          <div className="p-6">
            <h3 className="text-xl font-bold text-amber-900 mb-2">
              Hampi, Karnataka
            </h3>
            <p className="text-amber-700 mb-4">
              A UNESCO World Heritage site known for its ancient ruins and
              Vijayanagara empire.
            </p>
            <Link
              href="/places/hampi"
              className="text-amber-600 hover:text-amber-800 font-medium"
            >
              Explore &rarr;
            </Link>
          </div>
        </div>
        {/* More cards... */}
      </div>
    </div>
  );
}
