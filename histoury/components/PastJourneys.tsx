"use client";
export default function PastJourneys() {
  const journeys = [
    { place: "Mysore", date: "Jan 2024" },
    { place: "Delhi", date: "Dec 2023" },
  ];

  return (
    <div className="p-6 bg-white rounded-xl shadow-md w-full">
      <h2 className="text-2xl font-bold text-amber-900 mb-4">Past Journeys</h2>
      <ul className="text-amber-700">
        {journeys.map((journey, i) => (
          <li key={i}>
            {journey.place} – <span className="italic">{journey.date}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
