import { DIMENSION_WEIGHTS, SECTOR_FORMULAS } from "@/data/dimension_weights";
import { CAREERS, CAREER_SELECTION_RULES } from "@/data/career_weights";
import { REPORT_TEMPLATES } from "@/data/report_templates";
import {
  SCHOLARSHIP_RULES,
  SCHOLARSHIP_FALLBACK,
  PROMEDIO_NUMERIC_MAP,
} from "@/data/scholarships";
import { LEAD_SCORING_CONFIG, LEAD_CLASSIFICATION_RULES } from "@/data/lead_scoring";

// ─── Types ────────────────────────────────────────────────────────────────────

export type EvaInput = {
  responses: Record<string, number>; // Q01-Q25, Q29, Q30 → scale 0-4
  openAnswers: {
    Q26?: string; // situacion_actual
    Q27?: string; // intereses
    Q28?: string; // proyeccion
  };
  nombre: string;
  email: string;
  telefono: string;
  promedio: string; // text choice from questions.json
  urgencia: string; // text choice from questions.json
};

export type CareerResult = {
  career_id: string;
  career_name: string;
  area: string;
  score: number;         // normalized 0-100
  match_percent: number; // rounded, displayed to user
  modality: string;      // e.g. "presencial_cuatrimestral"
};

export type SupportResult = {
  id: string;
  name?: string;
  type: string;
  tuition_scholarship_percent?: number;
  enrollment_discount_percent?: number;
  message: string;
};

export type EvaOutput = {
  dimensions: Record<string, number>;
  sector_primary: string;
  sector_secondary: string | null;
  sector_scores: Record<string, number>;
  career_primary: CareerResult;
  career_secondary: CareerResult | null;
  recommended_modality: string;
  clarity_level: string;
  support: SupportResult;
  dictamen: string;
  lead_score: number;
  lead_classification: string;
  tags: string[];
};

// ─── Step 1: Raw dimension scores ─────────────────────────────────────────────

function calcRawDimensions(responses: Record<string, number>): Record<string, number> {
  const raw: Record<string, number> = {};
  for (const [dim, config] of Object.entries(DIMENSION_WEIGHTS)) {
    raw[dim] = Object.entries(config.questions).reduce(
      (sum, [qId, weight]) => sum + (responses[qId] ?? 0) * weight,
      0
    );
  }
  return raw;
}

// ─── Step 2: Normalize dimensions to 0-100 ────────────────────────────────────

function normalizeDimensions(raw: Record<string, number>): Record<string, number> {
  const norm: Record<string, number> = {};
  for (const [dim, config] of Object.entries(DIMENSION_WEIGHTS)) {
    norm[dim] = config.max > 0 ? (raw[dim] / config.max) * 100 : 0;
  }
  return norm;
}

// ─── Step 3: Sector scores ────────────────────────────────────────────────────

function calcSectorScores(norm: Record<string, number>): Record<string, number> {
  const scores: Record<string, number> = {};
  for (const [sector, formula] of Object.entries(SECTOR_FORMULAS)) {
    scores[sector] = formula.dims.reduce(
      (sum, { dim, weight }) => sum + (norm[dim] ?? 0) * weight,
      0
    );
  }
  return scores;
}

// ─── Step 4: Determine primary / secondary sector ─────────────────────────────

function determineSectors(sectorScores: Record<string, number>): {
  primary: string;
  secondary: string | null;
} {
  const sorted = Object.entries(sectorScores).sort(([, a], [, b]) => b - a);
  const primary = sorted[0][0];
  const primaryScore = sorted[0][1];
  const secondaryEntry = sorted[1];

  if (!secondaryEntry) return { primary, secondary: null };

  const gap = primaryScore - secondaryEntry[1];
  const secondary =
    gap <= CAREER_SELECTION_RULES.dual_sector_threshold ? secondaryEntry[0] : null;

  return { primary, secondary };
}

// ─── Step 5: Career scores for a sector ──────────────────────────────────────

function calcCareerScores(
  norm: Record<string, number>,
  sectorFilter: string
): Record<string, number> {
  const scores: Record<string, number> = {};
  for (const [id, career] of Object.entries(CAREERS)) {
    if (career.area !== sectorFilter) continue;
    scores[id] = Object.entries(career.dimension_weights).reduce(
      (sum, [dim, weight]) => sum + (norm[dim] ?? 0) * weight,
      0
    );
  }
  return scores;
}

// ─── Step 6: Select top careers ───────────────────────────────────────────────

function selectCareers(
  norm: Record<string, number>,
  primary: string,
  secondary: string | null
): { primary: CareerResult; secondary: CareerResult | null } {
  const primaryScores = calcCareerScores(norm, primary);
  const sortedPrimary = Object.entries(primaryScores).sort(([, a], [, b]) => b - a);

  const [p1Id, p1Score] = sortedPrimary[0];
  const p1Career = CAREERS[p1Id];

  const careerPrimary: CareerResult = {
    career_id: p1Id,
    career_name: p1Career.name,
    area: p1Career.area,
    score: p1Score,
    match_percent: Math.round(p1Score),
    modality: p1Career.modalities[0], // refined in step 7
  };

  let careerSecondary: CareerResult | null = null;

  if (secondary) {
    // Dual sector: pick best from secondary sector
    const secondaryScores = calcCareerScores(norm, secondary);
    const sortedSecondary = Object.entries(secondaryScores).sort(([, a], [, b]) => b - a);
    if (sortedSecondary.length > 0) {
      const [s1Id, s1Score] = sortedSecondary[0];
      const s1Career = CAREERS[s1Id];
      careerSecondary = {
        career_id: s1Id,
        career_name: s1Career.name,
        area: s1Career.area,
        score: s1Score,
        match_percent: Math.round(s1Score),
        modality: s1Career.modalities[0],
      };
    }
  } else if (sortedPrimary.length > 1) {
    // Single sector: include runner-up only if scores are close
    const [p2Id, p2Score] = sortedPrimary[1];
    const diff = p1Score - p2Score;
    if (diff < CAREER_SELECTION_RULES.minimum_difference_between_careers) {
      const p2Career = CAREERS[p2Id];
      careerSecondary = {
        career_id: p2Id,
        career_name: p2Career.name,
        area: p2Career.area,
        score: p2Score,
        match_percent: Math.round(p2Score),
        modality: p2Career.modalities[0],
      };
    }
  }

  return { primary: careerPrimary, secondary: careerSecondary };
}

// ─── Step 7: Determine modality ───────────────────────────────────────────────

function determineModality(career: CareerResult, q30: number): string {
  const available = CAREERS[career.career_id]?.modalities ?? ["presencial_cuatrimestral"];
  if (available.length === 1) return available[0];
  if (q30 >= 3 && available.includes("online")) return "online";
  return available.find((m) => m.startsWith("presencial")) ?? available[0];
}

// ─── Step 8: Vocational clarity ───────────────────────────────────────────────
// Formula from eva_engine.json: (Q13 + Q29) / 2

function determineClarity(responses: Record<string, number>): string {
  const avg = ((responses["Q13"] ?? 0) + (responses["Q29"] ?? 0)) / 2;
  if (avg >= 3.2) return "vocacion_clara";
  if (avg >= 2.0) return "exploracion";
  return "orientacion_recomendada";
}

// ─── Step 9: Financial support ────────────────────────────────────────────────

function determineSupport(promedio: string): SupportResult {
  const numericValue = PROMEDIO_NUMERIC_MAP[promedio];

  if (numericValue === null || numericValue === undefined) {
    return { id: SCHOLARSHIP_FALLBACK.id, type: SCHOLARSHIP_FALLBACK.type, message: SCHOLARSHIP_FALLBACK.message };
  }

  const rule = SCHOLARSHIP_RULES.find(
    (r) => numericValue >= r.promedioMin && numericValue <= r.promedioMax
  );

  if (!rule) {
    return { id: SCHOLARSHIP_FALLBACK.id, type: SCHOLARSHIP_FALLBACK.type, message: SCHOLARSHIP_FALLBACK.message };
  }

  return {
    id: rule.id,
    name: rule.name,
    type: rule.type,
    tuition_scholarship_percent: rule.tuitionScholarshipPercent,
    enrollment_discount_percent: rule.enrollmentDiscountPercent,
    message: rule.message,
  };
}

// ─── Modality display helpers ─────────────────────────────────────────────────

export function modalityLabel(modality: string): string {
  const map: Record<string, string> = {
    presencial_cuatrimestral: "Presencial Cuatrimestral",
    presencial_semestral: "Presencial Semestral",
    online: "Online",
    sabatina: "Sabatina",
  };
  return map[modality] ?? modality;
}

function modalityTemplateKey(modality: string): "presencial" | "online" | "sabatina" {
  if (modality === "online") return "online";
  if (modality === "sabatina") return "sabatina";
  return "presencial";
}

// ─── Step 10: Generate dictamen ───────────────────────────────────────────────

function generateDictamen(
  primary: string,
  secondary: string | null,
  careerPrimary: CareerResult,
  careerSecondary: CareerResult | null,
  clarityLevel: string,
  modality: string,
  openAnswers: { Q26?: string; Q27?: string; Q28?: string }
): string {
  const T = REPORT_TEMPLATES;
  const parts: string[] = [];

  parts.push(T.sector_intro[primary as keyof typeof T.sector_intro] ?? "");
  parts.push(T.career_explanation[careerPrimary.career_id as keyof typeof T.career_explanation] ?? "");

  if (careerSecondary) {
    parts.push(T.secondary_career_intro.default);
    parts.push(T.career_explanation[careerSecondary.career_id as keyof typeof T.career_explanation] ?? "");
  }

  parts.push(T.clarity_level[clarityLevel as keyof typeof T.clarity_level] ?? "");
  parts.push(T.modalidad_sugerida[modalityTemplateKey(modality)] ?? "");

  if (openAnswers.Q26) parts.push(T.contextual_integration.situacion_actual);
  if (openAnswers.Q27) parts.push(T.contextual_integration.intereses);
  if (openAnswers.Q28) parts.push(T.contextual_integration.proyeccion);

  parts.push(T.closing.default);

  return parts.filter(Boolean).join(" ");
}

// ─── Step 11: Lead score ──────────────────────────────────────────────────────

function calcLeadScore(
  urgencia: string,
  q29: number,
  clarityLevel: string,
  support: SupportResult,
  nombre: string,
  email: string,
  telefono: string
): number {
  const cfg = LEAD_SCORING_CONFIG;
  let score = 0;

  score += cfg.urgencia_inicio.scores[urgencia] ?? 0;
  score += cfg.motivacion_empleo.scale_scores[q29 as 0 | 1 | 2 | 3 | 4] ?? 0;
  score += cfg.claridad_vocacional.scores[clarityLevel] ?? 0;
  if (nombre && email && telefono) score += cfg.datos_contacto.score_if_complete;
  score += cfg.apoyo_financiero.scores[support.type] ?? 0;

  return Math.min(score, 100);
}

// ─── Step 12: Classify lead ───────────────────────────────────────────────────

function classifyLead(score: number): string {
  if (score >= LEAD_CLASSIFICATION_RULES.HOT.min_score) return "HOT";
  if (score >= LEAD_CLASSIFICATION_RULES.WARM.min_score) return "WARM";
  return "COLD";
}

// ─── Main engine ──────────────────────────────────────────────────────────────

export function runEvaEngine(input: EvaInput): EvaOutput {
  const { responses, openAnswers, nombre, email, telefono, promedio, urgencia } = input;

  const rawDimensions = calcRawDimensions(responses);
  const normDimensions = normalizeDimensions(rawDimensions);
  const sectorScores = calcSectorScores(normDimensions);
  const { primary, secondary } = determineSectors(sectorScores);

  const { primary: careerPrimary, secondary: careerSecondaryRaw } = selectCareers(
    normDimensions, primary, secondary
  );

  const q30 = responses["Q30"] ?? 0;
  careerPrimary.modality = determineModality(careerPrimary, q30);
  const careerSecondary = careerSecondaryRaw;
  if (careerSecondary) careerSecondary.modality = determineModality(careerSecondary, q30);

  const clarityLevel = determineClarity(responses);
  const support = determineSupport(promedio);

  const dictamen = generateDictamen(
    primary, secondary, careerPrimary, careerSecondary,
    clarityLevel, careerPrimary.modality, openAnswers
  );

  const leadScore = calcLeadScore(
    urgencia, responses["Q29"] ?? 0, clarityLevel,
    support, nombre, email, telefono
  );
  const leadClassification = classifyLead(leadScore);

  const tags = [
    "Test Vocacional UL v4.0",
    "Fuente: Landing Test Vocacional",
    leadClassification === "HOT" ? "🔥 Hot Lead" :
      leadClassification === "WARM" ? "🟡 Warm Lead" : "🔵 Cold Lead",
    `Sector: ${primary}`,
    `Modalidad: ${modalityLabel(careerPrimary.modality)}`,
  ];

  return {
    dimensions: normDimensions,
    sector_primary: primary,
    sector_secondary: secondary,
    sector_scores: sectorScores,
    career_primary: careerPrimary,
    career_secondary: careerSecondary,
    recommended_modality: careerPrimary.modality,
    clarity_level: clarityLevel,
    support,
    dictamen,
    lead_score: leadScore,
    lead_classification: leadClassification,
    tags,
  };
}
