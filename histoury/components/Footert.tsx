import Link from "next/link";
import { Facebook, Twitter, Instagram, Github } from "lucide-react";

export default function Footer() {
  return (
    <footer
      className="bg-amber-100 border-t border-amber-300 mt-6"
      style={{ borderTopWidth: "0.5px" }}
    >
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col">
            <h3 className="text-lg font-bold mb-3 text-amber-800">Histoury</h3>
            <p className="mb-4 text-amber-700 text-sm">
              Exploring the past, understanding the present, and shaping the
              future.
            </p>
            <div className="flex space-x-4 mt-auto">
              {/* Social Icons - Using Lucide React icons */}
              <a
                href="#"
                className="text-amber-600 hover:text-amber-800 transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={18} />
              </a>
              <a
                href="#"
                className="text-amber-600 hover:text-amber-800 transition-colors"
                aria-label="Twitter"
              >
                <Twitter size={18} />
              </a>
              <a
                href="#"
                className="text-amber-600 hover:text-amber-800 transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={18} />
              </a>
              <a
                href="#"
                className="text-amber-600 hover:text-amber-800 transition-colors"
                aria-label="GitHub"
              >
                <Github size={18} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-3 text-amber-800">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/"
                  className="text-amber-700 hover:text-amber-900 transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/scan"
                  className="text-amber-700 hover:text-amber-900 transition-colors"
                >
                  Scan and Learn
                </Link>
              </li>
              <li>
                <Link
                  href="/explore"
                  className="text-amber-700 hover:text-amber-900 transition-colors"
                >
                  Explore
                </Link>
              </li>
              <li>
                <Link
                  href="/my-journey"
                  className="text-amber-700 hover:text-amber-900 transition-colors"
                >
                  My Journey
                </Link>
              </li>
              <li>
                <Link
                  href="/chat"
                  className="text-amber-700 hover:text-amber-900 transition-colors"
                >
                  AI Guide
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-3 text-amber-800">
              Resources
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/contact"
                  className="text-amber-700 hover:text-amber-900 transition-colors"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-amber-700 hover:text-amber-900 transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-amber-700 hover:text-amber-900 transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-amber-200 mt-5 pt-4 text-center">
          <p className="text-amber-700 text-xs">
            &copy; {new Date().getFullYear()} Histoury. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
