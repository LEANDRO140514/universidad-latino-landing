import { Header } from "@/components/Header";
import { TypebotChat } from "@/components/TypebotChat";
import { Sparkles, Target, Smartphone, Zap } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen relative overflow-hidden bg-[#002D62]">
      {/* Hero Background Image with Filter */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=2000&auto=format&fit=crop" 
          alt="Alumnos Universidad Latino" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-[#002D62]/70 backdrop-blur-[2px]" />
      </div>

      <Header />

      <div className="container mx-auto px-4 pt-24 md:pt-32 pb-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          <div className="hero-text-section space-y-8 max-w-xl">
            <div className="space-y-4">
              <h1 className="text-white font-display font-bold text-5xl lg:text-7xl leading-[1.1] tracking-tight">
                Tu futuro <br />
                <span className="text-[#E6B400]">COMIENZA AQUÍ</span>
              </h1>
              <p className="text-white/90 font-light text-xl lg:text-2xl leading-relaxed">
                Descubre tu carrera ideal en solo 5 minutos con inteligencia artificial.
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
                  <div className="bg-[#E6B400] p-1.5 rounded-lg shadow-lg group-hover:scale-110 transition-transform">
                    <item.icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-white text-lg font-medium">{item.text}</span>
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
          </div>

          <div className="chatbot-container relative h-[650px] lg:h-[750px] w-full max-w-[550px] mx-auto lg:ml-auto">
            <TypebotChat />
          </div>

        </div>
      </div>
    </main>
  );
}
