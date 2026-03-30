"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Lock, Bot } from "lucide-react";
import { useRouter } from "next/navigation";

// ─── Types ────────────────────────────────────────────────────────────────────

type Message = {
  id: string;
  type: "bot" | "user";
  text: string;
  buttons?: { label: string; value: string; action?: string; variable?: string }[];
  likert?: { variable: string; nextAction: string };
  input?: { type: "text" | "phone" | "email" | "textarea"; variable: string; placeholder: string };
  loading?: boolean;
};

// ─── Scale 0-4 (from questions.json) ─────────────────────────────────────────

const LIKERT_OPTIONS = [
  { value: 0, label: "Nada" },
  { value: 1, label: "Poco" },
  { value: 2, label: "A veces" },
  { value: 3, label: "De acuerdo" },
  { value: 4, label: "Totalmente" },
];

// ─── Question definitions ─────────────────────────────────────────────────────

const QUESTIONS: Record<string, { id: string; prompt: string; next: string }> = {
  // Section 1: Intereses vocacionales (Q01-Q15)
  Q01: { id: "Q01", prompt: "Me interesa entender cómo funcionan los programas, aplicaciones o sistemas informáticos.", next: "Q02" },
  Q02: { id: "Q02", prompt: "Disfruto explorar nuevas herramientas digitales o tecnologías.", next: "Q03" },
  Q03: { id: "Q03", prompt: "Me llama la atención aprender programación o desarrollo de software.", next: "Q04" },
  Q04: { id: "Q04", prompt: "Me interesa conocer las leyes y cómo se aplican en la sociedad.", next: "Q05" },
  Q05: { id: "Q05", prompt: "Disfruto participar en debates y defender mi punto de vista.", next: "Q06" },
  Q06: { id: "Q06", prompt: "Me interesa analizar situaciones donde existen conflictos o injusticias.", next: "Q07" },
  Q07: { id: "Q07", prompt: "Me interesa aprender cómo funciona el cuerpo humano y cómo cuidar la salud.", next: "Q08" },
  Q08: { id: "Q08", prompt: "Disfruto ayudar a otras personas cuando tienen problemas emocionales o personales.", next: "Q09" },
  Q09: { id: "Q09", prompt: "Me interesa aprender sobre alimentación saludable y nutrición.", next: "Q10" },
  Q10: { id: "Q10", prompt: "Me gusta preparar alimentos o experimentar con recetas y sabores.", next: "Q11" },
  Q11: { id: "Q11", prompt: "Me interesa aprender cómo funcionan las empresas y los negocios.", next: "Q12" },
  Q12: { id: "Q12", prompt: "Disfruto convencer a otras personas sobre ideas o productos.", next: "Q13" },
  Q13: { id: "Q13", prompt: "Me interesa conocer otras culturas y aprender idiomas.", next: "Q14" },
  Q14: { id: "Q14", prompt: "Me gusta planear y coordinar actividades o proyectos para que todo funcione bien.", next: "Q15" },
  Q15: { id: "Q15", prompt: "Me gusta encontrar soluciones prácticas a problemas cotidianos.", next: "SECTION_APTITUDES" },

  // Section 2: Aptitudes personales (Q16-Q25)
  Q16: { id: "Q16", prompt: "Aprendo de forma autodidacta sobre herramientas digitales o software.", next: "Q17" },
  Q17: { id: "Q17", prompt: "Puedo explicar y defender mis ideas de forma clara frente a otras personas.", next: "Q18" },
  Q18: { id: "Q18", prompt: "Las personas suelen confiar en mí cuando necesitan apoyo emocional.", next: "Q19" },
  Q19: { id: "Q19", prompt: "Sé cómo cuidar a alguien cuando se siente enfermo o necesita ayuda.", next: "Q20" },
  Q20: { id: "Q20", prompt: "Me interesa planear comidas equilibradas o saludables.", next: "Q21" },
  Q21: { id: "Q21", prompt: "Disfruto preparar alimentos o experimentar en la cocina.", next: "Q22" },
  Q22: { id: "Q22", prompt: "Logro convencer a otras personas cuando recomiendo productos o ideas.", next: "Q23" },
  Q23: { id: "Q23", prompt: "Me gusta planear y coordinar eventos o proyectos.", next: "Q24" },
  Q24: { id: "Q24", prompt: "Puedo analizar situaciones y encontrar soluciones lógicas.", next: "Q25" },
  Q25: { id: "Q25", prompt: "Soy capaz de organizar mi tiempo y cumplir con responsabilidades sin supervisión.", next: "SECTION_CONTEXTO" },

  // Section 4: Motivación y modalidad (Q29-Q30)
  Q29: { id: "Q29", prompt: "¿Qué tan importante es para ti conseguir empleo rápidamente después de graduarte?", next: "Q30" },
  Q30: { id: "Q30", prompt: "¿Qué tan cómodo te sientes estudiando de forma autónoma (organizarte, cumplir tareas y avanzar por tu cuenta)?", next: "CONTEXT_PROMEDIO" },
};

const OPEN_QUESTIONS: Record<string, {
  id: string;
  prompt: string;
  helperText: string;
  placeholder: string;
  minChars: number;
  maxChars: number;
  next: string;
}> = {
  Q26: {
    id: "Q26",
    prompt: "Cuéntame brevemente cómo es tu situación actual en este momento de tu vida.",
    helperText: "Esto me ayuda a entender tu etapa actual y a sugerirte una modalidad compatible contigo.",
    placeholder: "Ej: Recién terminé la preparatoria / Trabajo actualmente y busco titularme.",
    minChars: 15,
    maxChars: 700,
    next: "Q27",
  },
  Q27: {
    id: "Q27",
    prompt: "¿Qué actividades disfrutas en tu tiempo libre o qué temas suelen llamar tu atención fuera de la escuela?",
    helperText: "Esto permite identificar intereses genuinos y no solo escolares.",
    placeholder: "Ej: Hago deporte y escucho música / Paso tiempo con mi familia.",
    minChars: 15,
    maxChars: 700,
    next: "Q28",
  },
  Q28: {
    id: "Q28",
    prompt: "Imagina tu vida dentro de algunos años. Describe cómo te gustaría que fuera tu día a día.",
    helperText: "Piensa en el tipo de actividades, entorno y relación con otras personas.",
    placeholder: "Ej: Tener mi propio negocio o consultorio / Conseguir un mejor puesto en mi trabajo.",
    minChars: 15,
    maxChars: 900,
    next: "SECTION_MOTIVACION",
  },
};

// Progress order: 30 questions total
const QUESTION_ORDER = [
  "Q01","Q02","Q03","Q04","Q05","Q06","Q07","Q08","Q09","Q10",
  "Q11","Q12","Q13","Q14","Q15",
  "Q16","Q17","Q18","Q19","Q20","Q21","Q22","Q23","Q24","Q25",
  "Q26","Q27","Q28",
  "Q29","Q30",
];
const TOTAL_QUESTIONS = QUESTION_ORDER.length;

// ─── Component ────────────────────────────────────────────────────────────────

export function TypebotChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const hasInteracted = useRef(false);
  const router = useRouter();

  useEffect(() => {
    // Wait for framer-motion animation to complete (~300ms) before scrolling
    const timer = setTimeout(() => {
      // Always scroll container to bottom so the latest message is visible
      const container = messagesContainerRef.current;
      if (container) container.scrollTop = container.scrollHeight;
      // After user interaction also scroll the page so input area is fully in view
      if (hasInteracted.current) {
        window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
      }
    }, 320);
    return () => clearTimeout(timer);
  }, [messages, isTyping]);

  useEffect(() => {
    startChat();
  }, []);

  const addBotMessage = (msg: Omit<Message, "id" | "type">) => {
    setMessages(prev => [...prev, { id: Date.now().toString(), type: "bot", ...msg }]);
  };

  const addUserMessage = (text: string) => {
    setMessages(prev => [...prev, { id: Date.now().toString(), type: "user", text }]);
  };

  const delay = (ms: number) => new Promise(r => setTimeout(r, ms));

  const typing = async (ms = 700) => {
    setIsTyping(true);
    await delay(ms);
    setIsTyping(false);
  };

  // ─── Question display ──────────────────────────────────────────────────────

  const showLikertQuestion = (questionId: string) => {
    const q = QUESTIONS[questionId];
    if (!q) return;
    const num = QUESTION_ORDER.indexOf(questionId) + 1;
    addBotMessage({
      text: `Reactivo ${num} de ${TOTAL_QUESTIONS}:\n\n${q.prompt}`,
      likert: { variable: q.id, nextAction: q.next },
    });
  };

  const showOpenQuestion = (questionId: string) => {
    const q = OPEN_QUESTIONS[questionId];
    if (!q) return;
    const num = QUESTION_ORDER.indexOf(questionId) + 1;
    addBotMessage({
      text: `Reactivo ${num} de ${TOTAL_QUESTIONS} (respuesta abierta):\n\n${q.prompt}\n\n💡 ${q.helperText}`,
      input: { type: "textarea", variable: questionId, placeholder: q.placeholder },
    });
  };

  // ─── Action handler ────────────────────────────────────────────────────────

  const handleAction = async (
    action: string,
    value: string,
    currentResponses: Record<string, any>,
    skipUserMessage = false
  ) => {
    if (!skipUserMessage && value) {
      const msg = messages.find(m => m.buttons?.some(b => b.value === value));
      const label = msg?.buttons?.find(b => b.value === value)?.label ?? value;
      addUserMessage(label);
    }

    await typing();

    switch (action) {

      case "MENSAJE_DUDAS":
        addBotMessage({
          text: "Sin problema.\n\nEl test es completamente GRATIS y te tomará unos minutos.\n\nTe haré 30 preguntas sobre:\n• Tus intereses vocacionales\n• Tus aptitudes personales\n• Tu contexto y situación actual\n• Tu motivación y forma de estudio\n\nAl final recibirás:\n• Tu carrera ideal con porcentaje de compatibilidad\n• Análisis vocacional personalizado\n• Opciones de becas disponibles\n\n¿Empezamos?",
          buttons: [{ label: "Sí, ahora sí!", value: "si_ahora", action: "PREGUNTA_NOMBRE" }],
        });
        break;

      case "PREGUNTA_NOMBRE":
        addBotMessage({
          text: "¡Perfecto! Comencemos.\n\n¿Cómo te llamas?",
          input: { type: "text", variable: "nombre", placeholder: "Tu nombre completo..." },
        });
        break;

      case "START_TEST":
        addBotMessage({
          text: `¡Hola, ${currentResponses.nombre}! 👋\n\nVamos a comenzar con la primera sección.\n\n📌 Sección 1 de 4 — Intereses vocacionales\n\nResponde con sinceridad qué tanto te identificas con cada afirmación. No hay respuestas correctas o incorrectas.`,
          buttons: [{ label: "Entendido, empezamos", value: "start_s1", action: "BEGIN_SECTION_1" }],
        });
        break;

      case "BEGIN_SECTION_1":
        await typing(400);
        showLikertQuestion("Q01");
        break;

      case "SECTION_APTITUDES":
        addBotMessage({
          text: `¡Muy bien, ${currentResponses.nombre}! Primera sección completada.\n\n📌 Sección 2 de 4 — Aptitudes personales\n\nAhora responde qué tanto reflejan estas afirmaciones habilidades o acciones que ya realizas en tu vida diaria.`,
          buttons: [{ label: "Continuar", value: "start_s2", action: "BEGIN_SECTION_2" }],
        });
        break;

      case "BEGIN_SECTION_2":
        await typing(400);
        showLikertQuestion("Q16");
        break;

      case "SECTION_CONTEXTO":
        addBotMessage({
          text: `¡Excelente! Ya respondiste 25 de 30 reactivos.\n\n📌 Sección 3 de 4 — Contexto personal\n\nEstas preguntas son abiertas. Responde con tus propias palabras, sin preocuparte por redacción. Lo que importa es lo que piensas.`,
          buttons: [{ label: "Continuar", value: "start_s3", action: "BEGIN_SECTION_3" }],
        });
        break;

      case "BEGIN_SECTION_3":
        await typing(400);
        showOpenQuestion("Q26");
        break;

      case "SECTION_MOTIVACION":
        addBotMessage({
          text: `Casi terminamos.\n\n📌 Sección 4 de 4 — Motivación y modalidad de estudio\n\nEstas últimas preguntas ayudan a entender tus prioridades y cómo preferirías estudiar.`,
          buttons: [{ label: "Continuar", value: "start_s4", action: "BEGIN_SECTION_4" }],
        });
        break;

      case "BEGIN_SECTION_4":
        await typing(400);
        showLikertQuestion("Q29");
        break;

      case "CONTEXT_PROMEDIO":
        addBotMessage({
          text: "¡Terminaste las 30 preguntas!\n\nAhora solo necesito algunos datos rápidos.\n\n¿Cómo describirías tu desempeño académico en bachillerato?",
          buttons: [
            { label: "Sobresaliente (9.5 o superior)", value: "Sobresaliente (9.5 o superior)", action: "CONTEXT_URGENCIA", variable: "promedio" },
            { label: "Muy alto (9.0 a 9.49)", value: "Muy alto (9.0 a 9.49)", action: "CONTEXT_URGENCIA", variable: "promedio" },
            { label: "Alto (8.5 a 8.99)", value: "Alto (8.5 a 8.99)", action: "CONTEXT_URGENCIA", variable: "promedio" },
            { label: "Bueno (8.0 a 8.49)", value: "Bueno (8.0 a 8.49)", action: "CONTEXT_URGENCIA", variable: "promedio" },
            { label: "Suficiente (7.0 a 7.99)", value: "Suficiente (7.0 a 7.99)", action: "CONTEXT_URGENCIA", variable: "promedio" },
            { label: "Prefiero no decirlo", value: "Prefiero no decirlo", action: "CONTEXT_URGENCIA", variable: "promedio" },
          ],
        });
        break;

      case "CONTEXT_URGENCIA":
        addBotMessage({
          text: "¿Qué tan pronto te gustaría iniciar tu carrera universitaria?",
          buttons: [
            { label: "Lo antes posible", value: "Lo antes posible", action: "CAPTURA_CONTACTO", variable: "urgencia" },
            { label: "Este año", value: "Este año", action: "CAPTURA_CONTACTO", variable: "urgencia" },
            { label: "En los próximos 6-12 meses", value: "En los próximos 6-12 meses", action: "CAPTURA_CONTACTO", variable: "urgencia" },
            { label: "Solo estoy explorando opciones", value: "Solo estoy explorando opciones", action: "CAPTURA_CONTACTO", variable: "urgencia" },
          ],
        });
        break;

      case "CAPTURA_CONTACTO":
        addBotMessage({
          text: `¡Perfecto, ${currentResponses.nombre}!\n\nYa tengo todo lo que necesito para generar tu PERFIL VOCACIONAL PERSONALIZADO.\n\nPara enviarte tus resultados, ¿cuál es tu número de WhatsApp?`,
          input: { type: "phone", variable: "telefono", placeholder: "Ej: 999 123 4567" },
        });
        break;

      case "CAPTURA_EMAIL":
        addBotMessage({
          text: "Y por último, tu correo electrónico:",
          input: { type: "email", variable: "email", placeholder: "tu@email.com" },
        });
        break;

      case "PROCESAMIENTO":
        addBotMessage({
          text: `Perfecto, ${currentResponses.nombre}!\n\nEstoy analizando tu perfil con inteligencia artificial...\n\nEsto tomará menos de 30 segundos.`,
          loading: true,
        });

        try {
          const response = await fetch("/api/test/submit", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(currentResponses),
          });
          let result: any;
          try {
            result = await response.json();
          } catch {
            throw new Error(`HTTP ${response.status}: respuesta no válida del servidor`);
          }

          if (result.success) {
            setMessages(prev => [
              ...prev.slice(0, -1),
              {
                id: Date.now().toString(),
                type: "bot",
                text: `¡Listo, ${currentResponses.nombre}!\n\nTu perfil vocacional fue generado exitosamente.\n\n¿Quieres ver tus resultados ahora?`,
                buttons: [
                  { label: "Sí, ver mis resultados", value: result.leadId, action: "REDIRECT" },
                  { label: "Hablar con un asesor AHORA", value: "hablar_asesor", action: "CALL" },
                ],
              },
            ]);
          } else {
            throw new Error(result.error ?? "Unknown API error");
          }
        } catch (err: any) {
          console.error("[EVA] Submit error:", err?.message ?? err);
          console.error("[EVA] Responses sent:", JSON.stringify(currentResponses, null, 2));
          setMessages(prev => [
            ...prev.slice(0, -1),
            {
              id: Date.now().toString(),
              type: "bot",
              text: `Error: ${err?.message ?? "No se pudo procesar tu perfil"}. Por favor, intenta de nuevo.`,
            },
          ]);
        }
        break;

      case "REDIRECT":
        router.push(`/resultados/${value}`);
        break;

      case "CALL":
        window.open("https://wa.me/529991525583", "_blank");
        break;
    }
  };

  // ─── Likert selection ──────────────────────────────────────────────────────

  const handleLikertSelect = async (value: number, variable: string, nextAction: string) => {
    hasInteracted.current = true;
    const labelMap: Record<number, string> = { 0: "Nada", 1: "Poco", 2: "A veces", 3: "De acuerdo", 4: "Totalmente" };
    addUserMessage(labelMap[value]);

    const updated = { ...responses, [variable]: value };
    setResponses(updated);

    await typing(500);

    if (QUESTIONS[nextAction]) {
      showLikertQuestion(nextAction);
    } else if (OPEN_QUESTIONS[nextAction]) {
      showOpenQuestion(nextAction);
    } else {
      handleAction(nextAction, String(value), updated, true);
    }
  };

  // ─── Text / textarea / phone / email input ─────────────────────────────────

  const handleInputSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    hasInteracted.current = true;

    const lastMsg = messages[messages.length - 1];
    if (!lastMsg?.input) return;

    const { variable } = lastMsg.input;
    let finalValue = inputValue.trim();

    if (variable === "telefono") {
      const clean = inputValue.replace(/\D/g, "");
      finalValue = clean.length === 10 ? `+52${clean}` : inputValue.startsWith("+") ? inputValue : `+${clean}`;
    }

    // Open question handling
    if (OPEN_QUESTIONS[variable]) {
      const oq = OPEN_QUESTIONS[variable];
      if (finalValue.length < oq.minChars) {
        addUserMessage(finalValue);
        await typing(400);
        addBotMessage({
          text: `Por favor, escribe al menos ${oq.minChars} caracteres para que pueda entender mejor tu situación.`,
          input: { type: "textarea", variable, placeholder: oq.placeholder },
        });
        setInputValue("");
        return;
      }
      if (finalValue.length > oq.maxChars) finalValue = finalValue.slice(0, oq.maxChars);

      const updated = { ...responses, [oq.id]: finalValue };
      setResponses(updated);
      addUserMessage(finalValue.length > 100 ? finalValue.slice(0, 100) + "…" : finalValue);

      await typing(500);

      if (QUESTIONS[oq.next]) showLikertQuestion(oq.next);
      else if (OPEN_QUESTIONS[oq.next]) showOpenQuestion(oq.next);
      else handleAction(oq.next, finalValue, updated, true);

      setInputValue("");
      return;
    }

    // Standard fields
    const updated = { ...responses, [variable]: finalValue };
    setResponses(updated);
    addUserMessage(finalValue);

    let nextAction = "";
    if (variable === "nombre") nextAction = "START_TEST";
    else if (variable === "telefono") nextAction = "CAPTURA_EMAIL";
    else if (variable === "email") nextAction = "PROCESAMIENTO";

    handleAction(nextAction, finalValue, updated, true);
    setInputValue("");
  };

  // ─── Button click ──────────────────────────────────────────────────────────

  const handleButtonClick = (btn: { label: string; value: string; action?: string; variable?: string }) => {
    hasInteracted.current = true;
    const updated = { ...responses };
    if (btn.variable) {
      updated[btn.variable] = btn.value;
      setResponses(updated);
    }
    handleAction(btn.action ?? "", btn.value, updated);
  };

  // ─── Start ─────────────────────────────────────────────────────────────────

  const startChat = async () => {
    await typing(900);
    addBotMessage({
      text: "¡Hola! Soy Eva, asistente de orientación vocacional de la Universidad Latino.\n\nVamos a descubrir qué carrera es ideal para ti con nuestro test de 30 preguntas, diseñado con apoyo del Departamento de Psicología.\n\nEl proceso es gratuito y al final recibirás un dictamen vocacional personalizado con IA.\n\n¿Todo listo para comenzar?",
      buttons: [
        { label: "Sí, empecemos!", value: "si_empezar", action: "PREGUNTA_NOMBRE" },
        { label: "Tengo una duda", value: "tengo_dudas", action: "MENSAJE_DUDAS" },
      ],
    });
  };

  // ─── Render ────────────────────────────────────────────────────────────────

  const lastMsg = messages[messages.length - 1];
  const showInput = !!lastMsg?.input;

  return (
    <div className="flex flex-col h-full bg-white rounded-3xl shadow-2xl overflow-hidden border border-white/20 text-gray-900">

      {/* Header */}
      <div className="bg-gradient-to-r from-[#1E3A8A] to-[#4F46E5] p-6 text-white shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-lg">
            <Bot className="w-8 h-8 text-[#1E3A8A]" />
          </div>
          <div>
            <h3 className="font-display font-semibold text-lg leading-tight">Eva, orientación vocacional IA</h3>
            <div className="flex items-center gap-2 text-sm opacity-90">
              <span className="w-2 h-2 bg-[#10b981] rounded-full animate-pulse" />
              En línea · 30 reactivos
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-6 bg-[#f9fafb] space-y-4 scroll-smooth">
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
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-[#4F46E5] border-t-transparent" />
                    <span className="text-sm text-gray-500">Analizando tu perfil...</span>
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
                      <span>Nada de acuerdo</span>
                      <span>Totalmente de acuerdo</span>
                    </div>
                    <div className="flex gap-2 justify-center">
                      {LIKERT_OPTIONS.map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() =>
                            handleLikertSelect(opt.value, msg.likert!.variable, msg.likert!.nextAction)
                          }
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
        <div ref={messagesEndRef} className="h-0" />
      </div>

      {/* Input area */}
      <div className="p-4 bg-white border-t border-gray-100 shrink-0">
        {showInput ? (
          <form onSubmit={handleInputSubmit} className="flex gap-2">
            {lastMsg.input?.type === "textarea" ? (
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleInputSubmit(e as any);
                  }
                }}
                placeholder={lastMsg.input.placeholder}
                className="flex-1 bg-white border-2 border-gray-100 rounded-xl px-4 py-3 text-sm text-gray-900 focus:border-[#F59E0B] outline-none transition-colors resize-none min-h-[80px]"
              />
            ) : (
              <input
                type={lastMsg.input?.type === "phone" ? "tel" : lastMsg.input?.type === "email" ? "email" : "text"}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={lastMsg.input?.placeholder}
                className="flex-1 bg-white border-2 border-gray-100 rounded-xl px-4 py-3 text-sm text-gray-900 focus:border-[#F59E0B] outline-none transition-colors"
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
            <span>Universidad Latino · EVA v4.0</span>
          </div>
        )}
      </div>
    </div>
  );
}
