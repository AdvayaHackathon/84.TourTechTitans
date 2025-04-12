const API_URL = "http://localhost:5000";

export async function fetchWithAuth(
  endpoint: string,
  options: RequestInit = {}
) {
  const token = localStorage.getItem("authToken");

  if (!token) {
    throw new Error("No authentication token found. Please log in.");
  }

  const headers = {
    ...(options.headers as Record<string, string>),
    Authorization: `Bearer ${token}`,
    "Content-Type":
      (options.headers as Record<string, string>)?.["Content-Type"] ||
      "application/json",
  };

  try {
    console.log(`Making request to: ${API_URL}${endpoint}`);

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      let errorMessage = "API request failed";
      let errorDetails = "";

      try {
        const errorData = await response.json();
        errorMessage = errorData.detail || errorData.message || errorMessage;
        errorDetails = JSON.stringify(errorData);
      } catch (e) {
        console.log("Error parsing error response:", e);
        // Fallback to response text if JSON parsing fails
        try {
          errorDetails = await response.text();
        } catch {
          // Ignore error - can't get text error details
          errorDetails = "Unable to get error details";
        }
      }

      console.error(
        `API Error (${response.status}): ${errorMessage}`,
        errorDetails
      );
      throw new Error(`${errorMessage} (Status: ${response.status})`);
    }

    return response.json();
  } catch (error) {
    if (error instanceof TypeError && error.message.includes("fetch")) {
      console.error("Network error - Is the backend server running?", error);
      throw new Error(
        "Cannot connect to server. Please make sure the backend is running."
      );
    }
    throw error;
  }
}

// Example function to fetch user journeys
export async function getUserJourneys() {
  return fetchWithAuth("/journeys");
}

// Example function to upload a photo
export async function uploadPhoto(formData: FormData) {
  return fetchWithAuth("/photos/upload", {
    method: "POST",
    headers: {
      // Don't set Content-Type when using FormData
    },
    body: formData,
  });
}

// Create a new journey
export async function createJourney(name: string) {
  return fetchWithAuth("/journeys/", {
    method: "POST",
    body: JSON.stringify({ name }),
  });
}

// Add a landmark to a journey
export async function addLandmarkToJourney(
  journeyId: string,
  landmark: {
    name: string;
    latitude: string | number;
    longitude: string | number;
    summary?: string;
    image_url?: string;
  }
) {
  return fetchWithAuth(`/journeys/${journeyId}/landmarks`, {
    method: "POST",
    body: JSON.stringify(landmark),
  });
}

// Create a new trip
export async function createTrip(tripData: {
  lat: number | string;
  lng: number | string;
  description: string;
  start_date?: string;
  end_date?: string;
  place_name: string;
}) {
  return fetchWithAuth("/trips", {
    method: "POST",
    body: JSON.stringify(tripData),
  });
}

// Get all user trips
export async function getUserTrips() {
  return fetchWithAuth("/trips");
}

// Get a specific trip
export async function getTrip(tripId: string) {
  return fetchWithAuth(`/trips/${tripId}`);
}

// Update a trip
export async function updateTrip(
  tripId: string,
  tripData: Partial<{
    description: string;
    start_date: string;
    end_date: string;
    place_name: string;
  }>
) {
  return fetchWithAuth(`/trips/${tripId}`, {
    method: "PUT",
    body: JSON.stringify(tripData),
  });
}

// Delete a trip
export async function deleteTrip(tripId: string) {
  return fetchWithAuth(`/trips/${tripId}`, {
    method: "DELETE",
  });
}

// Mark a trip as completed (move to journeys table)
export async function markTripAsCompleted(tripId: string) {
  return fetchWithAuth(`/trips/${tripId}/complete`, {
    method: "POST",
  });
}

// Get all user journeys (completed trips)
export async function getUserJourneysHistory() {
  return fetchWithAuth("/journeys/history");
}
