"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import Image from "next/image";
import {
  fetchWithAuth,
  getUserJourneysHistory,
  getUserTrips,
} from "@/app/utils/api";

interface UserDetails {
  user_id: string;
  email: string;
  display_name: string;
  profile_picture_url?: string;
  created_at?: string;
}

interface Journey {
  journey_id: string;
  user_id: string;
  place_name?: string;
  start_date?: string;
  end_date?: string;
  photos?: { photo_id: string; url: string }[];
  created_at: string;
}

interface Trip {
  trip_id: string;
  user_id: string;
  place_name?: string;
  start_date?: string;
  end_date?: string;
}

interface UserStats {
  journeysCount: number;
  placesExplored: number;
  photosShared: number;
  travelDays: number;
}

export default function UserProfile() {
  const { user, isLoading: authLoading } = useAuth();
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [userStats, setUserStats] = useState<UserStats>({
    journeysCount: 0,
    placesExplored: 0,
    photosShared: 0,
    travelDays: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;

      try {
        setLoading(true);

        // Fetch basic user details
        const userData = await fetchWithAuth(`/auth/user`);
        setUserDetails(userData);

        // Fetch journeys history
        const journeysData = (await getUserJourneysHistory()) as Journey[];

        // Fetch current trips
        const tripsData = (await getUserTrips()) as Trip[];

        // Calculate stats
        const journeysCount = journeysData?.length || 0;

        // Count unique places from both journeys and trips
        const allPlaces = new Set();
        if (journeysData) {
          journeysData.forEach((journey: Journey) => {
            if (journey.place_name) allPlaces.add(journey.place_name);
          });
        }
        if (tripsData) {
          tripsData.forEach((trip: Trip) => {
            if (trip.place_name) allPlaces.add(trip.place_name);
          });
        }

        // Calculate total days traveling
        let travelDays = 0;
        if (journeysData) {
          journeysData.forEach((journey: Journey) => {
            if (journey.start_date && journey.end_date) {
              const start = new Date(journey.start_date);
              const end = new Date(journey.end_date);
              const days = Math.ceil(
                (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
              );
              travelDays += days > 0 ? days : 0;
            }
          });
        }

        // Count photos (if available in the API response)
        let photosCount = 0;
        if (journeysData) {
          journeysData.forEach((journey: Journey) => {
            if (journey.photos) photosCount += journey.photos.length;
          });
        }

        setUserStats({
          journeysCount,
          placesExplored: allPlaces.size,
          photosShared: photosCount,
          travelDays,
        });
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError("Failed to load user profile. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading && user) {
      fetchUserData();
    } else if (!authLoading && !user) {
      setLoading(false);
    }
  }, [user, authLoading]);

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-pulse flex flex-col items-center">
          <div className="bg-amber-200 h-32 w-32 rounded-full mb-4"></div>
          <div className="h-6 bg-amber-200 rounded w-48 mb-2"></div>
          <div className="h-4 bg-amber-100 rounded w-64"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-white rounded-xl shadow-md w-full">
        <div className="text-red-500 text-center">{error}</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-6 bg-white rounded-xl shadow-md w-full">
        <div className="text-amber-700 text-center">
          Please log in to view your profile.
        </div>
      </div>
    );
  }

  // Use actual user data or fallback to basic auth user data
  const displayUser = userDetails || user;
  const avatarUrl =
    displayUser.profile_picture_url ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      displayUser.display_name
    )}&background=amber&color=fff`;

  return (
    <div className="flex flex-col md:flex-row gap-8 p-8">
      {/* User Profile Card */}
      <div className="bg-white rounded-xl shadow-lg p-8 flex-1 max-w-md">
        <div className="flex flex-col items-center">
          <div className="relative h-32 w-32 mb-6 ring-4 ring-amber-200 rounded-full overflow-hidden">
            {avatarUrl ? (
              <Image
                src={avatarUrl}
                alt={displayUser.display_name}
                fill
                className="object-cover"
                sizes="128px"
              />
            ) : (
              <div className="bg-amber-400 h-full w-full flex items-center justify-center text-4xl text-white font-bold">
                {displayUser.display_name?.[0]?.toUpperCase() || "U"}
              </div>
            )}
          </div>

          <h1 className="text-2xl font-bold text-amber-900 mb-2">
            {displayUser.display_name}
          </h1>

          <p className="text-amber-600 mb-6">{displayUser.email}</p>

          <div className="w-full border-t border-amber-100 pt-4 mt-2">
            {userDetails?.created_at && (
              <div className="flex justify-between">
                <span className="text-amber-700 font-medium">
                  Member Since:
                </span>
                <span className="text-amber-900">
                  {new Date(userDetails.created_at).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right side section - Journey Stats */}
      <div className="bg-white rounded-xl shadow-lg p-8 flex-1">
        <h2 className="text-xl font-bold text-amber-900 mb-4">
          Your Journey Stats
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-amber-50 p-4 rounded-lg">
            <div className="text-amber-600 font-medium mb-1">
              Completed Journeys
            </div>
            <div className="text-3xl font-bold text-amber-900">
              {userStats.journeysCount}
            </div>
          </div>

          <div className="bg-amber-50 p-4 rounded-lg">
            <div className="text-amber-600 font-medium mb-1">
              Places Explored
            </div>
            <div className="text-3xl font-bold text-amber-900">
              {userStats.placesExplored}
            </div>
          </div>

          <div className="bg-amber-50 p-4 rounded-lg">
            <div className="text-amber-600 font-medium mb-1">
              Days Traveling
            </div>
            <div className="text-3xl font-bold text-amber-900">
              {userStats.travelDays}
            </div>
          </div>
        </div>

        <div className="mt-6">{/* Edit button removed */}</div>
      </div>
    </div>
  );
}
