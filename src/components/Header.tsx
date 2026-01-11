"use client";

import { Phone } from "lucide-react";
import Link from "next/link";

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 h-20 bg-[#667eea]/90 backdrop-blur-md z-[1000] border-b border-white/10">
      <div className="container mx-auto h-full px-4 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <div className="text-white font-display font-bold text-2xl tracking-tighter">
            UNIVERSIDAD <span className="text-[#FFD700]">LATINO</span>
          </div>
        </Link>
        
        <div className="flex items-center gap-2 text-white bg-white/10 px-4 py-2 rounded-full border border-white/20">
          <Phone className="w-4 h-4 text-[#FFD700]" />
          <span className="font-medium text-sm">999-XXX-XXXX</span>
        </div>
      </div>
    </header>
  );
}
