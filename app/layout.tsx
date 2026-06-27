import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Time Across Canada — Live Canadian Time Zone Clock",
  description: "A beautifully simple live clock for every Canadian time zone.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
