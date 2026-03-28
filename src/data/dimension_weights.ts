export type DimensionConfig = {
  description: string;
  questions: Record<string, number>;
  max: number;
};

export const DIMENSION_WEIGHTS: Record<string, DimensionConfig> = {
  INTERES_TECNOLOGIA: {
    description: "Interés por sistemas, tecnología, programación y herramientas digitales.",
    questions: { Q01: 2, Q02: 2, Q03: 3, Q16: 3 },
    max: 40,
  },
  INTERES_LEGAL: {
    description: "Interés por leyes, normas, argumentación y análisis de conflictos sociales.",
    questions: { Q04: 2, Q05: 3, Q06: 2, Q17: 2 },
    max: 36,
  },
  INTERES_SALUD_BIENESTAR: {
    description: "Interés por salud, bienestar físico, apoyo a personas y cuidado humano.",
    questions: { Q07: 2, Q08: 2, Q09: 2, Q10: 2, Q18: 2, Q19: 3, Q20: 2, Q21: 2 },
    max: 68,
  },
  INTERES_NEGOCIOS: {
    description: "Interés por empresas, comercio, liderazgo y generación de oportunidades.",
    questions: { Q11: 2, Q12: 3, Q13: 2, Q14: 2, Q22: 3, Q23: 2 },
    max: 56,
  },
  ANALISIS_LOGICO: {
    description: "Capacidad de análisis, resolución de problemas y pensamiento estructurado.",
    questions: { Q15: 1, Q24: 2, Q25: 1 },
    max: 16,
  },
  HABILIDAD_SOCIAL: {
    description: "Habilidad para interactuar con personas, persuadir y comprender emociones.",
    questions: { Q05: 1, Q08: 2, Q12: 1, Q17: 1, Q18: 2, Q22: 1 },
    max: 32,
  },
};

// Sector score formulas from eva_engine.json
export const SECTOR_FORMULAS: Record<string, { dims: { dim: string; weight: number }[] }> = {
  TECNOLOGIA: {
    dims: [
      { dim: "INTERES_TECNOLOGIA", weight: 0.7 },
      { dim: "ANALISIS_LOGICO", weight: 0.3 },
    ],
  },
  LEGAL: {
    dims: [
      { dim: "INTERES_LEGAL", weight: 0.7 },
      { dim: "HABILIDAD_SOCIAL", weight: 0.3 },
    ],
  },
  SALUD_BIENESTAR: {
    dims: [
      { dim: "INTERES_SALUD_BIENESTAR", weight: 0.7 },
      { dim: "HABILIDAD_SOCIAL", weight: 0.3 },
    ],
  },
  NEGOCIOS: {
    dims: [
      { dim: "INTERES_NEGOCIOS", weight: 0.7 },
      { dim: "HABILIDAD_SOCIAL", weight: 0.3 },
    ],
  },
};
