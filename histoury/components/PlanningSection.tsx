"use client";

import { useState, useEffect } from "react";
import { getUserTrips, deleteTrip, markTripAsCompleted } from "@/app/utils/api";
import Link from "next/link";
import { Check, Trash2, MapPin, Calendar, AlertTriangle } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

interface TripPlan {
  trip_id: string;
  place_name: string;
  start_date: string;
  end_date: string;
  description: string;
  number_of_days?: number;
  lat: number;
  lng: number;
  place_slug?: string;
}

export default function PlanningSection() {
  const [plans, setPlans] = useState<TripPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState<{ [key: string]: string }>(
    {}
  );

  const fetchTrips = async () => {
    try {
      setLoading(true);
      const tripsData = await getUserTrips();

      // Ensure we have an array (even if the API returns null or undefined)
      setPlans(Array.isArray(tripsData) ? tripsData : []);
    } catch (err) {
      console.error("Error fetching trips:", err);
      setError("Failed to load your planned trips. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
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

  // Calculate number of days between start and end date
  const calculateDays = (startDate: string, endDate: string) => {
    if (!startDate || !endDate) return 1;

    try {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    } catch (error) {
      console.error("Error calculating days:", error);
      return 1;
    }
  };

  const handleDeleteTrip = async (tripId: string, placeName: string) => {
    // Create custom toast confirm dialog
    toast(
      (t) => (
        <div className="flex flex-col gap-4 p-2">
          <div className="flex items-center gap-2 text-red-600">
            <AlertTriangle size={20} />
            <span className="font-medium">Delete Trip</span>
          </div>
          <p className="text-gray-700">
            Are you sure you want to delete your trip to{" "}
            <span className="font-semibold">{placeName}</span>?
          </p>
          <div className="flex justify-end gap-2 mt-2">
            <button
              onClick={() => toast.dismiss(t.id)}
              className="px-3 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg text-sm transition"
            >
              Cancel
            </button>
            <button
              onClick={async () => {
                toast.dismiss(t.id);
                await confirmDelete(tripId);
              }}
              className="px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-sm transition flex items-center gap-1"
            >
              <Trash2 size={16} /> Delete
            </button>
          </div>
        </div>
      ),
      {
        duration: 10000,
        style: {
          background: "#FFF",
          boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
          borderRadius: "16px",
          padding: "16px",
          border: "1px solid #FEE2E2",
        },
      }
    );
  };

  const confirmDelete = async (tripId: string) => {
    try {
      setActionLoading({ ...actionLoading, [tripId]: "delete" });

      // Show loading toast
      const loadingToast = toast.loading("Deleting trip...");

      await deleteTrip(tripId);

      // Remove the trip from the state
      setPlans(plans.filter((plan) => plan.trip_id !== tripId));

      // Show success toast
      toast.success("Trip deleted successfully!", { id: loadingToast });
    } catch (err) {
      console.error("Error deleting trip:", err);
      toast.error("Failed to delete trip. Please try again.");
    } finally {
      setActionLoading({ ...actionLoading, [tripId]: "" });
    }
  };

  const handleCompleteTrip = async (tripId: string, placeName: string) => {
    // Create custom toast confirm dialog
    toast(
      (t) => (
        <div className="flex flex-col gap-4 p-2">
          <div className="flex items-center gap-2 text-amber-700">
            <Check size={20} />
            <span className="font-medium">Mark Trip as Completed</span>
          </div>
          <p className="text-gray-700">
            Mark your trip to <span className="font-semibold">{placeName}</span>{" "}
            as completed? It will be moved to your Past Journeys.
          </p>
          <div className="flex justify-end gap-2 mt-2">
            <button
              onClick={() => toast.dismiss(t.id)}
              className="px-3 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg text-sm transition"
            >
              Cancel
            </button>
            <button
              onClick={async () => {
                toast.dismiss(t.id);
                await confirmComplete(tripId);
              }}
              className="px-3 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-700 rounded-lg text-sm transition flex items-center gap-1"
            >
              <Check size={16} /> Complete
            </button>
          </div>
        </div>
      ),
      {
        duration: 10000,
        style: {
          background: "#FFF",
          boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
          borderRadius: "16px",
          padding: "16px",
          border: "1px solid rgba(217, 119, 6, 0.2)",
        },
      }
    );
  };

  const confirmComplete = async (tripId: string) => {
    try {
      setActionLoading({ ...actionLoading, [tripId]: "complete" });

      // Show loading toast
      const loadingToast = toast.loading("Marking trip as completed...");

      await markTripAsCompleted(tripId);

      // Remove the trip from the state
      setPlans(plans.filter((plan) => plan.trip_id !== tripId));

      // Show success toast with link
      toast.success(
        (t) => (
          <div>
            <div className="font-medium">Trip marked as completed!</div>
            <div className="mt-2">
              <Link
                href="/my-journey/past"
                className="text-amber-800 underline hover:text-amber-900 font-medium flex items-center gap-1"
                onClick={() => toast.dismiss(t.id)}
              >
                <span>View Past Journeys</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14"></path>
                  <path d="m12 5 7 7-7 7"></path>
                </svg>
              </Link>
            </div>
          </div>
        ),
        { id: loadingToast, duration: 5000 }
      );
    } catch (err) {
      console.error("Error marking trip as completed:", err);
      toast.error("Failed to mark trip as completed. Please try again.");
    } finally {
      setActionLoading({ ...actionLoading, [tripId]: "" });
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-8 bg-amber-200 rounded w-1/3 mb-4"></div>
          <div className="h-64 bg-amber-100 rounded w-full"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Toast container */}
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 5000,
          style: {
            background: "#FFF",
            color: "#333",
            boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
            borderRadius: "16px",
            padding: "16px",
            maxWidth: "400px",
            fontWeight: "500",
            border: "1px solid #F5F5F5",
          },
          success: {
            style: {
              border: "1px solid rgba(217, 119, 6, 0.2)",
              background: "#FFFBEB",
              color: "#92400E",
            },
            iconTheme: {
              primary: "#D97706",
              secondary: "#FFFBEB",
            },
          },
          error: {
            style: {
              border: "1px solid #FEE2E2",
              background: "#FEF2F2",
              color: "#B91C1C",
            },
            iconTheme: {
              primary: "#EF4444",
              secondary: "#FEF2F2",
            },
          },
          loading: {
            style: {
              border: "1px solid rgba(217, 119, 6, 0.2)",
              background: "#FFFBEB",
              color: "#92400E",
            },
            iconTheme: {
              primary: "#D97706",
              secondary: "#FFFBEB",
            },
          },
        }}
      />

      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-amber-800">
          Your Upcoming Plans
        </h2>
        <Link
          href="/explore"
          className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-xl font-medium shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Add New Plan
        </Link>
      </div>

      {plans.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl shadow-md border border-amber-100">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-amber-600"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="16"></line>
                <line x1="8" y1="12" x2="16" y2="12"></line>
              </svg>
            </div>
          </div>
          <h3 className="text-xl font-bold text-amber-800 mb-4">
            No Planned Trips Yet
          </h3>
          <p className="text-lg text-gray-600 mb-4 max-w-md mx-auto">
            You haven&apos;t planned any trips yet!
          </p>
          <p className="text-gray-500 mb-8 max-w-md mx-auto">
            Explore heritage sites and add them to your journey for a
            personalized travel experience.
          </p>
          <Link
            href="/explore"
            className="bg-amber-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-amber-700 transition-all duration-300 shadow-md hover:shadow-lg inline-flex items-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <polygon points="10 8 16 12 10 16 10 8"></polygon>
            </svg>
            Explore Heritage Sites
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.trip_id}
              className="bg-white rounded-2xl shadow-md border border-amber-100 hover:shadow-lg transition-all duration-300 overflow-hidden"
            >
              {/* Card Header */}
              <div className="bg-gradient-to-r from-amber-500 to-amber-600 px-6 py-4">
                <h3 className="text-xl font-bold text-white mb-2 line-clamp-1">
                  {plan.place_name}
                </h3>
              </div>

              {/* Card Content */}
              <div className="p-6">
                <div className="flex items-center mb-3 gap-2">
                  <Calendar size={18} className="text-amber-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      {formatDate(plan.start_date)}
                      {plan.end_date && plan.end_date !== plan.start_date && (
                        <>
                          <span className="mx-2">→</span>
                          {formatDate(plan.end_date)}
                        </>
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-center mb-4">
                  <MapPin size={18} className="text-amber-600 mr-2" />
                  <div className="bg-amber-100 text-amber-800 text-sm font-medium px-3 py-1 rounded-full">
                    {plan.number_of_days ||
                      calculateDays(
                        plan.start_date,
                        plan.end_date || plan.start_date
                      )}{" "}
                    {plan.number_of_days === 1 ||
                    calculateDays(
                      plan.start_date,
                      plan.end_date || plan.start_date
                    ) === 1
                      ? "day"
                      : "days"}
                  </div>
                </div>

                <div className="bg-amber-50 rounded-xl p-4 mb-4 h-24 overflow-y-auto">
                  <p className="text-gray-700 line-clamp-4">
                    {plan.description || "No description provided."}
                  </p>
                </div>

                {plan.place_slug && (
                  <Link
                    href={`/places/${plan.place_slug}`}
                    className="inline-flex items-center text-amber-600 hover:text-amber-800 font-medium mb-4 hover:underline transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-1"
                    >
                      <circle cx="12" cy="12" r="10"></circle>
                      <polygon points="10 8 16 12 10 16 10 8"></polygon>
                    </svg>
                    View Details
                  </Link>
                )}

                {/* Action buttons */}
                <div className="flex justify-between mt-4 border-t border-amber-100 pt-4">
                  <button
                    onClick={() =>
                      handleCompleteTrip(plan.trip_id, plan.place_name)
                    }
                    disabled={actionLoading[plan.trip_id] === "complete"}
                    className="flex items-center justify-center text-green-600 hover:text-white bg-green-50 hover:bg-green-600 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 w-[48%]"
                  >
                    <Check size={18} className="mr-1" />
                    {actionLoading[plan.trip_id] === "complete"
                      ? "Marking..."
                      : "Complete"}
                  </button>

                  <button
                    onClick={() =>
                      handleDeleteTrip(plan.trip_id, plan.place_name)
                    }
                    disabled={actionLoading[plan.trip_id] === "delete"}
                    className="flex items-center justify-center text-red-600 hover:text-white bg-red-50 hover:bg-red-600 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 w-[48%]"
                  >
                    <Trash2 size={18} className="mr-1" />
                    {actionLoading[plan.trip_id] === "delete"
                      ? "Deleting..."
                      : "Delete"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
