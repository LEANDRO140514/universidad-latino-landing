import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

const PROGRAMS = [
  {
    id: "P_NUTRICION",
    name: "Licenciatura en Nutrición",
    sector: "SALUD",
    mode: "PRESENCIAL",
    period: "SEMESTRAL",
    duration: "4 años",
    online_allowed: false,
    sabatina_allowed: false
  },
  {
    id: "P_ENFERMERIA",
    name: "Licenciatura en Enfermería",
    sector: "SALUD",
    mode: "PRESENCIAL",
    period: "SEMESTRAL",
    duration: "4 años",
    online_allowed: false,
    sabatina_allowed: false
  },
  {
    id: "P_PSICOLOGIA",
    name: "Licenciatura en Psicología",
    sector: "SALUD",
    mode: "PRESENCIAL",
    period: "SEMESTRAL",
    duration: "4 años",
    online_allowed: false,
    sabatina_allowed: false
  },
  {
    id: "P_GASTRONOMIA",
    name: "Licenciatura en Gastronomía",
    sector: "SALUD",
    mode: "PRESENCIAL",
    period: "SEMESTRAL",
    duration: "4 años",
    online_allowed: false,
    sabatina_allowed: false
  },
  {
    id: "P_VENTAS_MKT",
    name: "Licenciatura en Ventas y Mercadotecnia",
    sector: "NEGOCIOS",
    mode: "PRESENCIAL",
    period: "CUATRIMESTRAL",
    duration: "3 años 4 meses",
    online_allowed: true,
    sabatina_allowed: false
  },
  {
    id: "P_NEGOCIOS_INT",
    name: "Licenciatura en Negocios Internacionales",
    sector: "NEGOCIOS",
    mode: "PRESENCIAL",
    period: "CUATRIMESTRAL",
    duration: "3 años 4 meses",
    online_allowed: false,
    sabatina_allowed: false
  },
  {
    id: "P_DERECHO",
    name: "Licenciatura en Derecho",
    sector: "DERECHO",
    mode: "PRESENCIAL",
    period: "CUATRIMESTRAL",
    duration: "4 años",
    online_allowed: true,
    sabatina_allowed: false
  },
  {
    id: "P_SISTEMAS",
    name: "Ingeniería en Sistemas Computacionales",
    sector: "TECNOLOGIA",
    mode: "PRESENCIAL",
    period: "CUATRIMESTRAL",
    duration: "3 años 8 meses",
    online_allowed: false,
    sabatina_allowed: false
  },
  {
    id: "P_ADMIN_SAB",
    name: "Licenciatura en Administración (Sabatina)",
    sector: "NEGOCIOS",
    mode: "SABATINA",
    period: "SEMESTRAL",
    duration: "4 años",
    online_allowed: false,
    sabatina_allowed: true
  },
  {
    id: "P_ADMIN_DEV_EMP",
    name: "Licenciatura en Administración y Desarrollo Empresarial",
    sector: "NEGOCIOS",
    mode: "ONLINE",
    period: "SEMESTRAL",
    duration: "4 años",
    online_allowed: true,
    sabatina_allowed: false
  }
];

function calculateDimensions(data: Record<string, any>) {
  return {
    I_SALUD: data.A1 || 3,
    I_SOCIAL: data.A2 || 3,
    I_NEGOCIOS: data.A3 || 3,
    I_TECNOLOGIA: data.A4 || 3,
    A_ANALITICO: data.B1 || 3,
    A_EMPATICO: data.B2 || 3,
    A_PRACTICO: data.B3 || 3,
    A_AUTOGESTION: data.B4 || 3,
    V_RESPONSABILIDADES: data.C1 || 3,
    V_REMOTO: data.C2 || 3,
    V_FINDE: data.C3 || 3,
    M_CLARIDAD_META: data.D1 || 3,
    M_COMPROMISO: data.D2 || 3,
    C_URGENCIA: { "ASAP": 5, "ESTE_ANIO": 4, "6_12": 3, "EXPLORANDO": 2 }[data.urgencia] || 3,
    C_PROMEDIO: { "EXCELENTE": 5, "MUY_BUENO": 4, "BUENO": 3, "REGULAR": 2, "NO_DIGO": 3 }[data.promedio] || 3
  };
}

function calculateSectorScores(dims: Record<string, number>) {
  return {
    SALUD: dims.I_SALUD * 1.0 + dims.A_PRACTICO * 0.3 + dims.A_EMPATICO * 0.2,
    SOCIAL: dims.I_SOCIAL * 1.0 + dims.A_EMPATICO * 0.4,
    NEGOCIOS: dims.I_NEGOCIOS * 1.0 + dims.A_ANALITICO * 0.3,
    TECNOLOGIA: dims.I_TECNOLOGIA * 1.0 + dims.A_ANALITICO * 0.5,
    DERECHO: dims.I_NEGOCIOS * 0.3 + dims.A_ANALITICO * 0.6 + dims.M_CLARIDAD_META * 0.3
  };
}

function calculateProgramScores(dims: Record<string, number>) {
  const scores: Record<string, number> = {
    P_NUTRICION: dims.I_SALUD * 1.0 + dims.A_ANALITICO * 0.3,
    P_ENFERMERIA: dims.I_SALUD * 0.9 + dims.A_PRACTICO * 0.4 + dims.A_EMPATICO * 0.2,
    P_PSICOLOGIA: dims.I_SOCIAL * 0.9 + dims.A_EMPATICO * 0.6,
    P_GASTRONOMIA: dims.I_SALUD * 0.7 + dims.A_PRACTICO * 0.5,
    P_VENTAS_MKT: dims.I_NEGOCIOS * 1.0 + dims.A_AUTOGESTION * 0.2 + dims.A_ANALITICO * 0.2,
    P_NEGOCIOS_INT: dims.I_NEGOCIOS * 0.9 + dims.A_ANALITICO * 0.5,
    P_DERECHO: dims.I_NEGOCIOS * 0.3 + dims.A_ANALITICO * 0.6 + dims.M_CLARIDAD_META * 0.3,
    P_SISTEMAS: dims.I_TECNOLOGIA * 1.0 + dims.A_ANALITICO * 0.6,
    P_ADMIN_SAB: dims.I_NEGOCIOS * 0.8 + dims.V_FINDE * 0.6 + dims.V_RESPONSABILIDADES * 0.2,
    P_ADMIN_DEV_EMP: dims.I_NEGOCIOS * 0.8 + dims.V_REMOTO * 0.6 + dims.A_AUTOGESTION * 0.4
  };
  return scores;
}

function scoreToMatchPercent(score: number): number {
  const minScore = 1.0;
  const maxScore = 8.0;
  const minPercent = 70;
  const maxPercent = 96;
  const normalized = Math.min(Math.max((score - minScore) / (maxScore - minScore), 0), 1);
  return Math.round(minPercent + normalized * (maxPercent - minPercent));
}

function determineModality(program: typeof PROGRAMS[0], dims: Record<string, number>): string {
  if (!program.online_allowed && !program.sabatina_allowed) {
    return "PRESENCIAL";
  }
  
  if (program.online_allowed && dims.V_REMOTO >= 4 && dims.A_AUTOGESTION >= 4) {
    return "ONLINE";
  }
  
  if (program.sabatina_allowed && dims.V_FINDE >= 4 && dims.V_RESPONSABILIDADES >= 3) {
    return "SABATINA";
  }
  
  return program.mode;
}

function calculateLeadScore(dims: Record<string, number>, topProgramScore: number): number {
  const normalize = (val: number, min: number, max: number) => 
    Math.min(Math.max((val - min) / (max - min), 0), 1) * 100;
  
  const vocationalCompat = normalize(topProgramScore, 1, 8) * 0.45;
  const avgPersistence = (dims.A_AUTOGESTION + dims.M_COMPROMISO + dims.M_CLARIDAD_META) / 3;
  const persistenceScore = normalize(avgPersistence, 1, 5) * 0.25;
  const urgencyScore = normalize(dims.C_URGENCIA, 2, 5) * 0.20;
  const performanceScore = normalize(dims.C_PROMEDIO, 2, 5) * 0.10;
  
  return Math.round(vocationalCompat + persistenceScore + urgencyScore + performanceScore);
}

function classifyLead(score: number): string {
  if (score >= 85) return "HOT";
  if (score >= 65) return "WARM";
  return "COLD";
}

function generateDictamen(
  nombre: string,
  sectorPrimary: string,
  dims: Record<string, number>,
  topProgram: typeof PROGRAMS[0],
  modality: string
): string {
  const sectorNames: Record<string, string> = {
    SALUD: "Salud y Bienestar",
    SOCIAL: "Ciencias Sociales",
    NEGOCIOS: "Negocios y Gestión",
    TECNOLOGIA: "Tecnología e Innovación",
    DERECHO: "Derecho y Ciencias Jurídicas"
  };

  const strengths: string[] = [];
  if (dims.A_ANALITICO >= 4) strengths.push("capacidad analítica");
  if (dims.A_EMPATICO >= 4) strengths.push("sensibilidad interpersonal");
  if (dims.A_PRACTICO >= 4) strengths.push("orientación práctica");
  if (dims.A_AUTOGESTION >= 4) strengths.push("autonomía y autogestión");
  
  const strength1 = strengths[0] || "interés vocacional definido";
  const strength2 = strengths[1] || "compromiso académico";

  const modalityText = modality === "ONLINE" 
    ? "Dado tu nivel de autonomía y preferencia por estudiar a distancia, la modalidad en línea resulta una opción adecuada."
    : modality === "SABATINA"
    ? "Por tu disponibilidad de fin de semana y carga entre semana, el esquema sabatino facilita continuidad."
    : "Por el componente práctico y el tipo de formación requerida, esta licenciatura se desarrolla en modalidad presencial.";

  return `${nombre}, con base en tus respuestas, se identifica una afinidad predominante hacia el área de ${sectorNames[sectorPrimary] || sectorPrimary}. Tu perfil combina ${strength1} y ${strength2}, lo que favorece un desempeño sólido en trayectos formativos con aplicación real. La opción con mayor compatibilidad es ${topProgram.name}, dentro de la modalidad ${modality} y periodo ${topProgram.period}. ${modalityText}`;
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    
    const dimensions = calculateDimensions(data);
    const sectorScores = calculateSectorScores(dimensions);
    const programScores = calculateProgramScores(dimensions);
    
    const sortedSectors = Object.entries(sectorScores)
      .sort(([,a], [,b]) => b - a);
    const sectorPrimary = sortedSectors[0][0];
    const sectorSecondary = (sortedSectors[0][1] - sortedSectors[1][1]) <= 0.5 
      ? sortedSectors[1][0] 
      : null;
    
    const sortedPrograms = Object.entries(programScores)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3);
    
    const topPrograms = sortedPrograms.map(([programId, score]) => {
      const program = PROGRAMS.find(p => p.id === programId)!;
      const modality = determineModality(program, dimensions);
      return {
        program_id: programId,
        program_name: program.name,
        sector: program.sector,
        mode: modality,
        period: program.period,
        duration: program.duration,
        match_percent: scoreToMatchPercent(score),
        raw_score: score
      };
    });

    const leadScore = calculateLeadScore(dimensions, sortedPrograms[0][1]);
    const leadClass = classifyLead(leadScore);
    
    const topProgram = PROGRAMS.find(p => p.id === topPrograms[0].program_id)!;
    const dictamenText = generateDictamen(
      data.nombre,
      sectorPrimary,
      dimensions,
      topProgram,
      topPrograms[0].mode
    );

    const becaMap: Record<string, string> = {
      'EXCELENTE': 'EXCELENCIA (40-50%)',
      'MUY_BUENO': 'MÉRITO ALTO (30-40%)',
      'BUENO': 'MÉRITO MEDIO (20-30%)',
      'REGULAR': 'BÁSICA (15-20%)',
      'NO_DIGO': 'BÁSICA (15-20%)'
    };
    const beca = becaMap[data.promedio] || 'BÁSICA (15-20%)';

    const { data: lead, error } = await supabase
      .from('leads')
      .insert([{
        nombre: data.nombre,
        email: data.email,
        telefono: data.telefono,
        urgencia: data.urgencia,
        promedio: data.promedio,
        responses: data,
        dimensions,
        sector_primary: sectorPrimary,
        sector_secondary: sectorSecondary,
        score: leadScore,
        lead_class: leadClass,
        classification: leadClass,
        top_programs: topPrograms,
        dictamen_text: dictamenText,
        beca_elegible: beca
      }])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ 
      success: true, 
      leadId: lead.id,
      preview: {
        sector: sectorPrimary,
        topProgram: topPrograms[0].program_name,
        matchPercent: topPrograms[0].match_percent,
        leadClass
      }
    });
  } catch (error: any) {
    console.error("Submission error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
