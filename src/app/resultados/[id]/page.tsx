"use client";

import { Header } from "@/components/Header";
import { motion } from "framer-motion";
import { CheckCircle2, Download, Calendar, ArrowRight, Share2, Smartphone, GraduationCap, Clock, MapPin, Sparkles, MessageCircle, Phone } from "lucide-react";
import { useEffect, useState, use } from "react";
import { supabase } from "@/lib/supabase";

type TopProgram = {
  program_id: string;
  program_name: string;
  sector: string;
  mode: string;
  period: string;
  duration: string;
  match_percent: number;
};

const SECTOR_NAMES: Record<string, string> = {
  SALUD: "Salud y Bienestar",
  NEGOCIOS: "Negocios y Gestión",
  TECNOLOGIA: "Tecnología e Innovación",
  DERECHO: "Derecho y Ciencias Jurídicas"
};

const SECTOR_ICONS: Record<string, string> = {
  SALUD: "🏥",
  NEGOCIOS: "📊",
  TECNOLOGIA: "💻",
  DERECHO: "⚖️"
};

const PROGRAM_IMAGES: Record<string, string> = {
  P_NUTRICION: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=1000&auto=format&fit=crop",
  P_ENFERMERIA: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=1000&auto=format&fit=crop",
  P_PSICOLOGIA: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=1000&auto=format&fit=crop",
  P_GASTRONOMIA: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=1000&auto=format&fit=crop",
  P_VENTAS_MKT: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1000&auto=format&fit=crop",
  P_NEGOCIOS_INT: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1000&auto=format&fit=crop",
  P_DERECHO: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=1000&auto=format&fit=crop",
  P_SISTEMAS: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1000&auto=format&fit=crop",
  P_ADMIN_SAB: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1000&auto=format&fit=crop",
  P_ADMIN_DEV_EMP: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1000&auto=format&fit=crop"
};

const PROGRAM_DETAILS: Record<string, { reasons: string[]; studyPlan: string[]; field: string[]; cost: number; inscription: number }> = {
  P_NUTRICION: {
    reasons: ["Interés en salud y bienestar", "Perfil analítico-práctico", "Vocación de servicio"],
    studyPlan: ["Nutrición Clínica", "Dietoterapia", "Nutrición Deportiva", "Evaluación Nutricional"],
    field: ["Hospitales", "Consulta privada", "Equipos deportivos", "Industria alimentaria"],
    cost: 5250,
    inscription: 8000
  },
  P_ENFERMERIA: {
    reasons: ["Sensibilidad interpersonal alta", "Orientación práctica", "Interés en cuidado de la salud"],
    studyPlan: ["Enfermería Básica", "Farmacología", "Cuidados Intensivos", "Salud Comunitaria"],
    field: ["Hospitales", "Clínicas", "Atención domiciliaria", "Sector público"],
    cost: 5250,
    inscription: 8000
  },
  P_PSICOLOGIA: {
    reasons: ["Alta empatía", "Interés en acompañamiento emocional", "Capacidad de escucha activa"],
    studyPlan: ["Psicología Clínica", "Psicología Organizacional", "Desarrollo Humano", "Terapias"],
    field: ["Consulta privada", "Empresas", "Escuelas", "Instituciones de salud"],
    cost: 5250,
    inscription: 8000
  },
  P_GASTRONOMIA: {
    reasons: ["Creatividad práctica", "Interés en bienestar", "Orientación al detalle"],
    studyPlan: ["Cocina Internacional", "Repostería", "Administración de Restaurantes", "Nutrición"],
    field: ["Restaurantes", "Hoteles", "Emprendimiento propio", "Industria alimentaria"],
    cost: 5800,
    inscription: 8000
  },
  P_VENTAS_MKT: {
    reasons: ["Perfil de negocios", "Capacidad analítica", "Habilidades de comunicación"],
    studyPlan: ["Marketing Digital", "Comportamiento del Consumidor", "Ventas Estratégicas", "E-commerce"],
    field: ["Empresas", "Agencias de publicidad", "Emprendimiento", "Consultoría"],
    cost: 4900,
    inscription: 7500
  },
  P_NEGOCIOS_INT: {
    reasons: ["Visión global", "Capacidad analítica alta", "Interés en comercio"],
    studyPlan: ["Comercio Internacional", "Logística", "Finanzas Internacionales", "Negociación"],
    field: ["Empresas multinacionales", "Aduanas", "Comercio exterior", "Consultoría"],
    cost: 4900,
    inscription: 7500
  },
  P_DERECHO: {
    reasons: ["Pensamiento analítico", "Interés en justicia", "Capacidad argumentativa"],
    studyPlan: ["Derecho Civil", "Derecho Penal", "Derecho Laboral", "Derecho Mercantil"],
    field: ["Despachos jurídicos", "Sector público", "Empresas", "Tribunales"],
    cost: 4900,
    inscription: 7500
  },
  P_SISTEMAS: {
    reasons: ["Alto interés tecnológico", "Capacidad analítica superior", "Resolución de problemas"],
    studyPlan: ["Programación", "Bases de Datos", "Redes", "Inteligencia Artificial"],
    field: ["Empresas de tecnología", "Startups", "Freelance", "Consultoría IT"],
    cost: 5500,
    inscription: 8000
  },
  P_ADMIN_SAB: {
    reasons: ["Perfil de negocios", "Disponibilidad fin de semana", "Responsabilidades laborales"],
    studyPlan: ["Administración General", "Finanzas", "Recursos Humanos", "Planeación Estratégica"],
    field: ["Empresas", "Emprendimiento", "Sector público", "Consultoría"],
    cost: 4500,
    inscription: 7000
  },
  P_ADMIN_DEV_EMP: {
    reasons: ["Autonomía alta", "Preferencia por estudio remoto", "Perfil emprendedor"],
    studyPlan: ["Desarrollo Empresarial", "Innovación", "Gestión de Proyectos", "Liderazgo"],
    field: ["Emprendimiento", "Startups", "Consultoría", "Empresas en crecimiento"],
    cost: 4200,
    inscription: 6500
  }
};

export default function ResultsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [lead, setLead] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLead() {
      const { data } = await supabase
        .from('leads')
        .select('*')
        .eq('id', id)
        .single();
      
      if (data) {
        setLead(data);
      }
      setLoading(false);
    }
    fetchLead();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f6f9fc] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#667eea]"></div>
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="min-h-screen bg-[#f6f9fc] flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Perfil no encontrado</h1>
        <a href="/" className="text-[#667eea] hover:underline">Volver al inicio</a>
      </div>
    );
  }

  const topPrograms: TopProgram[] = lead.top_programs || [];
  const sectorPrimary = lead.sector_primary || "NEGOCIOS";
  const sectorSecondary = lead.sector_secondary;
  const leadScore = lead.score || 75;
  const leadClass = lead.lead_class || "WARM";
  const ctaPrimary = lead.cta_primary || "Ver plan de estudios";

  return (
    <main className="min-h-screen bg-[#f6f9fc] pb-20">
      <Header />
      
      <section className="pt-32 pb-16 bg-gradient-hero relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-white">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <span className="bg-white/10 px-4 py-1.5 rounded-full text-sm font-semibold tracking-wider border border-white/10">
                TU PERFIL VOCACIONAL
              </span>
              <h1 className="text-4xl lg:text-6xl font-display font-bold">{lead.nombre}</h1>
              
              <div className="flex flex-wrap items-center gap-6 pt-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-[#FFD700] rounded-xl flex items-center justify-center text-2xl">
                    {SECTOR_ICONS[sectorPrimary] || "📊"}
                  </div>
                  <div>
                    <p className="text-white/60 text-xs font-medium uppercase">Sector Principal</p>
                    <p className="font-bold text-lg">{SECTOR_NAMES[sectorPrimary] || sectorPrimary}</p>
                  </div>
                </div>

                {sectorSecondary && (
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-2xl">
                      {SECTOR_ICONS[sectorSecondary] || "📚"}
                    </div>
                    <div>
                      <p className="text-white/60 text-xs font-medium uppercase">Sector Complementario</p>
                      <p className="font-bold text-lg">{SECTOR_NAMES[sectorSecondary] || sectorSecondary}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold ${
                    leadClass === "HOT" ? "bg-red-500" : leadClass === "WARM" ? "bg-orange-500" : "bg-blue-500"
                  }`}>
                    {leadScore}
                  </div>
                  <div>
                    <p className="text-white/60 text-xs font-medium uppercase">Lead Score</p>
                    <p className="font-bold text-lg">{leadClass === "HOT" ? "Alta Prioridad" : leadClass === "WARM" ? "Interesado" : "Explorando"}</p>
                  </div>
                </div>

                <div className="flex-1 min-w-[200px]">
                  <p className="text-white/60 text-xs font-medium uppercase mb-2">Compatibilidad: {leadScore}/100</p>
                  <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(leadScore, 100)}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className="h-full bg-[#FFD700]"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 -mt-12 relative z-20">
        <div className="max-w-5xl mx-auto space-y-12">
          
          {topPrograms.map((program, i) => {
            const details = PROGRAM_DETAILS[program.program_id] || PROGRAM_DETAILS.P_VENTAS_MKT;
            const image = PROGRAM_IMAGES[program.program_id] || PROGRAM_IMAGES.P_VENTAS_MKT;
            const isFromSecondary = sectorSecondary && program.sector === sectorSecondary;
            
            return (
              <motion.div 
                key={program.program_id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                className={`bg-white rounded-[2rem] shadow-2xl overflow-hidden border ${
                  i === 0 ? "border-[#FFD700] ring-2 ring-[#FFD700]/20" : "border-gray-100"
                }`}
              >
                {i === 0 && (
                  <div className="bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-[#2d1b69] px-6 py-2 text-center font-bold text-sm">
                    ⭐ MEJOR MATCH PARA TI
                  </div>
                )}
                {isFromSecondary && i > 0 && (
                  <div className="bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white px-6 py-2 text-center font-bold text-sm">
                    🔄 OPCIÓN DEL SECTOR COMPLEMENTARIO
                  </div>
                )}
                <div className="grid lg:grid-cols-[40%_60%]">
                  <div className="relative h-64 lg:h-auto">
                    <img src={image} alt={program.program_name} className="absolute inset-0 w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent lg:hidden" />
                  </div>
                  
                  <div className="p-8 lg:p-12 space-y-8">
                    <div className="flex justify-between items-start">
                      <div>
                        <h2 className="text-2xl lg:text-3xl font-display font-bold text-gray-900 leading-tight">
                          {SECTOR_ICONS[program.sector] || "📚"} {program.program_name}
                        </h2>
                        <div className="flex flex-wrap items-center gap-3 mt-3">
                          <span className="bg-[#667eea]/10 text-[#667eea] px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                            <MapPin className="w-3 h-3" /> {program.mode}
                          </span>
                          <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {program.period}
                          </span>
                          <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                            <GraduationCap className="w-3 h-3" /> {program.duration}
                          </span>
                        </div>
                      </div>
                      <div className="w-16 h-16 relative">
                        <svg className="w-full h-full" viewBox="0 0 36 36">
                          <path className="text-gray-100" stroke="currentColor" strokeDasharray="100, 100" strokeWidth="3" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                          <motion.path 
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: program.match_percent / 100 }}
                            transition={{ duration: 1.5, delay: 0.8 }}
                            className="text-[#667eea]" 
                            stroke="currentColor"
                            strokeDasharray={`${program.match_percent}, 100`} 
                            strokeWidth="3" 
                            strokeLinecap="round" 
                            fill="none" 
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-sm font-bold text-[#667eea]">{program.match_percent}%</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-500" /> Por qué es ideal para ti:
                        </h4>
                        <ul className="space-y-2">
                          {details.reasons.map((r, j) => (
                            <li key={j} className="text-gray-600 text-sm flex items-center gap-2">
                              <span className="w-1 h-1 bg-gray-300 rounded-full" /> {r}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="space-y-4">
                        <h4 className="font-semibold text-gray-900">📚 Plan de Estudios:</h4>
                        <ul className="space-y-2">
                          {details.studyPlan.map((p, j) => (
                            <li key={j} className="text-gray-600 text-sm">• {p}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="pt-8 border-t border-gray-100 space-y-4">
                      <h4 className="font-bold text-gray-900 uppercase text-xs tracking-wider">💰 Inversión</h4>
                      <div className="flex flex-wrap gap-6">
                        <div>
                          <p className="text-gray-500 text-xs">Colegiatura</p>
                          <p className="text-xl font-bold text-gray-900">${details.cost.toLocaleString()}/mes</p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs">Inscripción</p>
                          <p className="text-xl font-bold text-gray-900">${details.inscription.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs">Duración</p>
                          <p className="text-xl font-bold text-gray-900">{program.duration}</p>
                        </div>
                      </div>
                    </div>

                    {i === 0 && (
                      <div className="flex flex-wrap gap-4">
                        <button className="flex-1 min-w-[200px] bg-gradient-primary text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-[#667eea]/40 transition-all flex items-center justify-center gap-2">
                          <Calendar className="w-5 h-5" /> {ctaPrimary}
                        </button>
                        <button className="px-6 py-4 border-2 border-gray-100 text-gray-600 font-bold rounded-xl hover:bg-gray-50 transition-all flex items-center gap-2">
                          <Download className="w-5 h-5" /> PDF
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-gold p-8 lg:p-12 rounded-[2.5rem] shadow-glow text-[#2d1b69] relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 rounded-full translate-x-1/3 -translate-y-1/3 blur-2xl" />
            <div className="relative z-10 space-y-6">
              <div className="space-y-2">
                <h2 className="text-3xl lg:text-4xl font-display font-bold leading-tight">
                  🎁 BECA ESPECIAL PARA TI
                </h2>
                <p className="text-lg opacity-90">
                  {lead.nombre}, con tu desempeño académico calificas para:
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white/20 backdrop-blur-md p-6 rounded-2xl border border-white/20">
                  <p className="text-xs font-bold uppercase tracking-wider mb-1">Beca Elegible</p>
                  <p className="text-xl font-bold">{lead.beca_elegible}</p>
                </div>
                <div className="bg-white/20 backdrop-blur-md p-6 rounded-2xl border border-white/20">
                  <p className="text-xs font-bold uppercase tracking-wider mb-1">Ahorro Mensual</p>
                  <p className="text-3xl font-bold">$1,575+</p>
                </div>
                <div className="bg-white/20 backdrop-blur-md p-6 rounded-2xl border border-white/20">
                  <p className="text-xs font-bold uppercase tracking-wider mb-1">Ahorro Total</p>
                  <p className="text-3xl font-bold">$100k+</p>
                </div>
              </div>

              <button className="w-full lg:w-auto bg-white text-[#FFA500] font-bold px-12 py-5 rounded-2xl shadow-xl hover:scale-105 transition-transform text-lg flex items-center justify-center gap-2">
                Calcular Mi Beca Ahora <ArrowRight className="w-6 h-6" />
              </button>
            </div>
          </motion.div>

          <section className="bg-white p-8 lg:p-12 rounded-[2rem] shadow-xl space-y-8">
            <h2 className="text-2xl font-display font-bold text-gray-900 flex items-center gap-3">
              <Sparkles className="text-[#667eea]" /> DICTAMEN VOCACIONAL
            </h2>
            <div className="prose prose-lg text-gray-600 max-w-none leading-relaxed">
              <p>{lead.dictamen_text}</p>
            </div>
            
            {lead.dimensions && (
              <div className="pt-6 border-t border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-4">Tus Fortalezas:</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(lead.dimensions as Record<string, number>)
                    .filter(([key]) => key.startsWith('A_') || key.startsWith('M_'))
                    .sort(([,a], [,b]) => b - a)
                    .slice(0, 4)
                    .map(([key, value]) => {
                      const labels: Record<string, string> = {
                        A_ANALITICO: "Analítico",
                        A_EMPATICO: "Empático",
                        A_PRACTICO: "Práctico",
                        A_AUTOGESTION: "Autogestión",
                        M_CLARIDAD_META: "Claridad",
                        M_COMPROMISO: "Compromiso"
                      };
                      return (
                        <div key={key} className="bg-gray-50 p-4 rounded-xl">
                          <p className="text-sm text-gray-500">{labels[key] || key}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-[#667eea]" 
                                style={{ width: `${(value / 5) * 100}%` }}
                              />
                            </div>
                            <span className="text-sm font-bold text-gray-700">{value}/5</span>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}
          </section>

          <section className="bg-[#2d1b69] text-white p-8 lg:p-12 rounded-[2rem] shadow-2xl space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-display font-bold">¿Todo listo para el siguiente paso?</h2>
              <p className="text-white/70">Elige cómo quieres continuar:</p>
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              <button className="bg-[#25D366] hover:bg-[#128C7E] text-white p-6 rounded-2xl transition-colors flex flex-col items-center gap-3">
                <MessageCircle className="w-8 h-8" />
                <span className="font-bold">WhatsApp</span>
                <span className="text-sm opacity-80">Respuesta inmediata</span>
              </button>
              <button className="bg-[#FFD700] hover:bg-[#FFA500] text-[#2d1b69] p-6 rounded-2xl transition-colors flex flex-col items-center gap-3">
                <Calendar className="w-8 h-8" />
                <span className="font-bold">Agendar Cita</span>
                <span className="text-sm opacity-80">Visita al campus</span>
              </button>
              <button className="bg-white/10 hover:bg-white/20 text-white p-6 rounded-2xl transition-colors flex flex-col items-center gap-3 border border-white/20">
                <Phone className="w-8 h-8" />
                <span className="font-bold">Llamar Ahora</span>
                <span className="text-sm opacity-80">Habla con un asesor</span>
              </button>
            </div>
          </section>

          <div className="flex flex-col items-center gap-4 py-8">
            <p className="text-gray-400 text-sm font-medium">Comparte tus resultados:</p>
            <div className="flex gap-4">
              {[Share2, Smartphone, Download].map((Icon, i) => (
                <button key={i} className="w-12 h-12 bg-white rounded-full shadow-md flex items-center justify-center text-gray-400 hover:text-[#667eea] transition-colors">
                  <Icon className="w-5 h-5" />
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
