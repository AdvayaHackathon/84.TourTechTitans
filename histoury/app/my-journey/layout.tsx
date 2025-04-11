import JourneySidebar from "@/components/JourneySidebar";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function MyJourneyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-amber-50 p-4 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6">
        <JourneySidebar />
        <main className="flex-1">{children}</main>
      </div>
    </ProtectedRoute>
  );
}
