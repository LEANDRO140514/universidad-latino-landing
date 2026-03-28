"use client";

import { Header } from "@/components/Header";
import { TypebotChat } from "../components/TypebotChat";
import { Sparkles, Target, Smartphone, Zap, Stethoscope, Apple, Brain, ChefHat, Scale, Monitor, Briefcase, GraduationCap, ArrowRight, CheckCircle2, Clock, X, ExternalLink } from "lucide-react";
import { useState } from "react";

const CAREER_GROUPS = [
  { 
    sector: "Tecnología", 
    icon: Monitor, 
    careers: [
      { name: "Ingeniería en Sistemas", modality: "Presencial Cuatrimestral" }
    ] 
  },
  { 
    sector: "Legal", 
    icon: Scale, 
    careers: [
      { name: "Derecho", modality: "Presencial Cuatrimestral / Online" }
    ] 
  },
  { 
    sector: "Bienestar", 
    icon: ChefHat, 
    careers: [
      { name: "Gastronomía", modality: "Presencial Semestral" }
    ] 
  },
  { 
    sector: "Salud", 
    icon: Stethoscope, 
    careers: [
      { name: "Enfermería", modality: "Presencial Semestral" },
      { name: "Nutrición", modality: "Presencial Semestral" },
      { name: "Psicología", modality: "Presencial Semestral" }
    ] 
  },
  { 
    sector: "Negocios", 
    icon: Briefcase, 
    careers: [
      { name: "Ventas y Mercadotecnia", modality: "Presencial Cuatrimestral / Online" },
      { name: "Negocios Internacionales", modality: "Presencial Cuatrimestral" },
      { name: "Administración", modality: "Sabatina" },
      { name: "Administración y Desarrollo Empresarial", modality: "Online" }
    ] 
  },
];

const LICENCIATURAS_URL = "https://www.universidadlatino.edu.mx/licenciaturas/";

export default function Home() {
  const [showIframe, setShowIframe] = useState(false);

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
                Descubre tu carrera ideal en modalidad <strong>Presencial, Online o Sabatina</strong> con nuestro Test <strong>Vocacional</strong> de Inteligencia Artificial.
              </p>
            </div>

            <div className="flex flex-wrap gap-4 pt-4">
              <a
                href="https://wa.me/529991525583?text=Hola%2C%20me%20interesa%20solicitar%20una%20beca%20en%20Universidad%20Latino.%20%C2%BFMe%20pueden%20dar%20informaci%C3%B3n%3F"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#E6B400] hover:bg-[#CC9F00] text-[#002D62] font-bold px-10 py-5 rounded-xl shadow-2xl hover:scale-105 transition-all text-xl flex items-center justify-center gap-2"
              >
                Solicitar Beca <ArrowRight className="w-6 h-6" />
              </a>
              <button 
                onClick={scrollToChat}
                className="bg-[#E6B400] hover:bg-[#CC9F00] text-[#002D62] font-bold px-10 py-5 rounded-xl shadow-2xl hover:scale-105 transition-all text-xl"
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

          <div className="flex flex-wrap justify-center gap-8">
            {CAREER_GROUPS.map((group, i) => (
              <div 
                key={i} 
                className="w-full md:w-[calc(50%-1rem)] lg:w-[calc(33.333%-2rem)] group p-8 bg-white rounded-3xl border border-gray-100 hover:border-[#002D62]/20 hover:shadow-2xl hover:shadow-[#002D62]/5 transition-all duration-500"
              >
                <div className="w-16 h-16 bg-[#002D62]/5 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#002D62] transition-colors duration-500">
                  <group.icon className="w-8 h-8 text-[#002D62] group-hover:text-white transition-colors duration-500" />
                </div>
                <p className="text-xs font-bold text-[#E6B400] uppercase tracking-wider mb-2">{group.sector}</p>
                <h3 className="text-2xl font-bold text-[#002D62] mb-6">Licenciaturas en {group.sector}</h3>
                
                <div className="space-y-6">
                  {group.careers.map((career, j) => (
                    <div key={j} className="space-y-2 border-l-2 border-[#E6B400]/20 pl-4 py-1">
                      <h4 className="text-lg font-bold text-[#002D62] leading-tight">{career.name}</h4>
                      <div className="flex flex-wrap gap-2">
                        <span className="text-[10px] bg-[#002D62]/5 text-[#002D62] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                          {career.modality}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <ul className="mt-8 space-y-2 mb-8 pt-6 border-t border-gray-50">
                  <li className="flex items-center gap-2 text-sm text-gray-500">
                    <CheckCircle2 className="w-4 h-4 text-[#E6B400]" /> RVOE SEP Federal
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-500">
                    <CheckCircle2 className="w-4 h-4 text-[#E6B400]" /> Titulación Automática
                  </li>
                </ul>

                <button
                  onClick={() => setShowIframe(true)}
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
      <section id="chatbot-section" className="py-12 bg-[#F4F4F4] min-h-[calc(100vh-80px)] flex flex-col">
        <div className="container mx-auto px-4 flex-1 flex flex-col">
          <div className="flex-1 max-w-6xl mx-auto w-full bg-white rounded-[2rem] md:rounded-[3rem] shadow-2xl overflow-hidden flex flex-col lg:grid lg:grid-cols-[40%_60%] border border-white">
            <div className="p-8 lg:p-16 bg-[#002D62] text-white space-y-6 flex flex-col justify-center">
              <div className="space-y-3">
                <h2 className="text-3xl lg:text-5xl font-bold leading-tight">Registra tus datos y obtén tu <span className="text-[#E6B400]">Dictamen con IA</span></h2>
                <p className="text-white/70 text-base lg:text-lg">Un proceso rápido, gratuito y diseñado para ayudarte a tomar la mejor decisión para tu futuro profesional.</p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 lg:gap-6">
                {[
                  { icon: GraduationCap, title: "Beca de hasta 50%", desc: "Basado en tu desempeño" },
                  { icon: Target, title: "Perfil de Competencias", desc: "Análisis detallado de talentos" },
                  { icon: Clock, title: "Flexibilidad de Horarios", desc: "Modalidad Sabatina y Online" },
                  { icon: Smartphone, title: "Resultados vía WhatsApp", desc: "Entrega inmediata" }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center shrink-0">
                      <item.icon className="w-5 h-5 text-[#E6B400]" />
                    </div>
                    <div>
                      <p className="font-bold text-sm lg:text-base">{item.title}</p>
                      <p className="text-xs text-white/60">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative flex-1 min-h-[500px] lg:min-h-[600px] bg-white">
              <TypebotChat />
            </div>
          </div>
        </div>
      </section>

      {/* Modal iframe: Licenciaturas */}
      {showIframe && (
        <div className="fixed inset-0 z-[9999] flex flex-col bg-white">
          {/* Top bar */}
          <div className="flex items-center gap-3 px-4 py-3 bg-[#002D62] shadow-md flex-shrink-0">
            <button
              onClick={() => setShowIframe(false)}
              className="flex items-center gap-2 text-white font-bold text-sm px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
            >
              <ArrowRight className="w-4 h-4 rotate-180" />
              Volver a la landing
            </button>
            <span className="text-white/60 text-xs flex-1 truncate hidden sm:block">{LICENCIATURAS_URL}</span>
            <a
              href={LICENCIATURAS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-white/80 hover:text-white text-xs px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Abrir en nueva pestaña
            </a>
            <button
              onClick={() => setShowIframe(false)}
              className="text-white/60 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
              aria-label="Cerrar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          {/* iframe */}
          <iframe
            src={LICENCIATURAS_URL}
            className="flex-1 w-full border-none"
            title="Licenciaturas Universidad Latino"
          />
        </div>
      )}
    </main>
  );
}
