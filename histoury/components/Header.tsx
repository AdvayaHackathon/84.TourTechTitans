import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-amber-100 shadow-md rounded-xl">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold text-amber-800">
                Histoury
              </span>
            </Link>
          </div>

          <nav className="hidden md:flex space-x-8">
            <Link
              href="/"
              className="text-amber-900 hover:text-amber-700 font-medium"
            >
              Home
            </Link>
            <Link
              href="/scan"
              className="text-amber-900 hover:text-amber-700 font-medium"
            >
              Scan and Learn
            </Link>
            <Link
              href="/explore"
              className="text-amber-900 hover:text-amber-700 font-medium"
            >
              Explore
            </Link>
            <Link
              href="/my-journey"
              className="text-amber-900 hover:text-amber-700 font-medium"
            >
              My Journey
            </Link>
          </nav>

          <div className="flex items-center">
            <button className="bg-amber-600 hover:bg-amber-700 text-white font-bold py-2 px-4 rounded transition duration-300">
              Sign In
            </button>
          </div>

          <div className="md:hidden flex items-center">
            <button className="text-amber-900 hover:text-amber-700">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
