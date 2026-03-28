export const LEAD_SCORING_CONFIG = {
  urgencia_inicio: {
    scores: {
      "Lo antes posible": 30,
      "Este año": 25,
      "En los próximos 6-12 meses": 15,
      "Solo estoy explorando opciones": 5,
    } as Record<string, number>,
  },

  motivacion_empleo: {
    // Q29 is 0-4 scale
    scale_scores: { 0: 0, 1: 5, 2: 10, 3: 15, 4: 20 } as Record<number, number>,
  },

  claridad_vocacional: {
    scores: {
      vocacion_clara: 20,
      exploracion: 10,
      orientacion_recomendada: 5,
    } as Record<string, number>,
  },

  datos_contacto: {
    variables_required: ["nombre", "email", "telefono"] as string[],
    score_if_complete: 15,
  },

  apoyo_financiero: {
    scores: {
      beca_academica: 15,
      apoyo_ingreso: 10,
      revision_asesor: 5,
    } as Record<string, number>,
  },
};

export const LEAD_CLASSIFICATION_RULES = {
  HOT: { min_score: 75 },
  WARM: { min_score: 50, max_score: 74 },
  COLD: { max_score: 49 },
};
