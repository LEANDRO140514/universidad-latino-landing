"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Lock, Bot } from "lucide-react";
import { useRouter } from "next/navigation";

type Message = {
  id: string;
  type: "bot" | "user";
  text: string;
  buttons?: { label: string; value: string; action?: string; scoring?: number; sector?: string[]; beca_flag?: string }[];
  input?: { type: "text" | "phone" | "email" | "textarea"; variable: string; placeholder: string; required: boolean; validation?: any };
  loading?: boolean;
};

export function TypebotChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [currentStep, setCurrentStep] = useState("START");
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    startChat();
  }, []);

  const startChat = async () => {
    setIsTyping(true);
    await new Promise(r => setTimeout(r, 1000));
    setIsTyping(false);
    
    setMessages([
      {
        id: "1",
        type: "bot",
        text: "Hola! Soy Eva, tu orientadora vocacional de Universidad Latino.\n\nVamos a descubrir que carrera es perfecta para ti en solo 5 minutos.\n\nSera una conversacion natural, como hablar con una amiga\n\nLista para empezar?",
        buttons: [
          { label: "Si, vamos!", value: "si_empezar", action: "PREGUNTA_1_NOMBRE" },
          { label: "Tengo dudas", value: "tengo_dudas", action: "MENSAJE_DUDAS" }
        ]
      }
    ]);
  };

  const handleAction = async (action: string, value: string, extraData?: any) => {
    const userMsg = messages.find(m => m.buttons?.some(b => b.value === value));
    const label = userMsg?.buttons?.find(b => b.value === value)?.label || value;
    
    setMessages(prev => [...prev, { id: Date.now().toString(), type: "user", text: label }]);
    
    if (extraData?.variable) {
      setResponses(prev => ({ ...prev, [extraData.variable]: value }));
    }

    setIsTyping(true);
    await new Promise(r => setTimeout(r, 1500));
    setIsTyping(false);

    if (action === "MENSAJE_DUDAS") {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        type: "bot",
        text: "Sin problema\n\nEl test es completamente GRATIS y te tomara solo 5 minutos.\n\nTe voy a hacer preguntas sobre:\n- Tus materias favoritas\n- Tus intereses y pasiones\n- Como te imaginas en el futuro\n\nAl final recibiras:\n- Mensaje en WhatsApp con tu carrera ideal\n- Email con analisis completo\n- Informacion sobre becas\n\nEmpezamos?",
        buttons: [{ label: "Si, ahora si!", value: "si_ahora", action: "PREGUNTA_1_NOMBRE" }]
      }]);
    } else if (action === "PREGUNTA_1_NOMBRE") {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        type: "bot",
        text: "Perfecto! Comencemos\n\nComo te llamas?",
        input: { type: "text", variable: "nombre", placeholder: "Tu nombre...", required: true }
      }]);
    } else if (action === "PREGUNTA_2") {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        type: "bot",
        text: `Mucho gusto, ${responses.nombre || value}!\n\nEn que etapa estas?`,
        buttons: [
          { label: "Estoy en 6to semestre de prepa", value: "sexto_semestre", action: "PREGUNTA_3" },
          { label: "Acabo de terminar la prepa", value: "acabo_terminar", action: "PREGUNTA_3" },
          { label: "Termine hace 1-2 anos", value: "1_2_anos", action: "PREGUNTA_3" },
          { label: "Termine hace mas de 2 anos", value: "mas_2_anos", action: "PREGUNTA_3" },
          { label: "Estoy en otra carrera y quiero cambiar", value: "cambio_carrera", action: "PREGUNTA_3" }
        ]
      }]);
    } else if (action === "PREGUNTA_3") {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        type: "bot",
        text: `Excelente, ${responses.nombre}!\n\nCuentame... cuales son las 3 MATERIAS que mas disfrutaste en la prepa?\n\nEscribelas separadas por comas.\n\nEjemplo: Matematicas, Biologia, Historia`,
        input: { type: "text", variable: "materias_favoritas", placeholder: "Matematicas, Biologia, Historia...", required: true }
      }]);
    } else if (action === "PREGUNTA_4") {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        type: "bot",
        text: "Interesante eleccion!\n\nAhora hablame de tus PASIONES fuera de la escuela.\n\nQue actividades haces en tu tiempo libre que realmente disfrutas?\n\nPueden ser hobbies, deportes, intereses... lo que sea que te emocione",
        input: { type: "text", variable: "actividades_pasion", placeholder: "Ejemplo: Hacer ejercicio, leer, videojuegos...", required: true }
      }]);
    } else if (action === "PREGUNTA_5") {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        type: "bot",
        text: `Me encanta, ${responses.nombre}!\n\nSi tuvieras un SUPERPODER natural, cual de estos seria?`,
        buttons: [
          { label: "Resolver problemas complejos", value: "resolver_problemas", action: "PREGUNTA_6" },
          { label: "Conectar y entender a las personas", value: "entender_personas", action: "PREGUNTA_6" },
          { label: "Crear cosas con mis manos", value: "crear_manos", action: "PREGUNTA_6" },
          { label: "Organizar y liderar equipos", value: "liderar", action: "PREGUNTA_6" },
          { label: "Analizar datos y encontrar patrones", value: "analizar_datos", action: "PREGUNTA_6" },
          { label: "Comunicar ideas de forma persuasiva", value: "comunicar", action: "PREGUNTA_6" }
        ]
      }]);
    } else if (action === "PREGUNTA_6") {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        type: "bot",
        text: "Perfecto\n\nImagina tu TRABAJO IDEAL dentro de 10 anos...\n\nEn que tipo de ambiente te ves trabajando?",
        buttons: [
          { label: "Con pacientes/clientes (cara a cara)", value: "personas_directo", action: "PREGUNTA_7" },
          { label: "En una oficina/empresa corporativa", value: "oficina_corporativa", action: "PREGUNTA_7" },
          { label: "Desde casa o lugares remotos", value: "remoto", action: "PREGUNTA_7" },
          { label: "En laboratorios/cocinas/talleres", value: "laboratorio_taller", action: "PREGUNTA_7" },
          { label: "Al aire libre o en movimiento", value: "aire_libre", action: "PREGUNTA_7" },
          { label: "Mi propio negocio/emprendimiento", value: "emprendimiento", action: "PREGUNTA_7" }
        ]
      }]);
    } else if (action === "PREGUNTA_7") {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        type: "bot",
        text: "Interesante!\n\nQue es lo que MAS te motiva a elegir una carrera?\n\nSe honesta, no hay respuestas incorrectas",
        buttons: [
          { label: "Ayudar a mejorar la vida de las personas", value: "ayudar_personas", action: "PREGUNTA_8" },
          { label: "Ganar bien y tener estabilidad economica", value: "estabilidad_economica", action: "PREGUNTA_8" },
          { label: "Ser creativo e innovar constantemente", value: "creatividad", action: "PREGUNTA_8" },
          { label: "Tener poder de decision y liderazgo", value: "liderazgo", action: "PREGUNTA_8" },
          { label: "Trabajar en algo que me apasiona", value: "pasion", action: "PREGUNTA_8" },
          { label: "Balance vida-trabajo y flexibilidad", value: "balance", action: "PREGUNTA_8" }
        ]
      }]);
    } else if (action === "PREGUNTA_8") {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        type: "bot",
        text: `Ya casi terminamos, ${responses.nombre}!\n\nCierra los ojos por un segundo e imaginate dentro de 10 anos...\n\nQue estas haciendo? Como es un dia tipico en tu vida?\n\nDescribelo en una frase o dos.`,
        input: { type: "textarea", variable: "vision_futuro", placeholder: "Ejemplo: Ayudando a personas...", required: true }
      }]);
    } else if (action === "PREGUNTA_9") {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        type: "bot",
        text: `Excelente, ${responses.nombre}!\n\nUna pregunta importante...\n\nQue tan URGENTE es para ti empezar una carrera universitaria?`,
        buttons: [
          { label: "Muy urgente - Quiero iniciar lo antes posible", value: "muy_urgente", action: "PREGUNTA_10" },
          { label: "Urgente - Quisiera empezar este ano", value: "urgente", action: "PREGUNTA_10" },
          { label: "Tengo tiempo - En los proximos 6-12 meses", value: "tengo_tiempo", action: "PREGUNTA_10" },
          { label: "Sin prisa - Solo estoy explorando opciones", value: "sin_prisa", action: "PREGUNTA_10" }
        ]
      }]);
    } else if (action === "PREGUNTA_10") {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        type: "bot",
        text: `Ultima pregunta, ${responses.nombre}!\n\nComo describirias tu DESEMPENO ACADEMICO en la prepa?`,
        buttons: [
          { label: "Excelente - Promedio 9.5 o superior", value: "excelente", action: "CAPTURA_CONTACTO" },
          { label: "Muy bueno - Promedio 9.0 a 9.4", value: "muy_bueno", action: "CAPTURA_CONTACTO" },
          { label: "Bueno - Promedio 8.5 a 8.9", value: "bueno", action: "CAPTURA_CONTACTO" },
          { label: "Regular - Promedio 8.0 a 8.4", value: "regular", action: "CAPTURA_CONTACTO" },
          { label: "Prefiero no decirlo", value: "no_decir", action: "CAPTURA_CONTACTO" }
        ]
      }]);
    } else if (action === "CAPTURA_CONTACTO") {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        type: "bot",
        text: `Excelente, ${responses.nombre}!\n\nYa tengo todo lo que necesito para crear tu PERFIL VOCACIONAL PERSONALIZADO.\n\nPara enviarte tus resultados completos, necesito tu WhatsApp:`,
        input: { type: "phone", variable: "telefono", placeholder: "+52 999 123 4567", required: true }
      }]);
    } else if (action === "CAPTURA_EMAIL") {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        type: "bot",
        text: "Y por ultimo, tu correo electronico:",
        input: { type: "email", variable: "email", placeholder: "tu@email.com", required: true }
      }]);
    } else if (action === "PROCESAMIENTO") {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        type: "bot",
        text: `Perfecto, ${responses.nombre}!\n\nEstoy analizando tu perfil con nuestra inteligencia artificial...\n\nEsto tomara menos de 30 segundos.`,
        loading: true
      }]);
      
      try {
        const response = await fetch("/api/test/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(responses)
        });
        const result = await response.json();

        if (result.success) {
          setMessages(prev => [...prev.slice(0, -1), {
            id: Date.now().toString(),
            type: "bot",
            text: `Listo, ${responses.nombre}!\n\nTu perfil vocacional fue enviado a:\nWhatsApp: ${responses.telefono}\nEmail: ${responses.email}\n\nCheca tus mensajes AHORA MISMO`,
            buttons: [
              { label: "Si, mostrar resultados", value: result.leadId, action: "REDIRECT" },
              { label: "Hablar con un asesor AHORA", value: "hablar_asesor", action: "CALL" }
            ]
          }]);
        } else {
          throw new Error(result.error);
        }
      } catch (err) {
        console.error(err);
        setMessages(prev => [...prev.slice(0, -1), {
          id: Date.now().toString(),
          type: "bot",
          text: "Hubo un error al procesar tus resultados. Por favor, intenta de nuevo."
        }]);
      }
    } else if (action === "REDIRECT") {
      router.push(`/resultados/${value}`);
    }
  };

  const handleInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const currentMsg = messages[messages.length - 1];
    if (!currentMsg.input) return;

    const variable = currentMsg.input.variable;
    setResponses(prev => ({ ...prev, [variable]: inputValue }));
    
    let nextAction = "";
    if (variable === "nombre") nextAction = "PREGUNTA_2";
    else if (variable === "materias_favoritas") nextAction = "PREGUNTA_4";
    else if (variable === "actividades_pasion") nextAction = "PREGUNTA_5";
    else if (variable === "vision_futuro") nextAction = "PREGUNTA_9";
    else if (variable === "telefono") nextAction = "CAPTURA_EMAIL";
    else if (variable === "email") nextAction = "PROCESAMIENTO";

    handleAction(nextAction, inputValue, { variable });
    setInputValue("");
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-3xl shadow-2xl overflow-hidden border border-white/20">
      <div className="bg-gradient-to-r from-[#1E3A8A] to-[#4F46E5] p-6 text-white shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-lg">
            <Bot className="w-8 h-8 text-[#1E3A8A]" />
          </div>
          <div>
            <h3 className="font-display font-semibold text-lg leading-tight">Eva, tu orientadora IA</h3>
            <div className="flex items-center gap-2 text-sm opacity-90">
              <span className="w-2 h-2 bg-[#10b981] rounded-full animate-pulse" />
              En linea
            </div>
          </div>
        </div>
      </div>

      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 bg-[#f9fafb] space-y-4 scroll-smooth"
      >
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={`flex ${msg.type === "bot" ? "justify-start" : "justify-end"}`}
            >
              <div
                className={`max-w-[85%] p-4 rounded-2xl text-[15px] leading-relaxed shadow-sm ${
                  msg.type === "bot"
                    ? "bg-white text-gray-900 rounded-bl-none"
                    : "bg-gradient-to-br from-[#1E3A8A] to-[#4F46E5] text-white rounded-br-none"
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.text}</div>
                
                {msg.buttons && (
                  <div className="mt-4 grid gap-2">
                    {msg.buttons.map((btn) => (
                      <button
                        key={btn.value}
                        onClick={() => handleAction(btn.action || "", btn.value)}
                        className="bg-white border-2 border-gray-100 text-gray-700 p-3 rounded-xl font-medium text-sm text-left hover:border-[#F59E0B] hover:bg-[#F59E0B]/5 transition-all active:scale-95"
                      >
                        {btn.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
          
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className="bg-white p-4 rounded-2xl rounded-bl-none shadow-sm flex gap-1">
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" />
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="p-4 bg-white border-t border-gray-100 shrink-0">
        {messages.length > 0 && messages[messages.length - 1].input ? (
          <form onSubmit={handleInputSubmit} className="flex gap-2">
            <input
              type={messages[messages.length - 1].input?.type === "phone" ? "tel" : "text"}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={messages[messages.length - 1].input?.placeholder}
              className="flex-1 bg-white border-2 border-gray-100 rounded-xl px-4 py-3 text-sm focus:border-[#F59E0B] outline-none transition-colors"
              autoFocus
            />
            <button 
              type="submit"
              className="bg-[#F59E0B] text-[#111827] p-3 rounded-xl hover:bg-[#D97706] transition-colors shadow-lg shadow-amber-500/20"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        ) : (
          <div className="flex justify-between items-center text-[12px] text-gray-400 px-2">
            <div className="flex items-center gap-1">
              <Lock className="w-3 h-3" />
              Seguro y confidencial
            </div>
            <span>Powered by Universidad Latino</span>
          </div>
        )}
      </div>
    </div>
  );
}
