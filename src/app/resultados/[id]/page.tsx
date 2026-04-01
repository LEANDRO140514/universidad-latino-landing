"use client";

import { Header } from "@/components/Header";
import { motion } from "framer-motion";
import {
  CheckCircle2, Download, Calendar, ArrowRight, Share2,
  Smartphone, GraduationCap, Clock, MapPin, Sparkles,
  MessageCircle, Phone,
} from "lucide-react";
import { useEffect, useState, use } from "react";
import { supabase } from "@/lib/supabase";
import { modalityLabel } from "@/lib/eva-engine";

// ─── Sector display maps ───────────────────────────────────────────────────────

const SECTOR_NAMES: Record<string, string> = {
  // v4 keys
  SALUD_BIENESTAR: "Salud y Bienestar",
  LEGAL: "Derecho y Ciencias Jurídicas",
  TECNOLOGIA: "Tecnología e Innovación",
  NEGOCIOS: "Negocios y Gestión",
  // v3 legacy keys
  SALUD: "Salud y Bienestar",
  DERECHO: "Derecho y Ciencias Jurídicas",
};

const SECTOR_ICONS: Record<string, string> = {
  SALUD_BIENESTAR: "🏥",
  LEGAL: "⚖️",
  TECNOLOGIA: "💻",
  NEGOCIOS: "📊",
  SALUD: "🏥",
  DERECHO: "⚖️",
};

// ─── Career image & detail maps (v4 career IDs) ───────────────────────────────

const CAREER_IMAGES: Record<string, string> = {
  nutricion: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=1000&auto=format&fit=crop",
  enfermeria: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=1000&auto=format&fit=crop",
  psicologia: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=1000&auto=format&fit=crop",
  gastronomia: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=1000&auto=format&fit=crop",
  ventas_mercadotecnia: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1000&auto=format&fit=crop",
  negocios_internacionales: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1000&auto=format&fit=crop",
  derecho: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=1000&auto=format&fit=crop",
  ingenieria_sistemas: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1000&auto=format&fit=crop",
  administracion: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1000&auto=format&fit=crop",
  administracion_desarrollo_empresarial: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1000&auto=format&fit=crop",
  // v3 legacy IDs
  P_NUTRICION: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=1000&auto=format&fit=crop",
  P_ENFERMERIA: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=1000&auto=format&fit=crop",
  P_PSICOLOGIA: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=1000&auto=format&fit=crop",
  P_GASTRONOMIA: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=1000&auto=format&fit=crop",
  P_VENTAS_MKT: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1000&auto=format&fit=crop",
  P_NEGOCIOS_INT: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1000&auto=format&fit=crop",
  P_DERECHO: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=1000&auto=format&fit=crop",
  P_SISTEMAS: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1000&auto=format&fit=crop",
  P_ADMIN_SAB: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1000&auto=format&fit=crop",
  P_ADMIN_DEV_EMP: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1000&auto=format&fit=crop",
};

const CAREER_DETAILS: Record<string, { reasons: string[]; studyPlan: string[]; cost: number; inscription: number }> = {
  ingenieria_sistemas: {
    reasons: ["Alto interés tecnológico", "Capacidad analítica superior", "Resolución de problemas"],
    studyPlan: ["Programación", "Bases de Datos", "Redes", "Inteligencia Artificial"],
    cost: 4650, inscription: 7000,
  },
  derecho: {
    reasons: ["Pensamiento analítico", "Interés en justicia y normas", "Capacidad argumentativa"],
    studyPlan: ["Derecho Civil", "Derecho Penal", "Derecho Laboral", "Derecho Mercantil"],
    cost: 4650, inscription: 7000,
  },
  psicologia: {
    reasons: ["Alta empatía", "Interés en acompañamiento emocional", "Habilidad social"],
    studyPlan: ["Psicología Clínica", "Psicología Organizacional", "Desarrollo Humano", "Terapias"],
    cost: 4650, inscription: 7000,
  },
  enfermeria: {
    reasons: ["Sensibilidad interpersonal alta", "Orientación práctica", "Interés en cuidado de la salud"],
    studyPlan: ["Enfermería Básica", "Farmacología", "Cuidados Intensivos", "Salud Comunitaria"],
    cost: 4650, inscription: 7000,
  },
  nutricion: {
    reasons: ["Interés en salud y bienestar", "Perfil analítico-práctico", "Vocación de servicio"],
    studyPlan: ["Nutrición Clínica", "Dietoterapia", "Nutrición Deportiva", "Evaluación Nutricional"],
    cost: 4650, inscription: 7000,
  },
  gastronomia: {
    reasons: ["Creatividad práctica", "Interés en bienestar y alimentación", "Orientación al detalle"],
    studyPlan: ["Cocina Internacional", "Repostería", "Administración de Restaurantes", "Nutrición"],
    cost: 4650, inscription: 7000,
  },
  ventas_mercadotecnia: {
    reasons: ["Perfil de negocios", "Habilidades de comunicación", "Capacidad persuasiva"],
    studyPlan: ["Marketing Digital", "Comportamiento del Consumidor", "Ventas Estratégicas", "E-commerce"],
    cost: 4650, inscription: 7000,
  },
  negocios_internacionales: {
    reasons: ["Visión global", "Capacidad analítica alta", "Interés en comercio internacional"],
    studyPlan: ["Comercio Internacional", "Logística", "Finanzas Internacionales", "Negociación"],
    cost: 4650, inscription: 7000,
  },
  administracion: {
    reasons: ["Perfil de negocios", "Disponibilidad fin de semana", "Responsabilidades laborales"],
    studyPlan: ["Administración General", "Finanzas", "Recursos Humanos", "Planeación Estratégica"],
    cost: 3960, inscription: 3600,
  },
  administracion_desarrollo_empresarial: {
    reasons: ["Autonomía alta", "Preferencia por estudio remoto", "Perfil emprendedor"],
    studyPlan: ["Desarrollo Empresarial", "Innovación", "Gestión de Proyectos", "Liderazgo"],
    cost: 1980, inscription: 3600,
  },
};

// Fallback for legacy v3 IDs
const LEGACY_DETAILS: Record<string, typeof CAREER_DETAILS["ingenieria_sistemas"]> = {
  P_NUTRICION: CAREER_DETAILS.nutricion,
  P_ENFERMERIA: CAREER_DETAILS.enfermeria,
  P_PSICOLOGIA: CAREER_DETAILS.psicologia,
  P_GASTRONOMIA: CAREER_DETAILS.gastronomia,
  P_VENTAS_MKT: CAREER_DETAILS.ventas_mercadotecnia,
  P_NEGOCIOS_INT: CAREER_DETAILS.negocios_internacionales,
  P_DERECHO: CAREER_DETAILS.derecho,
  P_SISTEMAS: CAREER_DETAILS.ingenieria_sistemas,
  P_ADMIN_SAB: CAREER_DETAILS.administracion,
  P_ADMIN_DEV_EMP: CAREER_DETAILS.administracion_desarrollo_empresarial,
};

// ─── Normalize top_programs to a unified display format ────────────────────────

type DisplayProgram = {
  id: string;
  name: string;
  sector: string;
  modality: string;
  match_percent: number;
};

/** Supabase a veces devuelve JSONB anidado como string; normaliza a objeto. */
function parseIfJsonString<T extends object>(v: unknown): T | null {
  if (v == null) return null;
  if (typeof v === "string") {
    try {
      return JSON.parse(v) as T;
    } catch {
      return null;
    }
  }
  if (typeof v === "object") return v as T;
  return null;
}

function unwrapProgramEntry(entry: unknown): Record<string, unknown> | string | null {
  if (entry == null) return null;
  if (typeof entry === "string") {
    const trimmed = entry.trim();
    if (!trimmed) return null;
    const parsed = parseIfJsonString<Record<string, unknown>>(trimmed);
    if (parsed) return parsed;
    return trimmed;
  }
  if (typeof entry === "object") return entry as Record<string, unknown>;
  return null;
}

function careerFromObject(o: Record<string, unknown>): DisplayProgram | null {
  const idRaw = o.career_id ?? o.program_id ?? o.id;
  const nameRaw = o.career_name ?? o.program_name ?? o.name ?? o.title;
  const id = idRaw != null && String(idRaw).trim() ? String(idRaw).trim() : "";
  const name = nameRaw != null && String(nameRaw).trim() ? String(nameRaw).trim() : "";
  if (!id && !name) return null;
  const mp = o.match_percent ?? o.matchPercent;
  const match_percent =
    typeof mp === "number" && !Number.isNaN(mp)
      ? Math.round(mp)
      : typeof o.score === "number"
        ? Math.round(o.score as number)
        : 75;
  const sector = String(o.area ?? o.sector ?? "NEGOCIOS").trim();
  const modality = String(o.modality ?? o.mode ?? "presencial_cuatrimestral").trim();
  return {
    id: id || `slug:${name.toLowerCase().replace(/\s+/g, "_")}`,
    name: name || "Carrera",
    sector,
    modality,
    match_percent,
  };
}

function normalizePrograms(lead: any): DisplayProgram[] {
  const responses =
    parseIfJsonString<Record<string, unknown>>(lead.responses) ??
    (typeof lead.responses === "object" && lead.responses !== null
      ? (lead.responses as Record<string, unknown>)
      : {});
  const eva = responses._eva as Record<string, unknown> | undefined;

  const fromEva: unknown[] = [];
  if (eva?.career_primary) fromEva.push(eva.career_primary);
  if (eva?.career_secondary) fromEva.push(eva.career_secondary);

  let rawTop: unknown[] = [];
  const tp = lead.top_programs;
  if (Array.isArray(tp)) rawTop = [...tp];
  else if (typeof tp === "string") {
    const parsed = parseIfJsonString<unknown[]>(tp);
    if (Array.isArray(parsed)) rawTop = parsed;
  }

  // Prioridad: motor EVA en responses (objetos completos); luego top_programs
  const candidates = [...fromEva, ...rawTop];
  const programs: DisplayProgram[] = [];
  const seen = new Set<string>();

  for (const entry of candidates) {
    const unwrapped = unwrapProgramEntry(entry);
    if (unwrapped == null) continue;

    let prog: DisplayProgram | null = null;
    if (typeof unwrapped === "string") {
      prog = {
        id: `name:${unwrapped}`,
        name: unwrapped,
        sector: String(lead.sector_primary ?? "NEGOCIOS"),
        modality: "presencial_cuatrimestral",
        match_percent: 75,
      };
    } else {
      prog = careerFromObject(unwrapped);
    }
    if (!prog) continue;

    const dedupe = prog.id.startsWith("slug:") || prog.id.startsWith("name:")
      ? prog.name
      : prog.id;
    if (seen.has(dedupe)) continue;
    seen.add(dedupe);

    programs.push(prog);
  }

  return programs;
}

// ─── Scholarship from lead data ────────────────────────────────────────────────

type ScholarshipDisplay = {
  performance_label: string;
  tuition_scholarship_percent: number;
  enrollment_discount_percent: number;
  student_message: string;
  cta: { primary: string; secondary: string };
};

function resolveScholarship(lead: any): ScholarshipDisplay {
  // Prefer new engine support object (stored in responses._eva.support)
  const evaSupport = lead.responses?._eva?.support;
  if (evaSupport) {
    return {
      performance_label: evaSupport.name ?? evaSupport.type ?? "Apoyo académico",
      tuition_scholarship_percent: evaSupport.tuition_scholarship_percent ?? 0,
      enrollment_discount_percent: evaSupport.enrollment_discount_percent ?? 0,
      student_message: evaSupport.message ?? "",
      cta: { primary: "Hablar con Admisiones", secondary: "Ver proceso de inscripción" },
    };
  }

  // Legacy v3 fallback
  const promedio = lead.promedio;
  const promedioMap: Record<string, ScholarshipDisplay> = {
    SOBRESALIENTE: {
      performance_label: "Desempeño sobresaliente",
      tuition_scholarship_percent: 50, enrollment_discount_percent: 50,
      student_message: "Tu desempeño académico es sobresaliente. Puedes acceder a una beca del 50% en colegiatura y un 50% de descuento en la inscripción.",
      cta: { primary: "Hablar con Admisiones", secondary: "Conocer beneficios completos" },
    },
    MUY_ALTO: {
      performance_label: "Muy alto desempeño académico",
      tuition_scholarship_percent: 40, enrollment_discount_percent: 50,
      student_message: "Tu rendimiento académico es muy alto. Puedes acceder a una beca del 40% en colegiatura y un 50% de descuento en la inscripción.",
      cta: { primary: "Iniciar proceso con Admisiones", secondary: "Agendar asesoría" },
    },
    ALTO: {
      performance_label: "Buen desempeño académico",
      tuition_scholarship_percent: 30, enrollment_discount_percent: 50,
      student_message: "Tu desempeño refleja constancia. Puedes acceder a una beca del 30% en colegiatura y un 50% de descuento en la inscripción.",
      cta: { primary: "Hablar con Admisiones", secondary: "Conocer proceso de inscripción" },
    },
  };
  if (promedioMap[promedio]) return promedioMap[promedio];

  return {
    performance_label: "Oportunidad de Inscripción",
    tuition_scholarship_percent: 0, enrollment_discount_percent: 50,
    student_message: "Para apoyarte en el inicio de tu carrera, puedes aprovechar un 50% de descuento en la inscripción. Un asesor puede orientarte sobre el proceso.",
    cta: { primary: "Hablar con un asesor", secondary: "Iniciar proceso de inscripción" },
  };
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function ResultsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [lead, setLead] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [generatingPDF, setGeneratingPDF] = useState(false);
  const [showPhone, setShowPhone] = useState(false);

  useEffect(() => {
    async function fetchLead() {
      const res = await fetch(`/api/leads/${id}`);
      if (res.ok) {
        const data = await res.json();
        setLead(data);
      }
      setLoading(false);
    }
    fetchLead();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F4F4F4] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#002D62]" />
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="min-h-screen bg-[#F4F4F4] flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold text-[#002D62]">Perfil no encontrado</h1>
        <a href="/" className="text-[#002D62] hover:underline">Volver al inicio</a>
      </div>
    );
  }

  const programs = normalizePrograms(lead);
  const sectorPrimary = lead.sector_primary ?? "NEGOCIOS";
  const sectorSecondary = lead.sector_secondary;
  const leadScore = lead.score ?? 75;
  const leadClass = lead.lead_class ?? "WARM";
  const scholarship = resolveScholarship(lead);

  const handleDownloadPDF = async () => {
    if (generatingPDF) return;
    setGeneratingPDF(true);
    try {
      const { default: jsPDF } = await import("jspdf");
      const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

      const PW = 210;
      const M = 15;
      const CW = PW - M * 2;
      let y = 0;

      const checkPage = (need = 20) => {
        if (y + need > 272) { doc.addPage(); y = 18; }
      };

      // Helper: fetch image → base64 (smaller size for performance)
      const fetchImg = async (url: string): Promise<string | null> => {
        try {
          const small = url.replace(/w=\d+/, "w=300").replace(/q=\d+/, "q=70");
          const res = await fetch(small);
          const blob = await res.blob();
          return new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.readAsDataURL(blob);
          });
        } catch { return null; }
      };

      // Pre-load all career images in parallel before generating PDF
      const careerImgData = await Promise.all(
        programs.map(p => fetchImg(CAREER_IMAGES[p.id] ?? CAREER_IMAGES.ventas_mercadotecnia))
      );

      // ── Header bar ─────────────────────────────────────────────────────────
      doc.setFillColor(0, 45, 98);
      doc.rect(0, 0, PW, 36, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text("PERFIL VOCACIONAL", M, 15);
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.text("Universidad Latino · EVA v4.0", M, 23);
      doc.text(new Date().toLocaleDateString("es-MX"), PW - M, 23, { align: "right" });
      y = 46;

      // ── Student name ───────────────────────────────────────────────────────
      doc.setTextColor(0, 45, 98);
      doc.setFontSize(20);
      doc.setFont("helvetica", "bold");
      doc.text(lead.nombre ?? "", M, y);
      y += 7;

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(90, 90, 90);
      doc.text(`Sector: ${SECTOR_NAMES[sectorPrimary] ?? sectorPrimary}`, M, y);
      y += 5;
      if (sectorSecondary) {
        doc.text(`Sector complementario: ${SECTOR_NAMES[sectorSecondary] ?? sectorSecondary}`, M, y);
        y += 5;
      }
      doc.text(`Compatibilidad: ${leadScore}/100 — ${leadClass === "HOT" ? "Alta Prioridad" : leadClass === "WARM" ? "Interesado" : "Explorando"}`, M, y);
      y += 8;

      // ── Gold divider ───────────────────────────────────────────────────────
      doc.setDrawColor(230, 180, 0);
      doc.setLineWidth(0.8);
      doc.line(M, y, PW - M, y);
      y += 8;

      // ── Career cards (image left | details right) ─────────────────────────
      const IMG_W = 62;
      const IMG_H = 50;
      const TX = M + IMG_W + 5;   // text column X
      const TCW = CW - IMG_W - 5; // text column width
      const CARD_H = IMG_H + 6;   // card total height

      for (let i = 0; i < programs.length; i++) {
        const program = programs[i];
        const det = CAREER_DETAILS[program.id] ?? LEGACY_DETAILS[program.id] ?? CAREER_DETAILS.ventas_mercadotecnia;
        const isOnlineCard = program.modality === "online" || program.modality === "ONLINE";
        const coleg = isOnlineCard ? 1980 : det.cost;
        const inscFull = isOnlineCard ? 3600 : det.inscription;
        const inscDisc = Math.round(inscFull * 0.5);

        checkPage(CARD_H + 10);

        const cardY = y;

        // Card background
        doc.setFillColor(248, 248, 250);
        doc.roundedRect(M, cardY - 2, CW, CARD_H, 3, 3, "F");
        if (i === 0) {
          doc.setDrawColor(230, 180, 0);
          doc.setLineWidth(0.6);
          doc.roundedRect(M, cardY - 2, CW, CARD_H, 3, 3, "S");
        } else {
          doc.setDrawColor(220, 220, 225);
          doc.setLineWidth(0.3);
          doc.roundedRect(M, cardY - 2, CW, CARD_H, 3, 3, "S");
        }

        // ── Left: career image ──────────────────────────────────────────────
        if (careerImgData[i]) {
          doc.addImage(careerImgData[i] as string, "JPEG", M + 1, cardY - 1, IMG_W - 2, IMG_H - 2, undefined, "FAST");
        } else {
          doc.setFillColor(180, 185, 200);
          doc.rect(M + 1, cardY - 1, IMG_W - 2, IMG_H - 2, "F");
        }

        // Best match badge on top of image
        if (i === 0) {
          doc.setFillColor(230, 180, 0);
          doc.rect(M + 1, cardY - 1, IMG_W - 2, 7, "F");
          doc.setTextColor(0, 45, 98);
          doc.setFontSize(7);
          doc.setFont("helvetica", "bold");
          doc.text("MEJOR MATCH PARA TI", M + 1 + (IMG_W - 2) / 2, cardY + 3.5, { align: "center" });
        } else if (program.sector === sectorSecondary) {
          doc.setFillColor(0, 45, 98);
          doc.rect(M + 1, cardY - 1, IMG_W - 2, 7, "F");
          doc.setTextColor(255, 255, 255);
          doc.setFontSize(7);
          doc.setFont("helvetica", "bold");
          doc.text("OPCIÓN COMPLEMENTARIA", M + 1 + (IMG_W - 2) / 2, cardY + 3.5, { align: "center" });
        }

        // ── Right: details ──────────────────────────────────────────────────
        let ty = cardY + 6;

        // Career name (may wrap)
        doc.setTextColor(0, 45, 98);
        doc.setFontSize(11);
        doc.setFont("helvetica", "bold");
        const nameLines = doc.splitTextToSize(program.name, TCW) as string[];
        doc.text(nameLines, TX, ty);
        ty += nameLines.length * 5.5 + 2;

        // Modality & match pill
        doc.setFontSize(8.5);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(70, 70, 80);
        doc.text(`${modalityLabel(program.modality)}  ·  ${program.match_percent}% compatibilidad`, TX, ty);
        ty += 7;

        // Investment
        doc.setFontSize(8.5);
        doc.setTextColor(100, 100, 100);
        doc.text("Colegiatura:", TX, ty);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(30, 30, 30);
        doc.text(`$${coleg.toLocaleString()}/mes`, TX + 27, ty);
        ty += 6;

        doc.setFont("helvetica", "normal");
        doc.setTextColor(100, 100, 100);
        doc.text("Inscripción c/descuento:", TX, ty);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(22, 163, 74);
        doc.text(`$${inscDisc.toLocaleString()}`, TX + 46, ty);
        ty += 6;

        // Promo note
        doc.setFont("helvetica", "italic");
        doc.setFontSize(7.5);
        doc.setTextColor(110, 110, 110);
        const promoLines = doc.splitTextToSize(
          "Inscríbete antes del 31 de agosto y obtén 50% de descuento en tu inscripción.",
          TCW
        ) as string[];
        doc.text(promoLines, TX, ty);

        y = cardY + CARD_H + 6;
      }

      // ── Dictamen ───────────────────────────────────────────────────────────
      if (lead.dictamen_text) {
        checkPage(20);
        doc.setDrawColor(210, 210, 210);
        doc.setLineWidth(0.3);
        doc.line(M, y, PW - M, y);
        y += 7;

        doc.setTextColor(0, 45, 98);
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text("DICTAMEN VOCACIONAL", M, y);
        y += 7;

        doc.setFontSize(9.5);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(55, 55, 55);
        const lines = doc.splitTextToSize(lead.dictamen_text, CW);
        for (const line of lines) {
          checkPage(6);
          doc.text(line, M, y);
          y += 5;
        }
        y += 4;
      }

      // ── Dimensions ────────────────────────────────────────────────────────
      if (lead.dimensions) {
        checkPage(30);
        doc.setDrawColor(210, 210, 210);
        doc.line(M, y, PW - M, y);
        y += 7;
        doc.setTextColor(0, 45, 98);
        doc.setFontSize(11);
        doc.setFont("helvetica", "bold");
        doc.text("PERFIL DE DIMENSIONES", M, y);
        y += 6;
        const dimLabels: Record<string, string> = {
          INTERES_TECNOLOGIA: "Tecnología", INTERES_LEGAL: "Legal",
          INTERES_SALUD_BIENESTAR: "Salud", INTERES_NEGOCIOS: "Negocios",
          ANALISIS_LOGICO: "Análisis", HABILIDAD_SOCIAL: "Habilidad Social",
        };
        const sorted = Object.entries(lead.dimensions as Record<string, number>)
          .sort(([, a], [, b]) => b - a).slice(0, 6);
        for (const [key, val] of sorted) {
          checkPage(8);
          const label = dimLabels[key] ?? key;
          const pct = Math.round(val);
          doc.setFontSize(9);
          doc.setFont("helvetica", "normal");
          doc.setTextColor(60, 60, 60);
          doc.text(`${label}`, M, y);
          doc.setFillColor(220, 220, 230);
          doc.roundedRect(M + 40, y - 3.5, 80, 4.5, 1, 1, "F");
          doc.setFillColor(0, 45, 98);
          doc.roundedRect(M + 40, y - 3.5, Math.max(1, 80 * pct / 100), 4.5, 1, 1, "F");
          doc.setFont("helvetica", "bold");
          doc.text(`${pct}%`, M + 124, y);
          y += 7;
        }
      }

      // ── Footer bar ─────────────────────────────────────────────────────────
      const totalPages = (doc as any).internal.getNumberOfPages();
      for (let p = 1; p <= totalPages; p++) {
        doc.setPage(p);
        doc.setFillColor(0, 45, 98);
        doc.rect(0, 285, PW, 12, "F");
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(8);
        doc.setFont("helvetica", "normal");
        doc.text("Universidad Latino", M, 292);
        doc.text(`Página ${p} de ${totalPages}`, PW - M, 292, { align: "right" });
      }

      const filename = `perfil-vocacional-${(lead.nombre ?? "resultado").replace(/\s+/g, "-").toLowerCase()}.pdf`;
      doc.save(filename);
    } finally {
      setGeneratingPDF(false);
    }
  };

  const handleCopyLink = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      // fallback for older browsers
      const ta = document.createElement("textarea");
      ta.value = url;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleWhatsAppShare = () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    const text = encodeURIComponent(`¡Mira mi perfil vocacional de Universidad Latino! 🎓\n${url}`);
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  const topProgram = programs[0];
  const details = topProgram
    ? (CAREER_DETAILS[topProgram.id] ?? LEGACY_DETAILS[topProgram.id] ?? CAREER_DETAILS.ventas_mercadotecnia)
    : CAREER_DETAILS.ventas_mercadotecnia;

  const isOnline = topProgram?.modality === "online" || topProgram?.modality === "ONLINE";
  const baseTuition = isOnline ? 1980 : details.cost;
  const baseEnrollment = isOnline ? 3600 : details.inscription;
  const ahorroMensual = baseTuition * (scholarship.tuition_scholarship_percent / 100);
  const ahorroInscripcion = baseEnrollment * (scholarship.enrollment_discount_percent / 100);
  const totalAhorro = (ahorroMensual * 40) + (ahorroInscripcion * 8);

  return (
    <main className="min-h-screen bg-[#F4F4F4] pb-8">
      <style>{`
        @media print {
          @page { size: A4; margin: 12mm 14mm; }
          * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
          body { background: #fff !important; }
          .print-header { display: block !important; }
        }
        .print-header { display: none; }
      `}</style>
      {/* Print-only header */}
      <div className="print-header py-4 border-b border-gray-200 mb-4 flex items-center justify-between">
        <img
          src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/project-uploads/58874ed2-ae97-440c-b760-db483a0ae966/logo-horizontal-grande-2048x205-1769155392357.png?width=500&height=50&resize=contain"
          alt="Universidad Latino"
          style={{ height: 32 }}
        />
        <span style={{ fontSize: 11, color: "#666" }}>Perfil Vocacional · EVA v4.0 · {new Date().toLocaleDateString("es-MX")}</span>
      </div>
      <div className="print:hidden">
        <Header />
        <div className="fixed top-20 left-4 z-50">
          <a
            href="/"
            className="flex items-center gap-2 bg-white/90 backdrop-blur-sm text-[#002D62] text-sm font-semibold px-4 py-2 rounded-full shadow-md border border-gray-100 hover:bg-white hover:shadow-lg transition-all"
          >
            <ArrowRight className="w-4 h-4 rotate-180" />
            Volver al inicio
          </a>
        </div>
      </div>

      {/* Hero */}
      <section className="pt-32 pb-16 bg-[#002D62] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-white">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              <span className="bg-white/10 px-4 py-1.5 rounded-full text-sm font-semibold tracking-wider border border-white/10">
                TU PERFIL VOCACIONAL · EVA v4.0
              </span>
              <h1 className="text-4xl lg:text-6xl font-display font-bold">{lead.nombre}</h1>

              <div className="flex flex-wrap items-center gap-6 pt-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-[#E6B400] rounded-xl flex items-center justify-center text-2xl">
                    {SECTOR_ICONS[sectorPrimary] ?? "📊"}
                  </div>
                  <div>
                    <p className="text-white/60 text-xs font-medium uppercase">Sector Principal</p>
                    <p className="font-bold text-lg">{SECTOR_NAMES[sectorPrimary] ?? sectorPrimary}</p>
                  </div>
                </div>

                {sectorSecondary && (
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-2xl">
                      {SECTOR_ICONS[sectorSecondary] ?? "📚"}
                    </div>
                    <div>
                      <p className="text-white/60 text-xs font-medium uppercase">Sector Complementario</p>
                      <p className="font-bold text-lg">{SECTOR_NAMES[sectorSecondary] ?? sectorSecondary}</p>
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
                    <p className="font-bold text-lg">
                      {leadClass === "HOT" ? "Alta Prioridad" : leadClass === "WARM" ? "Interesado" : "Explorando"}
                    </p>
                  </div>
                </div>

                <div className="flex-1 min-w-[200px]">
                  <p className="text-white/60 text-xs font-medium uppercase mb-2">
                    Compatibilidad: {leadScore}/100
                  </p>
                  <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(leadScore, 100)}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className="h-full bg-[#E6B400]"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="container mx-auto px-4 -mt-12 relative z-20">
        <div className="max-w-5xl mx-auto space-y-12">

          {/* Career cards */}
          {programs.map((program, i) => {
            const det = CAREER_DETAILS[program.id] ?? LEGACY_DETAILS[program.id] ?? CAREER_DETAILS.ventas_mercadotecnia;
            const image = CAREER_IMAGES[program.id] ?? CAREER_IMAGES.ventas_mercadotecnia;
            const isSecondary = sectorSecondary && program.sector === sectorSecondary;

            return (
              <motion.div
                key={`career-${i}-${program.id}`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                className={`bg-white rounded-[2rem] shadow-2xl overflow-hidden border break-inside-avoid ${
                  i === 0 ? "border-[#E6B400] ring-2 ring-[#E6B400]/20" : "border-gray-100"
                }`}
              >
                {i === 0 && (
                  <div className="bg-gradient-to-r from-[#E6B400] to-[#CC9F00] text-[#002D62] px-6 py-2 text-center font-bold text-sm">
                    ⭐ MEJOR MATCH PARA TI
                  </div>
                )}
                {isSecondary && i > 0 && (
                  <div className="bg-gradient-to-r from-[#002D62] to-[#004080] text-white px-6 py-2 text-center font-bold text-sm">
                    🔄 OPCIÓN DEL SECTOR COMPLEMENTARIO
                  </div>
                )}

                <div className="grid lg:grid-cols-[40%_60%]">
                  <div className="relative h-64 lg:h-auto">
                    <img src={image} alt={program.name} className="absolute inset-0 w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent lg:hidden" />
                  </div>

                  <div className="p-8 lg:p-12 space-y-8">
                    <div className="flex justify-between items-start">
                      <div>
                        <h2 className="text-2xl lg:text-3xl font-display font-bold text-gray-900 leading-tight">
                          {SECTOR_ICONS[program.sector] ?? "📚"} {program.name}
                        </h2>
                        <div className="flex flex-wrap items-center gap-3 mt-3">
                          <span className="bg-[#002D62]/5 text-[#002D62] px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                            <MapPin className="w-3 h-3" /> {modalityLabel(program.modality)}
                          </span>
                          <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                            <GraduationCap className="w-3 h-3" /> RVOE SEP Federal
                          </span>
                        </div>
                      </div>
                      <div className="w-16 h-16 relative shrink-0">
                        <svg className="w-full h-full" viewBox="0 0 36 36">
                          <path className="text-gray-100" stroke="currentColor" strokeDasharray="100, 100" strokeWidth="3" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                          <motion.path
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: program.match_percent / 100 }}
                            transition={{ duration: 1.5, delay: 0.8 }}
                            className="text-[#002D62]"
                            stroke="currentColor"
                            strokeDasharray={`${program.match_percent}, 100`}
                            strokeWidth="3"
                            strokeLinecap="round"
                            fill="none"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-sm font-bold text-[#002D62]">{program.match_percent}%</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-500" /> Por qué es ideal para ti:
                        </h4>
                        <ul className="space-y-2">
                          {det.reasons.map((r, j) => (
                            <li key={j} className="text-gray-600 text-sm flex items-center gap-2">
                              <span className="w-1 h-1 bg-gray-300 rounded-full" /> {r}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="space-y-4">
                        <h4 className="font-semibold text-gray-900">📚 Plan de Estudios:</h4>
                        <ul className="space-y-2">
                          {det.studyPlan.map((p, j) => (
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
                          <p className="text-xl font-bold text-gray-900">
                            ${(program.modality === "online" || program.modality === "ONLINE" ? 1980 : det.cost).toLocaleString()}/mes
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs">Inscripción regular</p>
                          <p className="text-xl font-bold text-gray-400 line-through">
                            ${(program.modality === "online" || program.modality === "ONLINE" ? 3600 : det.inscription).toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-bold text-green-700 uppercase tracking-wide">Inscripción con descuento</p>
                          <p className="text-xl font-bold text-green-700">
                            ${Math.round((program.modality === "online" || program.modality === "ONLINE" ? 3600 : det.inscription) * 0.5).toLocaleString()}
                          </p>
                        </div>
                      </div>

                      <div className="border border-gray-100 rounded-xl px-4 py-3 print:hidden">
                        <p className="text-sm text-gray-600">
                          Inscríbete antes del{" "}
                          <strong className="text-[#002D62]">31 de agosto</strong>{" "}
                          y obtén{" "}
                          <strong className="text-green-700">50% de descuento en tu inscripción.</strong>
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3 print:hidden">
                      <div className="flex items-center gap-2">
                        <motion.div
                          animate={{ y: [0, 5, 0] }}
                          transition={{ repeat: Infinity, duration: 1, ease: "easeInOut" }}
                        >
                          <ArrowRight className="w-5 h-5 rotate-90 text-[#E6B400]" />
                        </motion.div>
                        <p className="text-sm font-semibold text-gray-500">
                          Habla con un asesor para activar tu descuento hoy
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-4">
                        <button className="flex-1 min-w-[200px] bg-[#E6B400] hover:bg-[#CC9F00] text-[#002D62] font-bold py-4 rounded-xl shadow-lg hover:shadow-[#E6B400]/40 transition-all flex items-center justify-center gap-2 text-base">
                          <MessageCircle className="w-5 h-5" /> Hablar con un Asesor
                        </button>
                        <button
                          onClick={handleDownloadPDF}
                          disabled={generatingPDF}
                          className="px-6 py-4 border-2 border-gray-100 text-gray-600 font-bold rounded-xl hover:bg-gray-50 transition-all flex items-center gap-2 disabled:opacity-60 disabled:cursor-wait"
                        >
                          <Download className="w-5 h-5" />
                          {generatingPDF ? "Generando…" : "Descargar PDF"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}

          {/* Dictamen */}
          <section className="bg-white p-8 lg:p-12 rounded-[2rem] shadow-xl space-y-8 break-inside-avoid">
            <h2 className="text-2xl font-display font-bold text-gray-900 flex items-center gap-3">
              <Sparkles className="text-[#002D62]" /> DICTAMEN VOCACIONAL
            </h2>
            <div className="prose prose-lg text-gray-600 max-w-none leading-relaxed">
              <p>{lead.dictamen_text}</p>
            </div>

            {lead.dimensions && (
              <div className="pt-6 border-t border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-4">Perfil de dimensiones:</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {Object.entries(lead.dimensions as Record<string, number>)
                    .sort(([, a], [, b]) => b - a)
                    .slice(0, 6)
                    .map(([key, value]) => {
                      const labels: Record<string, string> = {
                        INTERES_TECNOLOGIA: "Tecnología",
                        INTERES_LEGAL: "Legal",
                        INTERES_SALUD_BIENESTAR: "Salud",
                        INTERES_NEGOCIOS: "Negocios",
                        ANALISIS_LOGICO: "Análisis",
                        HABILIDAD_SOCIAL: "Habilidad Social",
                        // v3 legacy
                        A_ANALITICO: "Analítico",
                        A_EMPATICO: "Empático",
                        A_PRACTICO: "Práctico",
                        A_AUTOGESTION: "Autogestión",
                      };
                      const pct = Math.round(value);
                      return (
                        <div key={key} className="bg-gray-50 p-4 rounded-xl">
                          <p className="text-sm text-gray-500">{labels[key] ?? key}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div className="h-full bg-[#002D62]" style={{ width: `${pct}%` }} />
                            </div>
                            <span className="text-sm font-bold text-gray-700">{pct}%</span>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}
          </section>

          {/* CTA */}
          <section className="bg-[#002D62] text-white p-8 lg:p-12 rounded-[2rem] shadow-2xl space-y-8 print:hidden">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-display font-bold">¿Todo listo para el siguiente paso?</h2>
              <p className="text-white/70">Elige cómo quieres continuar:</p>
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              <button
                onClick={() => {
                  const career = programs[0]?.name ?? "la carrera";
                  const msg = encodeURIComponent(`Hola, acabo de completar el test vocacional. Soy ${lead.nombre ?? ""} y me interesa conocer más sobre ${career}. ¿Pueden orientarme?`);
                  window.open(`https://wa.me/529996442662?text=${msg}`, "_blank");
                }}
                className="bg-[#25D366] hover:bg-[#128C7E] text-white p-6 rounded-2xl transition-colors flex flex-col items-center gap-3"
              >
                <MessageCircle className="w-8 h-8" />
                <span className="font-bold">WhatsApp</span>
                <span className="text-sm opacity-80">Respuesta inmediata</span>
              </button>
              <button
                onClick={() => {
                  const career = programs[0]?.name ?? "una carrera";
                  const msg = encodeURIComponent(`Hola, soy ${lead.nombre ?? ""} y quiero agendar una visita al campus para conocer la carrera de ${career}. ¿Cuándo pueden atenderme?`);
                  window.open(`https://wa.me/529996442662?text=${msg}`, "_blank");
                }}
                className="bg-[#E6B400] hover:bg-[#CC9F00] text-[#002D62] p-6 rounded-2xl transition-colors flex flex-col items-center gap-3"
              >
                <Calendar className="w-8 h-8" />
                <span className="font-bold">Agendar Cita</span>
                <span className="text-sm opacity-80">Visita al campus</span>
              </button>
              {/* Mobile: tel: link abre el marcador directo */}
              <a
                href="tel:+529996442662"
                className="md:hidden bg-white/10 hover:bg-white/20 text-white p-6 rounded-2xl transition-colors flex flex-col items-center gap-3 border border-white/20 no-underline"
              >
                <Phone className="w-8 h-8" />
                <span className="font-bold">Llamar Ahora</span>
                <span className="text-sm opacity-80">Habla con un asesor</span>
              </a>
              {/* Desktop: muestra el número para marcarlo desde su teléfono */}
              <button
                onClick={() => setShowPhone(v => !v)}
                className="hidden md:flex bg-white/10 hover:bg-white/20 text-white p-6 rounded-2xl transition-all flex-col items-center gap-2 border border-white/20 w-full"
              >
                <Phone className="w-8 h-8" />
                <span className="font-bold">Llamar Ahora</span>
                {showPhone ? (
                  <span className="text-lg font-mono font-bold text-[#E6B400] tracking-widest mt-1">
                    999 152 5583
                  </span>
                ) : (
                  <span className="text-sm opacity-80">Ver número</span>
                )}
              </button>
            </div>
          </section>

          <div className="flex flex-col items-center gap-3 py-4 print:hidden">
            <p className="text-gray-400 text-sm font-medium">Comparte tus resultados:</p>
            <div className="flex gap-4">
              <button
                onClick={handleCopyLink}
                title={copied ? "¡Copiado!" : "Copiar link"}
                className="relative w-12 h-12 bg-white rounded-full shadow-md flex items-center justify-center transition-colors hover:text-[#002D62] text-gray-400"
              >
                <Share2 className="w-5 h-5" />
                {copied && (
                  <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs rounded px-2 py-1 whitespace-nowrap">
                    ¡Copiado!
                  </span>
                )}
              </button>
              <button
                onClick={handleWhatsAppShare}
                title="Compartir por WhatsApp"
                className="w-12 h-12 bg-white rounded-full shadow-md flex items-center justify-center text-gray-400 hover:text-[#25D366] transition-colors"
              >
                <Smartphone className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <footer className="py-8 bg-white text-center text-sm border-t border-gray-100 mt-6">
        <div className="container mx-auto px-4">
          <img
            src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/project-uploads/58874ed2-ae97-440c-b760-db483a0ae966/logo-horizontal-grande-2048x205-1769155392357.png?width=500&height=50&resize=contain"
            alt="Universidad Latino"
            className="h-10 w-auto mx-auto mb-8"
          />
          <p className="text-[#002D62] font-semibold">
            © {new Date().getFullYear()} Universidad Latino. Todos los derechos reservados.
          </p>
          <div className="flex justify-center gap-6 mt-4">
            <a href="#" className="text-gray-400 hover:text-[#002D62] transition-colors">Aviso de Privacidad</a>
            <a href="#" className="text-gray-400 hover:text-[#002D62] transition-colors">Términos y Condiciones</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
