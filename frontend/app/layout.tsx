import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ModelForge – AutoML & MLOps Platform",
  description: "Experiment tracking and model deployment dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-surface-900 text-slate-100">
        {children}
      </body>
    </html>
  );
}
