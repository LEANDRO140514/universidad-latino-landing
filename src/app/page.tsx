"use client";

import { Header } from "@/components/Header";
import { TypebotChat } from "@/components/TypebotChat";
import { Sparkles, Target, Smartphone, Zap, Stethoscope, Apple, Brain, ChefHat, Scale, Monitor, Briefcase, GraduationCap, ArrowRight, CheckCircle2, Clock } from "lucide-react";

const CAREERS = [
  { name: "Enfermería", icon: Stethoscope, sector: "Salud" },
  { name: "Nutrición", icon: Apple, sector: "Salud" },
  { name: "Psicología", icon: Brain, sector: "Salud" },
  { name: "Gastronomía", icon: ChefHat, sector: "Bienestar" },
  { name: "Derecho", icon: Scale, sector: "Legal" },
  { name: "Sistemas", icon: Monitor, sector: "Tecnología" },
  { name: "Administración", icon: Briefcase, sector: "Negocios" },
  { name: "Marketing", icon: Zap, sector: "Negocios" },
];

export default function Home() {
  const scrollToChat = () => {
    document.getElementById('chatbot-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <main className="min-h-screen relative bg-white">
      <Header />

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Hero Background Image with Filter */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=2000&auto=format&fit=crop" 
            alt="Alumnos Universidad Latino" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-[#002D62]/75 backdrop-blur-[1px]" />
        </div>

        <div className="container mx-auto px-4 relative z-10 pt-20">
          <div className="max-w-4xl space-y-8">
            <div className="space-y-4">
              <span className="inline-block bg-[#E6B400] text-[#002D62] px-4 py-1.5 rounded-full font-bold text-sm tracking-wide shadow-lg">
                NUEVA ADMISIÓN 2026
              </span>
              <h1 className="text-white font-display font-bold text-6xl lg:text-8xl leading-[1.05] tracking-tight">
                Tu futuro <br />
                <span className="text-[#E6B400]">COMIENZA AQUÍ</span>
              </h1>
              <p className="text-white/90 font-light text-xl lg:text-3xl leading-relaxed max-w-2xl">
                Descubre tu carrera ideal en modalidad <strong>Presencial, Online o Sabatina</strong> con nuestro Test de Inteligencia Artificial.
              </p>
            </div>

            <div className="flex flex-wrap gap-4 pt-4">
              <button 
                onClick={scrollToChat}
                className="bg-[#E6B400] hover:bg-[#CC9F00] text-[#002D62] font-bold px-10 py-5 rounded-xl shadow-2xl hover:scale-105 transition-all text-xl flex items-center justify-center gap-2"
              >
                Solicitar Beca <ArrowRight className="w-6 h-6" />
              </button>
              <button 
                onClick={scrollToChat}
                className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/20 font-bold px-10 py-5 rounded-xl transition-all text-xl"
              >
                Iniciar Test
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Oferta Educativa Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20 space-y-4">
            <span className="text-[#E6B400] font-bold tracking-widest uppercase text-sm">Excelencia Académica</span>
            <h2 className="text-4xl lg:text-6xl font-bold text-[#002D62]">Nuestra Oferta Educativa</h2>
            <div className="w-24 h-1.5 bg-[#E6B400] mx-auto rounded-full" />
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {CAREERS.map((career, i) => (
              <div 
                key={i} 
                className="group p-8 bg-white rounded-3xl border border-gray-100 hover:border-[#002D62]/20 hover:shadow-2xl hover:shadow-[#002D62]/5 transition-all duration-500"
              >
                <div className="w-16 h-16 bg-[#002D62]/5 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#002D62] transition-colors duration-500">
                  <career.icon className="w-8 h-8 text-[#002D62] group-hover:text-white transition-colors duration-500" />
                </div>
                <p className="text-xs font-bold text-[#E6B400] uppercase tracking-wider mb-2">{career.sector}</p>
                <h3 className="text-2xl font-bold text-[#002D62] mb-4">{career.name}</h3>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center gap-2 text-sm text-gray-500">
                    <CheckCircle2 className="w-4 h-4 text-[#E6B400]" /> Presencial, Online y Sabatina
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-500">
                    <CheckCircle2 className="w-4 h-4 text-[#E6B400]" /> RVOE SEP Federal
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-500">
                    <CheckCircle2 className="w-4 h-4 text-[#E6B400]" /> Titulación Automática
                  </li>
                </ul>
                <button 
                  onClick={scrollToChat}
                  className="text-[#002D62] font-bold text-sm flex items-center gap-2 hover:translate-x-2 transition-transform underline decoration-[#E6B400] underline-offset-4"
                >
                  Conocer más <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Formulario / Registro Section */}
      <section id="chatbot-section" className="py-24 bg-[#F4F4F4]">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto bg-white rounded-[3rem] shadow-2xl overflow-hidden flex flex-col lg:grid lg:grid-cols-[45%_55%] border border-white">
            <div className="p-12 lg:p-20 bg-[#002D62] text-white space-y-8 flex flex-col justify-center">
              <div className="space-y-4">
                <h2 className="text-4xl lg:text-5xl font-bold leading-tight">Registra tus datos y obtén tu <span className="text-[#E6B400]">Dictamen con IA</span></h2>
                <p className="text-white/70 text-lg">Un proceso rápido, gratuito y diseñado para ayudarte a tomar la mejor decisión para tu futuro profesional.</p>
              </div>
              
              <div className="space-y-6">
                {[
                  { icon: GraduationCap, title: "Beca de hasta 50%", desc: "Basado en tu desempeño" },
                  { icon: Target, title: "Perfil de Competencias", desc: "Análisis detallado de talentos" },
                  { icon: Clock, title: "Flexibilidad de Horarios", desc: "Modalidad Sabatina y Online" },
                  { icon: Smartphone, title: "Resultados vía WhatsApp", desc: "Entrega inmediata" }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                      <item.icon className="w-6 h-6 text-[#E6B400]" />
                    </div>
                    <div>
                      <p className="font-bold">{item.title}</p>
                      <p className="text-sm text-white/60">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative min-h-[700px] bg-white">
              <TypebotChat />
            </div>
          </div>
        </div>
      </section>

      {/* Footer minimal */}
      <footer className="py-16 bg-[#002D62] text-white/40 text-center text-sm border-t border-white/5">
        <div className="container mx-auto px-4">
          <img 
            src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/project-uploads/58874ed2-ae97-440c-b760-db483a0ae966/logo-horizontal-grande-2048x205-1769155392357.png?width=500&height=50&resize=contain" 
            alt="Universidad Latino" 
            className="h-10 w-auto mx-auto mb-8 brightness-0 invert opacity-40 grayscale"
          />
          <p>© {new Date().getFullYear()} Universidad Latino. Todos los derechos reservados.</p>
          <div className="flex justify-center gap-6 mt-4">
            <a href="#" className="hover:text-white transition-colors">Aviso de Privacidad</a>
            <a href="#" className="hover:text-white transition-colors">Términos y Condiciones</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
