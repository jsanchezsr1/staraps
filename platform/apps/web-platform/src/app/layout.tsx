import React from "react";
import "./globals.css";

export const metadata = {
  title: "Platform",
  description: "AI app builder control plane"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
