"use client";

import { RotateCcw } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export function Header() {
    const handleResetTest = () => {
      window.location.href = "/?reset=" + Date.now();
    };

  return (
    <header className="fixed top-0 left-0 right-0 h-20 bg-[#002D62]/95 backdrop-blur-md z-[1000] border-b border-white/10">
      <div className="container mx-auto h-full px-4 flex items-center justify-between">
        <Link href="/" className="flex items-center">
            <Image
              src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/project-uploads/58874ed2-ae97-440c-b760-db483a0ae966/logo-horizontal-grande-2048x205-1769155392357.png?width=500&height=50&resize=contain"
              alt="Universidad Latino"
              width={300}
              height={60}
              className="h-10 md:h-12 w-auto object-contain filter brightness-0 invert"
              priority
            />
        </Link>
        
        <button
          onClick={handleResetTest}
          className="flex items-center gap-2 bg-[#E6B400] hover:bg-[#CC9F00] text-white px-4 py-2 rounded-full font-bold text-sm transition-all shadow-lg hover:scale-105 active:scale-95"
        >
          <RotateCcw className="w-4 h-4" />
          <span className="hidden md:inline">Reiniciar Test</span>
        </button>
      </div>
    </header>
  );
}
