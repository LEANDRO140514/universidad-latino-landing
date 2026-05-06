export type DimensionConfig = {
  description: string;
  questions: Record<string, number>;
  max: number;
};

export const DIMENSION_WEIGHTS: Record<string, DimensionConfig> = {
  INTERES_TECNOLOGIA: {
    description: "Interés por sistemas, tecnología, programación y herramientas digitales.",
    questions: { Q08: 2, Q14: 3, Q26: 2, Q31: 3 },
    max: 40,
  },
  INTERES_LEGAL: {
    description: "Interés por leyes, normas, argumentación y análisis de conflictos sociales.",
    questions: { Q02: 3, Q07: 2, Q09: 2, Q29: 2, Q35: 2 },
    max: 44,
  },
  INTERES_SALUD_BIENESTAR: {
    description: "Interés por salud, bienestar físico, apoyo a personas y cuidado humano.",
    questions: {
      Q03: 2, Q04: 2, Q05: 2, Q06: 2, Q10: 2,
      Q15: 3, Q16: 3, Q17: 3,
      Q19: 2, Q20: 2, Q21: 2, Q22: 2, Q24: 2, Q27: 2, Q28: 2,
    },
    max: 128,
  },
  INTERES_NEGOCIOS: {
    description: "Interés por empresas, comercio, liderazgo y generación de oportunidades.",
    questions: { Q01: 2, Q12: 2, Q13: 3, Q18: 2, Q23: 2, Q30: 2, Q34: 3 },
    max: 64,
  },
  ANALISIS_LOGICO: {
    description: "Capacidad de análisis, resolución de problemas y pensamiento estructurado.",
    questions: { Q12: 1, Q25: 2, Q30: 2, Q32: 1 },
    max: 24,
  },
  HABILIDAD_SOCIAL: {
    description: "Habilidad para interactuar con personas, persuadir y comprender emociones.",
    questions: { Q01: 1, Q06: 2, Q07: 1, Q23: 1, Q24: 2, Q35: 2 },
    max: 36,
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
