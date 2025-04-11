"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/app/context/AuthContext";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { isAuthenticated, logout, isLoading } = useAuth();

  const handleSignOut = () => {
    logout();
  };

  const renderAuthButton = () => {
    if (isLoading) {
      return (
        <div className="bg-amber-600 text-white font-bold py-2 px-4 rounded transition duration-300">
          Loading...
        </div>
      );
    }

    if (isAuthenticated) {
      return (
        <button
          onClick={handleSignOut}
          className="bg-amber-600 hover:bg-amber-700 text-white font-bold py-2 px-4 rounded transition duration-300"
        >
          Sign Out
        </button>
      );
    }

    return (
      <Link
        href="/login"
        className="bg-amber-600 hover:bg-amber-700 text-white font-bold py-2 px-4 rounded transition duration-300"
      >
        Sign In
      </Link>
    );
  };

  return (
    <header className="bg-amber-100 shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-bold text-amber-800">Histoury</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-8">
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

          {/* Language Switcher and Auth Button on Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="border-r border-amber-300 pr-4">
              <LanguageSwitcher />
            </div>
            {renderAuthButton()}
          </div>

          {/* Hamburger Icon */}
          <div className="md:hidden">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-amber-900 hover:text-amber-700 focus:outline-none"
              aria-label="Toggle Menu"
            >
              <svg
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

        {/* Animated Mobile Menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            menuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="flex flex-col mt-4 space-y-3">
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

            {/* Language Switcher in Mobile Menu */}
            <div className="py-2 border-t border-amber-200">
              <div className="mb-3">
                <span className="text-amber-900 font-medium">
                  Select Language:
                </span>
              </div>
              <LanguageSwitcher />
            </div>

            <div className="pt-2 border-t border-amber-200">
              {renderAuthButton()}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
