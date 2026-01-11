"use client";

import { Header } from "@/components/Header";
import { motion } from "framer-motion";
import { CheckCircle2, TrendingUp, Download, Calendar, ArrowRight, Share2, Sparkles, Smartphone } from "lucide-react";
import { useEffect, useState, use } from "react";
import { supabase } from "@/lib/supabase";

export default function ResultsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [lead, setLead] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLead() {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .eq('id', id)
        .single();
      
      if (data) setLead(data);
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

  const careers = [
    {
      name: "LIC. EN NUTRICIÓN",
      match: 94,
      image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=1000&auto=format&fit=crop",
      reasons: ["Tu interés en nutrición", "Materias Bio/Química", "Deseo de ayudar"],
      studyPlan: ["Nutrición Clínica", "Dietoterapia", "Nutrición Deportiva"],
      field: ["Hospitales", "Consulta privada", "Equipos deportivos"],
      cost: 5250,
      inscription: 8000
    }
  ];

  return (
    <main className="min-h-screen bg-[#f6f9fc] pb-20">
      <Header />
      
      {/* Hero Profile Section */}
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
                  <div className="w-12 h-12 bg-[#FFD700] rounded-xl flex items-center justify-center">
                    <TrendingUp className="text-[#2d1b69] w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-white/60 text-xs font-medium uppercase">Sector Principal</p>
                    <p className="font-bold text-lg">{lead.superpower?.includes('personas') ? 'SALUD' : 'NEGOCIOS'}</p>
                  </div>
                </div>

                <div className="flex-1 min-w-[200px]">
                  <p className="text-white/60 text-xs font-medium uppercase mb-2">Lead Score: {lead.score}/100</p>
                  <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${lead.score}%` }}
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
          
          {/* Career Cards */}
          {careers.map((career, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-gray-100"
            >
              <div className="grid lg:grid-cols-[40%_60%]">
                <div className="relative h-64 lg:h-auto">
                  <img src={career.image} alt={career.name} className="absolute inset-0 w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent lg:hidden" />
                </div>
                
                <div className="p-8 lg:p-12 space-y-8">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-3xl font-display font-bold text-gray-900 leading-tight">🥗 {career.name}</h2>
                      <div className="flex items-center gap-2 mt-2 text-[#667eea] font-bold">
                        <span>Tu Match: {career.match}% 🔥</span>
                      </div>
                    </div>
                    <div className="w-16 h-16 relative">
                      <svg className="w-full h-full" viewBox="0 0 36 36">
                        <path className="text-gray-100" strokeDasharray="100, 100" strokeWidth="3" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                        <motion.path 
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: career.match / 100 }}
                          transition={{ duration: 1.5, delay: 0.8 }}
                          className="text-[#667eea]" 
                          strokeDasharray={`${career.match}, 100`} 
                          strokeWidth="3" 
                          strokeLinecap="round" 
                          fill="none" 
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
                        />
                      </svg>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-500" /> Por qué es perfecta:
                      </h4>
                      <ul className="space-y-2">
                        {career.reasons.map((r, i) => (
                          <li key={i} className="text-gray-600 text-sm flex items-center gap-2">
                            <span className="w-1 h-1 bg-gray-300 rounded-full" /> {r}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="space-y-4">
                      <h4 className="font-semibold text-gray-900">📚 Plan de Estudios:</h4>
                      <ul className="space-y-2">
                        {career.studyPlan.map((p, i) => (
                          <li key={i} className="text-gray-600 text-sm">• {p}</li>
                        ))}
                      </ul>
                      <button className="text-[#667eea] text-xs font-bold hover:underline">Ver completo →</button>
                    </div>
                  </div>

                  <div className="pt-8 border-t border-gray-100 space-y-4">
                    <h4 className="font-bold text-gray-900 uppercase text-xs tracking-wider">💰 Inversión</h4>
                    <div className="flex flex-wrap gap-6">
                      <div>
                        <p className="text-gray-500 text-xs">Colegiatura</p>
                        <p className="text-xl font-bold text-gray-900">${career.cost.toLocaleString()}/mes</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs">Inscripción</p>
                        <p className="text-xl font-bold text-gray-900">${career.inscription.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs">Duración</p>
                        <p className="text-xl font-bold text-gray-900">4 años</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4">
                    <button className="flex-1 min-w-[200px] bg-gradient-primary text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-[#667eea]/40 transition-all flex items-center justify-center gap-2">
                      <Calendar className="w-5 h-5" /> Agendar Visita al Campus
                    </button>
                    <button className="px-6 py-4 border-2 border-gray-100 text-gray-600 font-bold rounded-xl hover:bg-gray-50 transition-all flex items-center gap-2">
                      <Download className="w-5 h-5" /> PDF
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}

          {/* Scholarship Banner */}
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

          {/* AI Analysis */}
          <section className="bg-white p-8 lg:p-12 rounded-[2rem] shadow-xl space-y-8">
            <h2 className="text-2xl font-display font-bold text-gray-900 flex items-center gap-3">
              <Sparkles className="text-[#667eea]" /> TU ANÁLISIS PERSONALIZADO
            </h2>
            <div className="prose prose-lg text-gray-600 max-w-none leading-relaxed">
              <p>
                {lead.nombre}, tu perfil vocacional muestra una clara inclinación basada en tus intereses en <strong>{lead.materias_favoritas}</strong>. Tu pasión por <strong>{lead.actividades_pasion}</strong> y tu superpoder de <strong>{lead.superpower?.replace('_', ' ')}</strong> indican que prosperarías en un entorno de <strong>{lead.entorno_trabajo?.replace('_', ' ')}</strong>.
              </p>
              <p>
                Tu visión de futuro: <em>"{lead.vision_futuro}"</em> demuestra una gran claridad de propósito. Basado en tu desempeño académico y tu motivación por <strong>{lead.motivacion_principal?.replace('_', ' ')}</strong>, Universidad Latino es el lugar ideal para transformar tu potencial en una carrera exitosa.
              </p>
            </div>
          </section>

          {/* Next Steps / Schedule */}
          <section className="bg-[#2d1b69] text-white p-8 lg:p-12 rounded-[2rem] shadow-2xl text-center space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl font-display font-bold">¿Lista para el siguiente paso?</h2>
              <p className="text-white/70">Agenda una cita personalizada y conoce nuestras instalaciones.</p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { date: "Sábado 11 Ene", time: "10:00 AM" },
                { date: "Sábado 11 Ene", time: "4:00 PM" },
                { date: "Lunes 13 Ene", time: "11:00 AM" }
              ].map((slot, i) => (
                <div key={i} className="bg-white/5 border border-white/10 p-6 rounded-2xl hover:bg-white/10 transition-colors group">
                  <p className="text-sm font-medium opacity-60 mb-1">{slot.date}</p>
                  <p className="text-xl font-bold mb-4">{slot.time}</p>
                  <button className="w-full py-2 bg-[#FFD700] text-[#2d1b69] rounded-lg font-bold text-sm">
                    Agendar
                  </button>
                </div>
              ))}
            </div>
            
            <button className="text-white/60 text-sm font-medium hover:text-white transition-colors">
              Ver calendario completo →
            </button>
          </section>

          {/* Social Share */}
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
