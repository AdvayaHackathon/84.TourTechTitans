"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = searchParams.get("token");
    const error = searchParams.get("error");

    if (error) {
      setError("Authentication failed. Please try again.");
      return;
    }

    if (!token) {
      setError("No authentication token received.");
      return;
    }

    // Store token
    localStorage.setItem("authToken", token);

    // Redirect to journey page
    router.push("/my-journey");
  }, [router, searchParams]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-red-500">{error}</p>
        <button
          onClick={() => router.push("/login")}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Back to Login
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p>Completing authentication...</p>
    </div>
  );
}
