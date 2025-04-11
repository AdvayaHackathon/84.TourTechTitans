import JourneySidebar from "@/components/JourneySidebar";
import UserProfile from "@/components/UserProfile";

export default function MyJourneyPage() {
  return (
    <div className="min-h-screen bg-amber-50 p-4 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6">
      <JourneySidebar />
      <UserProfile />
    </div>
  );
}
