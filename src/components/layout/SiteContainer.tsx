import React from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

interface SiteContainerProps {
  children: React.ReactNode;
}

export default function SiteContainer({ children }: SiteContainerProps) {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-1 pt-16">
        {children}
      </main>
      <Footer />
    </div>
  );
}