"use client";

import { useState } from "react";

const languageMap: { [key: string]: string } = {
  english: "en-US",
  hindi: "hi-IN",
  kannada: "kn-IN",
  tamil: "ta-IN",
  telugu: "te-IN",
};

export default function StoryNarrator() {
  const [story, setStory] = useState("Here’s your AI-generated story...");
  const [language, setLanguage] = useState("english");

  const handleSpeak = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(story);
      utterance.lang = languageMap[language];
      window.speechSynthesis.cancel(); // Stop previous speech if ongoing
      window.speechSynthesis.speak(utterance);
    } else {
      alert("Speech synthesis not supported in this browser.");
    }
  };

  return (
    <div className="mt-6 bg-white border border-amber-300 p-6 rounded-2xl shadow-lg text-amber-900 space-y-4 w-full max-w-3xl mx-auto">
      <h2 className="text-xl sm:text-2xl font-semibold text-center text-amber-800">
        📖 AI-Generated Story
      </h2>

      <textarea
        value={story}
        onChange={(e) => setStory(e.target.value)}
        placeholder="The story will appear here..."
        className="w-full h-44 sm:h-52 resize-none p-4 text-base rounded-xl border border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-amber-50 text-amber-900"
      />

      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <select
          aria-label="Select language for story narration"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="w-full sm:w-auto px-4 py-2 rounded-xl border border-amber-300 bg-white text-amber-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
        >
          <option value="english">English</option>
          <option value="hindi">Hindi</option>
          <option value="kannada">Kannada</option>
          <option value="tamil">Tamil</option>
          <option value="telugu">Telugu</option>
        </select>

        <button
          onClick={handleSpeak}
          className="w-full sm:w-auto bg-amber-600 hover:bg-amber-700 text-white font-semibold px-6 py-2 rounded-xl transition-all duration-200"
        >
          🔊 Speak Story
        </button>
      </div>
    </div>
  );
}
