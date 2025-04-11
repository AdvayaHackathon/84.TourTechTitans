import SearchBar from "@/components/SearchBar";
import SuggestedSection from "@/components/SuggestedSection";
import TrendingSection from "@/components/TrendingSection";
// import Image from "next/image";
// import Link from "next/link";

export default function ExplorePage() {
  return (
    <div className="flex flex-col">
      <section className="bg-gradient-to-r from-amber-200 to-amber-100 py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-amber-900 mb-6">
            Explore Histoury
          </h1>
          <p className="text-lg text-amber-800 mb-8">
            Search and discover rich historical stories, cultural landmarks, and
            more!
          </p>
          <div className="flex justify-center">
            <SearchBar />
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <SuggestedSection />
      </section>

      <section className="py-16 bg-white">
        <TrendingSection />
      </section>
    </div>
  );
}
