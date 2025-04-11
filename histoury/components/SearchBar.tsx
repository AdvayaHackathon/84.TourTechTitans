"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/explore/${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="w-full max-w-xl flex">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search by place or culture..."
        className="flex-grow p-4 rounded-l-lg border border-amber-400 focus:outline-none text-amber-800"
      />
      <button
        type="submit"
        className="bg-amber-700 text-white px-6 py-3 rounded-r-lg hover:bg-amber-800 transition"
      >
        Search
      </button>
    </form>
  );
}
