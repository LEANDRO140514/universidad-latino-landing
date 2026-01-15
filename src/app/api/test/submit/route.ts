import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

type Program = {
  id: string;
  name: string;
  sector: string;
  modalities: { mode: string; period: string; duration: string }[];
};

const PROGRAMS: Program[] = [
  {
    id: "P_VENTAS_MKT",
    name: "Licenciatura en Ventas y Mercadotecnia",
    sector: "NEGOCIOS",
    modalities: [
      { mode: "PRESENCIAL", period: "CUATRIMESTRAL", duration: "3 años 4 meses" },
      { mode: "ONLINE", period: "SEMESTRAL", duration: "4 años" }
    ]
  },
  {
    id: "P_NEGOCIOS_INT",
    name: "Licenciatura en Negocios Internacionales",
    sector: "NEGOCIOS",
    modalities: [
      { mode: "PRESENCIAL", period: "CUATRIMESTRAL", duration: "3 años 4 meses" }
    ]
  },
  {
    id: "P_GASTRONOMIA",
    name: "Licenciatura en Gastronomía",
    sector: "SALUD",
    modalities: [
      { mode: "PRESENCIAL", period: "SEMESTRAL", duration: "4 años" }
    ]
  },
  {
    id: "P_NUTRICION",
    name: "Licenciatura en Nutrición",
    sector: "SALUD",
    modalities: [
      { mode: "PRESENCIAL", period: "SEMESTRAL", duration: "4 años" }
    ]
  },
  {
    id: "P_ENFERMERIA",
    name: "Licenciatura en Enfermería",
    sector: "SALUD",
    modalities: [
      { mode: "PRESENCIAL", period: "SEMESTRAL", duration: "4 años" }
    ]
  },
  {
    id: "P_PSICOLOGIA",
    name: "Licenciatura en Psicología",
    sector: "SALUD",
    modalities: [
      { mode: "PRESENCIAL", period: "SEMESTRAL", duration: "4 años" }
    ]
  },
  {
    id: "P_DERECHO",
    name: "Licenciatura en Derecho",
    sector: "DERECHO",
    modalities: [
      { mode: "PRESENCIAL", period: "CUATRIMESTRAL", duration: "4 años" },
      { mode: "ONLINE", period: "SEMESTRAL", duration: "4 años" }
    ]
  },
  {
    id: "P_SISTEMAS",
    name: "Ingeniería en Sistemas Computacionales",
    sector: "TECNOLOGIA",
    modalities: [
      { mode: "PRESENCIAL", period: "CUATRIMESTRAL", duration: "3 años 8 meses" }
    ]
  },
  {
    id: "P_ADMIN_SAB",
    name: "Licenciatura en Administración (Sabatina)",
    sector: "NEGOCIOS",
    modalities: [
      { mode: "SABATINA", period: "SEMESTRAL", duration: "4 años" }
    ]
  },
  {
    id: "P_ADMIN_DEV_EMP",
    name: "Licenciatura en Administración y Desarrollo Empresarial",
    sector: "NEGOCIOS",
    modalities: [
      { mode: "ONLINE", period: "SEMESTRAL", duration: "4 años" }
    ]
  }
];

function calculateDimensions(data: Record<string, any>) {
  return {
    I_SALUD: data.Q01 || 3,
    I_SOCIAL: data.Q02 || 3,
    I_NEGOCIOS: data.Q03 || 3,
    I_TECNOLOGIA: data.Q04 || 3,
    A_ANALITICO: data.Q05 || 3,
    A_EMPATICO: data.Q06 || 3,
    A_PRACTICO: data.Q07 || 3,
    A_AUTOGESTION: data.Q08 || 3,
    V_RESPONSABILIDADES: data.Q09 || 3,
    V_REMOTO: data.Q10 || 3,
    V_FINDE: data.Q11 || 3,
    LS_PERSISTENCIA: data.Q12 || 3,
    LS_APRENDIZAJE: data.Q13 || 3,
    LS_ESTRUCTURA: data.Q14 || 3,
    AI_RELATION: data.Q15 || 3,
    C_URGENCIA: data.Q16 || { "ASAP": 5, "ESTE_ANIO": 4, "6_12": 3, "EXPLORANDO": 2 }[data.urgencia] || 3,
    C_PROMEDIO: data.Q17 || { "EXCELENTE": 5, "MUY_BUENO": 4, "BUENO": 3, "REGULAR": 2, "NO_DIGO": 3 }[data.promedio] || 3,
    M_CLARIDAD_META: 3,
    M_COMPROMISO: 3
  };
}

function calculateSectorScores(dims: Record<string, number>) {
  return {
    SALUD: dims.I_SALUD * 1.0 + dims.A_PRACTICO * 0.30 + dims.A_EMPATICO * 0.20 + dims.I_SOCIAL * 0.30,
    NEGOCIOS: dims.I_NEGOCIOS * 1.0 + dims.A_ANALITICO * 0.30 + dims.A_AUTOGESTION * 0.15,
    TECNOLOGIA: dims.I_TECNOLOGIA * 1.0 + dims.A_ANALITICO * 0.55,
    DERECHO: dims.A_ANALITICO * 0.55 + dims.M_CLARIDAD_META * 0.25 + dims.I_NEGOCIOS * 0.20
  };
}

function checkCohesionGate(sector: string, dims: Record<string, number>): boolean {
  const gates: Record<string, { mustAll?: { dim: string; value: number }[]; mustAny?: { dim: string; value: number }[] }> = {
    SALUD: {
      mustAll: [{ dim: "I_SALUD", value: 3 }],
      mustAny: [{ dim: "A_PRACTICO", value: 3 }, { dim: "A_EMPATICO", value: 3 }]
    },
    NEGOCIOS: {
      mustAll: [{ dim: "I_NEGOCIOS", value: 3 }],
      mustAny: [{ dim: "A_ANALITICO", value: 3 }, { dim: "A_AUTOGESTION", value: 3 }]
    },
    TECNOLOGIA: {
      mustAll: [{ dim: "I_TECNOLOGIA", value: 3 }, { dim: "A_ANALITICO", value: 3 }]
    },
    DERECHO: {
      mustAny: [{ dim: "A_ANALITICO", value: 3 }, { dim: "M_CLARIDAD_META", value: 3 }]
    }
  };

  const gate = gates[sector];
  if (!gate) return true;

  if (gate.mustAll) {
    const allPass = gate.mustAll.every(cond => dims[cond.dim] >= cond.value);
    if (!allPass) return false;
  }

  if (gate.mustAny) {
    const anyPass = gate.mustAny.some(cond => dims[cond.dim] >= cond.value);
    if (!anyPass) return false;
  }

  return true;
}

function calculateProgramScores(dims: Record<string, number>, sector: string) {
  const formulas: Record<string, Record<string, { dim: string; mul: number }[]>> = {
    SALUD: {
      P_NUTRICION: [
        { dim: "I_SALUD", mul: 1.0 },
        { dim: "A_ANALITICO", mul: 0.30 },
        { dim: "A_PRACTICO", mul: 0.15 }
      ],
      P_ENFERMERIA: [
        { dim: "I_SALUD", mul: 0.90 },
        { dim: "A_PRACTICO", mul: 0.45 },
        { dim: "A_EMPATICO", mul: 0.20 }
      ],
      P_PSICOLOGIA: [
        { dim: "I_SOCIAL", mul: 0.70 },
        { dim: "A_EMPATICO", mul: 0.65 },
        { dim: "M_CLARIDAD_META", mul: 0.10 }
      ],
      P_GASTRONOMIA: [
        { dim: "I_SALUD", mul: 0.70 },
        { dim: "A_PRACTICO", mul: 0.55 }
      ]
    },
    NEGOCIOS: {
      P_VENTAS_MKT: [
        { dim: "I_NEGOCIOS", mul: 1.0 },
        { dim: "A_AUTOGESTION", mul: 0.25 },
        { dim: "A_ANALITICO", mul: 0.20 }
      ],
      P_NEGOCIOS_INT: [
        { dim: "I_NEGOCIOS", mul: 0.85 },
        { dim: "A_ANALITICO", mul: 0.60 }
      ],
      P_ADMIN_SAB: [
        { dim: "I_NEGOCIOS", mul: 0.80 },
        { dim: "V_FINDE", mul: 0.65 },
        { dim: "V_RESPONSABILIDADES", mul: 0.20 }
      ],
      P_ADMIN_DEV_EMP: [
        { dim: "I_NEGOCIOS", mul: 0.80 },
        { dim: "V_REMOTO", mul: 0.65 },
        { dim: "A_AUTOGESTION", mul: 0.45 }
      ]
    },
    DERECHO: {
      P_DERECHO: [
        { dim: "A_ANALITICO", mul: 0.65 },
        { dim: "M_CLARIDAD_META", mul: 0.35 }
      ]
    },
    TECNOLOGIA: {
      P_SISTEMAS: [
        { dim: "I_TECNOLOGIA", mul: 1.0 },
        { dim: "A_ANALITICO", mul: 0.70 },
        { dim: "A_AUTOGESTION", mul: 0.15 }
      ]
    }
  };

  const sectorFormulas = formulas[sector] || {};
  const scores: Record<string, number> = {};

  for (const [programId, formula] of Object.entries(sectorFormulas)) {
    scores[programId] = formula.reduce((sum, { dim, mul }) => sum + (dims[dim] || 0) * mul, 0);
  }

  return scores;
}

function scoreToMatchPercent(score: number): number {
  const minScore = 1.0;
  const maxScore = 5.0;
  const minPercent = 70;
  const maxPercent = 96;
  const normalized = Math.min(Math.max((score - minScore) / (maxScore - minScore), 0), 1);
  return Math.round(minPercent + normalized * (maxPercent - minPercent));
}

function determineModality(program: Program, dims: Record<string, number>): { mode: string; period: string; duration: string } {
  const modalities = program.modalities;
  
  if (modalities.length === 1) {
    return modalities[0];
  }

  const hasSabatina = modalities.find(m => m.mode === "SABATINA");
  if (hasSabatina && dims.V_FINDE >= 4 && dims.V_RESPONSABILIDADES >= 3) {
    return hasSabatina;
  }

  const hasOnline = modalities.find(m => m.mode === "ONLINE");
  if (hasOnline && dims.V_REMOTO >= 4 && dims.A_AUTOGESTION >= 4) {
    return hasOnline;
  }

  const hasPresencial = modalities.find(m => m.mode === "PRESENCIAL");
  return hasPresencial || modalities[0];
}

function calculateLeadScore(dims: Record<string, number>, topProgramScore: number): number {
  const normalize = (val: number, min: number, max: number) => 
    Math.min(Math.max((val - min) / (max - min), 0), 1) * 100;
  
  const vocationalCompat = normalize(topProgramScore, 1, 5) * 0.45;
  const avgPersistence = (dims.A_AUTOGESTION + dims.LS_PERSISTENCIA + dims.M_COMPROMISO) / 3;
  const persistenceScore = normalize(avgPersistence, 1, 5) * 0.22;
  const urgencyScore = normalize(dims.C_URGENCIA, 2, 5) * 0.20;
  const performanceScore = normalize(dims.C_PROMEDIO, 2, 5) * 0.08;
  const aiRelationScore = normalize(dims.AI_RELATION, 1, 5) * 0.05;
  
  return Math.round(vocationalCompat + persistenceScore + urgencyScore + performanceScore + aiRelationScore);
}

function classifyLead(score: number): string {
  if (score >= 85) return "HOT";
  if (score >= 65) return "WARM";
  return "COLD";
}

function getStrengthPhrases(dims: Record<string, number>): string[] {
  const phrases: string[] = [];
  if (dims.A_ANALITICO >= 4) phrases.push("capacidad para analizar situaciones y estructurar soluciones");
  if (dims.A_EMPATICO >= 4) phrases.push("habilidad para comprender necesidades y comunicarte con sensibilidad");
  if (dims.A_PRACTICO >= 4) phrases.push("preferencia por aprender a través de práctica y aplicación");
  if (dims.A_AUTOGESTION >= 4) phrases.push("autonomía para sostener un plan académico con constancia");
  
  if (phrases.length === 0) {
    phrases.push("interés vocacional definido", "compromiso con tu formación");
  }
  
  return phrases;
}

function getLearningStylePhrase(dims: Record<string, number>): string {
  if (dims.A_PRACTICO >= 4) return "aprendizaje con componente aplicado y experiencias formativas reales";
  if (dims.A_ANALITICO >= 4) return "análisis, razonamiento y estructura en el estudio";
  return "equilibrio entre teoría, práctica y seguimiento académico";
}

function generateDictamen(
  nombre: string,
  sectorPrimary: string,
  sectorSecondary: string | null,
  dims: Record<string, number>,
  topPrograms: any[],
  isMixed: boolean
): string {
  const sectorNames: Record<string, string> = {
    SALUD: "Salud y Bienestar",
    NEGOCIOS: "Negocios y Gestión",
    TECNOLOGIA: "Tecnología e Innovación",
    DERECHO: "Derecho y Ciencias Jurídicas"
  };

  const strengths = getStrengthPhrases(dims);
  const strength1 = strengths[0] || "interés vocacional definido";
  const strength2 = strengths[1] || "compromiso con tu formación";
  const learningStyle = getLearningStylePhrase(dims);

  const top1 = topPrograms[0];
  const top2 = topPrograms[1];
  const top3 = topPrograms[2];

  let modalityInsert = "";
  if (top1.mode === "PRESENCIAL") {
    const program = PROGRAMS.find(p => p.id === top1.program_id);
    if (program && program.modalities.length === 1) {
      modalityInsert = " Por el componente práctico y el tipo de formación requerida, esta licenciatura se desarrolla en modalidad presencial.";
    }
  } else if (top1.mode === "ONLINE") {
    modalityInsert = " Dado tu nivel de autonomía y preferencia por estudiar a distancia, la modalidad en línea resulta adecuada para sostener el avance con constancia.";
  } else if (top1.mode === "SABATINA") {
    modalityInsert = " Por tu disponibilidad de fin de semana y carga entre semana, el esquema sabatino facilita continuidad sin afectar tus otras responsabilidades.";
  }

  if (isMixed && sectorSecondary) {
    return `${nombre}, tus respuestas reflejan un perfil con dos ejes de interés relevantes: ${sectorNames[sectorPrimary]} como tendencia principal y ${sectorNames[sectorSecondary]} como área complementaria. Esto suele presentarse cuando una persona combina ${strength1} con ${strength2}, y mantiene apertura hacia distintos entornos de formación. Recomendación principal: ${top1.program_name} en modalidad ${top1.mode} y periodo ${top1.period}, por ser la opción con mejor ajuste global entre intereses, habilidades y contexto.${modalityInsert} Alternativas con sentido: ${top2?.program_name || "N/A"} (por habilidades transferibles) y ${top3?.program_name || "N/A"} (por alineación con el eje complementario).`;
  }

  return `${nombre}, con base en tus respuestas, se observa una afinidad predominante hacia el área de ${sectorNames[sectorPrimary]}. Tu perfil combina ${strength1} y ${strength2}, lo que favorece un desempeño consistente en procesos formativos con ${learningStyle}. Recomendación principal: ${top1.program_name} en modalidad ${top1.mode} y periodo ${top1.period}, de acuerdo con la oferta vigente.${modalityInsert} Como rutas complementarias, también aparecen ${top2?.program_name || "N/A"} y ${top3?.program_name || "N/A"}, por compartir componentes formativos compatibles con tu perfil.`;
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    
    const dimensions = calculateDimensions(data);
    const sectorScores = calculateSectorScores(dimensions);
    
    const sortedSectors = Object.entries(sectorScores)
      .filter(([sector]) => checkCohesionGate(sector, dimensions))
      .sort(([,a], [,b]) => b - a);
    
    if (sortedSectors.length === 0) {
      sortedSectors.push(["NEGOCIOS", sectorScores.NEGOCIOS]);
    }
    
    const sectorPrimary = sortedSectors[0][0];
    const sectorPrimaryScore = sortedSectors[0][1];
    const sectorSecondaryEntry = sortedSectors[1];
    
    const gap = sectorSecondaryEntry 
      ? sectorPrimaryScore - sectorSecondaryEntry[1] 
      : 999;
    
    const isMixed = gap < 0.8;
    const sectorSecondary = isMixed && sectorSecondaryEntry ? sectorSecondaryEntry[0] : null;

    const primaryProgramScores = calculateProgramScores(dimensions, sectorPrimary);
    const sortedPrimaryPrograms = Object.entries(primaryProgramScores)
      .sort(([,a], [,b]) => b - a);

    let topProgramEntries: [string, number][] = [];
    
    if (isMixed && sectorSecondary) {
      topProgramEntries = sortedPrimaryPrograms.slice(0, 2);
      
      const secondaryProgramScores = calculateProgramScores(dimensions, sectorSecondary);
      const sortedSecondaryPrograms = Object.entries(secondaryProgramScores)
        .filter(([, score]) => score >= 3.4)
        .sort(([,a], [,b]) => b - a);
      
      if (sortedSecondaryPrograms.length > 0) {
        topProgramEntries.push(sortedSecondaryPrograms[0]);
      } else if (sortedPrimaryPrograms.length > 2) {
        topProgramEntries.push(sortedPrimaryPrograms[2]);
      }
    } else {
      topProgramEntries = sortedPrimaryPrograms.slice(0, 3);
    }

    const topPrograms = topProgramEntries.map(([programId, score]) => {
      const program = PROGRAMS.find(p => p.id === programId)!;
      const modality = determineModality(program, dimensions);
      return {
        program_id: programId,
        program_name: program.name,
        sector: program.sector,
        mode: modality.mode,
        period: modality.period,
        duration: modality.duration,
        match_percent: scoreToMatchPercent(score),
        raw_score: score
      };
    });

    while (topPrograms.length < 3) {
      const fallbackProgram = PROGRAMS.find(p => !topPrograms.some(tp => tp.program_id === p.id));
      if (fallbackProgram) {
        const modality = determineModality(fallbackProgram, dimensions);
        topPrograms.push({
          program_id: fallbackProgram.id,
          program_name: fallbackProgram.name,
          sector: fallbackProgram.sector,
          mode: modality.mode,
          period: modality.period,
          duration: modality.duration,
          match_percent: 70,
          raw_score: 1
        });
      } else {
        break;
      }
    }

    const leadScore = calculateLeadScore(dimensions, topProgramEntries[0]?.[1] || 3);
    const leadClass = classifyLead(leadScore);
    
    const dictamenText = generateDictamen(
      data.nombre,
      sectorPrimary,
      sectorSecondary,
      dimensions,
      topPrograms,
      isMixed
    );

    const becaMap: Record<string, string> = {
      'EXCELENTE': 'EXCELENCIA (40-50%)',
      'MUY_BUENO': 'MÉRITO ALTO (30-40%)',
      'BUENO': 'MÉRITO MEDIO (20-30%)',
      'REGULAR': 'BÁSICA (15-20%)',
      'NO_DIGO': 'BÁSICA (15-20%)'
    };
    const beca = becaMap[data.promedio] || 'BÁSICA (15-20%)';

    const ctaMap: Record<string, string> = {
      HOT: "Hablar con un asesor ahora",
      WARM: "Ver plan de estudios",
      COLD: "Explorar carreras"
    };

    const tags = [
      "Test Vocacional UL",
      "Fuente: Landing Test Vocacional",
      leadClass === "HOT" ? "🔥 Hot Lead" : leadClass === "WARM" ? "🟡 Warm Lead" : "🔵 Cold Lead",
      `Sector: ${sectorPrimary}`,
      `Modalidad: ${topPrograms[0]?.mode || "PRESENCIAL"}`
    ];

    const leadData = {
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
      beca_elegible: beca,
      cta_primary: ctaMap[leadClass],
      tags
    };

      let lead;
      let error;

      if (data.lead_id) {
        const result = await supabase
          .from('leads')
          .update(leadData)
          .eq('id', data.lead_id)
          .select();
        lead = result.data?.[0];
        error = result.error;
      } else if (data.email) {
        const { data: existingLeads } = await supabase
          .from('leads')
          .select('id')
          .eq('email', data.email.toLowerCase().trim())
          .order('created_at', { ascending: false })
          .limit(1);

        const existingLead = existingLeads?.[0];

        if (existingLead) {
          const result = await supabase
            .from('leads')
            .update(leadData)
            .eq('id', existingLead.id)
            .select();
          lead = result.data?.[0];
          error = result.error;
        } else {
          const result = await supabase
            .from('leads')
            .insert([leadData])
            .select();
          lead = result.data?.[0];
          error = result.error;
        }
      } else {
        const result = await supabase
          .from('leads')
          .insert([leadData])
          .select();
        lead = result.data?.[0];
        error = result.error;
      }

    if (error) throw error;

    return NextResponse.json({ 
      success: true, 
      leadId: lead.id,
      preview: {
        sector: sectorPrimary,
        sectorSecondary,
        isMixed,
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
