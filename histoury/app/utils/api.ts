const API_URL = "http://localhost:5000";

export async function fetchWithAuth(
  endpoint: string,
  options: RequestInit = {}
) {
  const token = localStorage.getItem("authToken");

  if (!token) {
    throw new Error("No authentication token found");
  }

  const headers = {
    ...(options.headers as Record<string, string>),
    Authorization: `Bearer ${token}`,
    "Content-Type":
      (options.headers as Record<string, string>)?.["Content-Type"] ||
      "application/json",
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorMessage = "API request failed";
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorMessage;
    } catch (e) {
      console.log(e);
      // JSON parsing failed, use default message
    }
    throw new Error(errorMessage);
  }

  return response.json();
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
