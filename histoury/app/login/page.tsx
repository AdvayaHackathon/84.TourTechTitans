"use client";

// import { signIn } from "next-auth/react";

export default function LoginPage() {
  const handleLogin = () => {
    signIn("google");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-amber-50 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-xl text-center">
        <h1 className="text-3xl font-bold text-amber-900 mb-4">
          Welcome to Histoury
        </h1>
        <p className="text-amber-700 mb-6">
          Explore stories, travel memories, and hidden heritage. Start your
          journey now.
        </p>
        <button
          onClick={handleLogin}
          className="bg-amber-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-amber-700 transition shadow-md"
        >
          Sign in with Google
        </button>
      </div>
    </div>
  );
}
