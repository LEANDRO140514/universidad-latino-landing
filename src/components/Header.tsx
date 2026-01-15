"use client";

import { RotateCcw } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export function Header() {
    const handleResetTest = () => {
      window.location.href = "/";
    };

  return (
    <header className="fixed top-0 left-0 right-0 h-20 bg-[#1E3A8A]/95 backdrop-blur-md z-[1000] border-b border-white/10">
      <div className="container mx-auto h-full px-4 flex items-center justify-between">
        <Link href="/" className="flex items-center">
            <Image
              src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/project-uploads/58874ed2-ae97-440c-b760-db483a0ae966/logo-ul-main-header-1768158382220.png?width=8000&height=8000&resize=contain"
              alt="Universidad Latino"
              width={200}
              height={80}
              className="h-16 w-auto object-contain"
            />
        </Link>
        
        <button
          onClick={handleResetTest}
          className="flex items-center gap-2 bg-[#F59E0B] hover:bg-[#D97706] text-[#111827] px-4 py-2 rounded-full font-bold text-sm transition-all shadow-lg hover:scale-105 active:scale-95"
        >
          <RotateCcw className="w-4 h-4" />
          <span className="hidden md:inline">Reiniciar Test</span>
        </button>
      </div>
    </header>
  );
}
