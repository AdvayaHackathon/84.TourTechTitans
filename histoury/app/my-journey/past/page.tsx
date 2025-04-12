import PastJourneys from "@/components/PastJourneys";
import 'leaflet/dist/leaflet.css';
export default function PastPage() {
  return (
    <div className="min-h-screen bg-amber-50">
      <div className="max-w-6xl mx-auto pt-8 px-4">
        <PastJourneys />
      </div>
    </div>
  );
}
