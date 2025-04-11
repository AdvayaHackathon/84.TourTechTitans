"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { name: "User Profile", path: "/my-journey" },
  { name: "Planning", path: "/my-journey/plan" },
  { name: "Past Journeys", path: "/my-journey/past" },
];

export default function JourneySidebar() {
  const pathname = usePathname();
  return (
    <aside className="w-full sm:w-64 bg-amber-100 text-amber-900 p-4 rounded-xl shadow-lg">
      <nav className="flex flex-col space-y-3">
        {links.map((link) => (
          <Link
            key={link.path}
            href={link.path}
            className={`px-4 py-2 rounded-md font-medium transition ${
              pathname === link.path
                ? "bg-amber-700 text-white"
                : "hover:bg-amber-200"
            }`}
          >
            {link.name}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
