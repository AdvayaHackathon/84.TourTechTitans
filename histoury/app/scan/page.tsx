import ScanWrapper from "@/components/ScanWrapper";
import StoryNarrator from "@/components/StoryNarrator";

export default function ScanPage() {
  return (
    <div className="min-h-screen bg-amber-50 py-16 px-4">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-amber-900 mb-4">
          Scan a Monument
        </h1>
        <p className="text-amber-800 mb-8">
          Upload or click a photo of a historical landmark to discover its
          story.
        </p>
      </div>
      <ScanWrapper />
      <StoryNarrator />
    </div>
  );
}
