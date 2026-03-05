import type { Metadata } from "next";
import AuthProvider from "@/components/AuthProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Coach — Leadership Coaching for Middle Managers",
  description:
    "In-the-moment, AI-powered coaching for middle managers. Prepare for 1:1s, rehearse hard conversations, and build leadership skills.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
