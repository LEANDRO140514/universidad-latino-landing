"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Lock, Bot } from "lucide-react";
import { useRouter } from "next/navigation";

type LikertOption = {
  value: number;
  label: string;
};

type Message = {
  id: string;
  type: "bot" | "user";
  text: string;
  buttons?: { label: string; value: string; action?: string; variable?: string }[];
  likert?: { variable: string; nextAction: string };
  input?: { type: "text" | "phone" | "email" | "textarea"; variable: string; placeholder: string; required: boolean };
  loading?: boolean;
};

const LIKERT_OPTIONS: LikertOption[] = [
  { value: 1, label: "Nada" },
  { value: 2, label: "Poco" },
  { value: 3, label: "Moderado" },
  { value: 4, label: "Mucho" },
  { value: 5, label: "Totalmente" }
];

const QUESTIONS: Record<string, { id: string; prompt: string; dimension: string; next: string }> = {
    Q01: {
      id: "Q01",
      prompt: "Me interesa comprender el bienestar físico y participar en acciones que favorezcan hábitos de cuidado y salud.",
      dimension: "I_SALUD",
      next: "Q02"
    },
    Q02: {
      id: "Q02",
      prompt: "Me atrae acompañar u orientar a otras personas en decisiones o situaciones personales.",
      dimension: "I_SOCIAL",
      next: "Q03"
    },
    Q03: {
      id: "Q03",
      prompt: "Me motiva coordinar, mejorar procesos y lograr objetivos dentro de un equipo u organización.",
      dimension: "I_NEGOCIOS",
      next: "Q04"
    },
    Q04: {
      id: "Q04",
      prompt: "Me llama la atención la tecnología y la posibilidad de crear o mejorar soluciones digitales.",
      dimension: "I_TECNOLOGIA",
      next: "Q05"
    },
    Q05: {
      id: "Q05",
      prompt: "Se me facilita analizar un problema y estructurar una solución paso a paso.",
      dimension: "A_ANALITICO",
      next: "Q06"
    },
    Q06: {
      id: "Q06",
      prompt: "Suelo captar con facilidad lo que otra persona necesita y responder con sensibilidad y criterio.",
      dimension: "A_EMPATICO",
      next: "Q07"
    },
    Q07: {
      id: "Q07",
      prompt: "Aprendo mejor cuando puedo aplicar lo aprendido en prácticas, casos o situaciones reales.",
      dimension: "A_PRACTICO",
      next: "Q08"
    },
    Q08: {
      id: "Q08",
      prompt: "Puedo organizarme y avanzar con constancia sin depender de supervisión continua.",
      dimension: "A_AUTOGESTION",
      next: "Q09"
    },
    Q09: {
      id: "Q09",
      prompt: "Actualmente tengo responsabilidades (trabajo, familia u otras) que limitan mi disponibilidad entre semana.",
      dimension: "V_RESPONSABILIDADES",
      next: "Q10"
    },
    Q10: {
      id: "Q10",
      prompt: "Me adapto bien a estudiar desde casa y sostener avances con actividades en línea.",
      dimension: "V_REMOTO",
      next: "Q11"
    },
    Q11: {
      id: "Q11",
      prompt: "Cuento con disponibilidad real para concentrar estudio en fin de semana (especialmente sábados).",
      dimension: "V_FINDE",
      next: "OQ01"
    },
    Q12: {
      id: "Q12",
      prompt: "En este momento, iniciar la universidad es una meta concreta y prioritaria para mí.",
      dimension: "M_CLARIDAD_META",
      next: "Q13"
    },
    Q13: {
      id: "Q13",
      prompt: "Estoy dispuesto(a) a sostener el esfuerzo académico incluso cuando haya semanas exigentes.",
      dimension: "M_COMPROMISO",
      next: "CONTEXT_URGENCIA"
    }
  };

const OPEN_QUESTIONS: Record<string, { id: string; prompt: string; helperText: string; placeholder: string; minChars: number; maxChars: number; next: string }> = {
    OQ01: {
      id: "OQ01_contexto",
      prompt: "Para iniciar, cuéntame brevemente cuál es tu situación actual.",
      helperText: "Esto nos ayuda a sugerirte una modalidad realista para tu ritmo de vida.",
      placeholder: "Ejemplo: Recién terminé la preparatoria / Trabajo actualmente y busco titularme.",
      minChars: 15,
      maxChars: 700,
      next: "OQ02"
    },
    OQ02: {
      id: "OQ02_intereses",
      prompt: "Cuéntame qué actividades realizas usualmente en tu tiempo libre.",
      helperText: "No hay respuestas correctas o incorrectas. Busco entender qué te entusiasma de forma natural.",
      placeholder: "Ejemplo: Hago deporte y escucho música / Paso tiempo con mi familia.",
      minChars: 15,
      maxChars: 700,
      next: "OQ03"
    },
    OQ03: {
      id: "OQ03_vision",
      prompt: "Imagina tu vida en unos años, ¿cuál es tu objetivo principal?",
      helperText: "Esto ayuda a conectar tus preferencias con carreras y modalidades que realmente encajen contigo.",
      placeholder: "Ejemplo: Tener mi propio negocio o consultorio / Conseguir un mejor puesto en mi trabajo.",
      minChars: 15,
      maxChars: 900,
      next: "Q12"
    }
};

export function TypebotChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [isTyping, setIsTyping] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<string | null>(null);
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
        text: "¡Hola! Soy Eva, asistente de orientación vocacional de la Universidad Latino.\n\nVamos a descubrir qué carrera es perfecta para ti en solo 5 minutos.\n\nTe haré 15 preguntas rápidas sobre tus intereses, habilidades y estilo de vida.\n\n¿Todo listo para empezar?",
        buttons: [
          { label: "Sí, vamos!", value: "si_empezar", action: "PREGUNTA_NOMBRE" },
          { label: "Tengo dudas", value: "tengo_dudas", action: "MENSAJE_DUDAS" }
        ]
      }
    ]);
  };

const QUESTION_ORDER = [
    "Q01", "Q02", "Q03", "Q04", "Q05", "Q06", "Q07", "Q08", "Q09", "Q10", "Q11",
    "OQ01", "OQ02", "OQ03",
    "Q12", "Q13"
  ];
  const TOTAL_QUESTIONS = QUESTION_ORDER.length;

  const showLikertQuestion = async (questionId: string) => {
        const question = QUESTIONS[questionId];
        if (!question) return;

        setCurrentQuestion(questionId);
        const questionNumber = QUESTION_ORDER.indexOf(questionId) + 1;
        
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          type: "bot",
          text: `Reactivo ${questionNumber} de ${TOTAL_QUESTIONS}:\n\n${question.prompt}`,
          likert: { variable: question.id, nextAction: question.next }
        }]);
      };

      const showOpenQuestion = async (questionId: string) => {
        const question = OPEN_QUESTIONS[questionId];
        if (!question) return;

        setCurrentQuestion(questionId);
        const questionNumber = QUESTION_ORDER.indexOf(questionId) + 1;
        
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          type: "bot",
          text: `Reactivo ${questionNumber} de ${TOTAL_QUESTIONS} (abierto):\n\n${question.prompt}\n\n💡 ${question.helperText}`,
          input: { type: "textarea", variable: questionId, placeholder: question.placeholder, required: true }
        }]);
      };

  const handleAction = async (action: string, value: string, currentResponses: Record<string, any>, skipUserMessage = false) => {
    if (!skipUserMessage) {
      const userMsg = messages.find(m => m.buttons?.some(b => b.value === value));
      const label = userMsg?.buttons?.find(b => b.value === value)?.label || value;
      setMessages(prev => [...prev, { id: Date.now().toString(), type: "user", text: label }]);
    }
    
    setIsTyping(true);
    await new Promise(r => setTimeout(r, 800));
    setIsTyping(false);

    if (action === "MENSAJE_DUDAS") {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        type: "bot",
        text: "Sin problema.\n\nEl test es completamente GRATIS y te tomará solo 5 minutos.\n\nTe haré 15 preguntas sobre:\n• Tus intereses vocacionales\n• Tus habilidades y fortalezas\n• Tu estilo de vida y disponibilidad\n• Tu motivación y metas\n\nAl final recibirás:\n• Tu carrera ideal con porcentaje de compatibilidad\n• Análisis de tus fortalezas\n• Opciones de becas disponibles\n\n¿Empezamos?",
        buttons: [{ label: "Sí, ahora sí!", value: "si_ahora", action: "PREGUNTA_NOMBRE" }]
      }]);
    } else if (action === "PREGUNTA_NOMBRE") {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        type: "bot",
        text: "¡Perfecto! Comencemos.\n\n¿Cómo te llamas?",
        input: { type: "text", variable: "nombre", placeholder: "Tu nombre...", required: true }
      }]);
    } else if (action === "START_TEST") {
      showLikertQuestion("Q01");
} else if (action === "Q14") {
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          type: "bot",
          text: "¡Excelente progreso!\n\n¿Cuándo te gustaría iniciar tu carrera universitaria?",
          buttons: [
            { label: "Lo antes posible", value: "ASAP", action: "Q15", variable: "urgencia" },
            { label: "Este año", value: "ESTE_ANIO", action: "Q15", variable: "urgencia" },
            { label: "En los próximos 6 a 12 meses", value: "6_12", action: "Q15", variable: "urgencia" },
            { label: "Solo estoy explorando por ahora", value: "EXPLORANDO", action: "Q15", variable: "urgencia" }
          ]
        }]);
      } else if (action === "CONTEXT_URGENCIA") {
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          type: "bot",
          text: "¡Muy bien! Ahora unas preguntas finales.\n\n¿Cuándo te gustaría iniciar tu carrera universitaria?",
          buttons: [
            { label: "Lo antes posible", value: "ASAP", action: "CONTEXT_PROMEDIO", variable: "urgencia" },
            { label: "Este año", value: "ESTE_ANIO", action: "CONTEXT_PROMEDIO", variable: "urgencia" },
            { label: "En los próximos 6 a 12 meses", value: "6_12", action: "CONTEXT_PROMEDIO", variable: "urgencia" },
            { label: "Solo estoy explorando por ahora", value: "EXPLORANDO", action: "CONTEXT_PROMEDIO", variable: "urgencia" }
          ]
        }]);
      } else if (action === "CONTEXT_PROMEDIO") {
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          type: "bot",
          text: "Última pregunta:\n\n¿Cuál fue tu promedio aproximado (o nivel de desempeño) en tu último grado?",
          buttons: [
            { label: "Sobresaliente (≈ 9.5 o más)", value: "SOBRESALIENTE", action: "CAPTURA_CONTACTO", variable: "promedio" },
            { label: "Muy alto (≈ 9.0 a 9.4)", value: "MUY_ALTO", action: "CAPTURA_CONTACTO", variable: "promedio" },
            { label: "Alto (≈ 8.5 a 8.9)", value: "ALTO", action: "CAPTURA_CONTACTO", variable: "promedio" },
            { label: "Bueno (≈ 8.0 a 8.4)", value: "BUENO", action: "CAPTURA_CONTACTO", variable: "promedio" },
            { label: "Suficiente (≈ 7.0 a 7.9)", value: "SUFICIENTE", action: "CAPTURA_CONTACTO", variable: "promedio" },
            { label: "Prefiero no decirlo", value: "NO_DIGO", action: "CAPTURA_CONTACTO", variable: "promedio" }
          ]
        }]);
    } else if (action === "CAPTURA_CONTACTO") {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        type: "bot",
        text: `¡Excelente, ${currentResponses.nombre}!\n\nYa tengo todo lo que necesito para crear tu PERFIL VOCACIONAL PERSONALIZADO.\n\nPara enviarte tus resultados completos, necesito tu WhatsApp:`,
        input: { type: "phone", variable: "telefono", placeholder: "Ej: 999 123 4567", required: true }
      }]);
    } else if (action === "CAPTURA_EMAIL") {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        type: "bot",
        text: "Y por último, tu correo electrónico:",
        input: { type: "email", variable: "email", placeholder: "tu@email.com", required: true }
      }]);
    } else if (action === "PROCESAMIENTO") {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        type: "bot",
        text: `Perfecto, ${currentResponses.nombre}!\n\nEstoy analizando tu perfil con nuestra inteligencia artificial...\n\nEsto tomará menos de 30 segundos.`,
        loading: true
      }]);
      
      try {
        const response = await fetch("/api/test/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(currentResponses)
        });
        const result = await response.json();

        if (result.success) {
          setMessages(prev => [...prev.slice(0, -1), {
            id: Date.now().toString(),
            type: "bot",
            text: `¡Listo, ${currentResponses.nombre}!\n\nTu perfil vocacional fue generado exitosamente.\n\nWhatsApp: ${currentResponses.telefono}\nEmail: ${currentResponses.email}\n\n¿Quieres ver tus resultados ahora?`,
            buttons: [
              { label: "Sí, mostrar resultados", value: result.leadId, action: "REDIRECT" },
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

  const handleLikertSelect = async (value: number, variable: string, nextAction: string) => {
    const labelMap: Record<number, string> = { 1: "Nada", 2: "Poco", 3: "Moderado", 4: "Mucho", 5: "Totalmente" };
    
    setMessages(prev => [...prev, { id: Date.now().toString(), type: "user", text: labelMap[value] }]);
    
    const updatedResponses = { ...responses, [variable]: value };
    setResponses(updatedResponses);
    
    setIsTyping(true);
    await new Promise(r => setTimeout(r, 600));
    setIsTyping(false);

if (QUESTIONS[nextAction]) {
        showLikertQuestion(nextAction);
      } else if (OPEN_QUESTIONS[nextAction]) {
        showOpenQuestion(nextAction);
      } else {
        handleAction(nextAction, String(value), updatedResponses, true);
      }
  };

  const handleInputSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const currentMsg = messages[messages.length - 1];
    if (!currentMsg.input) return;

    const variable = currentMsg.input.variable;
    let finalValue = inputValue;

    if (variable === "telefono") {
      const clean = inputValue.replace(/\D/g, "");
      if (clean.length === 10) {
        finalValue = `+52${clean}`;
      } else if (!inputValue.startsWith("+")) {
        finalValue = `+${clean}`;
      }
    }

    const updatedResponses = { ...responses, [variable]: finalValue };
    setResponses(updatedResponses);
    
    setMessages(prev => [...prev, { id: Date.now().toString(), type: "user", text: inputValue }]);
    
let nextAction = "";
      if (variable === "nombre") nextAction = "START_TEST";
      else if (variable === "telefono") nextAction = "CAPTURA_EMAIL";
      else if (variable === "email") nextAction = "PROCESAMIENTO";
      else if (OPEN_QUESTIONS[variable]) {
        const openQ = OPEN_QUESTIONS[variable];
        if (finalValue.length < openQ.minChars) {
          setMessages(prev => [...prev, {
            id: Date.now().toString(),
            type: "bot",
            text: `Por favor, escribe al menos ${openQ.minChars} caracteres para poder entender mejor tu situación.`,
            input: { type: "textarea", variable: variable, placeholder: openQ.placeholder, required: true }
          }]);
          setInputValue("");
          return;
        }
        if (finalValue.length > openQ.maxChars) {
          finalValue = finalValue.substring(0, openQ.maxChars);
        }
        const updatedWithOpen = { ...responses, [openQ.id]: finalValue };
        setResponses(updatedWithOpen);
        
        if (QUESTIONS[openQ.next]) {
          setIsTyping(true);
          await new Promise(r => setTimeout(r, 600));
          setIsTyping(false);
          showLikertQuestion(openQ.next);
          setInputValue("");
          return;
        } else if (OPEN_QUESTIONS[openQ.next]) {
          setIsTyping(true);
          await new Promise(r => setTimeout(r, 600));
          setIsTyping(false);
          showOpenQuestion(openQ.next);
          setInputValue("");
          return;
        } else {
          nextAction = openQ.next;
        }
      }

    handleAction(nextAction, finalValue, updatedResponses, true);
    setInputValue("");
  };

  const handleButtonClick = (btn: any) => {
    let updatedResponses = { ...responses };
    if (btn.variable) {
      updatedResponses[btn.variable] = btn.value;
      setResponses(updatedResponses);
    }
    handleAction(btn.action || "", btn.value, updatedResponses);
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-3xl shadow-2xl overflow-hidden border border-white/20 text-gray-900">
      <div className="bg-gradient-to-r from-[#1E3A8A] to-[#4F46E5] p-6 text-white shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-lg">
            <Bot className="w-8 h-8 text-[#1E3A8A]" />
          </div>
          <div>
            <h3 className="font-display font-semibold text-lg leading-tight">Eva, asistencia vocacional IA</h3>
            <div className="flex items-center gap-2 text-sm opacity-90">
              <span className="w-2 h-2 bg-[#10b981] rounded-full animate-pulse" />
              En línea
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
                
                {msg.loading && (
                  <div className="mt-4 flex items-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-[#4F46E5] border-t-transparent"></div>
                    <span className="text-sm text-gray-500">Procesando...</span>
                  </div>
                )}
                
                {msg.buttons && (
                  <div className="mt-4 grid gap-2">
                    {msg.buttons.map((btn) => (
                      <button
                        key={btn.value}
                        onClick={() => handleButtonClick(btn)}
                        className="bg-white border-2 border-gray-100 text-gray-700 p-3 rounded-xl font-medium text-sm text-left hover:border-[#F59E0B] hover:bg-[#F59E0B]/5 transition-all active:scale-95"
                      >
                        {btn.label}
                      </button>
                    ))}
                  </div>
                )}

                {msg.likert && (
                  <div className="mt-4 space-y-3">
                    <div className="flex justify-between text-xs text-gray-400 px-1">
                      <span>Nada</span>
                      <span>Totalmente</span>
                    </div>
                    <div className="flex gap-2 justify-center">
                      {LIKERT_OPTIONS.map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() => handleLikertSelect(opt.value, msg.likert!.variable, msg.likert!.nextAction)}
                          className="w-12 h-12 rounded-full border-2 border-gray-200 bg-white text-gray-700 font-bold text-lg hover:border-[#F59E0B] hover:bg-[#F59E0B] hover:text-white transition-all active:scale-95 flex items-center justify-center"
                        >
                          {opt.value}
                        </button>
                      ))}
                    </div>
                    <div className="flex justify-between text-[10px] text-gray-400 px-1">
                      {LIKERT_OPTIONS.map((opt) => (
                        <span key={opt.value} className="w-12 text-center">{opt.label}</span>
                      ))}
                    </div>
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
              {messages[messages.length - 1].input?.type === "textarea" ? (
                <textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={messages[messages.length - 1].input?.placeholder}
                  className="flex-1 bg-white border-2 border-gray-100 rounded-xl px-4 py-3 text-sm text-gray-900 focus:border-[#F59E0B] outline-none transition-colors resize-none min-h-[80px]"
                  autoFocus
                />
              ) : (
                <input
                  type={messages[messages.length - 1].input?.type === "phone" ? "tel" : "text"}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={messages[messages.length - 1].input?.placeholder}
                  className="flex-1 bg-white border-2 border-gray-100 rounded-xl px-4 py-3 text-sm text-gray-900 focus:border-[#F59E0B] outline-none transition-colors"
                  autoFocus
                />
              )}
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
            <span>Powered by la Universidad Latino</span>
          </div>
        )}
      </div>
    </div>
  );
}
