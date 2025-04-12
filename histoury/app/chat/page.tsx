import GuideChatClient from "@/components/GuideChatClient";

export default function GuideChatPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-orange-100 p-6 flex flex-col items-center">
      <h1 className="text-3xl font-bold text-orange-700 mb-4">
        Your Personal Tour Guide 🧭
      </h1>
      <GuideChatClient />
    </div>
  );
}
