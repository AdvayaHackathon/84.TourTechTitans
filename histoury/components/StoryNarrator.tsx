"use client";

import { useState } from "react";

const languageMap: { [key: string]: string } = {
  english: "en",
  hindi: "hi",
  kannada: "kn",
  tamil: "ta",
  telugu: "te",
};

export default function StoryNarrator({
  landmark,
}: {
  landmark: string | null;
}) {
  const [story, setStory] = useState("Here’s your AI-generated story...");
  const [language, setLanguage] = useState("english");
  const [loading, setLoading] = useState(false);
  const [audioPath, setAudioPath] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!landmark) {
      alert("No landmark detected yet.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("landmark", landmark);
    formData.append("language", languageMap[language]);

    try {
      const res = await fetch("http://localhost:8000/generate_summary/", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      setStory(data.summary || "No summary returned.");
      setAudioPath(data.audio_file || null);
    } catch (err) {
      console.error(err);
      setStory("Failed to fetch summary.");
    } finally {
      setLoading(false);
    }
  };

  const handleSpeak = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(story);
      utterance.lang = languageMap[language];
      window.speechSynthesis.cancel(); // Stop any current speech
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
          {Object.keys(languageMap).map((lang) => (
            <option key={lang} value={lang}>
              {lang[0].toUpperCase() + lang.slice(1)}
            </option>
          ))}
        </select>

        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="bg-amber-500 hover:bg-amber-600 text-white font-semibold px-6 py-2 rounded-xl transition-all duration-200"
          >
            ✍️ {loading ? "Generating..." : "Generate Story"}
          </button>

          <button
            onClick={handleSpeak}
            className="bg-amber-700 hover:bg-amber-800 text-white font-semibold px-6 py-2 rounded-xl transition-all duration-200"
          >
            🔊 Speak
          </button>
        </div>
      </div>

      {audioPath && (
        <div className="text-center mt-4">
          <a
            href={`http://localhost:8000/download_audio/?path=${audioPath}`}
            className="text-amber-700 underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            🔉 Download or play narration
          </a>
        </div>
      )}
    </div>
  );
}
