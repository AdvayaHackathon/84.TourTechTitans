"use client";

import { useState, useEffect } from "react";
import { getUserJourneysHistory } from "@/app/utils/api";
import { MapPin, Calendar } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

interface Journey {
  journey_id: string;
  place_name: string;
  start_date: string;
  end_date: string;
  description: string;
  lat: number;
  lng: number;
}

export default function PastJourneys() {
  const [journeys, setJourneys] = useState<Journey[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchJourneys() {
      try {
        setLoading(true);
        // Show loading toast
        const loadingToast = toast.loading("Loading your journey history...");

        const journeysData = await getUserJourneysHistory();

        // Ensure we have an array (even if the API returns null or undefined)
        setJourneys(Array.isArray(journeysData) ? journeysData : []);

        // Dismiss loading toast
        toast.dismiss(loadingToast);
      } catch (err) {
        console.error("Error fetching journeys:", err);
        setError("Failed to load your past journeys. Please try again.");
        toast.error("Failed to load your journey history. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    fetchJourneys();
  }, []);

  // Format date to be more readable
  const formatDate = (dateString: string) => {
    if (!dateString) return "";

    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateString; // Return the original string if formatting fails
    }
  };

  if (loading) {
    return (
      <div className="p-6 w-full">
        <div className="animate-pulse flex flex-col">
          <div className="h-8 bg-amber-200 rounded w-1/3 mb-4"></div>
          <div className="h-24 bg-amber-100 rounded w-full mb-3"></div>
          <div className="h-24 bg-amber-100 rounded w-full mb-3"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 w-full">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-xl shadow-md w-full">
      {/* Toast container */}
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 5000,
          style: {
            background: "#FFF",
            color: "#333",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
            borderRadius: "8px",
            padding: "16px",
          },
          success: {
            style: {
              border: "1px solid #D1FAE5",
              background: "#F0FDF4",
            },
            iconTheme: {
              primary: "#059669",
              secondary: "#ECFDF5",
            },
          },
          error: {
            style: {
              border: "1px solid #FEE2E2",
              background: "#FEF2F2",
            },
            iconTheme: {
              primary: "#EF4444",
              secondary: "#FECACA",
            },
          },
        }}
      />

      <h2 className="text-2xl font-bold text-amber-900 mb-6">Past Journeys</h2>

      {journeys.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-lg text-gray-600 mb-2">
            You haven&apos;t completed any journeys yet.
          </p>
          <p className="text-gray-500">
            Mark your planned trips as completed to see them here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {journeys.map((journey) => (
            <div
              key={journey.journey_id}
              className="border border-amber-200 rounded-lg p-4 hover:shadow-md transition bg-amber-50"
            >
              <h3 className="text-xl font-semibold text-amber-800 mb-2">
                {journey.place_name}
              </h3>

              <div className="flex items-center mb-2 text-amber-700">
                <Calendar size={18} className="mr-2" />
                <span>
                  {formatDate(journey.start_date)}
                  {journey.end_date &&
                    journey.end_date !== journey.start_date &&
                    ` - ${formatDate(journey.end_date)}`}
                </span>
              </div>

              <div className="flex items-center mb-3 text-amber-700">
                <MapPin size={18} className="mr-2" />
                <span>
                  {journey.lat.toFixed(4)}, {journey.lng.toFixed(4)}
                </span>
              </div>

              <p className="text-gray-700">{journey.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
