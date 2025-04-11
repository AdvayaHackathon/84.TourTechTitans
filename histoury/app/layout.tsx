import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footert";
import { AuthProvider } from "@/app/context/AuthContext";
import LanguageSwitcher from "@/components/LanguageSwitcher"; // ✅ added import

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Histoury - Explore the Past",
  description: "Discover and explore historical events and stories",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} min-h-screen flex flex-col bg-amber-50`}
      >
        <AuthProvider>
          {/* Optional: Add styling or positioning container */}
          <div className="absolute top-2 right-40 z-50">
            <LanguageSwitcher />
          </div>
          <Header />
          <main className="flex-grow">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
