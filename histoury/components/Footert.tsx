import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-amber-800 text-amber-100">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Histoury</h3>
            <p className="mb-4">
              Exploring the past, understanding the present, and shaping the
              future.
            </p>
            <div className="flex space-x-4">
              {/* Social Icons */}
              {/* (same as original, left untouched) */}
              <a href="#" className="text-amber-100 hover:text-white">
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 4.557c..." />
                </svg>
              </a>
              <a href="#" className="text-amber-100 hover:text-white">
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2.163c..." />
                </svg>
              </a>
              <a href="#" className="text-amber-100 hover:text-white">
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M9 8h-3v4h3v12..." />
                </svg>
              </a>
              <a href="#" className="text-amber-100 hover:text-white">
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 0c..." />
                </svg>
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="hover:text-white">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/scan" className="hover:text-white">
                  Scan
                </Link>
              </li>
              <li>
                <Link href="/explore" className="hover:text-white">
                  Explore
                </Link>
              </li>
              <li>
                <Link href="/my-journey" className="hover:text-white">
                  My Journey
                </Link>
              </li>
              <li>
                <Link href="/chat" className="hover:text-white">
                  AI Guide
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/contact" className="hover:text-white">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-amber-700 mt-8 pt-6 text-center">
          <p>
            &copy; {new Date().getFullYear()} Histoury. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
