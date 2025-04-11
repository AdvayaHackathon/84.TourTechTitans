"use client";

import { useState } from "react";

interface TripPlan {
  destination: string;
  date: string;
  notes: string;
}

export default function PlanningSection() {
  const [plans, setPlans] = useState<TripPlan[]>([
    {
      destination: "Hampi",
      date: "2025-05-18",
      notes: "Explore Vijayanagara ruins and Virupaksha temple",
    },
    {
      destination: "Mahabalipuram",
      date: "2025-06-04",
      notes: "Shore temple and cultural exploration",
    },
  ]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold text-amber-800 mb-4">
        Your Upcoming Plans
      </h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {plans.map((plan, index) => (
          <div
            key={index}
            className="bg-white p-5 rounded-xl shadow-md border border-amber-100 hover:shadow-lg transition"
          >
            <h3 className="text-xl font-bold text-amber-700 mb-1">
              {plan.destination}
            </h3>
            <p className="text-sm text-gray-600 mb-1">📅 {plan.date}</p>
            <p className="text-sm text-gray-700">{plan.notes}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 text-center">
        <button className="bg-amber-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-amber-700 transition">
          + Add New Plan
        </button>
      </div>
    </div>
  );
}
