import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase-server";
import { runEvaEngine, EvaInput } from "@/lib/eva-engine";

function sanitizeText(text: unknown, maxLength = 900): string {
  if (!text || typeof text !== "string") return "";
  return text.replace(/<[^>]*>/g, "").replace(/[<>]/g, "").trim().slice(0, maxLength);
}

function truncateForCRM(text: string, maxLength = 250): string {
  if (!text) return "";
  return text.length <= maxLength ? text : text.slice(0, maxLength - 3) + "...";
}

export async function POST(req: Request) {
  try {
    let data: Record<string, any>;
    try {
      data = await req.json();
    } catch {
      return NextResponse.json({ success: false, error: "Invalid JSON format" }, { status: 400 });
    }

    const supabase = getSupabaseServer();

    // Build numeric responses map (Q01-Q25, Q29, Q30 are 0-4 Likert)
    const responses: Record<string, number> = {};
    const likertIds = [
      ...Array.from({ length: 25 }, (_, i) => `Q${String(i + 1).padStart(2, "0")}`),
      "Q29", "Q30",
    ];
    for (const key of likertIds) {
      if (data[key] !== undefined) responses[key] = Number(data[key]);
    }

    const input: EvaInput = {
      responses,
      openAnswers: {
        Q26: sanitizeText(data.Q26, 700),
        Q27: sanitizeText(data.Q27, 700),
        Q28: sanitizeText(data.Q28, 900),
      },
      nombre: sanitizeText(data.nombre, 80),
      email: typeof data.email === "string" ? data.email.toLowerCase().trim() : "",
      telefono: sanitizeText(data.telefono, 20),
      promedio: sanitizeText(data.promedio, 60),
      urgencia: sanitizeText(data.urgencia, 60),
    };

    // Run EVA engine
    const result = runEvaEngine(input);

    // Build open answers summary for CRM
    const oqSummary = [
      input.openAnswers.Q26 ? `Situación: ${truncateForCRM(input.openAnswers.Q26)}` : "",
      input.openAnswers.Q27 ? `Intereses: ${truncateForCRM(input.openAnswers.Q27)}` : "",
      input.openAnswers.Q28 ? `Visión: ${truncateForCRM(input.openAnswers.Q28)}` : "",
    ].filter(Boolean).join(" | ");

    const ctaMap: Record<string, string> = {
      HOT: "Hablar con un asesor ahora",
      WARM: "Ver plan de estudios",
      COLD: "Explorar carreras",
    };

    // Map engine output to existing Supabase schema columns
    // New computed fields are embedded inside `responses` to avoid schema errors
    const leadData = {
      nombre: input.nombre,
      email: input.email || null,
      telefono: input.telefono,
      urgencia: input.urgencia,
      promedio: input.promedio,
      // Preserve raw responses + embed engine output in jsonb
      responses: {
        ...data,
        _eva: {
          sector_scores: result.sector_scores,
          career_primary: result.career_primary,
          career_secondary: result.career_secondary,
          recommended_modality: result.recommended_modality,
          clarity_level: result.clarity_level,
          support: result.support,
        },
      },
      dimensions: result.dimensions,
      sector_primary: result.sector_primary,
      sector_secondary: result.sector_secondary,
      score: result.lead_score,
      lead_class: result.lead_classification,
      classification: result.lead_classification,
      tags: result.tags,
      dictamen_text: result.dictamen,
      // Map to existing schema columns
      beca_elegible: result.support.name ?? result.support.type,
      cta_primary: ctaMap[result.lead_classification] ?? "Hablar con un asesor",
      top_programs: [result.career_primary, result.career_secondary].filter(Boolean),
      // Open answers mapped to existing column names
      oq01_contexto: input.openAnswers.Q26 || null,
      oq02_intereses: input.openAnswers.Q27 || null,
      oq03_vision: input.openAnswers.Q28 || null,
    };

    // Upsert to Supabase
    let lead: any;
    let error: any;
    const emailNorm = input.email || null;

    if (data.lead_id) {
      const r = await supabase.from("leads").update(leadData).eq("id", data.lead_id).select();
      lead = r.data?.[0];
      error = r.error;
    } else if (emailNorm) {
      const { data: existing } = await supabase
        .from("leads")
        .select("id")
        .eq("email", emailNorm)
        .order("created_at", { ascending: false })
        .limit(1);

      if (existing?.[0]) {
        const r = await supabase.from("leads").update(leadData).eq("id", existing[0].id).select();
        lead = r.data?.[0];
        error = r.error;
      } else {
        const r = await supabase.from("leads").insert([leadData]).select();
        lead = r.data?.[0];
        error = r.error;
      }
    } else {
      const r = await supabase.from("leads").insert([leadData]).select();
      lead = r.data?.[0];
      error = r.error;
    }

    if (error) {
      console.error("Supabase error:", JSON.stringify(error, null, 2));
      throw new Error(`Supabase error: ${error.message ?? JSON.stringify(error)}`);
    }
    if (!lead) throw new Error("Failed to save lead – no data returned");

    // GHL webhook (fire & forget)
    // Payload must be FLAT — GHL does not parse nested objects correctly.
    // Tags must be a comma-separated string, not an array.
    const ghlWebhookUrl = process.env.GHL_WEBHOOK_URL;
    if (ghlWebhookUrl) {
      fetch(ghlWebhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          // Contact fields (flat)
          firstName:          input.nombre.split(" ")[0] ?? "",
          lastName:           input.nombre.split(" ").slice(1).join(" ") ?? "",
          email:              input.email,
          phone:              input.telefono,
          tags:               Array.isArray(result.tags) ? result.tags.join(",") : result.tags,
          // Custom fields (flat, same level)
          sector_principal:   result.sector_primary,
          carrera_recomendada: result.career_primary.career_name,
          match_percent:      String(result.career_primary.match_percent),
          modalidad:          result.recommended_modality,
          lead_score:         String(result.lead_score),
          lead_class:         result.lead_classification,
          beca_elegible:      result.support.name ?? result.support.type,
          urgencia:           input.urgencia,
          promedio:           input.promedio,
          oq_resumen:         oqSummary || null,
          dictamen_url:       `${process.env.NEXT_PUBLIC_BASE_URL ?? ""}/resultados/${lead.id}`,
        }),
      }).catch((err) => console.error("GHL webhook error:", err));
    }

    return NextResponse.json({
      success: true,
      leadId: lead.id,
      preview: {
        sector: result.sector_primary,
        sectorSecondary: result.sector_secondary,
        topCareer: result.career_primary.career_name,
        matchPercent: result.career_primary.match_percent,
        leadClass: result.lead_classification,
      },
    });
  } catch (err: any) {
    const cause = err?.cause;
    let causeMsg: string | null = null;
    if (cause instanceof AggregateError) {
      causeMsg = cause.errors?.map((e: any) => e?.message ?? String(e)).join(" | ");
    } else if (cause) {
      causeMsg = cause?.message ?? String(cause);
    }
    console.error("Submission error:", err?.message, causeMsg ? `| cause: ${causeMsg}` : "");
    return NextResponse.json(
      { success: false, error: err.message, cause: causeMsg },
      { status: 500 }
    );
  }
}
