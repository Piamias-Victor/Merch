import Link from "next/link";
import PharmacyButton from "@/components/ui/pharmacy-button";
import { LayoutGrid } from "lucide-react";

export default function Header() {
  return (
    <header className="fixed w-full z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
      <div className="container mx-auto px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-md bg-[#0A5B91] flex items-center justify-center">
            <LayoutGrid size={20} className="text-white" />
          </div>
          <span className="text-xl font-medium text-[#0A5B91] tracking-tight">Pharmacy Planner</span>
        </Link>
        
        <nav className="hidden md:flex space-x-8">
          <Link href="#features" className="text-sm text-gray-500 hover:text-[#0A5B91] transition-colors">
            Fonctionnalités
          </Link>
          <Link href="#how-it-works" className="text-sm text-gray-500 hover:text-[#0A5B91] transition-colors">
            Comment ça marche
          </Link>
          <Link href="#pricing" className="text-sm text-gray-500 hover:text-[#0A5B91] transition-colors">
            Tarifs
          </Link>
          <Link href="#contact" className="text-sm text-gray-500 hover:text-[#0A5B91] transition-colors">
            Contact
          </Link>
        </nav>
        
        <Link href="/editor" className="hidden md:flex">
          <PharmacyButton size="default">
            Essayer gratuitement
          </PharmacyButton>
        </Link>
      </div>
    </header>
  );
}