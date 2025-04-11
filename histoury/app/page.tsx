import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-amber-200 to-amber-100 py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            {/* Text Content */}
            <div className="w-full md:w-1/2 mb-10 md:mb-0 text-center md:text-left">
              <h1 className="text-4xl md:text-5xl font-bold text-amber-900 mb-6">
                Discover the Stories That Shaped Our World
              </h1>
              <p className="text-lg text-amber-800 mb-8">
                Journey through time with Histoury, where history comes alive
                through immersive storytelling, interactive timelines, and
                captivating insights.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center md:justify-start">
                <Link
                  href="/scan"
                  className="bg-amber-700 hover:bg-amber-800 text-white font-bold py-3 px-6 rounded-lg transition duration-300 text-center"
                >
                  Scan and Learn
                </Link>
                <Link
                  href="/explore"
                  className="bg-transparent hover:bg-amber-600 text-amber-700 hover:text-white border border-amber-700 font-bold py-3 px-6 rounded-lg transition duration-300 text-center"
                >
                  Explore
                </Link>
              </div>
            </div>

            {/* Image - Appears below on mobile, beside on desktop */}
            <div className="w-full md:w-1/2 relative">
              <div className="relative w-full aspect-[4/3] md:aspect-[16/9] rounded-lg overflow-hidden shadow-xl">
                <Image
                  src="/heroImage.png"
                  alt="Historical artifacts and documents"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-amber-900 mb-12">
            Discover Stories Behind Every Landmark
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-amber-50 p-6 rounded-lg shadow-md">
              <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-amber-700"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-amber-800 text-center mb-2">
                Instant Recognition
              </h3>
              <p className="text-amber-700 text-center">
                Upload or capture images of monuments to instantly identify them
                and unlock immersive historical insights.
              </p>
            </div>

            <div className="bg-amber-50 p-6 rounded-lg shadow-md">
              <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-amber-700"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-amber-800 text-center mb-2">
                Multilingual Stories
              </h3>
              <p className="text-amber-700 text-center">
                Experience cultural stories in your native language through
                dynamic translations and narration options.
              </p>
            </div>

            <div className="bg-amber-50 p-6 rounded-lg shadow-md">
              <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-amber-700"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-amber-800 text-center mb-2">
                AI-Powered Narration
              </h3>
              <p className="text-amber-700 text-center">
                Let AI read the story aloud as you explore, enhancing
                accessibility and making history come alive on-site.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Suggested For You Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between mb-12">
            <h2 className="text-3xl font-bold text-amber-900">
              Suggested for You
            </h2>
            <Link
              href="/explore"
              className="text-amber-700 hover:text-amber-900 font-medium"
            >
              Explore All &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-amber-50 rounded-lg overflow-hidden shadow-md">
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
                  Wonders of the Ancient World
                </h3>
                <p className="text-amber-700 mb-4">
                  Explore iconic landmarks that stood the test of time and still
                  captivate the imagination today.
                </p>
                <Link
                  href="/collections/ancient-wonders"
                  className="text-amber-600 hover:text-amber-800 font-medium"
                >
                  Discover &rarr;
                </Link>
              </div>
            </div>

            <div className="bg-amber-50 rounded-lg overflow-hidden shadow-md">
              <div className="relative h-48">
                <Image
                  src="/images/suggestion2.jpg"
                  alt="World Wars"
                  layout="fill"
                  objectFit="cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-amber-900 mb-2">
                  Chronicles of War
                </h3>
                <p className="text-amber-700 mb-4">
                  Relive pivotal moments from World War I and II that redefined
                  the global order.
                </p>
                <Link
                  href="/collections/war-chronicles"
                  className="text-amber-600 hover:text-amber-800 font-medium"
                >
                  Learn More &rarr;
                </Link>
              </div>
            </div>

            <div className="bg-amber-50 rounded-lg overflow-hidden shadow-md">
              <div className="relative h-48">
                <Image
                  src="/images/suggestion3.jpg"
                  alt="Historic Cities"
                  layout="fill"
                  objectFit="cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-amber-900 mb-2">
                  Timeless Cities to Visit
                </h3>
                <p className="text-amber-700 mb-4">
                  Travel back in time with our guide to the world's most
                  historically rich cities.
                </p>
                <Link
                  href="/places/historic-cities"
                  className="text-amber-600 hover:text-amber-800 font-medium"
                >
                  Explore Now &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
