"use client";

import { useState, useEffect } from "react";
import { ArrowRight, Mic, Volume2, Globe } from "lucide-react";

type Language = "en" | "hi" | "kn" | "ta" | "te";

interface LanguageOption {
  code: Language;
  name: string;
  nativeName: string;
  voiceURI?: string;
}

export default function GuideChatClient() {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<Language>("en");
  const [availableVoices, setAvailableVoices] = useState<
    SpeechSynthesisVoice[]
  >([]);

  const languageOptions: LanguageOption[] = [
    { code: "en", name: "English", nativeName: "English" },
    { code: "hi", name: "Hindi", nativeName: "हिन्दी" },
    { code: "kn", name: "Kannada", nativeName: "ಕನ್ನಡ" },
    { code: "ta", name: "Tamil", nativeName: "தமிழ்" },
    { code: "te", name: "Telugu", nativeName: "తెలుగు" },
  ];

  // Load available voices when component mounts
  useEffect(() => {
    const loadVoices = () => {
      const voices = speechSynthesis.getVoices();
      setAvailableVoices(voices);
    };

    // Load voices if already available
    loadVoices();

    // Listen for the voiceschanged event
    speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  const handleSend = async () => {
    if (!query.trim()) return;

    setIsLoading(true);

    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: query,
          language: selectedLanguage,
        }),
      });

      const data = await res.json();
      setResponse(data.result);
      speakResponse(data.result);
    } catch (error) {
      console.error("Error:", error);
      setResponse("Sorry, there was an error processing your request.");
    } finally {
      setIsLoading(false);
    }
  };

  const speakResponse = (text: string) => {
    // Cancel any ongoing speech
    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);

    // Set language based on selection
    utterance.lang = getLangCode(selectedLanguage);

    // Try to find a voice for the selected language
    const languageVoices = availableVoices.filter((voice) =>
      voice.lang.startsWith(getLangCode(selectedLanguage).substring(0, 2))
    );

    if (languageVoices.length > 0) {
      utterance.voice = languageVoices[0];
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = (event) => {
      console.error("Speech synthesis error:", event);
      setIsSpeaking(false);
    };

    speechSynthesis.speak(utterance);
  };

  const getLangCode = (lang: Language): string => {
    switch (lang) {
      case "hi":
        return "hi-IN";
      case "kn":
        return "kn-IN";
      case "ta":
        return "ta-IN";
      case "te":
        return "te-IN";
      default:
        return "en-IN";
    }
  };

  const handleVoiceInput = () => {
    if (
      !("webkitSpeechRecognition" in window) &&
      !("SpeechRecognition" in window)
    ) {
      alert(
        "Speech recognition is not supported in your browser. Try Chrome or Edge."
      );
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    const recognition = new SpeechRecognition();
    recognition.lang = getLangCode(selectedLanguage);
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      const spokenText = event.results[0][0].transcript;
      setQuery(spokenText);
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error", event);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedLanguage(e.target.value as Language);
  };

  return (
    <div className="w-full max-w-2xl bg-white shadow-xl rounded-2xl p-6 space-y-4">
      <div className="flex items-center justify-end mb-2">
        <div className="flex items-center space-x-2">
          <Globe className="w-5 h-5 text-orange-500" />
          <select
            value={selectedLanguage}
            onChange={handleLanguageChange}
            className="pl-2 pr-8 py-1 rounded-lg border border-orange-300 text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm"
          >
            {languageOptions.map((option) => (
              <option key={option.code} value={option.code}>
                {option.nativeName} ({option.name})
              </option>
            ))}
          </select>
        </div>
      </div>

      <textarea
        className="w-full p-4 rounded-xl border text-black border-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-400"
        rows={3}
        placeholder={
          selectedLanguage === "en"
            ? "Ask me anything about a monument, culture, or place..."
            : "Ask your question in any language..."
        }
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <div className="flex gap-4 justify-between">
        <button
          onClick={handleSend}
          disabled={isLoading || !query.trim()}
          className={`flex items-center gap-2 px-4 py-2 text-white rounded-xl ${
            isLoading || !query.trim()
              ? "bg-orange-300 cursor-not-allowed"
              : "bg-orange-500 hover:bg-orange-600"
          }`}
        >
          {isLoading ? "Processing..." : "Ask"}
          {!isLoading && <ArrowRight className="w-4 h-4" />}
        </button>

        <button
          onClick={handleVoiceInput}
          disabled={isListening}
          className={`flex items-center gap-2 px-4 py-2 text-white rounded-xl ${
            isListening ? "bg-red-500" : "bg-green-500 hover:bg-green-600"
          }`}
        >
          {isListening ? "Listening..." : "Speak"}
          <Mic className="w-4 h-4" />
        </button>
      </div>

      {response && (
        <div className="bg-yellow-100 rounded-xl p-4 text-gray-800 space-y-2">
          <p className="text-lg">{response}</p>
          <button
            onClick={() => speakResponse(response)}
            disabled={isSpeaking}
            className="mt-2 flex items-center gap-2 text-orange-600 hover:underline"
          >
            <Volume2 className="w-4 h-4" />
            {isSpeaking ? "Speaking..." : "Play Again"}
          </button>
        </div>
      )}
    </div>
  );
}
