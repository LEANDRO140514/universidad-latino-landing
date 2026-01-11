import { Header } from "@/components/Header";
import { TypebotChat } from "@/components/TypebotChat";
import { Sparkles, Target, Smartphone, Zap } from "lucide-react";
import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen relative overflow-hidden bg-gradient-hero">
      {/* Animated Blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#667eea] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#FFD700] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
      <div className="absolute -bottom-8 left-20 w-96 h-96 bg-[#2d1b69] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />

      <Header />

      <div className="container mx-auto px-4 pt-32 pb-20 relative z-10">
        <div className="grid lg:grid-cols-[40%_60%] gap-12 items-center">
          
          {/* Left Column: Copy */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-white font-display font-bold text-5xl lg:text-6xl leading-[1.1] tracking-tight">
                Descubre tu <br />
                <span className="text-gradient-gold">CARRERA IDEAL</span>
              </h1>
              <p className="text-white/90 font-light text-xl lg:text-2xl leading-relaxed">
                En solo 5 minutos, con inteligencia artificial
              </p>
            </div>

            <div className="space-y-4 pt-4">
              {[
                { icon: Sparkles, text: "Análisis con IA de última generación" },
                { icon: Target, text: "Matching personalizado con tus talentos" },
                { icon: Smartphone, text: "Resultados inmediatos en tu WhatsApp" },
                { icon: Zap, text: "100% Gratis, sin compromiso" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 group">
                  <div className="bg-[#FFD700] p-1.5 rounded-lg shadow-lg group-hover:scale-110 transition-transform">
                    <item.icon className="w-5 h-5 text-[#2d1b69]" />
                  </div>
                  <span className="text-white/95 text-lg font-medium">{item.text}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-4 pt-8 border-t border-white/20">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-gradient-primary flex items-center justify-center text-[10px] text-white font-bold shadow-lg overflow-hidden">
                    <img 
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 123}`} 
                      alt="avatar"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
              <p className="text-white text-sm font-medium">
                +500 estudiantes ya encontraron su camino
              </p>
            </div>

            <div className="pt-6">
              <p className="text-white/60 text-xs font-medium uppercase tracking-wider mb-3">Certificado por:</p>
              <div className="flex gap-3">
                <div className="bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-md border border-white/10 text-white text-[11px] font-semibold">
                  RVOE SEP
                </div>
                <div className="bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-md border border-white/10 text-white text-[11px] font-semibold">
                  ISO 9001
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Chat */}
          <div className="relative h-[650px] lg:h-[750px]">
            <div className="absolute -top-4 -right-4 z-20 animate-pulse">
              <div className="bg-gradient-gold px-4 py-2 rounded-full shadow-xl text-[#2d1b69] font-bold text-sm border-2 border-white/50">
                ✨ 100% Gratis
              </div>
            </div>
            <TypebotChat />
          </div>

        </div>
      </div>
    </main>
  );
}
