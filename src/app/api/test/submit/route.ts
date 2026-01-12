import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const data = await req.json();

    // 1. Calculate Score (Scoring Logic)
    let score = 0;
    
    const urgenciaScores: Record<string, number> = {
      'muy_urgente': 30,
      'urgente': 25,
      'tengo_tiempo': 15,
      'sin_prisa': 5
    };
    score += urgenciaScores[data.urgencia_timeline] || 0;

    const desempenoScores: Record<string, number> = {
      'excelente': 25,
      'muy_bueno': 20,
      'bueno': 15,
      'regular': 10,
      'no_decir': 5
    };
    score += desempenoScores[data.desempeno_academico] || 0;

    const etapaScores: Record<string, number> = {
      'acabo_terminar': 15,
      'cambio_carrera': 12,
      'sexto_semestre': 10,
      '1_2_anos': 8,
      'mas_2_anos': 5
    };
    score += etapaScores[data.etapa_educativa] || 0;

      score += 75; // Completion points


    // 2. Classification
    let classification = "COLD";
    if (score >= 75) classification = "HOT";
    else if (score >= 50) classification = "WARM";

    // 3. Beca
    const becaMap: Record<string, string> = {
      'excelente': 'EXCELENCIA (40-50%)',
      'muy_bueno': 'MÉRITO ALTO (30-40%)',
      'bueno': 'MÉRITO MEDIO (20-30%)',
      'regular': 'BÁSICA (15-20%)',
      'no_decir': 'BÁSICA (15-20%)'
    };
    const beca = becaMap[data.desempeno_academico] || 'BÁSICA (15-20%)';

    // 4. Insert into Supabase
    const { data: lead, error } = await supabase
      .from('leads')
      .insert([{
        ...data,
        score,
        classification,
        beca_elegible: beca
      }])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, leadId: lead.id });
  } catch (error: any) {
    console.error("Submission error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
