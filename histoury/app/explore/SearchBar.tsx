"use client"
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { debounce } from "lodash";

// Complete list of all 12 sites for searching
const allSites = [
  // Site 1
  {
    name: "Ajanta Caves",
    location: "Aurangabad, Maharashtra",
    description: "Buddhist rock-cut cave monuments with paintings and sculptures dating from the 2nd century BCE.",
    imageSrc: "/images/ajanta_caves.jpg",
    slug: "ajanta-caves"
  },
  // Site 2
  {
    name: "Victoria Memorial",
    location: "Kolkata, West Bengal",
    description: "Magnificent white marble monument blending British and Mughal elements.",
    imageSrc: "/images/victoria_memorial.jpg",
    slug: "victoria-memorial"
  },
  // Site 3
  {
    name: "Taj Mahal",
    location: "Agra, Uttar Pradesh",
    description: "Iconic white marble mausoleum built by Mughal Emperor Shah Jahan in memory of his wife Mumtaz Mahal.",
    imageSrc: "/images/taj_mahal.jpg",
    slug: "taj-mahal"
  },
  // Site 4
  {
    name: "Gateway of India",
    location: "Mumbai, Maharashtra",
    description: "Iconic monument built to commemorate the visit of King George V and Queen Mary to Mumbai.",
    imageSrc: "/images/gateway_of_india.jpg",
    slug: "gateway-of-india"
  },
  // Site 5
  {
    name: "Qutub Minar",
    location: "Delhi",
    description: "UNESCO World Heritage Site, the tallest brick minaret in the world standing at 73 meters.",
    imageSrc: "/images/qutub_minar.jpg",
    slug: "qutub-minar"
  },
  // Site 6
  {
    name: "Khajuraho Temples",
    location: "Madhya Pradesh",
    description: "Known for their Nagara-style architectural symbolism and erotic sculptures, built between 950-1050 CE.",
    imageSrc: "/images/khajuraho_temples.jpg",
    slug: "khajuraho-temples"
  },
  // Site 7
  {
    name: "Ellora Caves",
    location: "Aurangabad, Maharashtra",
    description: "Ancient rock-cut caves featuring Buddhist, Hindu and Jain monuments with remarkable sculptures.",
    imageSrc: "/images/ellora_caves.jpg",
    slug: "ellora-caves"
  },
  // Site 8
  {
    name: "Hawa Mahal",
    location: "Jaipur, Rajasthan",
    description: "Palace of winds featuring a unique five-story exterior with 953 small windows called jharokhas.",
    imageSrc: "/images/hawa_mahal.jpg",
    slug: "hawa-mahal"
  },
  // Site 9
  {
    name: "Golden Temple",
    location: "Amritsar, Punjab",
    description: "Most significant shrine in Sikhism, known officially as Harmandir Sahib or Darbar Sahib.",
    imageSrc: "/images/golden_temple.jpg",
    slug: "golden-temple"
  },
  // Site 10
  {
    name: "Mysore Palace",
    location: "Mysore, Karnataka",
    description: "Historical palace that was the official residence of the Wadiyar dynasty, rulers of Mysore.",
    imageSrc: "/images/mysore_palace.jpg",
    slug: "mysore-palace"
  },
  // Site 11
  {
    name: "Sun Temple",
    location: "Konark, Odisha",
    description: "13th-century temple dedicated to the sun god Surya, known for its intricate stone carvings.",
    imageSrc: "/images/sun_temple.jpg",
    slug: "sun-temple"
  },
  // Site 12
  {
    name: "Meenakshi Temple",
    location: "Madurai, Tamil Nadu",
    description: "Ancient Hindu temple dedicated to Goddess Meenakshi with thousands of colorful sculptures.",
    imageSrc: "/images/meenakshi_temple.jpg",
    slug: "meenakshi-temple"
  }
];

// Result item with expanded information and better styling
interface SearchResultItemProps {
  site: {
    name: string;
    location: string;
    description: string;
    slug: string;
  };
  onClick: () => void;
}

const SearchResultItem: React.FC<SearchResultItemProps> = ({ site, onClick }) => {
  const description = site.description.length > 80 
    ? site.description.substring(0, 80) + "..." 
    : site.description;

  return (
    <Link href={`/places/${site.slug}`} onClick={onClick}>
      <div className="p-4 border-b border-amber-100 hover:bg-amber-50 transition-colors duration-150 cursor-pointer flex items-start group">
        <div className="relative h-16 w-16 mr-4 rounded-lg overflow-hidden flex-shrink-0 shadow-sm group-hover:shadow transition-shadow">
          <Image
            src={`/api/placeholder/100/100`}
            alt={site.name}
            fill
            className="object-cover"
          />
        </div>
        <div className="flex-grow">
          <h4 className="text-amber-900 font-semibold text-base group-hover:text-amber-700 transition-colors">
            {site.name}
          </h4>
          <p className="text-amber-700 text-sm mb-1 flex items-center">
            <svg className="h-3 w-3 mr-1 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>{site.location}</span>
          </p>
          <p className="text-amber-600 text-xs line-clamp-2">
            {description}
          </p>
        </div>
      </div>
    </Link>
  );
};

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<typeof allSites>([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // The minimum number of characters required before searching
  const MIN_SEARCH_LENGTH = 3;

  // Handle click outside to close results
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Calculate relevance score based ONLY on name
  const getNameRelevanceScore = (site: typeof allSites[0], searchTerm: string) => {
    const lowerSearchTerm = searchTerm.toLowerCase();
    const lowerName = site.name.toLowerCase();
    
    let score = 0;
    
    // Exact name match
    if (lowerName === lowerSearchTerm) {
      score += 100;
    } 
    // Name starts with search term (e.g., "Ta" matching "Taj Mahal")
    else if (lowerName.startsWith(lowerSearchTerm)) {
      score += 80;
    }
    // Words in name start with search term
    else if (lowerName.split(' ').some(word => word.startsWith(lowerSearchTerm))) {
      score += 70;
    }
    // Contains search term in name
    else if (lowerName.includes(lowerSearchTerm)) {
      score += 60;
    }
    
    // Boost score for shorter name length (more specific matches)
    score += (20 - Math.min(20, lowerName.length)) / 2;
    
    return score;
  };

  // Simple search function that ONLY checks name
  const searchSites = (term: string) => {
    if (term.trim() === "" || term.trim().length < MIN_SEARCH_LENGTH) {
      setResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    
    // Short delay for UX feedback
    setTimeout(() => {
      const lowerCaseTerm = term.toLowerCase();
      
      // Only filter based on name
      const matchedResults = allSites.filter(site => 
        site.name.toLowerCase().includes(lowerCaseTerm)
      );
      
      // Sort by relevance score (still based only on name)
      const sortedResults = matchedResults.sort((a, b) => {
        const scoreA = getNameRelevanceScore(a, term);
        const scoreB = getNameRelevanceScore(b, term);
        return scoreB - scoreA; // Higher score first
      });
      
      setResults(sortedResults);
      setIsSearching(false);
    }, 300);
  };

  // Create debounced search function
  const debouncedSearch = useRef(
    debounce((term: string) => {
      searchSites(term);
    }, 300)
  ).current;

  // Call debounced search when search term changes
  useEffect(() => {
    if (searchTerm.trim().length >= MIN_SEARCH_LENGTH) {
      setIsSearching(true);
      debouncedSearch(searchTerm);
      setShowResults(true);
    } else {
      setResults([]);
      setIsSearching(false);
      // Keep dropdown open for UX feedback but clear results
      if (searchTerm.trim().length > 0) {
        setShowResults(true);
      }
    }
    
    return () => {
      debouncedSearch.cancel();
    };
  }, [searchTerm, debouncedSearch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    // We'll show the results container even with < 3 chars, just to provide feedback
    setShowResults(true);
  };

  const clearSearch = () => {
    setSearchTerm("");
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleResultClick = () => {
    setShowResults(false);
    setSearchTerm("");
  };

  // Check if search term is too short to trigger search
  

  return (
    <div className="w-full max-w-2xl relative" ref={searchRef}>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          placeholder="Search for historical sites by name..."
          className="w-full p-4 pl-12 rounded-full border-2 border-amber-300 focus:border-amber-500 focus:outline-none shadow-md transition-all duration-200"
          value={searchTerm}
          onChange={handleInputChange}
          onClick={() => setShowResults(true)}
          aria-label="Search heritage sites"
        />
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <svg
            className={`h-5 w-5 ${isSearching ? 'text-amber-400 animate-pulse' : 'text-amber-600'}`}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        
        {/* Clear button when there's text */}
        {searchTerm && (
          <button 
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-amber-600 hover:text-amber-800 transition-colors"
            onClick={clearSearch}
            aria-label="Clear search"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </button>
        )}
      </div>

      {/* Search Results Dropdown with improved styling and loading state */}
      {showResults && (
        <div className="absolute z-10 mt-2 w-full bg-white rounded-lg shadow-lg border border-amber-200 overflow-hidden max-h-96 overflow-y-auto transition-all duration-200">
          {/* Show "Type at least 3 characters" message when input is too short */}
         

          {isSearching && searchTerm.length >= MIN_SEARCH_LENGTH && (
            <div className="p-4 text-center text-amber-700 flex items-center justify-center">
              <svg className="animate-spin h-5 w-5 mr-2 text-amber-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Searching...
            </div>
          )}

          {!isSearching && results.length > 0 && searchTerm.length >= MIN_SEARCH_LENGTH && (
            <>
              <div className="p-2 bg-amber-50 text-amber-700 text-sm font-medium border-b border-amber-200">
                {results.length} {results.length === 1 ? 'result' : 'results'} found
              </div>
              {results.map((site, index) => (
                <SearchResultItem 
                  key={index} 
                  site={site} 
                  onClick={handleResultClick}
                />
              ))}
            </>
          )}

          {/* No results message */}
          {!isSearching && searchTerm.length >= MIN_SEARCH_LENGTH && results.length === 0 && (
            <div className="p-6 text-center flex flex-col items-center justify-center">
              <svg className="h-12 w-12 text-amber-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-amber-800 font-medium mb-1">No sites found matching &quot;{searchTerm}&quot;</p>
              <p className="text-amber-600 text-sm">Try different keywords or explore our suggested sites below</p>
            </div>
          )}
          
          {/* Popular searches - show only when there's no search term */}
          {!searchTerm && showResults && (
            <div className="p-3">
              <div className="text-sm font-medium text-amber-700 mb-2">Popular Searches</div>
              <div className="flex flex-wrap gap-2">
                {["Taj Mahal", "Temple", "Caves", "Palace", "Memorial"].map((term, i) => (
                  <button 
                    key={i}
                    className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm hover:bg-amber-200 transition-colors"
                    onClick={() => setSearchTerm(term)}
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;