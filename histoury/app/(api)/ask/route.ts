import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: Request) {
  try {
    const { prompt, language = "en" } = await req.json();

    if (!process.env.GEMINI_API_KEY) {
      console.error("GEMINI_API_KEY is not defined in environment variables");
      throw new Error("API key not configured");
    }

    // Initialize the Gemini API with your API key
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    // Get the model (Gemini Pro)
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // Generate system prompt with language context
    let systemPrompt =
      "You are an AI tour guide expert on monuments, cultures, and places around the world. ";

    // Add language-specific instructions
    switch (language) {
      case "hi":
        systemPrompt += "Respond in Hindi language.";
        break;
      case "kn":
        systemPrompt += "Respond in Kannada language.";
        break;
      case "ta":
        systemPrompt += "Respond in Tamil language.";
        break;
      case "te":
        systemPrompt += "Respond in Telugu language.";
        break;
      default:
        systemPrompt += "Respond in English language.";
    }

    console.log("Sending request to Gemini with prompt:", prompt);
    console.log("System prompt:", systemPrompt);

    try {
      // Generate the response
      const result = await model.generateContent({
        contents: [
          {
            role: "user",
            parts: [{ text: `${systemPrompt}\n\nUser query: ${prompt}` }],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1000,
        },
      });

      const response = result.response.text();
      console.log("Received response from Gemini");

      return new Response(JSON.stringify({ result: response }), {
        headers: { "Content-Type": "application/json" },
      });
    } catch (generationError) {
      console.error("Error generating content:", generationError);
      throw generationError;
    }
  } catch (error: any) {
    console.error("Error in API route:", error);
    return new Response(
      JSON.stringify({
        error: "An error occurred during your request.",
        details: error.message || "Unknown error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
