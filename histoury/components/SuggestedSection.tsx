import Image from "next/image";
import Link from "next/link";

export default function SuggestedSection() {
  return (
    <div className="container mx-auto px-4">
      <h2 className="text-3xl font-bold text-amber-900 mb-12 text-center">
        Suggested for You
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Example Card */}
        <div className="bg-amber-50 rounded-lg shadow-md overflow-hidden">
          <div className="relative h-48">
            <Image
              src="/images/suggestion1.jpg"
              alt="Ancient Wonders"
              layout="fill"
              objectFit="cover"
            />
          </div>
          <div className="p-6">
            <h3 className="text-xl font-bold text-amber-900 mb-2">
              Ancient Civilizations
            </h3>
            <p className="text-amber-700 mb-4">
              Uncover the mysteries of the world&apos;s earliest empires and
              societies.
            </p>
            <Link
              href="/collections/ancient"
              className="text-amber-600 hover:text-amber-800 font-medium"
            >
              Discover &rarr;
            </Link>
          </div>
        </div>
        {/* More cards... */}
      </div>
    </div>
  );
}
